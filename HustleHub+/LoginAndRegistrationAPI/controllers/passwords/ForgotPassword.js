const crypto = require('crypto');

const User = require('../../models/users');
const PasswordReset = require('../../models/auth/passwordReset');
const SendEmail = require('../../utils/email/EmailHandler');

//(The IIE, 2026) (W3 Schools, s.a.)
const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'Email address is required'

            });

        }

        //Using a generic response to prevent account enumeration
        const genericResponse = {  message: 'If an account exists with that email, a password reset link will be sent.' };//(The IIE, 2026) (W3 Schools, s.a.)

        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(200).json(genericResponse);

        }

        //Creating a cryptographically secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');

        //Hashing the token before storing it.
        const tokenHash = crypto
            .createHash('sha256')
            .update(resetToken)//(The IIE, 2026) (W3 Schools, s.a.)
            .digest('hex');

        //Setting the token expiry to 15 minutes
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        //Replacing any existing reset token for this user
        await PasswordReset.findOneAndUpdate(
            { user: foundUser._id },
            {
                user: foundUser._id,
                tokenHash,
                expiresAt

            },
            {
                upsert: true,
                new: true,
                runValidators: true

            }

        );

        //Build the password reset link.
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        try {
            await SendEmail(
                foundUser.email,
                'HustleHub Password Reset',
                `You requested a password reset.

                Click the link below to reset your password:

                ${resetLink}

                This link expires in 15 minutes.

                If you did not request this reset, you can safely ignore this email.`

            );

        } //(The IIE, 2026) (W3 Schools, s.a.)
        catch (emailError) {
            //Invalidate the token if email delivery fails.
            await PasswordReset.deleteOne({
                user: foundUser._id,
                tokenHash

            });

            throw emailError;

        }

        return res.status(200).json(genericResponse);

    } 
    catch (error) {
        console.error('Forgot password error:', error);

        return res.status(500).json({
            error: 'Unable to process password reset request' //(The IIE, 2026) (W3 Schools, s.a.)

        });

    }

};

module.exports = ForgotPassword;
