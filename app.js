var express =  require('express');
var db = require('./queries');
var app = express();
const PORT = process.env.PORT || 5000


app.get('/', function (req, res){
    res.send('Hola Mundo desde NodeJS!');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/api/users', db.getAllUsers);

/*
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM users');
    res.send(JSON.stringify(result));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});  

app.get('/tasks', function (request, response) {
  response.json({tasks: taskRepository.findAll()});
}); */

//https://vooban.com/en/tips-articles-geek-stuff/how-to-quickly-create-a-simple-rest-api-for-sql-server-database/
//https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database