var express = require('express')
var router = express.Router();
var app = express();
var fs = require('fs')
var mongoose = require('mongoose')
var schema = mongoose.Schema;
var bodyParser = require('body-parser')
var crypto = require('crypto')

app.use(bodyParser.urlencoded({
    extended : true
}))

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:28001/Energy_Hackathon", function (err) {
    if(err){
        res.send(503,{
            success : false,
            message : "DB Error!"
        })
        console.log('DB Error!')
        throw err
    }
    else{
        console.log('DB Connect Success!')
    }
})

var UserSchema = new schema({
    username : {
        type : String
    },
    Device_ID : {
        type : String
    },
    id : {
        type : String
    },
    password : {
        type : String
    }
})

var DaySchema = new schema({
    Device_ID : {
        type : String
    },
    KWH : {
        type : Number
    }
})

var TotalSchema = new schema({
    Device_ID : {
        type : String
    },
    total : {
        type : Number
    }
})

var User = mongoose.model('user', UserSchema)
var Day = mongoose.model('day', DaySchema)
var Total = mongoose.model('total', TotalSchema)

app.listen(5000, function (err) {
    if(err){
        console.log('Server Error!')
        res.send(503, {
            success : false,
            message : "Server Error!"
        })
        throw err
    }
    else {
        console.log('Server Running At 5000 Port!')
    }
})

app.get('/', (req, res)=>{
    res.redirect('/register')
})

app.get('/register', (req, res)=>{
    fs.readFile('index.html', 'utf-8', (err, data)=>{
        res.send(200,data)
    })
})

app.post('/register', (req, res)=>{
    console.log(req.body)
    var password = crypto.createHash('sha256').update(req.param('password')).digest('base64');
    var deviceid = crypto.createHash('sha256').update(req.param('deviceid')).digest('base64');
    console.log("Password : "+password+" Device_ID : "+deviceid);
    var user  = new User({
        username : req.param('username'),
        Device_ID : deviceid,
        id : req.param('id'),
        password : password
    })

    User.findOne({
        Device_ID : deviceid
    }, (err, result)=>{
        if(err){
            console.log('/register Error!')
            throw err
        }
        else if(result){
            console.log('Already In DataBase')
            res.send(401,{
                success : false,
                message : "Already In Database"
            })
        }
        else{
            user.save((err)=>{
                if(err){
                    console.log('/register save Error!')
                    res.send(500, {
                        success : false,
                        message : "Server Error!"
                    })
                    throw err
                }
                else {
                    console.log('Save Success')
                    res.send(200,{
                        success : true,
                        message : "Save Success"
                    })
                }
            })
        }

    })
})

app.post('/day', (req, res)=>{
    var success = 0;
    var deviceid = crypto.createHash('sha256').update(req.param('deviceid')).digest('base64');
    var Dayform = new Day({
        Device_ID : deviceid,
        KWH : req.param('KWH')
    })
    var Totalform = new Total({
        Device_ID : deviceid,
        total : req.param('KWH')
    })
    Day.findOne({
        Device_ID : deviceid
    }, (err, result)=>{
        if(err){
            res.send(500,{
                success : false,
                message : "Server Error!(Day fine)"
            })
        }
        else if(result){
            var plusday = parseInt(result.KWH)+parseInt(req.param('KWH'))
            Day.update({
                Device_ID : deviceid
            },{$set:{"KWH":plusday}}, (err)=>{
                if(err){
                    res.send(500,{
                        success : false,
                        message : "Update Error!(Day)"
                    })
                }
                else {

                }
            })
        }
        else {
            Dayform.save((err)=>{
                if(err){
                    res.send(500,{
                        success : false,
                        message : "Save Error!(Day)"
                    })
                }
                else {
                    console.log('Day SSave')
                }
            })
        }
    })

    Total.findOne({
        Device_ID : deviceid
    }, (err, result)=>{
        if(err){
            res.send(500,{
                success : false,
                message : "Server Error!(Total fine)"
            })
        }
        else if(result){
            var plustotal = parseInt(result.total)+parseInt(req.param('KWH'))
            Total.update({
                Device_ID : deviceid
            },{$set:{"total":plustotal}}, (err)=>{
                if(err){
                    res.send(500,{
                        success : false,
                        message : "Update Error!(Total)"
                    })
                }
                else {
                    res.send(200,{
                        success : true,
                        message : "Save Success"
                    })
                }
            })
        }
        else {
            Totalform.save((err)=>{
                if(err){
                    res.send(500,{
                        success : false,
                        message : "Save Error!(Total)"
                    })
                }
                else {
                    res.send(200,{
                        success : true,
                        message : "Save Success"
                    })
                }

            })
        }
    })
})
