import http from 'http'; 
import https from 'https'; 
import path from 'path';
import fs from 'fs'; 

let apik = "AWOPjMeOhAVw3FlgSvSYrgfmgtNZOGvuhN0dt1Jx"; 
let data;
let contentType; 

let api_config = {
    hostname: `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apik}`
}

let server = http.createServer((req, res) => {

    // static files 
    let filePath = '.' + req.url; 
    if(filePath == "./home" || filePath == "./Home" || filePath == './') {
        filePath = "./index.html";
        contentType = 'text/html'; 

        fs.readFile(filePath, (err, content) => {
            if(err) {
                res.end('error: '+err);
            }else{ 
                res.writeHead(200, {"Content-Type": contentType})
                res.end(content, 'utf-8');
            }
        })
    } else if(filePath == './Api'){
         // http request -> GET
        let pet = https.get(api_config.hostname, (resq) => {
            data = ''; 
            resq.on('data', (chunk) => {
                data += chunk; 
            })

            resq.on('end', () => {
                res.end(data); 
            })
        })

        pet.on('error', (err) => {
            console.log(err); 
        })
    } else if(filePath == './main.js') {
        contentType = "text/javascript"; 
        fs.readFile(filePath, (err, content) => {
            if(err) {
                res.end('error: '+err);
            }else{ 
                res.writeHead(200, {"Content-Type": contentType})
                res.end(content, 'utf-8');
            }
        })
    }
}); 


// server url 
let config = {
    hostname: "127.223.22",
    port: 5013
}

server.listen(config, () => {
    console.log('server listening in rute URL => http://'+config.hostname+":"+config.port); 
})