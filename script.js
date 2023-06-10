// Globala konstanter och variabler
const tiles = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
]; // Array med 40 brickor

let newGameButton; // Knappen för nytt spel
let newTilesButton; // Knappen för nya brickor
let resetButton;
let newTilesElements; // Array för div-elementen där nya slumpade brickor ska skrivas ut
let tilesElements; // Array för div-elementen som nya slumpade brickor ska dras till
let tempTiles; // Array för kopia av arrayen med brickor/nummer
let markElements; // Array med element för markering av rätt/fel svar
let dragElement; // Element som användaren börjar dra
let gameCountMessage; // Element för meddelande om antalet spel
let gameCount = 0; // Spelräkning
let dragElementsCount = 0; // Antal drag
let resultMessage; // Element för resultatmeddelandet
let correctSeriesCount = 0; // Antal rätta serier
let totalPointsCount = 0; // Totalpoäng
let totalPointsMessage; // Element för totalpoängmeddelande
let draggedElementsCount = 0; // Antal drag från rutor med slumpade brickor

// --------------------------------------------------

function init() {
  fromLocalStarage();

  // Referenser till element i gränssnittet
  newGameButton = document.getElementById("newGameBtn"); // Knappen för nytt spel
  newTilesButton = document.getElementById("newTilesBtn"); // Knappen för nya brickor
  resetButton = document.getElementById("resetBtn");
  totalPointsMessage = document.getElementById("totPoints"); // Element för meddelande med totalpong
  gameCountMessage = document.getElementById("countGames"); // Element för meddelande om antal spel
  resultMessage = document.getElementById("message"); // Element för meddelande med resultat

  newTilesElements = document
    .getElementById("newTiles")
    .getElementsByClassName("tile"); // Array med element för utskrift av nya brickor
  tilesElements = document
    .getElementById("board")
    .getElementsByClassName("tile"); // Array med element som nya brickor ska dras till
  markElements = document
    .getElementById("board")
    .getElementsByClassName("mark"); // Array med element för markering av rätt/fel svar

  // Händelsehanterare
  newGameButton.addEventListener("click", startNewGame); // Då man klickar på knappen starts spelet
  newTilesButton.addEventListener("click", getNewTiles); // Då man klickar på knappen slumpas fram fyra brickor
  resetButton.addEventListener("click", resetLocalStorage);

  newTilesButton.disabled = true; // Inaktiverar knappen för nya brickor
  newTilesButton.classList.remove("hover");

  // Går igenom alla newTilesElements och lägger på händelsehanterare och funktioner
  for (let i = 0; i < newTilesElements.length; i++) {
    newTilesElements[i].addEventListener("dragstart", dragstartTile);
    newTilesElements[i].addEventListener("dragend", dragendTile);
  }
}
window.addEventListener("load", init);

// --------------------------------------------------

// Starts the game
function startNewGame() {
  resetAll();

  tempTiles = tiles.slice(); // Gör en kopia av arrayen med brickor/nummer

  newGameButton.disabled = true; // Inaktiverar knappen för nytt spel
  newTilesButton.disabled = false; // Aktiverar knappen för nya brickor

  newGameButton.classList.remove("hover");
  newTilesButton.classList.add("hover");
}

// --------------------------------------------------

// Resets all parameters
function resetAll() {
  correctSeriesCount = 0; // Nollställer antalet rätta serier

  dragElementsCount = 0; // Nollställer antalet drag
  resultMessage.innerHTML = ""; // Rensar meddelande med resultat från den ena omgången

  // Tar bort brickor och stiler från rutor med slumpade brickor
  for (let i = 0; i < 4; i++) {
    newTilesElements[i].innerHTML = ""; // Rensar rutor med slumpade brickor
    newTilesElements[i].classList.remove("filled"); // Ändrar stiler för slumpade brickor genom att ta bort en klass
    newTilesElements[i].classList.add("empty"); // Ändrar stiler för slumpade brickor genom att lägga till en klass
  }
  // Tar bart alla brickor från tavlan
  for (let i = 0; i < tilesElements.length; i++) {
    tilesElements[i].innerHTML = ""; // Rensar rutor med brickor
    tilesElements[i].classList.remove("filled"); // Ändrar stiler för slumpade brickor genom att ta bort en klass
    tilesElements[i].classList.add("empty"); // Ändrar stiler för slumpade brickor genom att lägga till en klass
  }
  // Tar bort bockar och kryss
  for (let i = 0; i < markElements.length; i++) {
    markElements[i].classList.remove("check", "cross");
  }
  newGameButton.disabled = false; // Aktiverar knappen för nytt spel
  newTilesButton.disabled = true; // Inaktiverar knappen för nya brickor
  newGameButton.classList.add("hover");
  newTilesButton.classList.remove("hover");
}

