let hasUnsavedChanges = false;
const createListBtn = document.getElementById("create-list");
const nameInput = document.getElementById("name-input");
const pasteInput = document.getElementById("paste-input");
const formatError = document.getElementById("format-error");
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
const unionBtn = document.getElementById("union");
const deleteBtn = document.getElementById("delete");
const areYouSure = document.getElementById("are-you-sure");
const importBtn = document.getElementById("import");
const importLabelBtn = document.getElementById("import-label");
const exportBtn = document.getElementById("export");
const exportallBtn = document.getElementById("export-all");
const importallBtn = document.getElementById("import-all");
const importallFileBtn = document.getElementById("import-file");
let correctAnswer;
let correctAnswers;
let incorrectAnswers;
let lists;
let isCorrected;
let selectedLists = [];
let inPractice = false;
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
class Answer {
    ans;
    constructor(ans) {
        this.ans = ans;
    }
}
class Word {
    word;
    answers;
    constructor(word, answers) {
        this.word = word;
        this.answers = answers;
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
    // Hide any previous error messages
    formatError.style.display = "none";
    // Validate that name is not empty
    if (!nameInput.value.trim()) {
        formatError.textContent = "Please enter a name for your list.";
        formatError.style.display = "block";
        return;
    }
    // Validate that input is not empty
    if (!pasteInput.value.trim()) {
        formatError.textContent = "List is empty. Please enter words according to the example format.";
        formatError.style.display = "block";
        return;
    }
    const words = stringToWords(pasteInput.value);
    if (words.length === 0) {
        formatError.textContent = "Incorrect Format. Example: can: poder, get: obtener / llegar / conseguir";
        formatError.style.display = "block";
        return;
    }
    lists.push(new List(nameInput.value, words));
    hasUnsavedChanges = true;
    articlePasteTitle.innerHTML = "Create a list with your vocabulary";
    createListBtn.innerHTML = "Create list";
    importLabelBtn.style.display = "block";
    pasteInput.value = "";
    nameInput.value = "";
    renderLists();
    location.href = "#lists-container";
});
listsDiv.addEventListener("click", function (e) {
    let id = e.target.id;
    let index = Number(id.split("-")[1]);
    if (id.includes("practice-")) {
        home.style.display = "none";
        modeSelection.style.display = "flex";
        inPractice = true;
        practising.list = new List(lists[index].name, randomize(lists[index].words));
        practising.listIndex = index;
        correctAnswers = new List(`Correct of ${practising.list.name}`, []);
        incorrectAnswers = new List(`Errors of ${practising.list.name}`, []);
        renderLists();
    }
    else if (id.includes("edit-")) {
        nameInput.value = lists[index].name;
        pasteInput.value = wordsToString(lists[index].words);
        lists.splice(index, 1);
        hasUnsavedChanges = true;
        articlePasteTitle.innerHTML = "Edit the list";
        createListBtn.innerHTML = "Edit";
        importLabelBtn.style.display = "none";
        location.href = "#paste-input-container";
        renderLists();
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
        renderLists();
    }
    else if (id.includes("checkbox-")) {
        let found = false;
        let foundIndex;
        for (let i = 0; i < selectedLists.length && !found; i++) {
            if (selectedLists[i] == index) {
                found = true;
                foundIndex = i;
            }
        }
        if (found) {
            selectedLists.splice(foundIndex, 1);
        }
        else {
            selectedLists.push(index);
        }
        if (selectedLists.length >= 1) {
            deleteBtn.style.display = "block";
            exportBtn.style.display = "block";
        }
        else {
            deleteBtn.style.display = "none";
            exportBtn.style.display = "none";
        }
        if (selectedLists.length >= 2) {
            unionBtn.style.display = "block";
        }
        else {
            unionBtn.style.display = "none";
        }
    }
    else if (id.includes("duplicate-")) {
        let duplicate = structuredClone(lists[index]);
        duplicate.name = `Duplicate of ${duplicate.name}`;
        lists.push(duplicate);
        hasUnsavedChanges = true;
        renderLists();
    }
});
unionBtn.addEventListener("click", function () {
    let listToUnion = [];
    selectedLists.forEach((e) => {
        listToUnion.push(lists[e]);
    });
    lists.push(listsUnion(listToUnion));
    hasUnsavedChanges = true;
    renderLists();
});
deleteBtn.addEventListener("click", function () {
    areYouSure.style.display = "flex";
    location.href = "#are-you-sure";
});
exportBtn.addEventListener("click", function () {
    console.log("Export button clicked, selectedLists:", selectedLists);
    exportListWords(selectedLists);
});
importBtn.addEventListener("change", importListWords);
areYouSure.addEventListener("click", function (e) {
    let id = e.target.id;
    if (id == "yes") {
        selectedLists.sort((a, b) => a - b);
        for (let i = selectedLists.length - 1; i >= 0; i--) {
            lists.splice(selectedLists[i], 1);
        }
        hasUnsavedChanges = true;
        areYouSure.style.display = "none";
        renderLists();
    }
    else if (id == "no") {
        areYouSure.style.display = "none";
    }
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
    if (inPractice && e.key === "Enter") {
        if (isCorrected) {
            next();
        }
        else {
            const userInput = answerInput.value.trim().toLowerCase();
            const currentWord = practising.list.words[practising.questionIndex - 1];
            let isOk = false;
            if (practising.list.isReversed) {
                isOk = (userInput === currentWord.word.toLowerCase());
            }
            else {
                const answersArray = Array.isArray(currentWord.answers) ? currentWord.answers : [{ ans: currentWord.answers }];
                isOk = answersArray.some(a => {
                    const text = (typeof a === 'string') ? a : a.ans;
                    return text.trim().toLowerCase() === userInput;
                });
            }
            renderCorrection(isOk);
        }
    }
});
homeBtn.addEventListener("click", goHome);
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
exportallBtn.addEventListener("click", function () {
    if (!lists) {
        alert("No Lists to export.");
        return;
    }
    const jsonfiles = JSON.stringify(lists);
    const blob = new Blob([jsonfiles], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vocabulary-practice-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    markExported();
});
importallBtn.addEventListener("click", function () {
    importallFileBtn.click();
});
importallFileBtn.addEventListener("change", function (e) {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onload = function () {
        try {
            const listtext = reader.result;
            const importedlists = JSON.parse(listtext);
            if (!Array.isArray(importedlists)) {
                throw new Error("Invalid format");
            }
            lists = importedlists;
            renderLists();
        }
        catch (err) {
            alert("Invalid format, please use a JSON file");
        }
    };
    reader.readAsText(file);
});
//#region FUNCTIONS
function renderLists() {
    listsDiv.innerHTML = "";
    localStorage.setItem("data", JSON.stringify(lists));
    selectedLists = [];
    unionBtn.style.display = "none";
    deleteBtn.style.display = "none";
    exportBtn.style.display = "none";
    if (lists.length === 0) {
        listsDiv.innerHTML = `<h3 id="no-lists">There are no lists</h3>`;
        return;
    }
    for (let i = 0; i < lists.length; i++) {
        listsDiv.innerHTML += `
        <div class="list">
            <div class="checkbox-and-name">
                <input type="checkbox" id="checkbox-${i}" name="checkbok-${i}"class="checkbox"/>
                <h3 class="list-name">${lists[i].name}</h3>
            </div>
            <div class="buttons">
                <button id="practice-${i}">Practice</button>
                <button class="edit-button" id="edit-${i}">Edit</button>
                <button class="duplicate-button" id="duplicate-${i}">Duplicate</button>
                <button class="graph-button" id="graph-${i}">Graph</button>
            </div>
        </div>
        `;
    }
}
function renderQuestion(wordObject) {
    const isReversed = practising.list.isReversed;
    const allTranslations = wordObject.answers.map(a => a.ans).join(" / ");
    if (isReversed) {
        word.innerHTML = allTranslations;
        correctAnswer = wordObject.word;
    }
    else {
        word.innerHTML = wordObject.word;
        correctAnswer = allTranslations;
    }
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
    const current = practising.list.words[practising.questionIndex - 1];
    const displayQuestion = practising.list.isReversed ? current.answers.map(a => a.ans).join(" / ") : current.word;
    if (isCorrect) {
        correct.style.display = "flex";
        correctAnswers.words.push(current);
    }
    else {
        incorrect.style.display = "flex";
        incorrect.innerHTML = `<div>
        No!<br>The answer for <span class="black">${displayQuestion}</span> was: <span class="green">${correctAnswer}</span>
        </div>`;
        incorrectAnswers.words.push(current);
    }
}
function reverseList(listToReverse) {
    let list = structuredClone(listToReverse);
    /** for(let i = 0; i < list.words.length; i++){
        let exchange = list.words[i].word;
        list.words[i].word = list.words[i].answer;
        list.words[i].answer = exchange;
    } **/
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
    inPractice = false;
    if (incorrectAnswers.words.length === 0) {
        errorsBtn.style.display = "none";
    }
    else {
        errorsBtn.style.display = "block";
    }
    lists[practising.listIndex].correctHistory.push(correctAnswers.words.length);
    hasUnsavedChanges = true;
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
    if (!string.trim())
        return [];
    return string.split(",").map(pair => {
        const [wordPart, answersPart] = pair.split(":");
        if (!answersPart)
            return null;
        const answerObjects = answersPart.split("/")
            .map(a => new Answer(a.trim()))
            .filter(a => a.ans !== "");
        return new Word(wordPart.trim(), answerObjects);
    }).filter(w => w !== null);
}
function wordsToString(words) {
    /**let string = "";

    for(let i = 0; i < words.length; i++){
        string += `${words[i].word}: ${words[i].answer}`;

        if(i + 1 != words.length){
            string += ", ";
        }
    }

    return string; **/
    return words.map(w => {
        const answerString = w.answers.map(a => a.ans).join(" / ");
        return `${w.word}: ${answerString}`;
    }).join(", ");
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
function wordEquals(first, second) {
    return first.word == second.word && JSON.stringify(first.answers.sort()) === JSON.stringify(second.answers.sort());
}
function arrayIncludesWord(array, w) {
    for (let i = 0; i < array.length; i++) {
        if (wordEquals(array[i], w)) {
            return true;
        }
    }
    return false;
}
function wordsUnion(first, second) {
    let array = structuredClone(first);
    second.forEach((w) => {
        if (!arrayIncludesWord(array, w)) {
            array.push(w);
        }
    });
    return array;
}
function listsUnion(lists) {
    let newList = lists[0];
    for (let i = 1; i < lists.length; i++) {
        newList = new List("Union", wordsUnion(newList.words, lists[i].words));
    }
    return newList;
}
function markExported() {
    hasUnsavedChanges = false;
}
function exportListWords(selectedLists) {
    const selectedListsWords = [];
    selectedLists.forEach((e) => {
        selectedListsWords.push(lists[e]);
    });
    const jsonData = JSON.stringify(selectedListsWords);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lists.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function importListWords(event) {
    const target = event.target;
    const file = target.files?.[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const jsonData = event.target?.result;
            const importedLists = JSON.parse(jsonData);
            // Add imported lists to existing lists
            importedLists.forEach((importedList) => {
                lists.push(new List(importedList.name, importedList.words));
            });
            hasUnsavedChanges = true;
            renderLists();
            location.href = "#lists-container";
            // Reset the file input
            target.value = "";
        }
        catch (error) {
            console.error("Error parsing JSON file:", error);
            alert("Error: Invalid JSON file format");
        }
    };
    reader.readAsText(file);
}
window.addEventListener("beforeunload", (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
    }
});
