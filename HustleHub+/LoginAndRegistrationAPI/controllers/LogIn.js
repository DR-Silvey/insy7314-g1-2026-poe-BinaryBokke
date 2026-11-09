//Loading required utils
//(The IIE, 2026)
const EncryptionHandler = require('../utils/passwords/EncryptionHandler');
const encryptionHandler = new EncryptionHandler();

const TokenCreation = require('../utils/tokens/TokenCreation');

//Temp to store and retreive data relating to user
const user = require('../models/users');
const EmailVerification = require('../models/emailVerification');
const TwoFactor = require('../models/twoFactor');
const SendEmail = require('../utils/email/EmailHandler');
const { GenerateOtp, HashOtp } = require('../utils/email/OtpHandler');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//Seven-day verification period
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

//Trusted-device cookie name
const DEVICE_COOKIE = 'hustlehub_device';

//Method logs user in if their username and corelating password matches a saved one
//(The IIE, 2026)
const logUserIn =  async (req, res) => {
    try{
        const { username, password } = req.body;
    
        //Seeing if the entered username is in the database
        //(The IIE, 2026)
        const foundUser = await user.findOne({ username });

        //User doesn't exist
        if(!foundUser){
            console.error(`Invalid Usernamr or password`);
            return res.status(401).json({
                error: 'Invalid Username or Password'
        
            });

        }

        //If user does exist comparre the hasehed version of the netered password to the related stored password
        //(w3 Schools, s.a.)
        const passwordMatches = await encryptionHandler.ComparePassword(password, foundUser.password);

        //Passwords don't match
        if(!passwordMatches){
            console.error(`The Password does not match the correlating user's (${username})`);
            return res.status(401).json({
                error: 'Invalid Username or Password'
        
            });

        }

        //Check email verification
        const emailVerification = await EmailVerification.findOne({ user: foundUser._id });

        if (!emailVerification || !emailVerification.isVerified) {
            return res.status(403).json({
                error: 'Please verify your email address before logging in.',
                requiresEmailVerification: true

            });

        }

        //Find or create the user's 2FA record
        let twoFactor = await TwoFactor.findOne({ user: foundUser._id });

        if (!twoFactor) {
            twoFactor = await TwoFactor.create({
                user: foundUser._id,
                enabled: true

            });

        }

        //If 2FA has been disabled, issue normal JWT
        if (!twoFactor.enabled) {
            const token = TokenCreation(foundUser.username, foundUser.role);

            return res.status(200).json({
                message: 'Login successful.',
                token

            });

        }

        //Read recognised-device cookie
        const deviceToken = req.cookies?.[DEVICE_COOKIE];

        //Hash the browser's device token
        let deviceTokenHash = null;

        if (deviceToken) {
            deviceTokenHash = crypto
                .createHash('sha256')
                .update(deviceToken)
                .digest('hex');

        }

        //Find recognised device
        let recognisedDevice = null;

        if (deviceTokenHash) {
            recognisedDevice = twoFactor.devices.find(
                device => device.tokenHash === deviceTokenHash

            );

        }

        //Check whether the account-wide seven-day period is valid
        const now = Date.now();

        const verificationStillValid =
            twoFactor.lastVerifiedAt &&
                now - new Date(twoFactor.lastVerifiedAt).getTime() < SEVEN_DAYS &&
                now >= new Date(twoFactor.lastVerifiedAt).getTime();

        //Home and Work devices can bypass OTP during the seven-day period
        if (recognisedDevice && ['HOME', 'WORK'].includes(recognisedDevice.location) && verificationStillValid) {
            recognisedDevice.lastSeenAt = new Date();

            await twoFactor.save();

            const token = TokenCreation(foundUser.username, foundUser.role);

            console.log(`Trusted-device login successful for ${username}`);
            return res.status(200).json({
                message: 'Login successful.',
                token,
                requiresTwoFactor: false

            });

        }

        //New devices need a new random device token.
        //Existing recognised devices keep their existing token.
        let pendingDeviceToken = deviceToken;

        if (!recognisedDevice) {

            pendingDeviceToken = crypto
                .randomBytes(32)
                .toString('hex');

            deviceTokenHash = crypto
                .createHash('sha256')
                .update(pendingDeviceToken)
                .digest('hex');

            //Store the cookie as HttpOnly so frontend JavaScript
            //cannot read the device token.
            res.cookie(DEVICE_COOKIE, pendingDeviceToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 365 * 24 * 60 * 60 * 1000,
                path: '/'

            });

        }

        //Generate login OTP
        const otp = GenerateOtp();
        const otpHash = await HashOtp(otp);

        //Store temporary OTP information
        twoFactor.otpHash = otpHash;
        twoFactor.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        twoFactor.otpAttempts = 0;
        twoFactor.otpPurpose = 'LOGIN';

        await twoFactor.save();

        //Create short-lived temporary login token.
        //This is NOT the user's normal access token.
        const temporaryToken = jwt.sign(
        {
                userId: foundUser._id.toString(),
                username: foundUser.username,
                purpose: 'LOGIN_2FA',
                deviceTokenHash: deviceTokenHash,
                existingDeviceId: recognisedDevice
                    ? recognisedDevice._id.toString()
                    : null
            },
            process.env.TWO_FACTOR_JWT_SECRET, { expiresIn: '5m' }

        );

        //Send login OTP
        await SendEmail(
            foundUser.email,
            'HustleHub+ Login Verification',
            `Hello ${foundUser.fullname},

                A login attempt was made to your HustleHub account.

                Your verification code is: ${otp}

                This code expires in 5 minutes.

                If you did not attempt to log in, please secure your account.

                Kind regards,
                HustleHub+ Support`

        );

        console.log(`Login OTP sent to ${username}`);

        return res.status(200).json({
            message: 'Please verify your login using the OTP sent to your email.',
            requiresTwoFactor: true,
            temporaryToken

        });

    } 
    catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            error: 'Something went wrong'

        });

    }

};

module.exports = logUserIn;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/