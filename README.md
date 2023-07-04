###  Inicializar  el proyecto  :  Comandos en terminal 	  	

```bash
git clone "URL PROJECT OF GIT"
```

- Clonamos el repositorio de git 

```bash
cd Project | npm install 
```

> Dentro del directorio clonado instalamos las dependencias: 
>
> - nodemon
> - JSDOM

### Funcionamiento de las dependencias

La dependencia ``nodemon`` nos permite hacer monitoreo en el archivo ``app.js`` que hay por defecto en el proyecto, si en nuestro ``package`` configuramos el script para ejecutar el siguiente comando

```bash
npm run dev 
```

 Va a ejecutar y monitorear el archivo ``app.js`` 

La configuración es la siguiente: 

- En nuestro package, en la sección de scripts, configuramos el script,  en este caso le colocamos el nombre dev esto por el estándar, pero puedes colocar cualquiera, el comando es ``nodemon /*state*/ /*name file*/``, el state es la forma como nodemon te va a notificar los mensajes ya sea en modo silencioso o modo natural. 

```json
"scripts": {
    "dev": "nodemon --quiet app.js"
  }
```

Por el contrario la dependencia ``JSDOM`` permite crear un entorno de dom virtual, esto debido a que Node.js no cuenta con un DOM, ya que su window apunta a global. es decir a configuraciones de Node.js, NO al viewport. 

- En el archivo app se importa el modulo de JSDOM 

```javascript
import {JSDOM} from 'jsdom';
```

- Crear la instancia: 

```js
let dom = new JSDOM('<!DOCTYPE html><html lang="es"><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><head></head><body></body></html>'); 
```

En mi caso necesitaba un html con esos parametros por eso lo hice de esa manera.

- Una vez hecho puedes entrar a su window y a su document

```js
let document = dom.window.document;
```

- Puedes crear elementos e insertarlos dentro del document creado

```js
// cree todos los elementos e hice un set a cada instancia creada en sus atributos
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

// cree una variable donde almacenara el valor retornado -> array 
let elements = createDom(document); 
// inserto en el document
document.body.append(...elements);
// serializas para terminar el proceso de DOM virtual
let serialDOM = dom.serialize(); 
```

- Con los parametros registrados en la creacion de tu servidor con HTTP puedes servir el documento que se creo

```js
// parametros
let server = http.createServer((req, res)); 
// haces un set al header: Lo pones de tipo Content-type: text/html
res.setHeader('Content-Type', 'text/html');
// seteas el estado
res.statusCode = 200; 
// sirves el archivo
res.end(serialDOM) -> el dom serializado 
```

### Configuraciones para el funcionamiento de la app

Se utilizo el modulo de node.js => FS

- Para la administracion de los archivos estaticos.

Se necesito en el proyecto ya que los archivos javascript al no tener una ruta especificada el documento html, no podia hacer consultas a una url que no estaba sirviendo ningun archivo, por defecto resulta un 404 => no found 

- importamos el modulo

```js
import fs from 'fs';
```

- Una vez imporado podemos especificar mediante una instancia condicional, parametros del servidor y una variable, que cuando consulta a main.js el codigo se muestre

```js
// filepath -> url donde se hace la consulta 
let filePath = '.' + req.url;
if(filePath == './main.js') {
    	// el tipo de header
        contentType = "text/javascript"; 
	 // leemos el archivo o el codigo que se creo dentro del archivo main.js
   	 fs.readFile(filePath, (err, content) => {
         // em caso de error -> ErrorException
            if(err) res.end('error: '+err);
            else{ 
		// estado y configura el header
                res.writeHead(200, {"Content-Type": contentType})
		// sirve el arhivo en la ruta especficada
                res.end(content, 'utf-8');
            }
        })
    }
```

De esta manera cuando nuestro archivo html haga consultas al archivo main.js, Node va a leer el codigo y lo va a servir, de esta forma todo lo que este dentro del script se va a ejecutar.

### Creación del servidor 

- importamos el modulo http

```js
import http from 'http'; 
```

- Configuramos el hostname y el puerto

```js
let config = {
    hostname: "127.223.22",
    port: 5013
}
```

- Ponemos en escucha al servidor y lanzamos mensaje de confirmación para ver si se ha creado de manera exitosa

```js
// creamos el servidor
let server = http.createServer();
// evento de escucha
server.listen(config, () => {
    console.log('server listening in rute URL => http://'+config.hostname+":"+config.port); 
})
```

### Consultas get con HTTPS

- importamos el modulo https

```js
import https from 'https'; 
```

- hacemos la petición con el modulo dentro de la instancia creada con ``http.createServer()``

- Se utilizo la api de la nasa. Para mas información sobre la api puedes dar un vistazo a:

  [https://api.nasa.gov]: Nasa_documentación

```js
 let server = http.createServer((req, res) => {
 	 // peticion get con https.get 
     let pet = https.get(api_config.hostname, (resq) => {
            // variable de almacenamiento de data entrante
         	data = ''; 
         	// data entrante visible
            resq.on('data', (chunk) => data += chunk); 
		   // sirve la data
         	resq.on('end', () => res.end(data)); 
        })
     	// ErrorException en caso de error
        pet.on('error', (err) => console.log(err)); 
 });
```

