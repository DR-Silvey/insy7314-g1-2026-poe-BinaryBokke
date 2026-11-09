const jwt = require('jsonwebtoken');

const User = require('./../../models/users');
const TwoFactor = require('./../../models/twoFactorAuth/twoFactorAuth');

const { GenerateOtp, HashOtp } = require('./../../utils/email/OtpHandler');
const SendEmail = require('./../../utils/email/EmailHandler');

const COOLDOWN = 60 * 1000;
const OTP_EXPIRY = 5 * 60 * 1000;

const ResendLoginOtp = async (req, res) => {
    try {
        const { temporaryToken } = req.body;

        if (!temporaryToken) {
            return res.status(400).json({
                error: 'Temporary login token is required.'
                
            });

        }

        //Verify the temporary login token
        let decoded;

        try {
            decoded = jwt.verify(temporaryToken, process.env.TWO_FACTOR_JWT_SECRET );

        } 
        catch (error) {
            return res.status(401).json({
                error: 'Your login session has expired. Please log in again.'

            });

        }

        if (decoded.purpose !== 'LOGIN_2FA') {
            return res.status(401).json({
                error: 'Invalid login verification session.'

            });

        }

        const foundUser = await User.findById(decoded.userId);

        if (!foundUser) {
            return res.status(404).json({
                error: 'User not found.'

            });

        }

        const twoFactor = await TwoFactor.findOne({ user: foundUser._id });

        if (!twoFactor || !twoFactor.enabled || twoFactor.otpPurpose !== 'LOGIN') {
            return res.status(400).json({
                error: 'No active login verification request was found.'

            });

        }

        //Check the 60-second resend cooldown
        if (twoFactor.otpLastSentAt) {
            const timeSinceLastOtp =
                Date.now() - twoFactor.otpLastSentAt.getTime();

            if (timeSinceLastOtp < COOLDOWN) {
                const secondsRemaining = Math.ceil((COOLDOWN - timeSinceLastOtp) / 1000 );

                return res.status(429).json({
                    error: 'Please wait before requesting another code.',
                    secondsRemaining

                });

            }

        }

        //Generate a fresh login OTP
        const otp = GenerateOtp();
        const otpHash = await HashOtp(otp);

        await SendEmail(
            foundUser.email,
            'HustleHub+ Login Verification',
            `Hello ${foundUser.fullname},

            Your new login verification code is: ${otp}

            This code expires in 5 minutes.

            If you did not attempt to log in, please secure your account.

            Kind regards,
            HustleHub+ Support`

        );

        //Replace the old OTP and reset attempts
        twoFactor.otpHash = otpHash;
        twoFactor.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY);
        twoFactor.otpAttempts = 0;
        twoFactor.otpLastSentAt = new Date();

        await twoFactor.save();

        return res.status(200).json({
            message: 'A new login verification code has been sent to your email.'

        });

    } 
    catch (error) {
        console.error('Resend Login OTP Error:', error);

        return res.status(500).json({
            error: 'Something went wrong while resending your login verification code.'

        });
    }

};

module.exports = ResendLoginOtp;