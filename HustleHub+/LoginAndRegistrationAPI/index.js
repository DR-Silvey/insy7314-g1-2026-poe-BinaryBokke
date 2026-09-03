//Loading envrionmnet variables from .env file
require('dotenv').config();

//Loading required classes
const CommonInputValidator = require('./methods/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

const express = require('express');
const app = express();
const port = process.env.PORT;


app.use(express.json());

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

//Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

});

//LogIn route
//Steps
  //Check inputs (flag abnormalities)
  //Check if user exists
  //Check if password is correct
  //Return response (ensure to keep failure generic)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    res.json({ received: message });

    //default response -failure
    const response = 400;

    //Checking inputs
    if(inputValidator.IsValidUsernameandPassword(username, password)) {
        response = 200;

    }else{
        response = 400;

    } 
    
    //Check if user exists

    //Check if password is correct

    //Response
    res.send(response);
    
});

//Registration route
//Steps
  //Check inputs (flag abnormalities)
  //check if username or email already exists (if username or email already exists, tell the user account laready exists)
  //check if password meets security requirements
  //encrypt password

app.post('/register', (req, res) => {
    const { username, password, fullname, email } = req.body;

    //Checking inputs
    if(inputValidator.IsValidUsernameandPassword(username, password) && inputValidator.IsValidFullname(fullname) && inputValidator.IsValidEmail(email) && inputValidator.IsValidAge(age)) {
        response = 200;

    }else{
        response = 400;
        
    }


});