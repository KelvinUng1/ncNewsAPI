const express = require('express');
const app = express();

const{ getTopics } = require('./controllers/topics.controller')

app.get('/api/topics', getTopics);


app.all('*', (req,res)=>{
    console.log("caught error")
    res.status(400).send({ msg: 'Bad Request'})
    })

app.use((err, req, res, next) => {
        console.log(err)
    res.status(500).send({msg: "Internal Server Error"}) 
})
module.exports = app