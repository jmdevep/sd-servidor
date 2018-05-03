var express =  require('express');
var app = express();
var cors = require('cors')
var bodyParser = require("body-parser");
var user_api = require('./user_api');
var category_api = require('./category_api');
const PORT = process.env.PORT || 5000

app.use(cors({credentials: true, origin: true}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/', function (req, res){
    res.send('Hola Mundo desde NodeJS!');
}); 

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

//User
app.get('/api/users', user_api.getAllUsers);
app.post('/api/email_available', user_api.emailAvailable);
app.post('/api/register_user', user_api.registerUser);
app.post('/api/send_verification_email', user_api.sendVerificationEmail)
app.post('/api/confirm_email', user_api.confirmEmail)

//Category
app.get('/api/categories', category_api.getAllCategories);
app.get('/api/get_category', category_api.getCategory);
app.post('/api/add_category', category_api.addCategory);
app.post('/api/update_category', category_api.updateCategory);
app.post('/api/delete_category', category_api.deleteCategory);
