// Proper way to initialize and share the Database object
var promise = require('bluebird');
// Loading and initializing the library:
const pgp = require('pg-promise')({
    // Initialization Options
    promiseLib: promise
});

// Preparing the connection details:
const cn =  "postgres://iktjudwycclbar:f8707155a2fa080e10ff7422fb2ff3dfa4b2fd123189590fe127b6cb8f8ee083@ec2-50-17-194-129.compute-1.amazonaws.com:5432/d1ot33q5r24d40?ssl=true";

// Creating a new database instance from the connection details:
const db = pgp(cn);

// Exporting the database object for shared use:
module.exports = db, pgp;

