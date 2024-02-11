var express = require('express');
var cors = require('cors');
const fetch =(...args)=>
import (node-fetch).then(({default:fetch})=>fetch(...args));
var bodyParser= require('body-parser');



const client_id='d8c29a8e39a37033822a'
const client_secret="fb427bdd9e6c3c64fea299db8fe9aa9bce2496ef"




var app=express()

app.use(cors())

app.use(bodyParser.json())


app.listen(4000,function(){
    console.log("Cors server Running on Port 4000")
})