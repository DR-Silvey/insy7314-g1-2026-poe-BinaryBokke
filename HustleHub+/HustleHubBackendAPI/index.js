//Loading envrionmnet variables from .env file
require('dotenv').config();

//(The IIE, 2026)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');

//Attempting connection to db
const connectDb = require('../HustleHubBackendAPI/config/db');
connectDb();


const ErrorHandler = require('../HustleHubBackendAPI/middleware/ErrorHandler');

const app = express();

//(The IIE, 2026)
const PORT = process.env.PORT || 5000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5273';

//(The IIE, 2026)
app.disable('x-powered-by');

//Loading required utils
const CommonInputValidator = require('./utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

//(The IIE, 2026)
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'", CLIENT_ORIGIN],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                frameAncestors: ["'none'"]

            }

        },
        crossOriginResourcePolicy: { policy: 'same-site' }

    })

);

//Limiting which types of endpoinmts can be accessed
//(The IIE, 2026)
app.use(
    cors({
        origin: CLIENT_ORIGIN,
        methods: ['POST', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']

    })

);

app.use(express.json({limit: '10kb'}));

//General Routes
    //ROOT route
    //(The IIE, 2026)
    app.get('/', (req, res) => {
        console.log('ROOT request occured');
        res.send(process.env.APP_NAME);

    });

    //Health route
    //(The IIE, 2026)
    app.get('/health', (req, res) => {
        console.log('HEALTH request occured');
        res.json({ status: 'OK' });

    });

    //POST route
    //(The IIE, 2026)
    app.post('/message', (req, res) => {
        const { message } = req.body;

        console.log('MESSAGE request occured');
        res.json({ 
            received: message 
        
        });

    });

//Registration route access

app.use((req, res) => {
    console.error("API route not found");
    res.status(404).json({
        error: 'Route not found'
    
    });

})

app.use(ErrorHandler);
   
//Esuring the use of HTTPS when pages are loaded
//(The IIE, 2026)
if(USE_HTTPS){
    const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, 'certs', 'localhost-key.pem');
    const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, 'certs', 'localhost-cert.pem');

    const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)

    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`HTTPS sever running on port ${PORT}`);

    });

}
else{
    app.listen(PORT, () => {
        console.log(`HTTP sever running on port ${PORT}`)

    });

}

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/

