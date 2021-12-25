const express = require('express');
const app = express();
const upload = require('express-fileupload');
const bc = require('bcrypt');
const fs = require('fs');

// Variable declaration
const domain = 'localhost';  // Replace with domain name as needed
var files = fs.readdirSync(`${__dirname}/images`);
const endPointList = ['/api', '/api/image', '/api/upload', "/api/image/recent/:id"];
const webPageDir = __dirname + '/pages';


// Middleware declaration
app.use('/images', express.static(`${__dirname}/images`));
app.use(express.json());
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
        endpoints: endPointList,
    });
});

app.get('/api/image', (req, res) => {
    res.send({url: `http://${domain}/images/${randomimg()}`});
});

app.get('/api/image/recent/:id', (req, res) => {
    if (files[req.params.id] != undefined) {
        let id = parseInt(req.params.id);
        let resbody = []
        for (let i=0; i<id; i++) {
            let o = files.length - i - 1;
            resbody.push(`http://${domain}/images/${files[o]}`);
        }

        res.send({
            url: resbody,
        });
    }
    else { res.send(`${req.params.id} is out of range`) }
});

app.post('/api/upload', (req, res) => {
    if (req.files) {
        // TODO: encrypt password
        if (/*req.body.pw === "donthackme"*/ true) {
            req.files.filename.mv(`${__dirname}/images/${files.length+1}.png`);
            res.status(200).send("File received!");
        } 
        else{ res.status(400).send("ERROR!") }
    } 
    else { res.status(400).send("Error") }
    refreshFiles();
});


// Front End
app.get('/', (req, res) => {
    res.sendFile(`${webPageDir}/index.html`);
});
app.get('/*style.css', (req, res) => {
    res.sendFile(`${webPageDir}/style.css`);
});


app.get('/image', (req, res) => {
    res.sendFile(`${__dirname}/images/${randomimg()}`);
});
app.get('/upload', (req, res) => {
    res.sendFile(`${webPageDir}/upload/index.html`);
});




app.get('*', (req, res) => {
    res.send('Not found');
});

app.listen(80);