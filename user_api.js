const uuidV4 = require('uuid/v4'); //uuidV1();
var nodemailer = require('nodemailer');
const db = require('./database.js');
/*
var promise = require('bluebird');
var pgp = require('pg-promise')(options);
var options = {
  // Initialization Options
  promiseLib: promise
}; */


module.exports = {
  getAllUsers: getAllUsers,
  emailAvailable: emailAvailable,
  registerUser: registerUser,
  sendVerificationEmail: sendVerificationEmail,
  getUserToken: getUserToken,
  confirmEmail: confirmEmail,
  validateUser: validateUser,
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

  function emailAvailable(req, res, next) {
    var email = req.body.email;
    console.log(req.body);
    console.log(req.body.email);
    db.one("SELECT * FROM users WHERE email like '" + email + "'")
        .then(user => { //USER FOUND - EMAIL NOT AVAILABLE
            // user found;
            res.status(200)
          .json({
            status: 'success',
            //data: data,
            message: 1
          });             
        })
        .catch(error => { //NOT FOUND - EMAIL AVAILABLE
            console.log(error); 
            res.status(200)
            .json({
              status: 'success',
             // data: data,
              message: -1
            });
            // error;    
        });
  }    

  function registerUser(req, res, next) {
    var user = req.body; 
    var token = uuidV4();
    console.log(user);
    console.log(token);
    db.one(`INSERT INTO users (first_name, last_name, password, address, phone, company_name, nit, email, active, verification_token, created_at, location, department)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, current_timestamp, $10, $11) RETURNING id`, 
      [user.firstName, user.lastName, user.password, user.address, user.phone, user.companyName, user.nit, user.email, token, user.location, user.department])
        .then(data => {            
            res.status(200)
          .json({
            status: 'success',
            id: data.id,
            message: 1
          });
        })
        .catch(error => {
            console.log(error);
            res.status(200)
            .json({
              status: 'failed',
             // data: data,
              message: -1
            });
            // error;    
        }); 
  }    

  function sendVerificationEmail(req, res, next){
    console.log(req.body);
    var email = req.body.email;
    var name = req.body.name;
    getUserToken(req.body.id)
      .then((token) => {
        console.log("Token: " +  token);

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mvsolucionesinf@gmail.com',
            pass: '20f804c8'
          }
        }); 
        var url = `http://localhost:8080/confirm-email/${token}`;
        var mailOptions = {
          from: 'mvsolucionesinf@gmail.com',
          to: email,
          subject: `${name}, Bienvenido a Luanas!`,
          html: `<h2>${name}, Te has registrado con éxito.</h2><p>¿Qué esperas para validar tu cuenta? Nuestros servicios te esperan!</p>
                <p>Para confirmar tu dirección de correo, haz </p><a href="${url}">click aquí.</a>`
        }
        transporter.sendMail(mailOptions)
          .then((error, info) => { 
            res.status(200)
          .json({
            status: 'success',
            message: 1
          });             
        })
        .catch(error => {
            console.log(error); 
            res.status(200)
            .json({
              status: 'success',
              message: -1
            });
        })
    });
    
    /*transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });  */
  }

  function getUserToken(id) {
      return db.one('SELECT verification_token FROM users WHERE id = $1', id)
      .then(function(data) {
        return data.verification_token;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  
  function confirmEmail(req, res, next) {
    var token = req.body.token;
    console.log(req.body);
    
    db.tx(async t => {
      const q1 = await db.one("SELECT id FROM users WHERE verification_token like '" + token + "'");
      console.log(q1);
      await db.none("UPDATE users set (active, verification_token) = (1, 'empty') WHERE id = " + q1.id);
    
      // returning a promise that determines a successful transaction:
      //return t.batch([q1, q2]); // all of the queries are to be resolved;
    })
    .then(data => {
      // success, COMMIT was executed
      res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 1
          });
    })
    .catch(error => {
        // failure, ROLLBACK was executed
        console.log(error); 
        res.status(200)
        .json({
          status: 'success',
          message: -1
        });
    });
    
  }    

  function validateUser(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(req.body);
    db.one("SELECT * FROM users WHERE email like '" + email + "' AND password like '" + password +"';")
        .then(user => { //USER FOUND 
            res.status(200)
          .json({
            status: 'success',
            data: user,
            message: 1
          });             
        })
        .catch(error => { //NOT FOUND - WRONG LOGIN
            console.log(error); 
            res.status(200)
            .json({
              status: 'success',
              message: -1
            });
   
        });
  }  

 /*   db.one("select * from users where email like '$1'", email)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 1
          });
      })
      .catch(function (err) {
        return next(err);
      }); */
