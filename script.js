// Global constants and  och variables
const tiles = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
]; // Array with 40 tiles

let newGameButton; // New game button
let newTilesButton; // The button for new tiles
let resetButton; // Reset button
let newTilesElements; // Array of the div elements where new random tiles should be printed
let tilesElements; // Array of the div elements to which new random tiles should be drawn
let tempTiles; // Array for copy of the array of tiles/numbers
let markElements; // Array with boxes for marking right/wrong answers
let dragElement; // Elements that the user begins to drag
let gameCountMessage; // Element for notification of the number of game
let gameCount = 0; // Game count
let dragElementsCount = 0; // Number of moves
let resultMessage; // The result message element
let correctSeriesCount = 0; // Number of correct series
let totalPointsCount = 0; // Total score
let totalPointsMessage; // Element for total score message
let draggedElementsCount = 0; // Number of moves from squares with random tiles

// --------------------------------------------------

function init() {
  fromLocalStarage(); // Retrieves data from Local storage

  // References to elements in the interface
  newGameButton = document.getElementById('newGameBtn');
  newTilesButton = document.getElementById('newTilesBtn');
  resetButton = document.getElementById('resetBtn');
  totalPointsMessage = document.getElementById('totPoints');
  gameCountMessage = document.getElementById('countGames');
  resultMessage = document.getElementById('message');

  newTilesElements = document.getElementById('newTiles').getElementsByClassName('tile'); // Array of elements for printing new tiles
  tilesElements = document.getElementById('board').getElementsByClassName('tile'); // Array of elements to which new tiles should be drawn
  markElements = document.getElementById('board').getElementsByClassName('mark'); // Array with elements for marking right/wrong answers

  // Event handlers
  newGameButton.addEventListener('click', startNewGame); // When you click the button, the game starts
  newTilesButton.addEventListener('click', getNewTiles); // When you click the button, four tiles will appear randomly
  resetButton.addEventListener('click', resetLocalStorage); // When the button is clicked, local storage is reset

  newTilesButton.disabled = true; // Disables the button for new tiles
  newTilesButton.classList.remove('hover');

  // Loops through all newTilesElements and adds event handlers and functions
  for (let i = 0; i < newTilesElements.length; i++) {
    newTilesElements[i].addEventListener('dragstart', dragstartTile);
    newTilesElements[i].addEventListener('dragend', dragendTile);
  }
}
window.addEventListener('load', init);

// --------------------------------------------------

// Starts the game
function startNewGame() {
  resetAll();

  tempTiles = tiles.slice(); // Makes a copy of the tiles/numbers

  newGameButton.disabled = true;
  newTilesButton.disabled = false;

  newGameButton.classList.remove('hover');
  newTilesButton.classList.add('hover');
}

// --------------------------------------------------

// Resets all parameters
function resetAll() {
  correctSeriesCount = 0; // Resets the number of correct series
  dragElementsCount = 0; // Resets the number of moves
  resultMessage.innerHTML = ''; // Clears message with results from the one round

  // Removes all tiles and styles from boxes with random tiles
  for (let i = 0; i < 4; i++) {
    newTilesElements[i].innerHTML = '';
    newTilesElements[i].classList.remove('filled');
    newTilesElements[i].classList.add('empty');
  }
  // Removes all tiles and styles from the board
  for (let i = 0; i < tilesElements.length; i++) {
    tilesElements[i].innerHTML = '';
    tilesElements[i].classList.remove('filled');
    tilesElements[i].classList.add('empty');
  }
  // Removes check and cross marks
  for (let i = 0; i < markElements.length; i++) {
    markElements[i].classList.remove('check', 'cross');
  }
  // Changes the activation and styles of the buttons
  newGameButton.disabled = false;
  newTilesButton.disabled = true;
  newGameButton.classList.add('hover');
  newTilesButton.classList.remove('hover');
}

// --------------------------------------------------

