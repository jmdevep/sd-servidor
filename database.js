// Proper way to initialize and share the Database object
var promise = require('bluebird');
// Loading and initializing the library:
const pgp = require('pg-promise')({
    // Initialization Options
    promiseLib: promise
});

// Preparing the connection details:
const cn =  "postgres://ylexyxforpvlvr:180bce8b94c01481fc2c31089dfa22e32cf63af94066452d005c48b60731d715@ec2-54-83-1-94.compute-1.amazonaws.com:5432/d698lodbfu82p2?ssl=true";

// Creating a new database instance from the connection details:
const db = pgp(cn);

// Exporting the database object for shared use:
module.exports = db;

