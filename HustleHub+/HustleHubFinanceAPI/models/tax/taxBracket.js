//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how tax barckets data will be stored
//(The IIE, 2026)
const TaxBracketSchema = new mongoose.Schema({
    taxYear: {
        type: String,
        required: true

    },

    minimumIncome: {
        type: Number,
        required: true

    },

    maximumIncome: {
        type: Number,
        default: null

    },

    taxRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100

    },

    baseTax: {
        type: Number,
        default: 0

    }

});

module.exports = mongoose.model('TaxBracket', TaxBracketSchema);

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 7 November 2026]. 

*/