// Generates four new random tiles
function getNewTiles() {
  for (let i = 0; i < newTilesElements.length; i++) {
    newTilesElements[i].draggable = true; // The tiles become drawable when new tiles are randomly presented

    randomNumber = Math.floor(Math.random() * tempTiles.length); // Generates random numbers between 1-40

    newTilesElements[i].innerHTML = tempTiles[randomNumber]; // Prints random numbers

    tempTiles.splice(randomNumber, 1); // Removes used numbers from the temporary array

    newTilesElements[i].classList.remove('empty'); // Changes styles for random tiles
    newTilesElements[i].classList.add('filled'); // Changes styles for random tiles
  }
  draggedElementsCount = 0; // Resets the counter for elements drawn from random tiles
  newTilesButton.disabled = true; // Disables the button for new tiles
  newTilesButton.classList.remove('hover');
}

// --------------------------------------------------

// Runs when the tile starts to be drawn
function dragstartTile() {
  dragElement = this; // Element that the user starts dragging (then used in the moveTileToBox() function)

  // Loops through all the tilesElements and adds event handlers and functions
  for (let i = 0; i < tilesElements.length; i++) {
    tilesElements[i].addEventListener('dragover', moveTileToBox);
    tilesElements[i].addEventListener('dragleave', moveTileToBox);
    tilesElements[i].addEventListener('drop', moveTileToBox);
  }
}

// --------------------------------------------------

// Removes the event and function when the tile is dropped
function dragendTile() {
  for (let i = 0; i < tilesElements.length; i++) {
    tilesElements[i].removeEventListener('dragover', moveTileToBox);
    tilesElements[i].removeEventListener('dragleave', moveTileToBox);
    tilesElements[i].removeEventListener('drop', moveTileToBox);
  }
}

// --------------------------------------------------

// Handles the movement of the tile to the box
function moveTileToBox(e) {
  e.preventDefault();

  if (e.type == 'drop') {
    let dropElement = this; // The current box for the tile

    if (dropElement.innerHTML == '') {
      dropElement.innerHTML = dragElement.innerHTML; // Adds the tile to the selected box
      dragElement.innerHTML = ''; // Removes the dragged element from the list
      dragElement.draggable = false; // Prevents an empty box from which a tile has been drawn from being drawn
      dragElement.classList.remove('filled'); // Changes the styles of the box from which the tile is drawn
      dragElement.classList.add('empty'); // Changes the styles of the box from which the tile is drawn
      dropElement.classList.remove('empty'); // Changes the styles of the box on the board where the tile is dropped
      dropElement.classList.add('filled'); // Changes the styles of the box on the board where the tile is dropped
    } else return; // Cancels the function if the box is occupied

    draggedElementsCount++; // Increases the number of elements drawn from the random tile boxes
    //  Activates the button when all four tiles have been drawn
    if (draggedElementsCount == 4) {
      newTilesButton.disabled = false;
      newTilesButton.classList.add('hover');
    }

    dragElementsCount++; // Increases the number of elements drawn to the board
    // Checks streaks and ends the game after 16 tiles have been drawn
    if (dragElementsCount == 16) {
      checkAnswers();
      countCorrectSeries();
      stopGame();
      newGameButton.classList.add('hover');
      newTilesButton.classList.remove('hover');
    }
  }

  // Hover effect when the tile is dragged over the box
  if (this.innerHTML == '') {
    if (e.type == 'dragover') {
      this.style.backgroundColor = '#79e200';
    } else if (e.type == 'dragleave') {
      this.style.backgroundColor = '';
    } else if (e.type == 'drop') {
      this.style.backgroundColor = '';
    }
    // Removes hover from a box with a tile in it
  } else {
    if (e.type == 'dragover') {
      this.style.backgroundColor = '';
    } else if (e.type == 'dragleave') {
      this.style.backgroundColor = '';
    } else if (e.type == 'drop') {
      this.style.backgroundColor = '';
    }
  }
}

// --------------------------------------------------

