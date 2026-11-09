const logger = require("./../../utils/Logger");

const mongoose = require('mongoose');

//Importing verification model
const EmailVerification = require('./../../models/userVerificiation/emailVerification');

const User = require('./../../models/users');

//Importing OTP comparison utility
const { CompareOtp } = require('./../../utils/email/OtpHandler');

const VerifyEmail = async (req, res) => {
    try {
        const { username, otp } = req.body;

        if (!username || !otp) {
            return res.status(400).json({
                error: 'Username and verification code are required.'

            });

        }

        const foundUser = await User.findOne({ username });

        if (!foundUser) {
            return res.status(404).json({
                error: 'User not found.'

            });

        }

        //Validate six-digit OTP format
        if (!/^\d{6}$/.test(String(otp))) {
            return res.status(400).json({
                error: 'Please enter a valid six-digit verification code.'

            });

        }

        //Find the user's verification record
        const verification = await EmailVerification.findOne({ user: foundUser._id });

        if (!verification) {
            return res.status(404).json({
                error: 'No email verification request was found.'

            });

        }

        //Check whether email is already verified
        if (verification.isVerified) {
            return res.status(200).json({
                message: 'Your email address has already been verified.'

            });

        }

        //Check whether the OTP has already been invalidated
        if (!verification.otpHash || !verification.otpExpiresAt) {
            return res.status(400).json({
                error: 'No active verification code exists. Please request a new one.'

            });

        }

        //Check OTP expiry
        if (Date.now() > verification.otpExpiresAt.getTime()) {
            verification.otpHash = null;
            verification.otpExpiresAt = null;
            verification.otpAttempts = 0;

            await verification.save();

            return res.status(410).json({
                error: 'Your verification code has expired. Please request a new one.'

            });

        }

        //Check maximum attempts
        if (verification.otpAttempts >= 5) {
            return res.status(429).json({
                error: 'Too many incorrect attempts. Please request a new verification code.'

            });

        }

        //Compare submitted OTP with stored bcrypt hash
        const otpMatches = await CompareOtp(String(otp), verification.otpHash);

        //Handle incorrect OTP
        if (!otpMatches) {
            verification.otpAttempts += 1;

            //Invalidate OTP after five incorrect attempts
            if (verification.otpAttempts >= 5) {
                verification.otpHash = null;
                verification.otpExpiresAt = null;

            }

            await verification.save();

            return res.status(400).json({
                error: verification.otpAttempts >= 5
                    ? 'Maximum attempts reached. Please request a new verification code.'
                    : 'Incorrect verification code.',

                attemptsRemaining: Math.max(0, 5 - verification.otpAttempts)

            });

        }

        //OTP is correct: verify the email
        verification.isVerified = true;

        //Invalidate the OTP so it cannot be reused
        verification.otpHash = null;
        verification.otpExpiresAt = null;
        verification.otpAttempts = 0;

        await verification.save();

        logger.log(`Email successfully verified for user ${foundUser.username}`);

        return res.status(200).json({
            message: 'Email address successfully verified. You can now log in.',
            emailVerified: true

        });

    } 
    catch (error) {
        logger.error('Email Verification Error:', error);

        return res.status(500).json({
            error: 'Something went wrong while verifying your email.'
            
        });

    }

};

module.exports = VerifyEmail;