// --------------------------------------------------

// Slumpar fram fyra nya brickor
function getNewTiles() {
  for (let i = 0; i < newTilesElements.length; i++) {
    newTilesElements[i].draggable = true; // Brickorna blir dragbara när nya brickor slumpas fram

    randomNumber = Math.floor(Math.random() * tempTiles.length); // Slumpar nummer mellan 1-40

    newTilesElements[i].innerHTML = tempTiles[randomNumber]; // Skriver ut slumpade nummer

    tempTiles.splice(randomNumber, 1); // Tar bort använda nummer från tillfälliga arrayen

    newTilesElements[i].classList.remove("empty"); // Ändrar stiler för slumpade brickor genom att ta bort en klass
    newTilesElements[i].classList.add("filled"); // Ändrar stiler för slumpade brickor genom att lägga till en klass
  }
  draggedElementsCount = 0; // Nollställer räknaren för element som dras från slumpade brickor
  newTilesButton.disabled = true; // Inaktiverar knappen för nya brickor
  newTilesButton.classList.remove("hover");
}

// --------------------------------------------------

// Körs när brickan börjar dras
function dragstartTile() {
  dragElement = this; // Element som användaren börjar dra (används sedan i moveTileToBox()-funktionen)

  // Går igenom alla tilesElements och lägger på händelsehanterare och funktioner
  for (let i = 0; i < tilesElements.length; i++) {
    tilesElements[i].addEventListener("dragover", moveTileToBox); // Lägger till händelsen och funktionen när brickan börjar dras
    tilesElements[i].addEventListener("dragleave", moveTileToBox); // Lägger till händelsen och funktionen när brickan börjar dras
    tilesElements[i].addEventListener("drop", moveTileToBox); // Lägger till händelsen och funktionen när brickan börjar dras
  }
}

// --------------------------------------------------

// Tar bort händelsen och funktionen när brickan släpts
function dragendTile() {
  for (let i = 0; i < tilesElements.length; i++) {
    tilesElements[i].removeEventListener("dragover", moveTileToBox); // Tar bort händelsen och funktionen när brickan släpts
    tilesElements[i].removeEventListener("dragleave", moveTileToBox); // Tar bort händelsen och funktionen när brickan släpts
    tilesElements[i].removeEventListener("drop", moveTileToBox); // Tar bort händelsen och funktionen när brickan släpts
  }
}

// --------------------------------------------------

// Hanterar flytten av brickan till rutan
function moveTileToBox(e) {
  e.preventDefault(); // Förhindrar webbläsarens "default"-beteende

  let boardElement = this;

  if (e.type == "drop") {
    let dropElement = this; // Den aktuella rutan för brickan

    if (dropElement.innerHTML == "") {
      dropElement.innerHTML = dragElement.innerHTML; // Lägger till brickan i den valda rutan
      dragElement.innerHTML = ""; // Tar bort elementet som dragits från listan
      dragElement.draggable = false; // Förhindrar så att en tom ruta som en bricka dragits från kan dras
      dragElement.classList.remove("filled"); // Ändrar stiler för elementet som brickan dragits ifrån
      dragElement.classList.add("empty"); // Ändrar stiler för elementet som brickan dragits ifrån
      boardElement.classList.remove("empty"); // Ändrar stiler för rutan på tavlan där brickan släpps
      boardElement.classList.add("filled"); // Ändrar stiler för rutan på tavlan där brickan släpps
    } else return; // Avbryter funktionen om rutan är upptagen

    draggedElementsCount++; // Ökar antalet element som dragits från rutorna med slumpade brickor
    //  Aktiverar knappen när alla fyra brickor har dragits
    if (draggedElementsCount == 4) {
      newTilesButton.disabled = false;
      newTilesButton.classList.add("hover");
    }

    dragElementsCount++; // Ökar antalet dragna element till tavlan
    //  Kontrollerar serier och avslutar spelet efter att 16 brickor har dragits
    if (dragElementsCount == 16) {
      checkAnswers();
      countCorrectSeries();
      stopGame();
      newGameButton.classList.add("hover");
      newTilesButton.classList.remove("hover");
    }
  }

  // Hovereffekt när brickan dras över rutan
  if (this.innerHTML == "") {
    if (e.type == "dragover") {
      this.style.backgroundColor = "#79e200";
    } else if (e.type == "dragleave") {
      this.style.backgroundColor = "";
    } else if (e.type == "drop") {
      this.style.backgroundColor = "";
    }
    // Tar bort hover över en ruta med en bricka i
  } else {
    if (e.type == "dragover") {
      this.style.backgroundColor = "";
    } else if (e.type == "dragleave") {
      this.style.backgroundColor = "";
    } else if (e.type == "drop") {
      this.style.backgroundColor = "";
    }
  }
}

