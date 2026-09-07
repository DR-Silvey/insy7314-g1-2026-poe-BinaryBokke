const mongoose = require('mongoose');

const ConnectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connection attempt successfull");

    }
    catch(error){
        console.error('DB connection attempt failure');
        process.exit(1);

    }

}

module.exports = ConnectDB;