//importing mongoose
const mongoose = require('mongoose');

//Schema that defines how user data will be stored
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
            trim: true,
            minlength: [12, 'Password must be atleast 12 characters']
            
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