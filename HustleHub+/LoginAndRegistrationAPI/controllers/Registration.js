//Loading required utils
const EncryptionHandler = require('./../utils/passwords/EncryptionHandler');
const encryptHandler = new EncryptionHandler();

const SendEmail = require('./../utils/email/EmailHandler');
const { GenerateOtp, HashOtp } = require('./../utils/email/OtpHandler');

//Temp to store and retreive data relating to user
const user = require('./../models/users');
const EmailVerification = require('./../models/userVerificiation/emailVerification');

//Registration route
//Steps
  //Check inputs (flag abnormalities)
  //check if username or email already exists (if username or email already exists, tell the user account laready exists)
  //check if password meets security requirements
  //encrypt password
  
//(The IIE, 2026)
const RegisterUser = async (req, res) => {
    let createdUserId = null;

    try{
        //(w3 Schools, s.a.)
        const { username, password, fullname, email, age, role } = req.body;
  
        //Checking if the username or email already exists
        const existingUser = await user.findOne({
            $or: [
                { username: username },
                { email: email }

            ]

        });

        if (existingUser) {
            console.error(`Instance of username ${username} or email ${email} already exists within db as (pk)`);
            return res.status(409).json({
                error: 'Username or email already exists. If this is your account, please LogIn'
            
            });

        }

        //Encrypting the user's chosen password
        const encryptedPassword = await encryptHandler.EncryptPassword(password);

        //Creating a populated instance of the user schema
        //(The IIE, 2026)
        //(w3 Schools, s.a.)
        const newUser = new user({
            username: username,
            password: encryptedPassword,
            fullname: fullname,
            email: email,
            age: age,
            role: role

        });

        //Saving the new user to in memory schema
        await newUser.save();

        createdUserId = newUser._id;

        //Generating the 6 digit OTP for email verification
        const otp = GenerateOtp();
        const hashedOtp = await HashOtp(otp);

        //Create the email verification record
        const verification = new EmailVerification({
            user: newUser._id,
            otpHash: hashedOtp,
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
            otpAttempts: 0,
            isVerified: false,
            lastOtpSentAt: new Date()

        });

        await verification.save();

        // Send the verification email
        await SendEmail(
            newUser.email,
            'Verify Your Email Address',
            `Hello ${newUser.fullname},

            Thank you for registering!

            Your email verification code is: <strong>${otp}</strong>

            This code expires in 5 minutes.

            If you did not create this account, please ignore this email.

            Kind regards,
            HustleHub+ Support Team`

        );

        console.log(`Registration verification email sent for ${username}`);

        return res.status(201).json({
            message: 'Registration successful. Please verify your email address using the code we sent you.',
            requiresEmailVerification: true,
            userId: newUser._id

        });

    }
    catch(error){
        console.error('Internal Server Error', error);
        
        if (createdUserId) {
            await EmailVerification.deleteOne({
                user: createdUserId

            });

            await user.deleteOne({
                _id: createdUserId

            });

        }

        //Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Username or email already exists.'

            });

        }

        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }

};

module.exports = RegisterUser;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/