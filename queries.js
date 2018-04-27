var promise = require('bluebird');
var pgp = require('pg-promise')(options);
var options = {
  // Initialization Options
  promiseLib: promise
};


var connectionString = "dbname=d698lodbfu82p2 host=ec2-54-83-1-94.compute-1.amazonaws.com port=5432 user=ylexyxforpvlvr password=180bce8b94c01481fc2c31089dfa22e32cf63af94066452d005c48b60731d715 sslmode=require";
pgp.pg.defaults.ssl = true;
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllUsers: getAllUsers,
 /* getSinglePuppy: getSinglePuppy,
  createPuppy: createPuppy,
  updatePuppy: updatePuppy,
  removePuppy: removePuppy*/
};


function getAllUsers(req, res, next) {
    db.any('select * from users')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL users'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }