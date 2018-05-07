const db = require('./database.js');

module.exports = {
  addProduct: addProduct,
  updateProduct: updateProduct,
  getAllProducts: getAllProducts,
  getProduct: getProduct,
  deleteProduct: deleteProduct,
  getProductsByCategory: getProductsByCategory,
};

function addProduct(req, res, next) {
    var product = req.body; 
    console.log(product);
    
    db.tx(async t => {
      const q1 = await db.one(`INSERT INTO item (name, description, requirements, active) VALUES ($1, $2, $3, 1) RETURNING item_id`, 
      [product.name, product.description, product.requirements]);
      console.log(q1);
      const q2 = await db.one(`INSERT INTO product(item_id, category_id) VALUES($1, $2) RETURNING prouct_id`,
      [q1.item_id, product.categoryId]);
      // returning a promise that determines a successful transaction:
      return t.batch([q1, q2]); // all of the queries are to be resolved;
    })
    .then(data => {
      // success, COMMIT was executed
      console.log(data);
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

    function updateProduct(req, res, next) {
    var product = req.body; 
    console.log(product);
    db.one(`UPDATE item set name = '$1', description = '$2', requirements = '$3' WHERE item_id = $4`, 
      [product.name, product.description, product.requirements, product.productId])
        .then(data => {            
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
            // error;    
        }); 
  } 

  function deleteProduct(req, res, next) {
    var productId = req.body.productId; 
    console.log(req.body);
    db.one(`UPDATE item set active = 0 WHERE item_id = $1`, 
      [productId])
        .then(data => {            
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
            // error;    
        }); 
  }
  
  function getAllProducts(req, res, next) {
    db.any('select * from product p, item i WHERE i.item_id = p.item_id AND p.active = 1')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL products'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function getProduct(req, res, next) {
    var productId = req.body.productId; 
    console.log(req.body);
    db.one(`SELECT * from item i, product p where p.item_id = $1 and p.item_id = i.item_id`, 
      [productId])
        .then(data => {            //Product found
            res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 1
          });
        })
        .catch(error => {         //Product not found
            console.log(error);
            res.status(200)
            .json({
              status: 'success',
              message: -1
            });  
        }); 
  }

  function getProductsByCategory(req, res, next) {
    var categoryId = req.body.categoryId; 
    console.log(req.body);
    db.any(`select * from product p, item i WHERE i.item_id = p.item_id AND p.active = 1 AND category_id = $1`, 
    [categoryId])
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL products'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }


