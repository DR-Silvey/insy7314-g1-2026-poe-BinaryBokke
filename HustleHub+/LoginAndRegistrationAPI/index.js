//Loading envrionmnet variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');

//Importing routes for LogIn, Registration, ErrorHandling
const RegistrationRoutes = require('../LoginAndRegistrationAPI/routes/RegistrationRoutes');
const LogInRoutes = require('../LoginAndRegistrationAPI/routes/LogInRoutes');

const ErrorHandler = require('../LoginAndRegistrationAPI/middleware/ErrorHandler');

const app = express();

const PORT = process.env.PORT || 4000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.disable('x-powered-by');

//Loading required utils
const CommonInputValidator = require('./utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

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
    app.get('/', (req, res) => {
        res.send(process.env.APP_NAME);

    });

    //Health route
    app.get('/health', (req, res) => {
        res.json({ status: 'OK' });

    });

    //POST route
    app.post('/message', (req, res) => {
        const { message } = req.body;
        res.json({ received: message });

    });

//Registration route access
app.use('/',RegistrationRoutes);

//LogIn route access
app.use('/',LogInRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    
    });

})

app.use(ErrorHandler);
    
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

