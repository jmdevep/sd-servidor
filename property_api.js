const db = require('./database.js');
const pgp = require('./database.js');
module.exports = {
  addProperties: addProperties,
};

function addProperties(productId, properties) { 

  const cs = new pgp.helpers.ColumnSet(['product_id', 'unit_price', 'name', 'description'], {table: 'property'});

  // data input values:
  //const properties = [{col_a: 'a1', col_b: 'b1'}, {col_a: 'a2', col_b: 'b2'}];
  
  properties.forEach(function(obj) { obj.product_id = productId; });

  // generating a multi-row insert query:
  const query = pgp.helpers.insert(properties, cs);
  //=> INSERT INTO "tmp"("col_a","col_b") VALUES('a1','b1'),('a2','b2')

  // executing the query:
  db.none(query)
      .then(data => {
          // success;
      })
      .catch(error => {
          // error;
      });
}   

