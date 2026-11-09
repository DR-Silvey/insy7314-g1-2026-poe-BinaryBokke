
//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how the password reset requests data will be stored
//(The IIE, 2026)
const PasswordResetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true

    },
    tokenHash: {
        type: String,
        required: true

    },
    expiresAt: {
        type: Date,
        required: true

    }

}, { timestamps: true });

module.exports = mongoose.models.PasswordReset || mongoose.model('PasswordReset', PasswordResetSchema);

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 7 November 2026]. 

*/
