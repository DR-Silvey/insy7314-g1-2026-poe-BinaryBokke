//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how the two factor authentication data will be stored
//(The IIE, 2026)
const TwoFactorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true

    },

    secret: {
        type: String,
        required: true

    },

    enabled: {
        type: Boolean,
        default: false

    },

    recoveryCodes: [{
        type: String

    }]

}, 

{ timestamps: true });

module.exports = mongoose.model('TwoFactor', TwoFactorSchema);

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 7 November 2026]. 

*/