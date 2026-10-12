//Temp to store and retreive data relating to transaction
const Transaction = require('../models/transaction');

//Using the Username attached to the JWT to retrieve the current user's username
const getUserName = (req) => {
    return req.user?.username;

};

//Method creates a new Transaction
//(The IIE, 2026) (W3 Schools, s.a.)
const CreateTransaction =  async (req, res) => {
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
        const { bookingID, gigID, usernamePerformer, amount } = req.body;

        //Creates the new bboking model and associates the booking with the logged-in client.
        const newTransaction = await Transaction.create({
            //transactionId: Auto genned Guid
            bookingID: bookingID,
            gigID: gigID,
            usernameClient: userName,
            usernamePerformer: usernamePerformer,
            amount: amount

        });

        console.log(`Transaction ${newTransaction.transactionID} created successfully`);
            return res.status(201).json({
                message: 'Transaction created successfully',
                transaction: newTransaction

        });

    }
    catch(error){
        console.error(`Internal Server Error`, error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Transaction validation failed',
                details: Object.values(error.errors).map(
                    validationError => validationError.message

                )

            });
            
        }

        //If the Transaction Id was not unique throw error
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'A transaction with this unique identifier already exists'

            });

        }

        return res.status(500).json({
            error: 'Something went wrong (Transaction Creation)'
        
        });

    }

}

//Method finds a tranction by its ID, gigID, bookingID, or the related username for either client or performer, and returns the transcation data
//(The IIE, 2026) (W3 Schools, s.a.)
const FindTransaction =  async (req, res) => {
    try{
        //Inputs we expect to receive from the query
        const { transactionID, bookingID, gigID, usernamePerformer, usernameClient } = req.query;
        const filter = {};
        
        //Filter by transactionID
        if (transactionID) {
            filter.transactionID = transactionID;
        
        }

        //Filter by bookingID
        if (bookingID) {
            filter.bookingID = bookingID;
        
        }
        
        //Filter by gigID
        if (gigID) {
            filter.gigID = gigID;
        
        }

        //Filter by the client's username
        if (usernameClient) {
            filter.usernameClient = usernameClient;
        
        }
        
        //Filter by the client's username
        if (usernamePerformer) {
            filter.usernamePerformer = usernamePerformer;
        
        }

        //Retrieve matching transaction
        const transactions = await Transaction.find(filter);
        
        //No transactions found
        if (transactions.length === 0) {
            console.error(`No Transactions Found`);
            return res.status(404).json({
                message: 'No Transactions found'
        
            });
        
        }
        
        //Returning all Transaction(s) that match the user's chosen criteria
        console.log(`${transactions.length} transaction(s) retrieved successfully`);
            return res.status(200).json({
                message: 'Transactions retrieved successfully',
                count: transactions.length,
                transactions
        
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong (Transaction Retrieval)'
        
        });

    }

}


module.exports = { CreateTransaction, FindTransaction };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 11 october 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 11 October 2026]. 

*/