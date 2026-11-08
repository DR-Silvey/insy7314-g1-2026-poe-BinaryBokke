//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how tax data will be stored
//(The IIE, 2026)
const TaxSchema = new mongoose.Schema(
    {
        taxID: { //used as a PK (GUID)
            type: String,
            required: true,
            unique: true,
            default: () => new mongoose.Types.UUID().toString()

        },

        transactionID: { //FK referencing booking
            type: String,
            ref: 'Transaction',
            required: [true, 'Transaction ID is required'],
            unique: true

        },

        taxAmount: {
            type: Number,
            required: [true, 'Tax amount is required'],
            min: [0, 'Tax amount cannot be negative']

        },

        taxYear: {
            type: String,
            required: true,
            default: Date.now().getFullYear().toString()

        },

        calculationDate: {
            type: Date,
            default: Date.now

        }

    },

    { timestamps: true }

);

module.exports = mongoose.model('Tax', TaxSchema);

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 7 November 2026]. 

*/