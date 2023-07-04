import http from 'http'; 
import https from 'https'; 
import {JSDOM} from 'jsdom'; 
import fs from 'fs'; 

let apik = "AWOPjMeOhAVw3FlgSvSYrgfmgtNZOGvuhN0dt1Jx"; 
let data;
let contentType; 

let api_config = {
    hostname: `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apik}`
}

const createDom = (structuredom) => {
    // vars
    let welcome = structuredom.createElement('h1');
    let input = structuredom.createElement('input');
    let container = structuredom.createElement('div');
    let script = structuredom.createElement('script');
    // attrs and text    
    welcome.textContent += "Nasa"; 
    input.setAttribute('placeholder', 'Busca el asteroide!!'); 
    container.setAttribute('class', 'nasa-info'); 
    container.setAttribute('style', "display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 3em");
    container.textContent = "Cargando Info!"; 
    script.setAttribute('src', './main.js'); 
    return [welcome, input, container, script];
}

let server = http.createServer((req, res) => {
    // static files 
    let filePath = '.' + req.url; 
    if(filePath == "./home" || filePath == "./Home" || filePath == './') {
        // contentType format and dom virtual
        contentType = 'text/html'; 
        let dom = new JSDOM('<!DOCTYPE html><html lang="es"><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><head></head><body></body></html>'); 
       
        // stament 
        let document = dom.window.document;

        // elements body 
        let elements = createDom(document); 
        document.body.append(...elements);
  
        // server use static files
        let serialDOM = dom.serialize(); 
        res.setHeader('Content-Type', contentType); 
        res.statusCode = 200; 
        res.end(serialDOM); 

    } else if(filePath == './asteroides'){
         // * http request -> GET
        let pet = https.get(api_config.hostname, (resq) => {
            data = ''; 
            resq.on('data', (chunk) => data += chunk); 
            resq.on('end', () => res.end(data)); 
        })
        pet.on('error', (err) => console.log(err)); 

    // * structure main js - static file - javascript 
    } else if(filePath == './main.js') {
        contentType = "text/javascript"; 
        fs.readFile(filePath, (err, content) => {
            if(err) res.end('error: '+err);
            else{ 
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

// listener in server
server.listen(config, () => {
    console.log('server listening in rute URL => http://'+config.hostname+":"+config.port); 
})