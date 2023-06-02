const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}
const shuffle = function (array) {
    const v1 = [...array] 
    for (let i = v1.length - 1; i > 0; i--) {
        const index = Math.floor(Math.random() * (i + 1))
        // swaping the values
        const original = v1[i]
        v1[i] = v1[index]
        v1[index] = original
    }

    return v1
}
const pickRandom = function (array, items) {
    const a1 = [...array]
    const r1 = []
    for (let i = 0; i < items; i++) {
        const index = Math.floor(Math.random() * a1.length)
        r1.push(a1[index])
        // removing the single element at randomIndex from cloneArray
        a1.splice(index, 1)
    }
    return r1
}
const generateGame = function () {
    const dim = selectors.board.getAttribute('data-dimension')

    if (dim % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }
    const emojis = ['👻', '🤑', '👽', '😈', '🤠', '😊', '🥶', '😍', '🤐', '🤩', '🥵']
    const picks = pickRandom(emojis, (dim * dim) / 2)
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dim}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    const p = new DOMParser().parseFromString(cards, 'text/html')
    selectors.board.replaceWith(p.querySelector('.board'))
}
const startGame = function() {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(function () {
        state.totalTime++
        selectors.moves.innerText = `${(state.totalFlips)} Moves`
        selectors.timer.innerText = `Time : ${state.totalTime} sec`
    }, 1000)
}

const flipBackCards = function() {
    document.querySelectorAll('.card:not(.matched)').forEach(function(card) {
        card.classList.remove('flipped')
    })
    state.flippedCards = 0
}

const flipCard = function (card) {
    state.flippedCards++
    state.totalFlips++
    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(function(){
            flipBackCards()
        }, 1000)
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(function() {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You Completed the game <br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                     <br> Played Well!<br>
                     God Luck for next time.
                </span>
            `
            clearInterval(state.loop)
        }, 1000)
    }
}
const attachEventListeners = function () {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()
