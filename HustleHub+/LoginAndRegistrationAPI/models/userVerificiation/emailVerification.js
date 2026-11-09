//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how the email verification data will be stored
//(The IIE, 2026)
const EmailVerificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true

    },

    //Hashed email verification OTP
    otpHash: {
        type: String,
        default: null

    },

    //OTP expiration time
    otpExpiresAt: {
        type: Date,
        default: null

    },

    //Number of incorrect OTP attempts
    otpAttempts: {
        type: Number,
        default: 0

    },

    //Whether the user's email has been verified
    isVerified: {
        type: Boolean,
        default: false

    },

    //Prevent excessive OTP resend requests
    lastOtpSentAt: {
        type: Date,
        default: null

    }

}, { timestamps: true });

module.exports = mongoose.model('EmailVerification', EmailVerificationSchema);

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 7 November 2026]. 

*/