//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how booking data will be stored
//(The IIE, 2026)
const BookingSchema = new mongoose.Schema(
    {
        bookingID: { //used as a PK (GUID)
            type: String,
            required: [true, 'BookingID is required'],
            unique: true,
            default: () => new mongoose.Types.UUID().toString()
            
        },

        gigID: { //FK referencing User
            type: String,
            ref: 'Gig',
            required: [true, 'Gig ID is required']

        },

        usernameClient: { //FK referencing User
            type: String,
            ref: 'User',
            required: [true, 'Client is required']

        },

        usernamePerformer: { //FK referencing User
            type: String,
            ref: 'User',
            required: [true, 'Performer is required']

        },

        eventName: {
            type: String,
            required: [true, 'Event name is required'],
            trim: true

        },

        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, 'Capacity must be at least 1'],
            validate: {
                validator: Number.isInteger,
                message: 'Capacity must be a whole number'
                
            }

        },

        numOfHours: {
            type: Number,
            required: [true, 'Number of hours is required'],
            min: [0.1, 'Number of hours must be greater than zero']

        },

        dateTimeToPerform: {
            type: Date,
            required: [true, 'Performance date is required']

        },

        venue: {
            type: String,
            required: [true, 'Venue is required'],
            trim: true

        },

        paymentReceived: { //amount received, not a Boolean
            type: Number,
            required: [true, 'Payment received amount is required'],
            min: [0, 'Payment received cannot be negative'],
            default: 0

        }

    },
    { timestamps: true }

);

module.exports = mongoose.model('Booking', BookingSchema);

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/