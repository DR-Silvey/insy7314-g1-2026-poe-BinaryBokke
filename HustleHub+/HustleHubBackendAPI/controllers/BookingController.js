//Temp to store and retreive data relating to booking
const booking = require('../models/Booking');

//Method creates a new booking
//(The IIE, 2026)
const CreateBooking =  async (req, res) => {
    try{
        const { } = req.body;


        console.log(`Attempt for ${username} was a success`);
        return res.status(200).json({
            message: '', token
    
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }

}

//Method finds a booking by its ID, or the related username, and returns the booking data
//(The IIE, 2026)
const FindBooking =  async (req, res) => {
    try{
        const { } = req.body;


        console.log(`Attempt for ${username} was a success`);
        return res.status(200).json({
            message: '', token
    
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }

}

//Method updates a booking if the user has the appropriate permissions
//(The IIE, 2026)
const UpdateBooking =  async (req, res) => {
    try{
        const { } = req.body;


        console.log(`Attempt for ${username} was a success`);
        return res.status(200).json({
            message: '', token
    
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }

}

//Method removes a booking if the user has the appropriate permissions
//(The IIE, 2026)
const RemoveBooking =  async (req, res) => {
    try{
        const { } = req.body;


        console.log(`Attempt for ${username} was a success`);
        return res.status(200).json({
            message: '', token
    
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }

}

module.exports = { CreateBooking, FindBooking, UpdateBooking, RemoveBooking };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/