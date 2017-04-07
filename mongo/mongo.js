var mongoose = require('mongoose')
var schema = mongoose.Schema;

var db = mongoose.connect("mongodb://localhost/Energy_Hackathon", function (err) {
    if(err){
        console.log('DB Error!');
        throw err
    }
    else{
        console.log('DB Connect Success')
    }
})

var UserSchema = new schema({
    username : {
        type : String
    },
    id : {
        type : String
    },
    password : {
        type : String
    }
})

var User = mongoose.model('user', UserSchema);

