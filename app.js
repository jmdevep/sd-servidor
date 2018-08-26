var express =  require('express');
var app = express();
var cors = require('cors')
var bodyParser = require("body-parser");
var user_api = require('./user_api');
var category_api = require('./category_api');
var product_api = require('./product_api');
const PORT = process.env.PORT || 5000

app.use(cors({credentials: true, origin: true}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res){
    res.send('Hola Mundo desde NodeJS!');
}); 

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

//User
app.get('/api/user/get-users', user_api.getAllUsers);
app.post('/api/user/register-user', user_api.registerUser);
app.get('/api/user/validate-user', user_api.validateUser);



