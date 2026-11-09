const User = require('./../../models/users');
const EmailVerification = require('./../../models/userVerificiation/emailVerification');

const { GenerateOtp, HashOtp } = require('./../../utils/email/OtpHandler');
const SendEmail = require('./../../utils/email/EmailHandler');

const COOLDOWN = 60 * 1000;
const OTP_EXPIRY = 5 * 60 * 1000;

const ResendEmailOtp = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                error: 'Username is required.'

            });

        }

        const foundUser = await User.findOne({ username });

        if (!foundUser) {
            return res.status(404).json({
                error: 'User not found.'

            });

        }

        const verification = await EmailVerification.findOne({ user: foundUser._id });

        if (!verification) {
            return res.status(404).json({
                error: 'No email verification request was found.'

            });

        }

        if (verification.isVerified) {
            return res.status(400).json({
                error: 'Your email address is already verified.'

            });

        }

        //Check the 60-second resend cooldown
        if (verification.lastOtpSentAt) {
            const timeSinceLastOtp =
                Date.now() - verification.lastOtpSentAt.getTime();

            if (timeSinceLastOtp < COOLDOWN) {
                const secondsRemaining = Math.ceil(
                    (COOLDOWN - timeSinceLastOtp) / 1000

                );

                return res.status(429).json({
                    error: 'Please wait before requesting another code.',
                    secondsRemaining

                });

            }

        }

        //Generate a fresh OTP
        const otp = GenerateOtp();
        const otpHash = await HashOtp(otp);

        await SendEmail(
            foundUser.email,
            'HustleHub+ Email Verification',
            `Hello ${foundUser.fullname},

            Your new email verification code is: ${otp}

            This code expires in 5 minutes.

            Kind regards,
            HustleHub+ Support`

        );

        //Replace the old OTP and reset its attempts
        verification.otpHash = otpHash;
        verification.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY);
        verification.otpAttempts = 0;
        verification.lastOtpSentAt = new Date();

        await verification.save();

        return res.status(200).json({
            message: 'A new verification code has been sent to your email.'

        });

    } 
    catch (error) {
        console.error('Resend Email OTP Error:', error);

        return res.status(500).json({
            error: 'Something went wrong while resending your verification code.'

        });

    }
    
};

module.exports = ResendEmailOtp;