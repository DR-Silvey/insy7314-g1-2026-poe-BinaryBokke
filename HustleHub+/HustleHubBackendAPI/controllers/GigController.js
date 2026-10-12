//Model used perform CRUD to Gig model
const Gig = require('../models/Gig');

//Using the Username attached to the JWT to retrieve the current user's username
const getUserName = (req) => {
    return req.user?.username;

};

//Using the Username attached to the JWT to retrieve the current user's role
const getUserRole = (req) => {
    return req.user?.role;

};

//Method to create a new Gig
//(The IIE, 2026) (W3 Schools, s.a.)
const CreateGig = async (req, res) => {
    try {  
        const userName = getUserName(req);
        console.log('Extracted username:', userName);
        
        if (!userName) {
            console.error(`No Auth`);
            return res.status(401).json({
                error: 'Invalid or missing authenticated user'

            });

        }

        //Getting gig data from request body
        const { gigType, description, stageName, costPerHour, isAvailable } = req.body;

        //Creates the new gig model and associates the gig with the logged-in freelancer.
        const newGig = await Gig.create({
            //GigId: Auto genned Guid
            usernamePerformer: userName,
            gigType,
            description,
            stageName,
            costPerHour,
            ...(isAvailable !== undefined && { isAvailable })

        });

        console.log(`Gig ${newGig.gigID} created successfully`);

        return res.status(201).json({
            message: 'Gig created successfully',
            gig: newGig

        });

    } 
    catch (error) {
        console.error(`Internal Server Error`, error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Gig validation failed',
                details: Object.values(error.errors).map(
                    validationError => validationError.message

                )

            });
            
        }

        //If the Gig Id was not unique throw error
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'A gig with this unique identifier already exists'

            });

        }

        return res.status(500).json({
            error: 'Something went wrong (Gig Creation)'

        });

    }

};

//Method used to return all gigs or only those linked to a performer username or GigID
//(The IIE, 2026) (W3 Schools, s.a.)
const FindGig = async (req, res) => {
    try {
        const { gigID, usernamePerformer } = req.query;
        const filter = {};

        //Filter by GigID
        if (gigID) {
            filter.gigID = gigID;

        }

        //Filter by the performer's username
        if (usernamePerformer) {
            filter.usernamePerformer = usernamePerformer;

        }

        //Retrieve matching gigs
        const gigs = await Gig.find(filter);

        //No gigs found
        if (gigs.length === 0) {
            console.error(`No Gigs Found`);
            return res.status(404).json({
                message: 'No gigs found'

            });

        }

        console.log(`${gigs.length} gig(s) retrieved successfully`);

        //Returning all Gig(s) that match the user's chosen criteria
        return res.status(200).json({
            message: 'Gigs retrieved successfully',
            count: gigs.length,
            gigs

        });

    } 
    catch (error) {
        console.error(`Internal Server Error`, error);

        return res.status(500).json({
            error: 'Something went wrong'

        });

    }

};

//Method used to update a gig (if said gig is owned by the current user)
//(The IIE, 2026) (W3 Schools, s.a.)
const UpdateGig = async (req, res) => {
    try {
        const userName= getUserName(req);
        const userRole = getUserRole(req);

        if (!userName) {
            console.error(`No Auth`);
            return res.status(401).json({
                error: 'Invalid or missing authenticated user'

            });

        }

        const { gigID } = req.body;

        if (!gigID) {
            console.error(`No Gig ID provided to update Gig`);
            return res.status(400).json({
                error: 'GigID is required to update a gig'

            });

        }

        //Retrieving hte Gig
        const existingGig = await Gig.findOne({ gigID });

        if (!existingGig) {
            console.error(`No matching Gig Found`);
            return res.status(404).json({
                error: 'Matching Gig not found'

            });

        }

        //Ensuring that the Gig belongs to the person trying to update it's info
        if (((existingGig.usernamePerformer.toString() !== userName.toString()) && (userRole !== 'admin'))) {
            console.error(`Outside Access Scope`);
            return res.status(403).json({
                error: 'You are not authorised to update this gig (belongs to another performer)'

            });

        }

        //Updating Gig's model (The Gig's ID or performer cannot be updated)
        const allowedFields = [ 'gigType', 'description', 'stageName', 'costPerHour', 'isAvailable' ];
        const updates = {};

        //Ensruing the valididty of the new info in terms of data type
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];

            }

        }

        if (Object.keys(updates).length === 0) {
            console.error(`Invalid inputs to update Gig Info Provided`);
            return res.status(400).json({
                error: 'No valid fields supplied for updating'

            });

        }

        //Updating the actual values stored regarding a gig
        const updatedGig = await Gig.findOneAndUpdate(
            { gigID },
            { $set: updates },
            {
                new: true,
                runValidators: true

            }

        );

        console.log(`Gig ${gigID} updated successfully`);

        //Retruning the new version of the gig to the front-end
        return res.status(200).json({
            message: 'Gig updated successfully',
            gig: updatedGig

        });

    } 
    catch (error) {
        console.error(`Internal Server Error`, error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Gig validation failed',
                details: Object.values(error.errors).map(
                    validationError => validationError.message

                )

            });

        }

        return res.status(500).json({
            error: 'Something went wrong (Gig Info Update)'

        });

    }

};

//Method used to remove a gig (only if the authenticated user owns it)
//(The IIE, 2026) (W3 Schools, s.a.)
const RemoveGig = async (req, res) => {
    try {
        const userName = getUserName(req);
        const userRole = getUserRole(req);

        const { gigID } = req.query;

        if (!userName) {
            console.error(`No Auth`);
            return res.status(401).json({
                error: 'Invalid or missing authenticated user'

            });

        }

        if (!gigID) {
            console.error(`No Gig ID provided to remove a Gig`);
            return res.status(400).json({
                error: 'GigID is required to remove a gig'

            });

        }

        //Retrieving the current gig
        const existingGig = await Gig.findOne({ gigID });

        if (!existingGig) {
            console.error(`No matching Gig Found`);
            return res.status(404).json({
                error: 'Matching Gig not found'

            });

        }

        //Ensruing that the owner of the gig is the one removing it
        if (((existingGig.usernamePerformer.toString() !== userName.toString()) && (userRole !== 'admin'))) {
            console.error(`Outside Of Access Scope`);
            return res.status(403).json({
                error: 'You are not authorised to remove this gig'

            });

        }

        //Removing gig from cluster
        await Gig.deleteOne({ _id: existingGig._id });

        console.log(`Gig ${gigID} removed successfully`);

        return res.status(200).json({
            message: 'Gig removed successfully',
            gigID

        });

    } 
    catch (error) {
        console.error(`Internal Server Error`, error);

        return res.status(500).json({
            error: 'Something went wrong (Gig Removal)'

        });

    }

};


module.exports = { CreateGig, FindGig, UpdateGig, RemoveGig };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 11 october 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 11 October 2026]. 

*/