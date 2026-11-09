const crypto = require('crypto');

const user = require('./../../models/users');
const PasswordReset = require('./../../models/auth/passwordReset');
const EncryptionHandler = require('./../../utils/passwords/EncryptionHandler');

const encryptionHandler = new EncryptionHandler();

const ResetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        //Ensuring that all required fields are provided
        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({
                error: 'Please provide all required fields'

            });

        }

        //Ensuring the passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                error: 'Passwords do not match'

            });

        }

        // Basic password length validation
        if (newPassword.length < 8) {
            return res.status(400).json({
                error: 'Password must contain at least 8 characters'

            });

        }

        //Hashing the incoming token using SHA-256
        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        //Finding the matching reset token
        const resetRecord = await PasswordReset.findOne({ tokenHash });

        if (!resetRecord) {
            return res.status(400).json({
                error: 'Invalid or expired password reset link'

            });

        }

        //Ensuring that the reset token is made expired
        if (new Date() > resetRecord.expiresAt) {
            await PasswordReset.deleteOne({ _id: resetRecord._id });

            return res.status(400).json({
                error: 'Password reset link has expired. Please request another.'

            });

        }

        //Finding the account associated with the reset token
        const foundUser = await user.findById(resetRecord.user);

        if (!foundUser) {
            await PasswordReset.deleteOne({ _id: resetRecord._id });

            return res.status(404).json({
                error: 'User account not found'

            });

        }

        //Encrypting the new password using the existing password handler.
        const encryptedPassword = await encryptionHandler.EncryptPassword(newPassword);

        foundUser.password = encryptedPassword;

        await foundUser.save();

        //Delete the reset token so it cannot be reused.
        await PasswordReset.deleteOne({ _id: resetRecord._id });

        return res.status(200).json({
            message: 'Password successfully reset. You can now log in.'

        });

    } 
    catch (error) {
        console.error('Password reset error:', error);

        return res.status(500).json({
            error: 'Something went wrong while resetting your password'

        });

    }
    
};

module.exports = ResetPassword;
