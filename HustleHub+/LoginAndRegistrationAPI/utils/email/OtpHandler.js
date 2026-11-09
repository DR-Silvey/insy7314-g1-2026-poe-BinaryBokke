const bcrypt = require('bcrypt'); //(The IIE, 2026) (Bcrypt, s.a.)
const crypto = require('crypto'); 

const SALT_ROUNDS = 6; //6 rounds of salting to keep the complexity high enough but not too high to cause performance issues (The IIE, 2026) (Bcrypt, s.a.)

//Creting a random 6 digit OTP using crypto.randomInt (The IIE, 2026) (Node.js, s.a.)
const GenerateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();

};

// Hash the OTP using bcrypt (The IIE, 2026) (Bcrypt, s.a.)
const HashOtp = async (otp) => {
    return await bcrypt.hash(otp, SALT_ROUNDS);

};

//Compare a submitted OTP against its stored hash (The IIE, 2026) (Bcrypt, s.a.)
const CompareOtp = async (otp, hashedOtp) => {
    return await bcrypt.compare(otp, hashedOtp);

};

module.exports = { GenerateOtp, HashOtp, CompareOtp };

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 7 November 2026].
*/