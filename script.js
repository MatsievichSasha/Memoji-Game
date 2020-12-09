'use strict'
{
  // emoji for game
  const emojiBase = ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🌭', '🐯', '🧸', '🐮', '🐷', '🐸', '🧭', '🍏', '🧊', '🐞', '🦀', '🐟', '🐊', '📚', '☀️', '🍄', '🏀', '🍋'];
  //main field of play
  const fieldGame = document.querySelector(".game-memory");

  const timeBoard = ".timer";
  //number of unique cards
  const numberCards = 6;
  //game time ms (max 5940000 ms == 99 min)
  const timerTime = 30000;
  //constructor to create an array of emoji
  function CreateEmojiArr(arr) {
    this.arr = arr.slice();
    return this;
  }
  CreateEmojiArr.prototype.shuffle = function () {
    for (let i = this.arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]];
    }
    return this;
  }
  CreateEmojiArr.prototype.dubleNum = function (number) {
    /* let emojiForGame = new Array(number); */ // emoji for DOM

    let emojiForGame = this.arr.slice(0, number);

    this.arr.length = 0;

    for (let i = 0; i < number; i++) {
      this.arr[i] = emojiForGame[i];
      this.arr[(number * 2) - i - 1] = emojiForGame[i];
    }
    return this;
  }

  //playing field with methods
  let MemoryGame = function (fieldGame) {



    this.clickPoint = document.createElement('div');

    this.clickPoint.className = 'click-point';
    //select all cards
    this.cards = fieldGame.querySelectorAll('.game-memory__field__card');
    this.cardsContent = fieldGame.querySelectorAll('.game-memory__field__card__content');

    this.popUp = fieldGame.querySelector(".pop-up");
    this.popUpContMessage = this.popUp.querySelector(".pop-up__content__message");
    this.buttonPlayAgain = fieldGame.querySelector('.pop-up__button-play');
    //the current two selected cards
    this.choiceCard = [];
    //timer's object
  }
  MemoryGame.prototype.openCard = function (card) {
    card.classList.remove('face-down');
    card.classList.add('face-up');
    card.classList.remove('unEqual');
  }
  MemoryGame.prototype.closeCard = function (card) {
    card.classList.remove('face-up');
    card.classList.add('face-down');
    card.classList.remove('unEqual');
    card.classList.remove('equal');
  }
  MemoryGame.prototype.closeAllCards = function () {
    this.cards.forEach(item => this.closeCard(item));
  }
  //show circle 
  MemoryGame.prototype.showClickPoint = function (pageX, pageY) {
    fieldGame.appendChild(this.clickPoint);
    this.clickPoint.style.left = pageX - this.clickPoint.offsetWidth / 2 + 'px';
    this.clickPoint.style.top = pageY - this.clickPoint.offsetHeight / 2 + 'px';
    setTimeout(() => this.clickPoint.remove(), 100);
  }
  MemoryGame.prototype.setCard = function (cardsContent, emoji) {
    for (let i = 0, n = cardsContent.length; i < n; i++) {
      cardsContent[i].textContent = emoji[i];
    }
  }
  MemoryGame.prototype.showPopUpWin = function () {
    this.popUpContMessage.innerHTML = "<span>W</span><span>i</span><span>n</span>";
    this.popUp.classList.remove('hide');
    this.popUp.classList.add('show');
  }
  MemoryGame.prototype.showPopUpLose = function () {
    this.popUpContMessage.innerHTML = "<span>L</span><span>o</span><span>s</span><span>e</span>";
    this.popUp.classList.remove('hide');
    this.popUp.classList.add('show');
  }
  MemoryGame.prototype.closePopUp = function () {
    this.popUp.classList.remove('show');
    this.popUp.classList.add('hide');
  }
  MemoryGame.prototype.mutchAllcards = function (arr) {
    let countEqual = 0;
    arr.forEach((item) => {
      if (item.classList.contains('equal')) countEqual++;
    });
    if (countEqual == arr.length) {
      return true;
    } else {
      return false;
    };
  }

  // game's timer
  let Timer = function (fieldGame) {
 
    this.timerStart;
    this.setIdSec;
    this.setIdtimerTime;
    this.sec = fieldGame.querySelector('.timer__sec');
    this.min = fieldGame.querySelector('.timer__min');
  }
  Timer.prototype.setTime = function () {
    let oneMin = 60;
    let leftTime = this.timerStart ? Math.round((timerTime - (Date.now() - this.timerStart)) / 1e3) : timerTime / 1e3;

    let minMean; //meaning of minutes

    if (leftTime < oneMin) {
      minMean = '00';
    } else {
      minMean = Math.floor(leftTime / oneMin);
      if (minMean < 10) minMean = '0' + minMean;
    }

    let secMean; //meaning of seconds

    if (leftTime >= oneMin) {
      secMean = leftTime % oneMin;
    } else {
      secMean = leftTime;
    }
    if (secMean < 10) secMean = '0' + secMean;

    this.min.textContent = minMean;
    this.sec.textContent = secMean;

    if (leftTime == 0) {
      clearInterval(this.setIdSec);
    }
  }
  Timer.prototype.start = function (func) {
    this.timerStart = Date.now();
    this.setIdSec = setInterval(this.setTime.bind(this), 1000);
    this.setIdtimerTime = setTimeout(func, timerTime);
  }
  Timer.prototype.stop = function () {
    clearInterval(this.setIdSec);
    clearInterval(this.setIdtimerTime);
    this.timerStart = undefined;
    this.setIdSec = undefined;
    this.setIdtimerTime = undefined;
  }

  let Game = function (fieldGame) {
    // game's timer
    // timer and MemoryGame initialization 
    let timer = new Timer(fieldGame);
    let memoryGame = new MemoryGame(fieldGame);
    timer.setTime();
    //assign emoji to cards
    document.addEventListener("DOMContentLoaded", function () {
      /*  let emojiForGame = (new CreateEmojiArr(emojiBase)).shuffle().dubleNum(numberCards).shuffle(); */
      let emojiForGame = (new CreateEmojiArr(emojiBase)).shuffle().dubleNum(numberCards).shuffle();
      //assign emoji to cards
      this.setCard(this.cardsContent, emojiForGame.arr);
    }.bind(memoryGame));

    fieldGame.addEventListener('click', actionGame.bind(memoryGame));

    memoryGame.buttonPlayAgain.addEventListener('click', playAgain);

    function actionGame(event) {
      //the current card that was clicked
      let card = event.target.closest('.game-memory__field__card');

      if (card && !card.classList.contains('face-up')) {

        this.showClickPoint(event.pageX, event.pageY);
        //the timer starts when there is the first click
        if (!timer.setIdSec) {
          timer.start(function () {
            timer.stop();
            this.showPopUpLose();
          }.bind(this));
        }
        if (this.choiceCard.length === 2) {
          if (this.choiceCard[0].classList.contains('unEqual')) {
            this.choiceCard.forEach(item => this.closeCard(item));
          }
          this.choiceCard.length = 0;
          this.choiceCard.push(card);
          this.openCard(card);
        } else {
          this.choiceCard.push(card);
          this.openCard(card);
          if (this.choiceCard.length === 2) {
            if (this.choiceCard[0].textContent === this.choiceCard[1].textContent) {
              this.choiceCard.forEach(function (item) {
                item.classList.add('equal');
              });
              if (this.mutchAllcards(this.cards)) {
                timer.stop();
                this.showPopUpWin();
              }
            } else {
              this.choiceCard.forEach(function (item) {
                item.classList.add('unEqual');
              })
            }
          }
        }
      }
    }
    function playAgain() {
      memoryGame.closePopUp();
      memoryGame.closeAllCards();
      timer.setTime();
      memoryGame.choiceCard.length = 0;
      /*  let emojiForGame = (new CreateEmojiArr(emojiBase)).shuffle().dubleNum(numberCards).shuffle(); */
      let emojiForGame = (new CreateEmojiArr(emojiBase)).shuffle().dubleNum(numberCards).shuffle();
      //assign emoji to cards
      memoryGame.setCard(memoryGame.cardsContent, emojiForGame.arr);
    }
  }
  let game = new Game(fieldGame);
}



