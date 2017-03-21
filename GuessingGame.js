function generateWinningNumber() {
  return Math.ceil((Math.random() * 100) + 0.000001);
}

function shuffle(array) {
  let i;
  let t;
  for (let m = array.length; m > 0; m -= 1) {
    i = Math.floor(Math.random() * m);
    t = array[m - 1];
    array[m - 1] = array[i];
    array[i] = t;
  }
  return array;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
  return Math.abs(this.winningNumber - this.playersGuess);
};

Game.prototype.isLower = function () {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function (num) {
  if (num < 1 || num > 100 || !Number(num)) {
    throw 'That is an invalid guess.';
  }
  this.playersGuess = num;
  return this.checkGuess();
};


Game.prototype.checkGuess = function () {
  if (this.pastGuesses.includes(this.playersGuess)) {
    return 'You have already guessed that number.';
  }
  this.pastGuesses.push(this.playersGuess);
  if (this.pastGuesses.length === 5) {
    return 'You Lose.';
  }
  if (this.playersGuess === this.winningNumber) {
    return 'You Win!';
  }
  if (Math.abs(this.playersGuess - this.winningNumber) < 10) {
    return 'You\'re burning up!';
  }
  if (Math.abs(this.playersGuess - this.winningNumber) < 25) {
    return 'You\'re lukewarm.';
  }
  if (Math.abs(this.playersGuess - this.winningNumber) < 50) {
    return 'You\'re a bit chilly.';
  }
  if (Math.abs(this.playersGuess - this.winningNumber) <= 100) {
    return 'You\'re ice cold!';
  }
}

Game.prototype.provideHint =  function () {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

function newGame() {
  return new Game();
}

$(document).ready(() => {
  let game = new Game();
  function addGuesses () {
    const li = document.querySelectorAll('.guess li')
    for (let i = 0; i < li.length; i++) {
      $(li[i]).text(i < game.pastGuesses.length ? game.pastGuesses[i] : '-');
    }
  }
  function submitPlayerGuess(output) {
    $('h1').text(output)
    addGuesses()
    if (output === 'You Win!' || output === 'You Lose.') {
      $('#submit-btn, #hint').attr('disabled', true);
      $('h2').text('Press the Reset button to play again!');
    } else {
      $('h2').text(game.isLower() ? 'Guess Higher' : 'Guess Lower');
    }
  }
  $('#submit-btn').click(() => {
    submitPlayerGuess(game.playersGuessSubmission(Number($('#player-input').val())));
    $('#player-input').val('');
  })
    $('#player-input').keypress((e) => {
      if (e.keyCode === 13) {
        $('#submit-btn').click();
      }
    })
    $('#reset').click(() => {
      game = new Game()
      $('h1').text('Guessing Game!');
      $('h2').text('Guess a number between 1-100');
      addGuesses()
      $('#submit-btn, #hint').attr('disabled', false);
      $('#player-input').val('');

    })

    $('#hint').click(() => {
      const hints = game.provideHint();
      $('h1').text(`The winnning number is ${hints[0]}, ${hints[1]}, or ${hints[2]}`);

    })
})
