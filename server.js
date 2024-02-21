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


app.get('/getAccessToken',async function(req,res){


    req.query.code;

    const param ="?client_id="+client_id+"&client_secret="+client_secret+"&code="+req.query.code;

    await fetch('https://github.com/login/oauth/access_token'+param,{
        method:'POST',
        headers:{
           "Accept":'application/json' 
        }
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data)
         res.json(data)
    })

})



app.get('/getuserdata')


app.listen(4000,function(){
    console.log("Cors server Running on Port 4000")
})