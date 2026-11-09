//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how the revognixed devices data will be stored
//(The IIE, 2026)
const RecognisedDeviceSchema = new mongoose.Schema({
    tokenHash: {
        type: String,
        required: true

    },

    location: {
        type: String,
        enum: ['HOME', 'WORK', 'AWAY'],
        required: true

    },

    createdAt: {
        type: Date,
        default: Date.now

    },

    lastSeenAt: {
        type: Date,
        default: Date.now

    },

    loginCount: {
        type: Number,
        default: 0

    },

    classificationPrompted: {
        type: Boolean,
        default: false

    }

}, { _id: true });

module.exports = ( RecognisedDeviceSchema );

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 7 November 2026]. 

*/