var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router();
var app = express();
var db = require('./mongo/mongo')

app.use(bodyParser.urlencoded({
    extended : true
}))

app.listen(3000, function(err) {
    if(err){
        console.log('Server Error!')
        throw err
    }
    else {
        console.log('Server Running At 3000 Port!')
    }
})
