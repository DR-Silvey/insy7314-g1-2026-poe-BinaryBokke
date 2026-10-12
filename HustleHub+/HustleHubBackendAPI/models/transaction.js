//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how transaction data will be stored
//(The IIE, 2026)
const TransactionSchema = new mongoose.Schema(
    {
        transactionID: { //used as a PK (GUID)
            type: String,
            required: [true, 'transactionID is required'],
            unique: true,
            default: () => new mongoose.Types.UUID().toString()

        },

        bookingID: { //FK referencing booking
            type: String,
            required: [true, 'BookingID is required'],
            unique: true,
            default: () => new mongoose.Types.UUID().toString()
            
        },

        gigID: { //FK referencing Gig
            type: String,
            ref: 'Gig',
            required: [true, 'Gig ID is required']

        },

        usernamePerformer: { //FK referencing User
            type: String,
            ref: 'User',
            required: [true, 'Performer is required']

        },

        usernameClient: { //FK referencing User
            type: String,
            ref: 'User',
            required: [true, 'Client is required']

        },

        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Cost per hour cannot be negative']

        },

    },
    { timestamps: true }

);

module.exports = mongoose.model('Transaction', TransactionSchema);

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/