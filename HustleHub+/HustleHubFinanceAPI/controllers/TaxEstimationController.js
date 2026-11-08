//To store and retreive data relating to transactions, tax and tax brackets
const Transaction = require('../models/transaction');
const Tax = require('../models/tax/taxRecord');
const TaxBracket = require('../models/tax/taxBracket');

//Using the Username attached to the JWT to retrieve the current user's username
const getUserName = (req) => {
    return req.user?.username;

};

//Using the Username attached to the JWT to retrieve the current user's role
const getUserRole = (req) => {
    return req.user?.role;

};

//Method to estimate tax based on the transaction amount and the tax brackets for the current year
//(The IIE, 2026) (W3 Schools, s.a.)
const EstimateTax =  async (req, res) => {
    try{
        //Retrieving username from jwt
        const userName = getUserName(req);
        const userRole = getUserRole(req);

        if (!userName) {
            console.error(`No Auth`);
            return res.status(401).json({
                error: 'Invalid or missing authenticated user'

            });

        }

        const today = new Date();
        const taxYear = (today.getMonth() >= 2 ? today.getFullYear() + 1 : today.getFullYear() ).toString(); //Tax years are defined byt the year at which they end, so we add 1 to the current year to get the next tax year

        //Retrieve the tax brackets for the current year
        const taxBrackets = await TaxBracket.find({taxYear: taxYear}).sort({ minimumIncome: 1 });

        //Used to store transactions and bookings for the current user based on their role (freelancer or client)
        let transactions;
        let bookings;

        //Used to store total income
        let totalIncome = 0;

        switch (userRole) {
            case 'freelancer':
                //Freelancers's tax is estimated on their total income from transactions for the current tax year
                //Retrieve the transactions matching the current user
                transactions = await Transaction.find({usernamePerformer: userName,
                    createdAt: {
                        $gte: new Date(`${Number(taxYear) - 1}-03-01`),
                        $lt: new Date(`${taxYear}-03-01`)

                    }

                });

                // Calculate total income
                totalIncome = transactions.reduce((total, transaction) => total + transaction.amount, 0);
                break;

            case 'client':
                //Clients's tax is estimated on their total income from bookings for the current tax year
                bookings = await Booking.find({usernameClient: userName,
                    createdAt: {
                        $gte: new Date(`${Number(taxYear) - 1}-03-01`),
                        $lt: new Date(`${taxYear}-03-01`)

                    }
                });

                // Calculate total income
                totalIncome = bookings.reduce((total, booking) => total + booking.amount, 0);
                break;

            default:
                console.error(`Invalid user role: ${userRole}`);
                return res.status(400).json({
                    error: 'Invalid user role (Only Freelancer or Clients can estimate their tax)'

                });

        }

        //To calculate the tax amount we get the transaction amount and the calculate the tax base on the first tax bracket 
        //We then move to the next tack bracket if their is left over after reached the max of the first tax bracket and then
        //Remove the total that fit into the first tax bracket we then repeat this process for each tax bracket until we reach the 
        //last tax bracket or we have no more left over to calculate tax on

        //Calculate tax using the progressive tax brackets
        let taxAmount = 0;

        for (const bracket of taxBrackets) {
            const maximumIncome = bracket.maximumIncome ?? totalIncome;
            const taxableAmount = Math.max(0, Math.min(totalIncome, maximumIncome) - bracket.minimumIncome);

            taxAmount += taxableAmount * (bracket.taxRate / 100);

        }

        //Subtract the primary SARS tax rebate
        taxAmount = Math.max(0, taxAmount - 17820);

        //Tax amount to 2 decimal places
        taxAmount = Number(taxAmount.toFixed(2));

        const estimatedTax = await await Booking.create({
            //taxId: Auto genned Guid,
            TransactionID: transactionID,
            taxPercentage: taxRate,
            taxAmount: taxAmount,
            taxYear: taxYear,
            calculationDate: new Date()

        });
    
        console.log(`Transaction ${newTransaction.transactionID} created successfully`);
            return res.status(201).json({
                message: 'Tax estimated successfully',
                estimatedTax: estimatedTax

        });

    }
    catch(error){
        console.error(`Internal Server Error`, error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Tax estimation failed',
                details: Object.values(error.errors).map(
                    validationError => validationError.message

                )

            });
            
        }

        //If the Tax Id was not unique throw error
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'A tax record with this unique identifier already exists'

            });

        }

        return res.status(500).json({
            error: 'Something went wrong (Tax Estimation)'
        
        });

    }

}

//Method finds a tax record by its ID, transactionID, tax year(s) or date(s) at which it was calculated, and returns the tax data
//(The IIE, 2026) (W3 Schools, s.a.)
const FindTaxRecord =  async (req, res) => {
    try{
        //Inputs we expect to receive from the query
        const { taxID, transactionID, taxYearStart, taxYearEnd, calculationDateStart, calculationDateEnd } = req.query;
        const filter = {};
        
        //Filter by taxID
        if (taxID) {
            filter.taxID = taxID;
        }

        //Filter by transactionID
        if (transactionID) {
            filter.transactionID = transactionID;
        
        }

        //Filter by taxYear range
        if (taxYearStart || taxYearEnd) {
            filter.taxYear = {};

            if (taxYearStart) {
                filter.taxYear.$gte = taxYearStart;

            }
            if (taxYearEnd) 
            {
                filter.taxYear.$lte = taxYearEnd;

            }

        }

        //Filter by calculationDate range
        if (calculationDateStart || calculationDateEnd) {
            filter.calculationDate = {};

            if (calculationDateStart) {
                filter.calculationDate.$gte = calculationDateStart;

            }
            if (calculationDateEnd) 
            {
                filter.calculationDate.$lte = calculationDateEnd;

            }
            
        }

        //Retrieve matching tax records
        const taxRecords = await Tax.find(filter);
        
        //No tax records found
        if (taxRecords.length === 0) {
            console.error(`No Tax Records Found`);
            return res.status(404).json({
                message: 'No Tax Records found'
        
            });
        
        }
        
        //Returning all Tax Record(s) that match the user's chosen criteria
        console.log(`${taxRecords.length} tax record(s) retrieved successfully`);
            return res.status(200).json({
                message: 'Tax Records retrieved successfully',
                count: taxRecords.length,
                transactions
        
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong (Tax Record Retrieval)'
        
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