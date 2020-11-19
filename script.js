'use strict'

/********************************************************************************
 *                         GLOBAL VARS + SELECTORS                              *
*********************************************************************************/

const loaderText = document.getElementById('loader-text');
const loader = document.getElementById('loader');
const content = document.getElementById('pokedex-journey-container');

const pickachu = document.getElementById('pickachu');
const grass = document.getElementById('grass');
const containerForThePokemons = document.getElementById('pokemons');
const hamburgerPokeball = document.getElementById('hamburger');

const onOffBtn = document.getElementById('on-off-btn');
const blueLight = document.querySelector('.pokedex-left-blue-shadow-one');
const redLight = document.querySelector('.pokedex-left-red-light');
const yellowLight = document.querySelector('.pokedex-left-yellow-light');
const greenLight = document.querySelector('.pokedex-left-green-light');

const whiteScreen = document.getElementById('white-screen');
const blackScreen = document.getElementById('black-screen');

const whiteBtns = document.getElementById('white-btns');
const greenBtn = document.getElementById('green-btn');

const helpBtn = document.getElementById('help-btn');
const helptText = document.getElementById('help-text');

const pokeball = document.getElementById('pokeball');
const caughtMessage = document.getElementById('caught');

const counter = document.getElementById('counter');

const restartBtn =  document.getElementById('restart-btn');

const numberOfPokemon = 150;

pickachu.style.position = 'relative';
let pickachuLeft = 0;
let pickachuTop = 0;

let randomLeft;
let randomTop;

let pokedexIsOn = false;
let caughtNewPokemon = false;

let foundPokemon;

let index = 0;

/********************************************************************************
 *                         FETCHING THE POKEMON                                 *
*********************************************************************************/

