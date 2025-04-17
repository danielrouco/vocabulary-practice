const createListBtn = document.getElementById("create-list");
const nameInput = document.getElementById("name-input");
const pasteInput = document.getElementById("paste-input");
const home = document.getElementById("home");
const modeSelection = document.getElementById("mode-selection");
const listsDiv = document.getElementById("lists");
const questionContainer = document.getElementById("question-container");
const listTitle = document.getElementById("list-title");
const word = document.getElementById("word");
const answerInput = document.getElementById("answer-input");
const bar = document.getElementById("bar");
const correct = document.getElementById("correct");
const incorrect = document.getElementById("incorrect");
const result = document.getElementById("result");
const correctAnswersDiv = document.getElementById("correct-answers");
const incorrectAnswersDiv = document.getElementById("incorrect-answers");
const homeBtn = document.getElementById("home-btn");
const errorsBtn = document.getElementById("errors-btn");
const articlePasteTitle = document.getElementById("article-paste-title");
const accuracy = document.getElementById("accuracy");
const canvasContainer = document.getElementById("canvas-container");
const historyArcticle = document.getElementById("history-article");
const historyTitle = document.getElementById("history-title");
const historyCanvas = document.getElementById("history-canvas");
const closeGraph = document.getElementById("close-graph");
let correctAnswer;
let correctAnswers;
let incorrectAnswers;
let lists;
let isCorrected;
let practising = {
    list: undefined,
    listIndex: undefined,
    questionIndex: 0
};
class List {
    name;
    words;
    isReversed;
    correctHistory;
    constructor(name, words) {
        this.name = name;
        this.words = words;
        this.isReversed = false;
        this.correctHistory = [];
    }
}
class Word {
    word;
    answer;
    constructor(word, answer) {
        this.word = word;
        this.answer = answer;
    }
}
let data = localStorage.getItem("data");
if (data === null) {
    lists = [];
}
else {
    lists = JSON.parse(data);
}
renderLists();
createListBtn.addEventListener("click", function () {
    lists.push(new List(nameInput.value, stringToWords(pasteInput.value)));
    articlePasteTitle.innerHTML = "Create a list with your vocabulary";
    createListBtn.innerHTML = "Create list";
    pasteInput.value = "";
    nameInput.value = "";
    renderLists();
    location.href = "#lists-container";
});
listsDiv.addEventListener("click", function (e) {
    let id = e.target.id;
    let index = Number(id[id.length - 1]);
    if (id.includes("delete-")) {
        lists.splice(index, 1);
    }
    else if (id.includes("practice-")) {
        home.style.display = "none";
        modeSelection.style.display = "flex";
        practising.list = new List(lists[index].name, randomize(lists[index].words));
        practising.listIndex = index;
        correctAnswers = new List(`Correct of ${practising.list.name}`, []);
        incorrectAnswers = new List(`Errors of ${practising.list.name}`, []);
    }
    else if (id.includes("edit-")) {
        nameInput.value = lists[index].name;
        pasteInput.value = wordsToString(lists[index].words);
        lists.splice(index, 1);
        articlePasteTitle.innerHTML = "Edit the list";
        createListBtn.innerHTML = "Edit";
        location.href = "#paste-input-container";
    }
    else if (id.includes("graph-")) {
        historyArcticle.style.display = "flex";
        historyTitle.innerHTML = "History graph of " + lists[index].name;
        if (lists[index].correctHistory.length > 1) {
            historyCanvas.innerHTML = `<canvas id="graph" width="500px" height="240px"></canvas>`;
            graph(lists[index].correctHistory, lists[index].words.length);
        }
        else {
            historyCanvas.innerHTML = "There is not enough data to draw a graph";
        }
        location.href = "#history-article";
    }
    renderLists();
});
closeGraph.addEventListener("click", function () {
    historyArcticle.style.display = "none";
});
modeSelection.addEventListener("click", function (e) {
    let id = e.target.id;
    if (id === "reverse") {
        practising.list = reverseList(practising.list);
    }
    correctAnswers.isReversed = practising.list.isReversed;
    incorrectAnswers.isReversed = practising.list.isReversed;
    historyCanvas.innerHTML = "There is not enough data to draw a graph";
    modeSelection.style.display = "none";
    questionContainer.style.display = "flex";
    listTitle.innerHTML = practising.list.name;
    renderQuestion(practising.list.words[practising.questionIndex]);
});
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        if (isCorrected) {
            next();
        }
        else {
            renderCorrection(answerInput.value === correctAnswer);
        }
    }
});
homeBtn.addEventListener("click", function () { goHome(); });
errorsBtn.addEventListener("click", function () {
    if (incorrectAnswers.isReversed) {
        lists.push(reverseList(incorrectAnswers));
    }
    else {
        lists.push(incorrectAnswers);
    }
    renderLists();
    goHome();
});
//#region FUNCTIONS
function renderLists() {
    listsDiv.innerHTML = "";
    localStorage.setItem("data", JSON.stringify(lists));
    if (lists.length === 0) {
        listsDiv.innerHTML = `<h3 id="no-lists">There are no lists</h3>`;
        return;
    }
    for (let i = 0; i < lists.length; i++) {
        listsDiv.innerHTML += `
        <div class="list">
            <h3>${lists[i].name}</h3>
            <div class="buttons">
                <button id="practice-${i}">Practice</button>
                <button class="edit-button" id="edit-${i}">Edit</button>
                <button class="delete-button" id="delete-${i}">Delete</button>
                <button class="graph-button" id="graph-${i}">Graph</button>
            </div>
        </div>
        `;
    }
}
function renderQuestion(wordObject) {
    word.innerHTML = wordObject.word;
    correctAnswer = wordObject.answer;
    isCorrected = false;
    correct.style.display = "none";
    incorrect.style.display = "none";
    questionContainer.style.display = "flex";
    bar.style.width = `${(practising.questionIndex / practising.list.words.length) * 100}vw`;
    practising.questionIndex++;
    answerInput.focus();
}
function renderCorrection(isCorrect) {
    questionContainer.style.display = "none";
    answerInput.value = "";
    isCorrected = true;
    if (isCorrect) {
        correct.style.display = "flex";
        correctAnswers.words.push(practising.list.words[practising.questionIndex - 1]);
    }
    else {
        incorrect.style.display = "flex";
        incorrect.innerHTML = `<div>
        No!<br>The answer for <span class="black">${practising.list.words[practising.questionIndex - 1].word}</span> was: <span class="green">${correctAnswer}</span>
        </div>`;
        incorrectAnswers.words.push(practising.list.words[practising.questionIndex - 1]);
    }
}
function reverseList(listToReverse) {
    let list = listToReverse;
    for (let i = 0; i < list.words.length; i++) {
        let exchange = list.words[i].word;
        list.words[i].word = list.words[i].answer;
        list.words[i].answer = exchange;
    }
    list.isReversed = true;
    return list;
}
function goHome() {
    home.style.display = "flex";
    result.style.display = "none";
    practising.listIndex = undefined;
    practising.list = undefined;
    practising.questionIndex = 0;
    canvasContainer.innerHTML = `<p id="no-data">There is not enough data to draw a graph</p>`;
}
function next() {
    if (practising.questionIndex >= practising.list.words.length) {
        renderResults();
        return;
    }
    renderQuestion(practising.list.words[practising.questionIndex]);
}
function renderResults() {
    result.style.display = "flex";
    correct.style.display = "none";
    incorrect.style.display = "none";
    if (incorrectAnswers.words.length === 0) {
        errorsBtn.style.display = "none";
    }
    else {
        errorsBtn.style.display = "block";
    }
    lists[practising.listIndex].correctHistory.push(correctAnswers.words.length);
    if (lists[practising.listIndex].correctHistory.length > 1) {
    }
    correctAnswersDiv.innerHTML = String(correctAnswers.words.length);
    incorrectAnswersDiv.innerHTML = String(incorrectAnswers.words.length);
    accuracy.innerHTML = String(Math.round(correctAnswers.words.length / practising.list.words.length * 100)) + "%";
    if (lists[practising.listIndex].correctHistory.length > 1) {
        canvasContainer.innerHTML = `<canvas id="graph" width="500px" height="240px"></canvas>`;
        graph(lists[practising.listIndex].correctHistory, lists[practising.listIndex].words.length);
    }
    localStorage.setItem("data", JSON.stringify(lists));
}
function stringToWords(string) {
    let array = string.split(",");
    let transitionArray = new Array(array.length);
    let words = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
        transitionArray[i] = array[i].split(":");
        words[i] = new Word(transitionArray[i][0].trim(), transitionArray[i][1].trim());
    }
    return words;
}
function wordsToString(words) {
    let string = "";
    for (let i = 0; i < words.length; i++) {
        string += `${words[i].word}: ${words[i].answer}`;
        if (i + 1 != words.length) {
            string += ", ";
        }
    }
    return string;
}
function random(max) {
    return Math.round(Math.random() * max);
}
function randomize(array) {
    let oldArray = structuredClone(array);
    let newArray = [];
    let randomIndex;
    while (oldArray.length > 0) {
        randomIndex = random(oldArray.length - 1);
        newArray.push(oldArray[randomIndex]);
        oldArray.splice(randomIndex, 1);
    }
    return newArray;
}
function graph(correctHistory, nQuestions) {
    let ctx = document.getElementById("graph").getContext("2d");
    let verticalK = 240 / nQuestions;
    let horizontalK = 500 / (correctHistory.length - 1);
    let maxHistory = 50;
    let lastIndex = 0;
    let gapX = 0;
    if (correctHistory.length > maxHistory) {
        lastIndex = correctHistory.length - maxHistory - 1;
        horizontalK = 500 / maxHistory;
        gapX = maxHistory;
    }
    ctx.fillStyle = "#6ab04c";
    ctx.translate(0, 240);
    ctx.moveTo(500, 0);
    ctx.beginPath();
    for (let i = correctHistory.length - 1; i >= lastIndex; i--) {
        ctx.lineTo((i - gapX) * horizontalK, -1 * correctHistory[i] * verticalK);
    }
    ctx.lineTo(0, 0);
    ctx.lineTo(500, 0);
    ctx.fill();
}
