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
  registerUser: registerUser,
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

  function emailAvailable(email) {
    return db.one("SELECT * FROM users WHERE email like '" + email + "'")
        .then(user => { //USER FOUND - EMAIL NOT AVAILABLE
            // user found;
          return false;
          })
        .catch(error => { //NOT FOUND - EMAIL AVAILABLE
            console.log(error); 
            return true;    
        });
  }    

  function nickAvailable(nickname) {
    return db.one("SELECT * FROM users WHERE nick_name like '" + nickname + "'")
        .then(user => { //USER FOUND - EMAIL NOT AVAILABLE
            // user found;
          return false;
          })
        .catch(error => { //NOT FOUND - EMAIL AVAILABLE
            console.log(error); 
            return true;    
        });
  }    

  function registerUser(req, res, next) {
    var user = req.body; 
    var token = uuidV4();
    console.log(user);
    console.log(token);
    emailAvailable(user.email).then(available => {
      if(available){
        nickAvailable(user.nickname).then(ver => {
          if(ver){
            db.one(`INSERT INTO users (full_name, nick_name, password, email, active, verification_token, created_at)
            VALUES ($1, $2, $3, $4, 1, $5,current_timestamp) RETURNING id`, 
             [user.fullName, user.nickname, user.password, user.email, token])
               .then(data => {            
                   res.status(200)
                 .json({
                   id: data.id,
                   message: 'USER_CREATED'
                 });
               })
               .catch(error => {
                   console.log(error);
                   res.status(200)
                   .json({
                     message: 'FAILED'
                   });    
               }); 
          } else {
            res.status(200)
                 .json({
                   message: 'NICKNAME_TAKEN'
                 });
          }
        });

      } else {
        res.status(200)
        .json({
          message: 'EMAIL_TAKEN'
        });
      }
    });

    
  }    

 /* function sendVerificationEmail(req, res, next){
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
        var url = `http://localhost:8080/user/confirm-email/${token}`;
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
    });  
  } */

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
    console.log(req);
    console.log(req.query);
    var nickname = req.query.nickname;
    var password = req.query.password;
    console.log(req.body);
    db.one("select * from users where password like '" + password + "' AND (email like '"+ nickname +"' or nick_name like '"+ nickname +"');")
        .then(user => { //USER FOUND 
          console.log(json(user));
          console.log(user);
            res.status(200)
          .json({
            data: user,
            message: "LOGIN_SUCCESS"
          });             
        })
        .catch(error => { //NOT FOUND - WRONG LOGIN
            console.log(error); 
            res.status(200)
            .json({
              message: 'LOGIN_FAILED',
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
