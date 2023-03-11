const mongoose = require('mongoose');
const envConfig = require('../Server');
mongoose.Promise = global.Promise
const chalk = require('chalk');
const moment = require('moment')
const fs = require('fs')
//-----Database Connection----------
try {

  let Conn = '';
  // console.log(process.env.NODE_ENV,"process.env.NODE_ENV")
  // console.log(envConfig)
  if (process.env.NODE_ENV === 'development') {
    Conn = `${envConfig.Database.Protocol}${envConfig.Database.DatabaseUsername}:${envConfig.Database.DatabasePass}@${envConfig.Database.Host}/${envConfig.Database.DatabaseName}`
    // Conn='mongodb+srv://SanjayMurmu:cQGRLDLvylpULsXA@nodewaycooltrainingprog.pzqd6.mongodb.net/database?retryWrites=true&w=majority'
  };

  if (process.env.NODE_ENV === 'production') {
    Conn = `${envConfig.Database.Protocol}${envConfig.Database.DatabaseUsername}:${envConfig.Database.DatabasePass}@${envConfig.Database.Host}/${envConfig.Database.DatabaseName}`
    // Conn='mongodb+srv://SanjayMurmu:cQGRLDLvylpULsXA@nodewaycooltrainingprog.pzqd6.mongodb.net/database?retryWrites=true&w=majority'
  };

  // console.log(Conn,"<<<<<<<<")

  mongoose.connect(Conn,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex:true,
      // useFindAndModify: false

    }, (err, Conn) => {

      if (err) return console.error(chalk.red(' [ ✗ ] '), err);
      // console.log(chalk.green(' [ ✓ ]'), `Connected to Database : ${envConfig.Database.DatabaseName}`); 
      mongoose.set('debug',/* true*/(collectionName, method, query, doc) => {
        let date1 = moment(new Date()).format("YYYY-MM-DD")
        let fileName = 'db' + date1 + '.txt';
        let path = './logs/';
        let queryLog = `${collectionName}.${method}` + JSON.stringify(query) + doc + " \r\n";
        fs.appendFile(path + fileName, queryLog, function (err) {
          if (err) throw err
        })

      });
    });

} catch (error) {
  console.error(chalk.red(' [ ✗ ] '), error);
};
//---------------------------------------
module.exports = mongoose;

/*
try {
 mongoose.connect(process.env.DB),{
   useUnifiedTopology:true,
   useNewUrlParser:true,
   useCreateIndex:true,
   useFindAndModify:false,
 },(err, connection) => {
   if(err) return console.error(chalk.red('[ ✗ ]'),err)
   console.log(chalk.green(''),`Connected to database:${process.env.databaseName}`)

 }

 
} catch (error) {
 console.error(chalk.red (' [ ✗ ] '), error);
 
}

module.exports = mongoose;
*/