const getPokemon = async () => {
    
    // vars
    const promises = [];
    let id;

    //poke api
    for(let i = 1; i <= numberOfPokemon; i++){
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`
        const res = await fetch(url);
        const data = await res.json();
        promises.push(data);
    }

    //when pokemon are fetched, delete loader and show pokedex when 2.5 sec are passed
    if(promises){
        setTimeout(() => {
            loaderText.style.display = 'none';
            loader.style.display = 'none';
            content.style.display = 'block';
        }, 2500);
    }

    //looping through promises
    Promise.all(promises).then( results => {
        const pokemon = results.map( data => ({
            name: data.name,
            id: data.id,
            abilities: data.abilities.map( ability => ability.ability.name).join(', '),
            image: data.sprites['front_default'],
            types: data.types.map( type => type.type.name).join(', ') 
        }))

        for(let i = 0; i <= pokemon.length; i++){
            id = i;
            localStorage.setItem(`pokemon`, JSON. stringify(pokemon));
        }

        displayPokemonInPokemonMenu(pokemon);
    })
}

getPokemon();

/********************************************************************************
 *                          DISPLAY POKEMON MENU                                *
*********************************************************************************/

const displayPokemonInPokemonMenu = (pokemons) => {

    const array = Object.entries(pokemons);

    array.forEach( pokemon => {

        let li = document.createElement('li');
        li.classList.add('card');
        li.setAttribute('id', pokemon[1].id);

        let h1 = document.createElement('h1');
        h1.classList.add('card-id');
        h1.innerHTML = pokemon[1].id;
        li.appendChild(h1);

        let img = document.createElement('img');
        img.classList.add('card-img');
        img.src = pokemon[1].image;
        li.appendChild(img);

        let h2 = document.createElement('h2');
        h2.classList.add('card-title');
        h2.innerHTML = pokemon[1].name;
        li.appendChild(h2);

        let p = document.createElement('p');
        p.classList.add('card-subtitle');
        p.innerHTML = pokemon[1].types;
        li.appendChild(p);

        li.appendChild(h1);
        containerForThePokemons.append(li);
    })
}

/********************************************************************************
 *                   HAMBURGER SHOWING THE POKEMON                              *
*********************************************************************************/

function changePokeballAndShowPokemonMenu(img){
   
    if(img.src.match('pokeball')){
        
         img.src = 'img/open.png';
         containerForThePokemons.classList.add('display');
         
 
    }else if(img.src.match('open')){
        
         img.src = 'img/pokeball.png';
         containerForThePokemons.classList.remove('display');
    
    }
 }
 
 hamburgerPokeball.addEventListener('click', (e) =>{
     let image = e.target;
     changePokeballAndShowPokemonMenu(image);
 })

/********************************************************************************
 *                              TURN POKEDEX ON/OFF                             *
*********************************************************************************/

onOffBtn.innerHTML = 'on';
onOffBtn.style.color = 'white';

function turnPokedexOn(){
    if(pokedexIsOn === false){
        //add CSS animation
        blueLight.classList.add('light-up-big-light');
        redLight.classList.add('light-up-small-light-red');
        yellowLight.classList.add('light-up-small-light-yellow');
        greenLight.classList.add('light-up-small-light-green');
        whiteScreen.classList.add('white-screen-turn-on');
    
        //add styling
        whiteScreen.style.background = 'white';

        //pokedex
        pokedexIsOn = true;
        onOffBtn.innerHTML = 'off';
        onOffBtn.style.color = 'white';

        //counter & addFoundClass
        counterOfPokemon();
        addFoundClass();
    }
}

function turnPokedexOff(){
    if(pokedexIsOn === true){
        //remove the CSS animation
        blueLight.classList.remove('light-up-big-light');
        redLight.classList.remove('light-up-small-light-red');
        yellowLight.classList.remove('light-up-small-light-yellow');
        greenLight.classList.remove('light-up-small-light-green');
        whiteScreen.classList.remove('white-screen-turn-on');

        //add styling
        whiteScreen.style.background = 'none';
        blackScreen.innerHTML = '';

        //pokedex
        onOffBtn.innerHTML = 'on';
        onOffBtn.style.color = 'white';
        greenBtn.classList.remove('clicked');
        pokedexIsOn = false;

        //counter
        counter.innerHTML = '';
    }
}

onOffBtn.addEventListener('click', () => {
    if(pokedexIsOn === false){
        turnPokedexOn();
    }else if (pokedexIsOn === true){
        turnPokedexOff();
    }
});

/********************************************************************************
 *                                  GREEN BTN                                   *
*********************************************************************************/


greenBtn.addEventListener('click', () =>{
    //with this class added, we know pokedex is on
    if(blueLight.classList[1] === 'light-up-big-light'){
        //add CSS animation
        greenBtn.classList.add('clicked');
    //with this class removed, we know pokedex is off
    }else if(blueLight.classList[1] !== 'light-up-big-light'){
        //remove CSS animations
        greenBtn.classList.remove('clicked');
    }
})

/********************************************************************************
 *                           MOVING PICKACHU                                    *
*********************************************************************************/

function movePickachu(e){

    if(e.keyCode === 37 || e.which === 37){ 
        pickachuLeft--;
        pickachu.style.left = pickachuLeft + 'px';
        if(pickachuLeft <= 0){
            pickachuLeft++;
        }
    }

    if(e.keyCode === 38 || e.which === 38){
        pickachuTop--;
        pickachu.style.top = pickachuTop + 'px';
        if(pickachuTop <= 0){
            pickachuTop++;
        }
    }

    if(e.keyCode === 39 || e.which === 39){
        pickachuLeft++;
        pickachu.style.left = pickachuLeft + 'px';
        if(pickachuLeft >= 265){
            pickachuLeft--;
        }
    }

    if(e.keyCode === 40 || e.which === 40){
        pickachuTop++;
        pickachu.style.top = pickachuTop + 'px';
        if(pickachuTop >= 195){
            pickachuTop--;
        }
    }
    
    searchPokemonInGrass(pickachuLeft, pickachuTop);
}

function getRandomNumbers(){
    randomLeft = Math.floor(Math.random() * 265);
    randomTop = Math.floor(Math.random() * 195);
}

function searchPokemonInGrass(left, top){
    getRandomNumbers();
    if(left === randomLeft || top === randomTop){
        getRandomPokemon();
    }
}

document.addEventListener('keydown', (e) => {
    //when green btn had class is clicked, then we can move pikachu
    if(greenBtn.classList[1] === 'clicked'){
        movePickachu(e);
    }
});

/********************************************************************************
 *                            GET A RANDOM POKEMON                              *
*********************************************************************************/

function getRandomPokemon(){
    //get random pokemon from LS
    const getPokemonFromLocalStorage = localStorage.getItem('pokemon');
    const parsedPokemon = JSON.parse(getPokemonFromLocalStorage);
    let randomPokemon = parsedPokemon[Math.floor(Math.random() * numberOfPokemon)];
    showRandomPokemonInPokedex(randomPokemon);
}

/********************************************************************************
 *                            SHOW RANDOM POKEMON                               *
*********************************************************************************/

function showRandomPokemonInPokedex(rp){

    //vars
    let name = rp.name;
    let id = rp.id.toString();
    let abilities = rp.abilities;
    let image = rp.image;
    let types = rp.types;

    //add animation
    pokeball.classList.add('display-pokeball');

    //when animation is complete, do:
    setTimeout(() => {
        whiteScreen.style.background = `url(${image}) no-repeat center white`;
        whiteScreen.style.backgroundSize = '150px 150px';
        blackScreen.style.color = 'white';
        blackScreen.innerHTML = `Name: ${name}<br>ID: ${id} <br>Abilities: ${abilities}<br>Type: ${types}`;
        blackScreen.style.display = 'block';
        addMessageNewOrAlreadyCaughtPokemon(rp);
    }, 8000);

    //then remove pokemon in pokedex, make blackscreen + caughtmessage empty + remove pokeball
    setTimeout(() => {
        whiteScreen.style.background = '';
        blackScreen.innerHTML = '';
        caughtMessage.innerHTML = '';
        pokeball.classList.remove('display-pokeball');
    }, 11000);
}

/********************************************************************************
 *                                     COUNTER                                  *
*********************************************************************************/

function counterOfPokemon(foundPokemon){
    
    //check LS
    if(localStorage.getItem('foundPokemon') === null){
        foundPokemon = []; 
    }else{
        foundPokemon = JSON.parse(localStorage.getItem('foundPokemon'));
    }

    //if lenght is 0 then counter 0
    if(foundPokemon.length === 0){
        counter.innerHTML = 0;
    //if length is bigger then 0 then add pokemon but smaller then 150
    }else if(foundPokemon.length > 0 && foundPokemon.length < numberOfPokemon){
        counter.innerHTML = foundPokemon.length;
    //if counter is numbersOfPokemon (150) then special message
    }else if(foundPokemon.length === numberOfPokemon){
        caughtMessage.innerHTML = `Congratulations! You catched all ${numberOfPokemon} pokemon. You are a pokemon master!`;
        restartBtn.classList.add('show-restart-btn');
        counter.innerHTML = numberOfPokemon;
    }
}

restartBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
})

/********************************************************************************
 *                                 ADD FOUND CLASS                              *
*********************************************************************************/

function addFoundClass(){
    let liElement;
    let fp;

    if(localStorage.getItem('foundPokemon') === null){
        fp = []; 
    }else{
        fp = JSON.parse(localStorage.getItem('foundPokemon'));
    }

    if(fp.length !== 0){
        for(let i = 0; i < fp.length; i++){
            let rpID = fp[i].id;
            liElement = document.getElementById(`${rpID}`);
            liElement.classList.add('found');
        }
    }
}

/********************************************************************************
 *                                      LS                                      *
*********************************************************************************/
function checkLS(){
  //check ls
    if(localStorage.getItem('foundPokemon') === null){
        foundPokemon = []; 
    }else{
        foundPokemon = JSON.parse(localStorage.getItem('foundPokemon'));
    }
}

function addMessageNewOrAlreadyCaughtPokemon(rp){
    let nameRP = rp.name;
    
    checkLS();

    //check is pokemon is already in de ls
    let index = foundPokemon.map(i =>{
        return i.name;
    }).indexOf(nameRP);

    //this pokemon is already in ls, wanneer -1 then event never occurs
    if(index !== -1){
        caughtMessage.innerHTML = `Gotcha! Ohh... you already have a ${nameRP}!`;

    //this pokemon is new, add to ls
    }else{
        caughtMessage.innerHTML = `Gotcha! You caught a ${nameRP}!`;
        saveRP(foundPokemon, rp);
    }
}

function saveRP(fp, rp){
    fp.push(rp);//add current RP to the array
    localStorage.setItem('foundPokemon', JSON.stringify(foundPokemon));
    counterOfPokemon(); 
    addFoundClass();
}

/********************************************************************************
 *                              WHITE BUTTONS                                   *
*********************************************************************************/

function showCaughtPokemonInPokedex(caughtPokemon){
    let name = caughtPokemon[index].name;
    let id = (caughtPokemon[index].id).toString();
    let abilities = caughtPokemon[index].abilities;
    let image = caughtPokemon[index].image;
    let types = caughtPokemon[index].types;

    whiteScreen.style.background = `url(${image}) no-repeat center white`;
    whiteScreen.style.backgroundSize = '150px 150px';
    blackScreen.style.color = 'white';
    blackScreen.innerHTML = `Name: ${name}<br>ID: ${id} <br>Abilities: ${abilities}<br>Type: ${types}`;
}

function nextPokemon(){
    let caughtPokemon = JSON.parse(localStorage.getItem('foundPokemon'));
    if( index >= caughtPokemon.length - 1){
        index = -1;
    }
    index++;
    return showCaughtPokemonInPokedex(caughtPokemon);
}

function prevPokemon(){
    let caughtPokemon = JSON.parse(localStorage.getItem('foundPokemon'));
    if(index <= 0){
        index = caughtPokemon.length;
    }
    index--;
    return showCaughtPokemonInPokedex(caughtPokemon);
}

whiteBtns.addEventListener('click', (e) => {
    let target = e.target;
    //when pokedex is on
    if(blueLight.classList[1] === 'light-up-big-light'){
        //if target is the right button
        if(target.classList.contains('pokedex-right-white-btn-right')){
            nextPokemon();
        //if target is the left button
        }else if(target.classList.contains('pokedex-right-white-btn-left')){
            prevPokemon();  
        }
    }
})

/********************************************************************************
 *                              HELP BUTTON                                     *
*********************************************************************************/

helpBtn.addEventListener('click', () => {
    blackScreen.innerHTML = `Click the 'on button' to turn the pokedex on. First click on the green button, then use the arrow keys to move Pickachu and find all the 150 pokemon. Use the white buttons to look throuh the pokedex.`;
    blackScreen.style.color = 'white';
})
