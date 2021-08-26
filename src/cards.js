import { noop } from "jquery"
import {angular,docker,firebase, js,materialize,mongodb,nest,node, php, py, react, rx, svelte, tailwind, typescript, vscode,vue, word, play, restart, next} from "./images"

let images = [angular,docker,firebase, js,materialize,mongodb,nest,node, php, py, react, rx, svelte, tailwind, typescript, vscode,vue, word]

let score = 0;
let stage = 1;
let maxHealth = 3
let currentHealth = maxHealth

export function cardGame(selector, options ={}){
  const game  =  document.querySelector(selector)
  

  game.insertAdjacentElement('afterbegin', createGameStats())
  game.insertAdjacentElement('afterbegin', createGameScreen('Start the game', play))

  const points =  game.querySelector('[data-info = score]')
  const step =  game.querySelector('[data-info = stage]')
  
  window.points = points
  window.step = step

  compareParameters(score, points)
  compareParameters(stage, step)  
  game.addEventListener('click', cardClickHandler)
  
  

}



function cardClickHandler(e){
    game.removeEventListener('click', cardClickHandler)
    const card = e.target.closest('.card-game-card')
    const play = e.target.closest('[data-action = "refresh"]')
    if(card) {
       flipCards(card)
    }
    if(play) {hideGameScreen(e.target.closest('.card-game-screen'))}

    
    setTimeout(()=> game.addEventListener('click', cardClickHandler), 700)
}

function createCardTable(arr, arr2 =[]){
    arr.forEach((item, index) => {
        const card = document.createElement('div')
        card.classList.add('card-game-card');
        card.dataset.id = index
        card.insertAdjacentHTML('afterbegin', `
        <div class="card-game-card__face card-game-card__face--front"><img src ="${item}"></div>
        <div class="card-game-card__face card-game-card__face--back"></div>
        `)
        arr2.push(card)
    });
    return arr2
    .concat(arr2)
    .sort(() => Math.random() - 0.5)
}

function createTableElement(cards){
    const table = creator('div', 'card-game__table', 'table', 'id')

    cards.forEach(card =>{ 
        const clone = card.cloneNode(true)
        table.insertAdjacentElement('afterbegin', clone)
       
      })
      return table
  
}

function createGameStats(){
    const stats = creator('div', 'card-game-stats')
    
    stats.insertAdjacentHTML('afterbegin',    ` 
    <div class="card-game-stats__points">
    <div class="card-game-stats__score" data-info="score">Score: 100</div>
    <div class="card-game-stats__stage" data-info="stage">Stage: 2</div>
 </div>  

   <div class="health-bar" id="health-bar" data-total="1000" data-value="1000">
   <div class="bar"></div>
   <span data-info = "health"> ${currentHealth} / ${maxHealth}</span> 
   <div class="hit"></div>
   </div>
    </div>`)
    return stats
 
}

function  creator(element, cls, attr = false, attrName = false ){
 const el = document.createElement(element);
 el.className = cls;
 attr? el.setAttribute(attrName,attr ) : noop()
 return el
}

function createGameScreen(title, img){
    const gameScreen = creator('div', 'card-game-screen')
    gameScreen.insertAdjacentHTML('afterbegin', `  <div class="card-game-screen__content">
    <div class="card-game-screen__title">${title}</div>
    <div class="card-game-screen__refresh" data-action="refresh">
    <img src="${img}" alt="">
    </div></div>` )
    return gameScreen
}

function hideGameScreen(el,ms = 3000){
    el.style.opacity = 0;
    const cards =  createCardTable(dificultyChanger(images))
    game.insertAdjacentElement('afterbegin', createTableElement(cards))

    setTimeout(()=> {
        el.remove()
        flipAllItems()
    }, ms)


}

function flipAllItems(){
    const cards = document.getElementById('table').querySelectorAll('.card-game-card').forEach(card => card.classList.add('flipped'))
}

function flipCards(card){

    card.classList.add('selected')
    card.classList.remove('flipped')

    const items = game.querySelectorAll('.selected')
    setTimeout(()=>{items.length === 2 ? delagateCards(items) : noop()},1300)
    !game.querySelector('.flipped') ? startNewStage() : noop() 
    
}

function delagateCards(items){
  if(items[0].dataset.id === items[1].dataset.id){
      items.forEach(item =>{
        item.classList.remove('selected')})
        plusScore(10)
        changeHealth(1)
  }
  else{
    items.forEach(item => { 
        item.classList.add('flipped')
        item.classList.remove('selected')
    })
    changeHealth(-1)
  }
}

function plusScore(num){
  score += num
  compareParameters(score, window.points)
}

function compareParameters(num, el){
    el.textContent = el.dataset.info + ':' + num
}

function changeHealth(val){
 const health = document.getElementById('health-bar') 
 const bar = health.querySelector('.bar')
 const hit = health.querySelector('.hit')
 const info = health.querySelector('span')

 val == 1 ? currentHealth < maxHealth ? currentHealth += 1 : noop() : currentHealth += -1
 

 bar.style.width =  currentHealth / maxHealth * 100 + "%";
 setTimeout(()=> hit.style.width =  currentHealth / maxHealth * 95  + "%", 700)
 info.textContent = currentHealth + " / " + maxHealth
 
 setTimeout(() => currentHealth === 0 ? endTheGame() : noop(), 1500)

}


function endTheGame(){
    score = 0
    maxHealth = 3
    currentHealth = maxHealth
    stage = 1

    changeHealth(1)
    game.querySelector('#table').remove()
    game.insertAdjacentElement('afterbegin', createGameScreen('Your memory is bad', restart))
}

function dificultyChanger(arr){
    if(stage === 1) return arr.slice(0, 9);
    else if (stage === 2) return arr.slice(0, 12);
    else if (stage === 3) return arr.slice(0, 15)
    else if (stage >= 4) return arr
}

function startNewStage(){
    maxHealth +=1
    currentHealth = maxHealth
    changeHealth(1)
    stage += 1
    score += 100
    compareParameters(stage, window.step) 
    setTimeout(()=>{
    game.querySelector('#table').remove()
    game.insertAdjacentElement('afterbegin', createGameScreen('To next stage', next))
    }, 2000)
    
}
