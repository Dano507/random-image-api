const express = require('express');
const app = express();
const upload = require('express-fileupload');
const fs = require('fs');

// Variable declaration
const domain = 'localhost';  // Replace with domain name as needed
var files = fs.readdirSync('./images');
const endpointlist = ['/api', '/api/image', '/api/upload'];
const webPageFile = __dirname + '/pages';


// Middleware declaration
app.use('/images', express.static('images'));
app.use(upload());


// Functions
// Gets random image name
function randomimg() {
    let img = Math.floor(Math.random()*files.length);
    img = files[img];
    return img
}

function refreshFiles() {
    files = fs.readdirSync('./images');
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

app.post('/api/upload', (req, res) => {
    if (req.files) {
        req.files.filename.mv(`${__dirname}/images/${files.length+1}.png`);
        res.status(200).send("File received!");
    } else {
        res.status(400).send("Error");
    }
    refreshFiles();
});


// Front End
app.get('/', (req, res) => {
    res.sendFile(`${webPageFile}/index.html`);
});
app.get('/*style.css', (req, res) => {
    res.sendFile(`${webPageFile}/style.css`);
});


app.get('/image', (req, res) => {
    res.sendFile(`${webPageFile}/upload/${randomimg()}`);
});
app.get('/upload', (req, res) => {
    res.sendFile(`${webPageFile}/upload/upload.html`);
});




app.get('*', (req, res) => {
    res.send('Not found');
});

app.listen(80);