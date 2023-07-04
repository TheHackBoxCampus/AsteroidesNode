let btn = document.querySelector('button'); 
let container = document.querySelector('.nasa-info'); 

const getData = async () =>{
    let pet = await (await fetch("http://127.223.0.22:5013/asteroides", {
        method : "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    })).json(); 
    return pet; 
}

const template = id => name => name_limited => designation => diameter => danger =>{
    return /* html */ `
        <table style="margin: 3em 0; border: 1px solid #000;">
            <tr style="color: red; text-align: center">
                <th style="border: 1px solid black">id</th>
                <th style="border: 1px solid black">name</th>
                <th style="border: 1px solid black">name Limited</th>
                <th style="border: 1px solid black">Designation</th>
                <th style="border: 1px solid black">Diameter</th>
                <th style="border: 1px solid black">Danger</th>
            </tr>
            <tr style="text-align: center">
                <td style="border: 1px solid black">${id}</td>
                <td style="border: 1px solid black">${name}</td>
                <td style="border: 1px solid black">${name_limited}</td>
                <td style="border: 1px solid black">${designation}</td>
                <td style="border: 1px solid black">${diameter}</td>
                <td style="border: 1px solid black">${danger}</td>
            </tr>
        </table>
        `;
}
        const filter = () => {
            let inpt = document.querySelector('input'); 
            inpt.addEventListener('change', async (e) => {
                container.innerHTML = "Buscando Data"; 
                let data = await (getData()); 
                let html = ''; 
                for(properties of data.near_earth_objects) {
                    if(properties.name_limited == inpt.value) {
                        html += template(properties.id)(properties.name)(properties.name_limited)(properties.designation)(properties.estimated_diameter.kilometers.estimated_diameter_min)(properties.is_potentially_hazardous_asteroid);
                    }else if(inpt.value == "") {
                        container.innerHTML = "la data se restaura!!"; 
                        html += template(properties.id)(properties.name)(properties.name_limited)(properties.designation)(properties.estimated_diameter.kilometers.estimated_diameter_min)(properties.is_potentially_hazardous_asteroid);
                    }
                }
                container.innerHTML = ""; 
                container.innerHTML += html; 
            })
        }
        const renderData = () => {
                let result = false; 
                Promise.resolve(getData()).then(data => {
                    if('near_earth_objects' in data) {
                        result = !result; 
                        let htmlRender = ''; 
            for(let properties of data['near_earth_objects']) {
                htmlRender += template(properties.id)(properties.name)(properties.name_limited)(properties.designation)(properties.estimated_diameter.kilometers.estimated_diameter_min)(properties.is_potentially_hazardous_asteroid);
            }
            container.innerHTML = htmlRender; 

        } else container.innerHTML = "Error de API - Revise el codigo o la consulta..."; 
    }); 
}

// TODO: Execute
renderData();
filter(); 