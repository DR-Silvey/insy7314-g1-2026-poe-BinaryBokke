//Genric error handler
//(The IIE, 2026)
const ErrorHandler = (err, req, res, next) => {
    console.error('Internal Server Error', err.message);
    res.status(500).json({
        error: 'Something went wrong'

    });

};

module.exports = ErrorHandler;

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/