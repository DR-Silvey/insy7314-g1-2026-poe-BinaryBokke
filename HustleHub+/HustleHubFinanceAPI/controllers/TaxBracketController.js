//Temp to store and retreive data relating to tax brackets
const TaxBracket = require('./../models/tax/taxBracket');

//Method creates a new Tax Bracket
//(The IIE, 2026) (W3 Schools, s.a.)
const CreateTaxBracket =  async (req, res) => {
    try{
        //Inputs we expect to receive from JSON
        const { taxYear, minimumIncome, maximumIncome, taxRate, baseTax } = req.body;

        //Creates the new tax bracket model
        const newTaxBracket = await TaxBracket.create({
            //taxBracketId: Auto genned Guid
            taxYear: taxYear,
            minimumIncome: minimumIncome,
            maximumIncome: maximumIncome,
            taxRate: taxRate,
            baseTax: baseTax

        });

        console.log(`Tax Bracket ${newTaxBracket.taxBracketId} created successfully`);
            return res.status(201).json({
                message: 'Tax Bracket created successfully',
                taxBracket: newTaxBracket

        });

    }
    catch(error){
        console.error(`Internal Server Error`, error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Tax Bracket validation failed',
                details: Object.values(error.errors).map(
                    validationError => validationError.message

                )

            });
            
        }

        //If the Tax Bracket Id was not unique throw error
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'A tax bracket with this unique identifier already exists'

            });

        }

        return res.status(500).json({
            error: 'Something went wrong (Tax Bracket Creation)'
        
        });

    }

}

//Method finds a tax bracket by its ID or other criteria, and returns the tax bracket data
//(The IIE, 2026) (W3 Schools, s.a.)
const FindTaxBracket =  async (req, res) => {
    try{
        //Inputs we expect to receive from the query
        const { taxYear, minimumIncome, maximumIncome, taxRate, baseTax } = req.query;
        const filter = {};
        
        //Filter by taxYear
        if (taxYear) {
            filter.taxYear = taxYear;
        
        }

        //Filter by minimumIncome
        if (minimumIncome) {
            filter.minimumIncome = minimumIncome;
        
        }

        //Filter by maximumIncome
        if (maximumIncome) {
            filter.maximumIncome = maximumIncome;
        
        }

        //Filter by taxRate
        if (taxRate) {
            filter.taxRate = taxRate;
        
        }

        //Filter by baseTax
        if (baseTax) {
            filter.baseTax = baseTax;
        
        }

        //Retrieve matching tax bracket
        const taxBrackets = await TaxBracket.find(filter);
        
        //No tax brackets found
        if (taxBrackets.length === 0) {
            console.error(`No Tax Brackets Found`);
            return res.status(404).json({
                message: 'No Tax Brackets found'
        
            });
        
        }
        
        //Returning all Tax Bracket(s) that match the user's chosen criteria
        console.log(`${taxBrackets.length} tax bracket(s) retrieved successfully`);
            return res.status(200).json({
                message: 'Tax Brackets retrieved successfully',
                count: taxBrackets.length,
                taxBrackets
        
        });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong (Tax Bracket Retrieval)'
        
        });

    }

}

//Method updates a tax bracket using its MongoDB _id
//(The IIE, 2026) (W3 Schools, s.a.)
const UpdateTaxBracket = async (req, res) => {
    try {
        //The ID comes from the route parameter
        const { id } = req.params;

        //Only these fields can be updated
        const allowedFields = [ 'taxYear', 'minimumIncome', 'maximumIncome', 'taxRate', 'baseTax' ];

        const updates = {};

        //Only accept permitted fields from the request body
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];

            }

        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                error: 'No valid fields supplied for updating'

            });

        }

        //Find and update the tax bracket using MongoDB _id
        const updatedTaxBracket = await TaxBracket.findByIdAndUpdate(
            id,
            { $set: updates },

            {
                new: true,
                runValidators: true

            }

        );

        if (!updatedTaxBracket) {
            return res.status(404).json({
                message: 'Tax Bracket not found'

            });

        }

        console.log('Tax Bracket updated successfully');

        return res.status(200).json({
            message: 'Tax Bracket updated successfully',
            taxBracket: updatedTaxBracket

        });


    }
    catch (error) {
        console.error('Internal Server Error', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Tax Bracket validation failed',
                details: Object.values(error.errors).map(
                    validationError => validationError.message

                )

            });

        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid Tax Bracket ID'

            });

        }

        return res.status(500).json({
            error: 'Something went wrong (Tax Bracket Info Update)'

        });

    }

};

//Method deletes a tax bracket using its MongoDB _id
//(The IIE, 2026) (W3 Schools, s.a.)
const DeleteTaxBracket = async (req, res) => {
    try {
        const { id } = req.params;

        //Find and delete the tax bracket using MongoDB _id
        const deletedTaxBracket = await TaxBracket.findByIdAndDelete(id);

        if (!deletedTaxBracket) {
            return res.status(404).json({
                message: 'Tax Bracket not found'

            });

        }

        console.log('Tax Bracket deleted successfully');

        return res.status(200).json({
            message: 'Tax Bracket deleted successfully',
            taxBracket: deletedTaxBracket

        });

    }
    catch (error) {
        console.error('Internal Server Error', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid Tax Bracket ID'

            });

        }

        return res.status(500).json({
            error: 'Something went wrong (Tax Bracket Deletion)'

        });

    }
    
};

module.exports = { CreateTaxBracket, FindTaxBracket, UpdateTaxBracket, DeleteTaxBracket };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 11 october 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 11 October 2026]. 

*/