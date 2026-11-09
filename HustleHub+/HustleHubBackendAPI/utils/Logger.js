const winston = require('winston');

//(The IIE, 2026)
const Logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()

    ),

    transports: [
        new winston.transports.Console()

    ]
    
});

//Allowing console.log-style input
const originalLog = Logger.log.bind(Logger);

Logger.log = function (...args) {
    if (args.length === 1) {
        return originalLog('info', args[0]);
        
    }

    return originalLog(...args);

};

module.exports = Logger;

/*
The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 9 November 2026]. 

*/