// Kontrollerar stigande serier
function checkAnswers() {
  let s1 = document.getElementsByClassName('s1'); // Array of boxes - rows
  let s2 = document.getElementsByClassName('s2'); // Array of boxes - rows
  let s3 = document.getElementsByClassName('s3'); // Array of boxes - rows
  let s4 = document.getElementsByClassName('s4'); // Array of boxes - rows
  let s5 = document.getElementsByClassName('s5'); // Array of boxes - columns
  let s6 = document.getElementsByClassName('s6'); // Array of boxes - columns
  let s7 = document.getElementsByClassName('s7'); // Array of boxes - columns
  let s8 = document.getElementsByClassName('s8'); // Array of boxes - columns

  let s1mark = document.getElementById('s1mark'); // Box for check or cross - rows
  let s2mark = document.getElementById('s2mark'); // Box for check or cross - rows
  let s3mark = document.getElementById('s3mark'); // Box for check or cross - rows
  let s4mark = document.getElementById('s4mark'); // Box for check or cross - rows
  let s5mark = document.getElementById('s5mark'); // Box for check or cross - columns
  let s6mark = document.getElementById('s6mark'); // Box for check or cross - columns
  let s7mark = document.getElementById('s7mark'); // Box for check or cross - columns
  let s8mark = document.getElementById('s8mark'); // Box for check or cross - columns

  const rowsAndColumns = [s1, s2, s3, s4, s5, s6, s7, s8]; // Array with rows and columns
  const markBoxes = [s1mark, s2mark, s3mark, s4mark, s5mark, s6mark, s7mark, s8mark]; // Array with mark boxes

  // Calls the function to check ascending series
  for (let i = 0; i < rowsAndColumns.length; i++) {
    isIncreasing(rowsAndColumns[i], markBoxes[i]);
  }

  // --------------------------------------------------

  // Checks ascending series and marks with a check or a cross
  function isIncreasing(series, mark) {
    for (let i = 1; i < series.length; i++) {
      if (parseFloat(series[i].innerHTML) > parseFloat(series[i - 1].innerHTML)) {
        mark.classList.add('check');
      } else {
        // If the number is less than the previous one, the check class is removed and the loop is terminated
        mark.classList.add('cross');
        mark.classList.remove('check');
        return;
      }
    }
  }
}

// --------------------------------------------------

// Counts number of correct series
function countCorrectSeries() {
  for (let i = 0; i < markElements.length; i++) {
    if (markElements[i].classList.contains('check')) {
      correctSeriesCount++;
      totalPointsCount++;
    }
  }

  resultMessage.innerHTML = 'You got ' + correctSeriesCount + '  points!'; // Prints points
  totalPointsMessage.innerHTML = totalPointsCount; // Prints the new total score
  gameCount++; // Increases the number of game rounds
  gameCountMessage.innerHTML = gameCount; // Prints the number of game rounds

  toLocalStorage(); // Calls the function to save data to localstorage
}

// --------------------------------------------------

// Saves data to Local Storage
function toLocalStorage() {
  var value = [totalPointsCount, gameCount];
  localStorage.setItem('data', JSON.stringify(value));
}

// Gets data from Local Storage
function fromLocalStarage() {
  let value = JSON.parse(localStorage.getItem('data'));

  if (value != null) {
    totalPointsCount = Number(value[0]); // Total points from localstorage
    gameCount = Number(value[1]); // The number of played games from local storage
  }

  document.getElementById('totPoints').innerHTML = totalPointsCount; //Prints total score from localstorage when game is reopened
  document.getElementById('countGames').innerHTML = gameCount; // Prints the number of game rounds from localstorage when the game is reopened
}

// Resets Local Storage
function resetLocalStorage() {
  localStorage.clear();
  resetAll();

  // Resets variables and printing
  totalPointsCount = 0;
  gameCount = 0;
  document.getElementById('totPoints').innerHTML = 0;
  document.getElementById('countGames').innerHTML = 0;
}

// --------------------------------------------------

// The game ends
function stopGame() {
  newGameButton.disabled = false;
  newTilesButton.disabled = true;
}
