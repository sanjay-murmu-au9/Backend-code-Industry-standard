const dotenv = require('dotenv');

dotenv.config({path:`.env.${process.env.NODE_ENV}`})


console.log(process.env.DATABASE_NAME)