const https = require('https');
const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');

// Variable declaration
const domain = 'localhost';  // Replace with domain name as needed
const files = fs.readdirSync('./images');
const endpointlist = ['/api', '/api/image'];


// Middleware declaration
app.use('/images', express.static('images'));


// Functions
// Gets random image name
function randomimg() {
    let img = Math.floor(Math.random()*files.length);
    img = files[img];
    return img
}


// APPLICATION BELOW THIS COMMNENT
// API
app.get('/api', (req, res) => {
    res.send({
        endpoints: endpointlist,
    });
});

app.get('/api/image', (req, res) => {
    res.send({url: `http://${domain}/images/${randomimg()}`});
});

app.get('*', (req, res) => {
    res.sendFile('Not found');
});




app.listen(80);