// --------------------------------------------------

// Kontrollerar stigande serier
function checkAnswers() {
  let s1 = document.getElementsByClassName("s1"); // Array med elementer - rader
  let s2 = document.getElementsByClassName("s2"); // Array med elementer - rader
  let s3 = document.getElementsByClassName("s3"); // Array med elementer - rader
  let s4 = document.getElementsByClassName("s4"); // Array med elementer - rader
  let s5 = document.getElementsByClassName("s5"); // Array med elementer - kolumner
  let s6 = document.getElementsByClassName("s6"); // Array med elementer - kolumner
  let s7 = document.getElementsByClassName("s7"); // Array med elementer - kolumner
  let s8 = document.getElementsByClassName("s8"); // Array med elementer - kolumner

  let s1mark = document.getElementById("s1mark"); // Element för bock eller kryss - rader
  let s2mark = document.getElementById("s2mark"); // Element för bock eller kryss - rader
  let s3mark = document.getElementById("s3mark"); // Element för bock eller kryss - rader
  let s4mark = document.getElementById("s4mark"); // Element för bock eller kryss - rader
  let s5mark = document.getElementById("s5mark"); // Element för bock eller kryss - kolumner
  let s6mark = document.getElementById("s6mark"); // Element för bock eller kryss - kolumner
  let s7mark = document.getElementById("s7mark"); // Element för bock eller kryss - kolumner
  let s8mark = document.getElementById("s8mark"); // Element för bock eller kryss - kolumner

  // Anropar funktionen för konroll av stigande serier
  isIncreasing(s1, s1mark);
  isIncreasing(s2, s2mark);
  isIncreasing(s3, s3mark);
  isIncreasing(s4, s4mark);
  isIncreasing(s5, s5mark);
  isIncreasing(s6, s6mark);
  isIncreasing(s7, s7mark);
  isIncreasing(s8, s8mark);

  // --------------------------------------------------

  // Kontrollerar stigande serier och markerar med bock eller kryss
  function isIncreasing(series, mark) {
    for (let i = 1; i < series.length; i++) {
      if (
        parseFloat(series[i].innerHTML) > parseFloat(series[i - 1].innerHTML)
      ) {
        mark.classList.add("check");
      } else {
        // Om talet är mindre än föregående tas klassen check bort och loopen avbryts
        mark.classList.add("cross");
        mark.classList.remove("check");
        return;
      }
    }
  }
}

// --------------------------------------------------

// Räknar antal rätta serier
function countCorrectSeries() {
  for (let i = 0; i < markElements.length; i++) {
    if (markElements[i].classList.contains("check")) {
      correctSeriesCount++;
      console.log(correctSeriesCount);
      totalPointsCount++;
      console.log(totalPointsCount);
    }
  }

  resultMessage.innerHTML = "You got " + correctSeriesCount + "  points!"; // Skriver ut antal poång
  totalPointsMessage.innerHTML = totalPointsCount; // Skriver ut det nya totalpoängen
  gameCount++; // Ökar antalet spelomgångar
  gameCountMessage.innerHTML = gameCount; // Skriver ut antalet spelomgångar

  toLocalStorage(); // Anropar funktionen för att spara data i localstorage
}

// --------------------------------------------------

// Saves data to Local Storage
function toLocalStorage() {
  var value = [totalPointsCount, gameCount]; // Array med värden
  localStorage.setItem("ig222maUserInfo", JSON.stringify(value)); // Sparar array med värden
}

// Gets data from Local Storage
function fromLocalStarage() {
  let value = JSON.parse(localStorage.getItem("ig222maUserInfo")); // Hämtar array med värden

  if (value != null) {
    totalPointsCount = Number(value[0]); // Totalpoäng från localstorage
    gameCount = Number(value[1]); // Antalet spelade spel från localstorage
  }

  document.getElementById("totPoints").innerHTML = totalPointsCount; // Skriver ut totalpoäng från localstorage när spelet öppnas på nytt
  document.getElementById("countGames").innerHTML = gameCount; // Skriver ut antalet spelomgångar från localstorage när spelet öppnas på nytt
}

// Resets Local Storage
function resetLocalStorage() {
  localStorage.clear();
  resetAll();
  totalPointsCount = 0;
  gameCount = 0;
  document.getElementById("totPoints").innerHTML = 0; // Skriver ut totalpoäng från localstorage när spelet öppnas på nytt
  document.getElementById("countGames").innerHTML = 0; // Skriver ut antalet spelomgångar från localstorage när spelet öppnas på nytt
}

// --------------------------------------------------

// Spelet avslutas
function stopGame() {
  newGameButton.disabled = false; // Aktiverar knappen för nytt spel
  newTilesButton.disabled = true; // Inaktiverar knappen för nya brickor
}
