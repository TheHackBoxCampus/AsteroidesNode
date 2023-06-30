let data = '';
let btn = document.querySelector('.btn');

const getData = async () =>{
    let pet = await (await fetch("http://127.223.0.22:5013/Api", {
        method : "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    })).json(); 
    return pet
}

const template = id => name => name_limited => designation => {
    return /* html */ `
        <span>id: ${id}</span><br>
        <span>nombre: ${name}</span><br>
        <span>name limitado: ${name_limited}</span><br>
    `;
}

const renderData = () => {
    let result = false; 
    let container = document.querySelector('.nasa-info'); 
    Promise.resolve(getData()).then(data => {
        if('near_earth_objects' in data) {
            result = !result; 
            for(let properties in data['near_earth_objects']) {
                let htmlRender = template(...properties);
                container.innerHTML = htmlRender; 
            }
        }
    }); 
}

btn.addEventListener('click', renderData); 