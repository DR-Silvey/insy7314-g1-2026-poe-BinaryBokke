//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how user data will be stored
//(The IIE, 2026)
const UserSchema = new mongoose.Schema(
    {
        username: { //used as a PK
            type: String,
            required: [true, 'Username is required'],
            unique: true, 
            trim: true,
            minlength: [3, 'Username must be atleast 3 characters']

        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            trim: true

            //Min length already enforced pre hashing
            
        },

        fullname: {
            type: String,
            required: [true, 'Fullname is required'],
            trim: true
            
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true
            
        },

        age: {
            type: Number,
            required: [true, 'Age  is required'],
            min: [16, 'Age has to be at minimum 16'],
            max: [120, 'Age has to be at maximum 120']
            
        },

        role: {
            type: String,
            required: [true, 'Role is required'],
            trim: true,
            default: 'GENERIC'
            
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        
        }

    },
    { timestamps: true }

);

module.exports = mongoose.model('User', UserSchema);

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/