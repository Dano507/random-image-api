const http = require('http');
const fs = require('fs');

const domain = '' //  domain name here
const files = fs.readdirSync('./images');

const server = http.createServer((req, res) => {
    req.url = req.url.toLowerCase();


    if (req.url === '/') {
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end('<h1>Click the button for a random image</h1><br><a href="/image">click me</a>');
    }

    else if (req.url.startsWith('/api/image')) {
        let filenum = Math.floor(Math.random()*files.length);
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(`{"url":"${domain}/images/${files[filenum]}"}`);
    }

    else if (req.url.startsWith('/image')) {
        let filenum = Math.floor(Math.random()*files.length);
        console.log(files[filenum]);
        fs.readFile(`./images/${files[filenum]}`, (err, pic) => {
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(pic);
        });
    }

    else if (req.url.startsWith('/images/')) {
        
        fs.readFile(`.${req.url}`, (err, data) => {
            type = getTypeFromLink(req.url);
            res.writeHead(200, {'Content-type': `image/${type}`});
            res.end(data);
        });
    }

    else {
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end('<h1>NO!</h1>');
    }
});


function getTypeFromLink(link) {
    let type = '';
    car = link.split('');
    for (let i = car.length; i > 0; i--) {
        if (car[i] === '.') {
            i++;
            if (car[car.length-1] === '/') {
                while (car[i] !== '/') {
                    type += car[i]
                    i++
                }
            } else {
                while (i !== car.length) {
                    type += car[i]
                    i++
                }
            }
            break;
        }
    }
    return type;
}

server.listen(80);