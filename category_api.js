const db = require('./database.js');

module.exports = {
  addCategory: addCategory,
  updateCategory: updateCategory,
  getAllCategories: getAllCategories,
  getCategory: getCategory,
  deleteCategory: deleteCategory,
};

function addCategory(req, res, next) {
    var category = req.body; 
    console.log(category);
    db.one(`INSERT INTO category (name, description, active)
     VALUES ($1, $2, 1) RETURNING id`, 
      [category.name, category.description])
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

  function updateCategory(req, res, next) {
    var category = req.body; 
    console.log(category);
    db.one(`UPDATE category set name = '$1', description = '$2' WHERE category_id = $3`, 
      [category.name, category.description, category.categoryId])
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
              status: 'success',
             // data: data,
              message: -1
            });
            // error;    
        }); 
  }

  function deleteCategory(req, res, next) {
    var categoryId = req.body; 
    console.log(category);
    db.one(`UPDATE category set active = 0 WHERE category_id = $1`, 
      [categoryId])
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
              status: 'success',
             // data: data,
              message: -1
            });
            // error;    
        }); 
  }
  
  function getAllCategories(req, res, next) {
    db.any('select * from category where active = 1')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL categories'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function getCategory(req, res, next) {
    var categoryId = req.body.categoryId; 
    console.log(category);
    db.one(`SELECT * from category where category_id = $1`, 
      [categoryId])
        .then(data => {            //Category found
            res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 1
          });
        })
        .catch(error => {         //Categry not found
            console.log(error);
            res.status(200)
            .json({
              status: 'success',
              message: -1
            });  
        }); 
  }
