//Temp to store and retreive data relating to booking
const Booking = require('../models/booking');

//Using the Username attached to the JWT to retrieve the current user's username
const getUserName = (req) => {
    return req.user?.username;

};

//Using the Username attached to the JWT to retrieve the current user's role
const getUserRole = (req) => {
    return req.user?.role;

};

//Method creates a new booking
//(The IIE, 2026) (W3 Schools, s.a.)
const CreateBooking =  async (req, res) => {
    try{
        //Retrieving username from jwt
        const userName = getUserName(req);
        
        if (!userName) {
            console.error(`No Auth`);
            return res.status(401).json({
                error: 'Invalid or missing authenticated user'

            });

        }

        //Inputs we expect to receive from JSON
        const { usernamePerformer, eventName, capacity, numOfHours, dateTimeToPerform, venue, paymentReceived  } = req.body;

        //Creates the new bboking model and associates the booking with the logged-in client.
        const newBooking = await Booking.create({
            //bookingId: Auto genned Guid
            usernameClient: userName,
            usernamePerformer: usernamePerformer,
            eventName: eventName,
            capacity: capacity,
            numOfHours: numOfHours,
            dateTimeToPerform: dateTimeToPerform,
            venue: venue,
            paymentReceived: paymentReceived

        });

        console.log(`Booking ${newBooking.bookingID} created successfully`);
            return res.status(201).json({
                message: 'Booking created successfully',
                booking: newBooking

        });

    }
    catch(error){
        console.error(`Internal Server Error`, error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Booking validation failed',
                details: Object.values(error.errors).map(
                    validationError => validationError.message

                )

            });
            
        }

        //If the Booking Id was not unique throw error
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'A booking with this unique identifier already exists'

            });

        }

        return res.status(500).json({
            error: 'Something went wrong (Booking Creation)'
        
        });

    }

}

//Method finds a booking by its ID, or the related username, and returns the booking data
//(The IIE, 2026) (W3 Schools, s.a.)
const FindBooking =  async (req, res) => {
    try{
        //Inputs we expect to receive from the query
        const { bookingID, usernameClient, usernamePerformer } = req.query;
        const filter = {};
        
        //Filter by bookingID
        if (bookingID) {
            filter.bookingID = bookingID;
        
        }
        
        //Filter by the client's username
        if (usernameClient) {
            filter.usernameClient = usernameClient;
        
        }
        
        //Filter by the client's username
        if (usernamePerformer) {
            filter.usernamePerformer = usernamePerformer;
        
        }

        //Retrieve matching bookings
        const bookings = await Booking.find(filter);
        
        //No bookings found
        if (bookings.length === 0) {
            console.error(`No Booking Found`);
            return res.status(404).json({
                message: 'No bookings found'
        
            });
        
        }
        
        //Returning all Booking(s) that match the user's chosen criteria
        console.log(`${bookings.length} booking(s) retrieved successfully`);
            return res.status(200).json({
                message: 'Bookings retrieved successfully',
                count: bookings.length,
                bookings
        
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong (Booking Retrieval)'
        
        });

    }

}

//Method updates a booking if the user has the appropriate permissions
//(The IIE, 2026) (W3 Schools, s.a.)
const UpdateBooking =  async (req, res) => {
    try{
        const userName= getUserName(req);
        const userRole = getUserRole(req);

        if (!userName) {
            console.error(`No Auth`);
            return res.status(401).json({
                error: 'Invalid or missing authenticated user'

            });

        }

        const { bookingID } = req.body;

        if (!bookingID) {
            console.error(`No Booking Id preovided to update booking Info`);
            return res.status(400).json({
                error: 'Booking ID is required to update a booking'
        
            });
        
        }
        
        //Retrieving hte booking
        const existingBooking = await Booking.findOne({ bookingID });
        
        if (!existingBooking) {
            console.error(`Matching Booking not Found`);
            return res.status(404).json({
                error: 'Matching Booking not found'
        
            });
        
        }
        
        //Ensuring that the Booking belongs to the person trying to update it's info
        if (((existingBooking.usernameClient.toString() !== userName.toString()) && (userRole !== 'admin'))) {
            console.error(`Outside Access Scope`);
            return res.status(403).json({
                error: 'You are not authorised to update this booking (belongs to another client)'
        
            });
        
        }
        
        //Updating Booking's model (The Booking's ID or Client cannot be updated)
        const allowedFields = [ 'usernamePerformer', 'eventName', 'capacity', 'numOfHours', 'dateTimeToPerform', 'venue', 'paymentReceived' ];
        const updates = {};
        
        //Ensruing the valididty of the new info in terms of data type
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
        
            }
        
        }
        
        if (Object.keys(updates).length === 0) {
            console.error(`Invalid Fields For update Given`);
            return res.status(400).json({
                error: 'No valid fields supplied for updating'
        
            });
        
        }
        
        //Updating the actual values stored regarding a booking
        const updatedBooking = await Booking.findOneAndUpdate(
            { bookingID },
            { $set: updates },
            {
                new: true,
                runValidators: true
        
            }
        
        );
        
        console.log(`Booking ${bookingID} updated successfully`);
        
        //Retruning the new version of the booking to the front-end
        return res.status(200).json({
            message: 'Booking updated successfully',
            booking: updatedBooking
        
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Booking validation failed',
                details: Object.values(error.errors).map(
                    validationError => validationError.message

                )

            });

        }

        return res.status(500).json({
            error: 'Something went wrong (Booking Info Update)'
        
        });

    }

}

//Method removes a booking if the user has the appropriate permissions
//(The IIE, 2026) (W3 Schools, s.a.)
const RemoveBooking =  async (req, res) => {
    try{
        const userName= getUserName(req);
        const userRole = getUserRole(req);

        if (!userName) {
            console.error(`No Auth`);
            return res.status(401).json({
                error: 'Invalid or missing authenticated user'

            });

        }
        //Inputs we expect to receive from the query
        const { bookingID } = req.query;


        if (!bookingID) {
            console.error(`No Bokking Id provided to remove Booking`);
            return res.status(400).json({
                error: 'Booking ID is required to remove a booking'
        
            });
        
        }
        
        //Retrieving the current booking
        const existingBooking = await Booking.findOne({ bookingID });
        
        if (!existingBooking) {
            console.error(`No Matching Booking Found`);
            return res.status(404).json({
                error: 'Matching Booking not found'
        
            });
        
        }
        
        //Ensruing that the owner of the booking is the one removing it
        if (((existingBooking.usernameClient.toString() !== userName.toString()) && (userRole !== 'admin'))) {
            console.error(`Outside Access Scope`);
            return res.status(403).json({
                error: 'You are not authorised to remove this booking'
        
            });
        
        }
        
        //Removing bookingfrom cluster
        await Booking.deleteOne({ _id: existingBooking._id });
        
        console.log(`Bookling ${bookingID} removed successfully`);
        
        return res.status(200).json({
            message: 'Booking removed successfully',
            bookingID
        
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong (Booking Removal)'
        
        });

    }

}

module.exports = { CreateBooking, FindBooking, UpdateBooking, RemoveBooking };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 11 october 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 11 October 2026]. 

*/