const jwt = require('jsonwebtoken');
const User = require('./../../models/users');
const TwoFactor = require('./../../models/twoFactorAuth/twoFactorAuth');
const TokenCreation = require('./../../utils/tokens/TokenCreation');
const SendEmail = require('./../../utils/email/EmailHandler');
const { CompareOtp } = require('./../../utils/email/OtpHandler');

//(The IIE, 2026)(W3 Schools, s.a.)
const VerifyLoginOtp = async (req, res) => {
    try {
        const { otp, temporaryToken } = req.body;

        if (!otp || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({ error: 'Please enter a valid six-digit OTP' });

        }

        if (!temporaryToken) {
            return res.status(401).json({ error: 'Login verification token is required' });

        }

        //Verify the temporary token created during login.
        let decoded; //(The IIE, 2026)(W3 Schools, s.a.)

        try {
            decoded = jwt.verify(temporaryToken, process.env.TWO_FACTOR_JWT_SECRET);

        } 
        catch (error) {
            return res.status(401).json({ 
                error: 'Invalid or expired verification session' 
            
            });

        }

        if (decoded.purpose !== 'LOGIN_2FA') {//(The IIE, 2026)(W3 Schools, s.a.)
            return res.status(401).json({ 
                error: 'Invalid verification session' 
            
            });

        }

        const foundUser = await User.findById(decoded.userId);

        if (!foundUser) {
            return res.status(404).json({ 
                error: 'User not found' 
            
            });

        }

        const twoFactor = await TwoFactor.findOne({ user: foundUser._id }); //(The IIE, 2026)(W3 Schools, s.a.)

        if (!twoFactor || !twoFactor.enabled) {
            return res.status(400).json({ 
                error: 'Two-factor verification is unavailable' 
            
            });

        }

        if (!twoFactor.otpHash || !twoFactor.otpExpiresAt || twoFactor.otpPurpose !== 'LOGIN') 
        {
            return res.status(400).json({ 
                error: 'No active login OTP found' 
            
            });

        }

        if (new Date() > twoFactor.otpExpiresAt) {
            twoFactor.otpHash = null;
            twoFactor.otpExpiresAt = null;
            twoFactor.otpAttempts = 0;
            twoFactor.otpPurpose = null;
            twoFactor.otpLastSentAt = null;
            await twoFactor.save();

            return res.status(400).json({ 
                error: 'OTP has expired. Please log in again.' 
            
            });

        }

        if (twoFactor.otpAttempts >= 5) {
            return res.status(429).json({
                error: 'Too many incorrect OTP attempts. Please log in again.'

            });//(The IIE, 2026)(W3 Schools, s.a.)

        }

        //(The IIE, 2026)(W3 Schools, s.a.)
        const otpMatches = await CompareOtp(otp, twoFactor.otpHash);

        if (!otpMatches) {
            twoFactor.otpAttempts += 1;

            if (twoFactor.otpAttempts >= 5) {
                twoFactor.otpHash = null;
                twoFactor.otpExpiresAt = null;
                twoFactor.otpPurpose = null;
                twoFactor.otpLastSentAt = null;

            }

            await twoFactor.save();

            return res.status(401).json({
                error: 'Incorrect OTP',
                attemptsRemaining: Math.max(0, 5 - twoFactor.otpAttempts)

            });

        }

        //The OTP has been used successfully. It cannot be reused.
        twoFactor.otpHash = null;
        twoFactor.otpExpiresAt = null;
        twoFactor.otpAttempts = 0;
        twoFactor.otpPurpose = null;
        twoFactor.otpLastSentAt = null;
        twoFactor.lastVerifiedAt = new Date();

        const recognisedDevice = decoded.existingDeviceId ? twoFactor.devices.id(decoded.existingDeviceId) : null;

        //Confirm that the device still matches the signed login challenge.
        const validRecognisedDevice =
            recognisedDevice && recognisedDevice.tokenHash === decoded.deviceTokenHash
                ? recognisedDevice
                : null;

        if (validRecognisedDevice) //(The IIE, 2026)(W3 Schools, s.a.)
        {
            validRecognisedDevice.lastSeenAt = new Date();
            validRecognisedDevice.loginCount += 1;

            //An Away browser must complete OTP on every login.
            if (validRecognisedDevice.location === 'AWAY') 
            {
                let requiresClassification = false;

                //After the browser has been used more than once, offer the user a chance to reclassify it.
                if (validRecognisedDevice.loginCount > 1 && !validRecognisedDevice.classificationPrompted) 
                {
                    validRecognisedDevice.classificationPrompted = true;
                    requiresClassification = true;//(The IIE, 2026)(W3 Schools, s.a.)

                }

                await twoFactor.save();

                //Notify the account owner on every successful Away login.
                try {
                    await SendEmail(foundUser.email, 'HustleHub: Away device login', `A successful login was made to your HustleHub account from a browser classified as AWAY. If this was not you, secure your account immediately.`);

                } 
                catch (emailError) {
                    console.error('Away login notification failed:', emailError);

                }

                if (requiresClassification) {
                    const classificationToken = jwt.sign(
                    {
                            userId: foundUser._id.toString(),
                            deviceTokenHash: decoded.deviceTokenHash,
                            purpose: 'DEVICE_CLASSIFICATION'

                        },

                        process.env.TWO_FACTOR_JWT_SECRET, { expiresIn: '5m' }

                    );

                    return res.status(200).json({//(The IIE, 2026)(W3 Schools, s.a.)
                        message: 'OTP verified. Please confirm this browser classification.',
                        requiresDeviceClassification: true,
                        classificationToken,
                        currentLocation: 'AWAY'//(The IIE, 2026)(W3 Schools, s.a.)

                    });
                }

            } 
            else {
                await twoFactor.save();

            }

            const token = TokenCreation(foundUser.username, foundUser.role);//(The IIE, 2026)(W3 Schools, s.a.)

            return res.status(200).json({
                message: 'Login successful',
                requiresTwoFactor: false,

                token

            });

        }

        // A new browser must be classified before it receives an access JWT.
        await twoFactor.save();

        const classificationToken = jwt.sign(
            {
                userId: foundUser._id.toString(),
                deviceTokenHash: decoded.deviceTokenHash,
                purpose: 'DEVICE_CLASSIFICATION'

            },
            process.env.TWO_FACTOR_JWT_SECRET, { expiresIn: '5m' }

        );

        return res.status(200).json({
            message: 'OTP verified. Please classify this browser.',
            requiresDeviceClassification: true,
            classificationToken

        });

    } 
    catch (error) {
        console.error('Login OTP verification error:', error);
        return res.status(500).json({ 
            error: 'Something went wrong' //(The IIE, 2026)(W3 Schools, s.a.)
        
        });

    }

};

module.exports = VerifyLoginOtp;
