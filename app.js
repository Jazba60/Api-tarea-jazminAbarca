//ver el url base de la api se crea constante 

const API_URL = 'https://swapi.dev/api/';

//elementos dom 

const content = document.getElementById('content');
const buttons = document.querySelectorAll('nav button');
const itemSelector = document.getElementById('item-selector');
const selectorContainer = document.getElementById('selector-container');

//funcion para obtener los datos de api sincronica CONCATENAMOS 

async function fetchData(endpoint){
    try{
        const response = await fetch(API_URL + endpoint);
        if (!response.ok){
            throw new Error('Network response was not ok')
        }
        const data = await response.json();
        console.log(`Featched data from ${endpoint}`, data);
        return data.results;
    }catch(error){
        console.error('Error fetching data: ', error);
        return[];
    }
}

//card para personajes 

function createCharacterCard(character){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML =`
    <h2>${character.name}</h2>
    <p>Altura: ${character.height}cm</p>
    <p>Peso: ${character.mass} kg</p>
    <p>Año de nacimiento: ${character.birth_year}</p>
    <p>Genero: ${character.gender}</p>`;
    return card;
}

//card para planetas 

function createPlanetCard(planet) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${planet.name}</h2>
        <p>Clima: ${planet.climate}</p>
        <p>Población: ${planet.population}</p>
        <p>Terreno: ${planet.terrain}</p>`;
    return card;
}
//card para naves

function createStarshipCard(starship) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${starship.name}</h2>
        <p>Modelo: ${starship.model}</p>
        <p>Fabricante: ${starship.manufacturer}</p>
        <p>Capacidad de carga: ${starship.cargo_capacity}kg</p>`;
    return card;
}
//funcion para mostrar los datos 

async function displayData(type){
     content.innerHTML = '';
     itemSelector.style.display = 'block';
     itemSelector.innerHTML = '<option value="" disabled selected>Seleccione un item</option>';

     const endpoint = type === 'character' ? 'people': type;
     console.log(`Feaching data for endpoint: ${endpoint}`);

     const data = await fetchData(endpoint);
     if(data.length === 0){
        itemSelector.innerHTML = '<option value="" disabled>No se encontraron datos.</option>';
        return;
     }
     data.forEach(item =>{
        const option = document.createElement('option');
        option.value = item.url;
        option.textContent = item.name || item.title;
        itemSelector.appendChild(option);

     });

     itemSelector.onchange = async function (){
        const url = this.value;
         const response = await fetch(url);
         const item = await response.json();
         content.innerHTML = '';

         let card;
         if (type === 'people'){
            card = createCharacterCard(item);
         }else if (type === 'planets'){
            card = createPlanetCard(item);
         }else if(type === 'starships'){
            card = createStarShipsCard(item);
         }

         if(card){
            content.appendChild(card);
         }else{
            console.error('Error: car undefined');
         }
     };
}

//Agregar eventos a los botones 
buttons.forEach(button =>{
    button.addEventListener('click', (event)=>{
        const type = event.target.id === 'characters' ? 'people': event.target.id;
        displayData(type);
    });
});