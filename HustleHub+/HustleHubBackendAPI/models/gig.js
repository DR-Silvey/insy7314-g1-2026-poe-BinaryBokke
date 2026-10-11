//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how gig data will be stored
//(The IIE, 2026)
const GigSchema = new mongoose.Schema(
    {
        gigID: { //used as a PK (GUID)
            type: String,
            required: [true, 'GigID is required'],
            unique: true,
            default: () => new mongoose.Types.UUID().toString()

        },

        usernamePerformer: { //FK referencing User
            type: String,
            ref: 'User',
            required: [true, 'Performer is required']

        },

        gigType: {
            type: String,
            required: [true, 'Gig type is required'],
            trim: true

        },

        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true

        },

        stageName: {
            type: String,
            required: [true, 'Stage name is required'],
            trim: true

        },

        costPerHour: {
            type: Number,
            required: [true, 'Cost per hour is required'],
            min: [0, 'Cost per hour cannot be negative']

        },

        isAvailable: {
            type: Boolean,
            required: [true, 'Availability status is required'],
            default: true
            
        }

    },
    { timestamps: true }

);

module.exports = mongoose.model('Gig', GigSchema);

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/