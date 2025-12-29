var hasUnsavedChanges = false;
var createListBtn = document.getElementById("create-list");
var nameInput = document.getElementById("name-input");
var pasteInput = document.getElementById("paste-input");
var formatError = document.getElementById("format-error");
var home = document.getElementById("home");
var modeSelection = document.getElementById("mode-selection");
var listsDiv = document.getElementById("lists");
var questionContainer = document.getElementById("question-container");
var listTitle = document.getElementById("list-title");
var word = document.getElementById("word");
var answerInput = document.getElementById("answer-input");
var bar = document.getElementById("bar");
var correct = document.getElementById("correct");
var incorrect = document.getElementById("incorrect");
var result = document.getElementById("result");
var correctAnswersDiv = document.getElementById("correct-answers");
var incorrectAnswersDiv = document.getElementById("incorrect-answers");
var homeBtn = document.getElementById("home-btn");
var errorsBtn = document.getElementById("errors-btn");
var articlePasteTitle = document.getElementById("article-paste-title");
var accuracy = document.getElementById("accuracy");
var canvasContainer = document.getElementById("canvas-container");
var historyArcticle = document.getElementById("history-article");
var historyTitle = document.getElementById("history-title");
var historyCanvas = document.getElementById("history-canvas");
var closeGraph = document.getElementById("close-graph");
var unionBtn = document.getElementById("union");
var deleteBtn = document.getElementById("delete");
var areYouSure = document.getElementById("are-you-sure");
var importBtn = document.getElementById("import");
var importLabelBtn = document.getElementById("import-label");
var exportBtn = document.getElementById("export");
var exportallBtn = document.getElementById("export-all");
var importallBtn = document.getElementById("import-all");
var importallFileBtn = document.getElementById("import-file");
var correctAnswer;
var correctAnswers;
var incorrectAnswers;
var lists;
var isCorrected;
var selectedLists = [];
var inPractice = false;
var practising = {
    list: undefined,
    listIndex: undefined,
    questionIndex: 0
};
var List = /** @class */ (function () {
    function List(name, words) {
        this.name = name;
        this.words = words;
        this.isReversed = false;
        this.correctHistory = [];
    }
    return List;
}());
var Answer = /** @class */ (function () {
    function Answer(ans) {
        this.ans = ans;
    }
    return Answer;
}());
var Word = /** @class */ (function () {
    function Word(word, answers) {
        this.word = word;
        this.answers = answers;
    }
    return Word;
}());
var data = localStorage.getItem("data");
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
    var words = stringToWords(pasteInput.value);
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
    var id = e.target.id;
    var index = Number(id.split("-")[1]);
    if (id.includes("practice-")) {
        home.style.display = "none";
        modeSelection.style.display = "flex";
        inPractice = true;
        practising.list = new List(lists[index].name, randomize(lists[index].words));
        practising.listIndex = index;
        correctAnswers = new List("Correct of ".concat(practising.list.name), []);
        incorrectAnswers = new List("Errors of ".concat(practising.list.name), []);
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
            historyCanvas.innerHTML = "<canvas id=\"graph\" width=\"500px\" height=\"240px\"></canvas>";
            graph(lists[index].correctHistory, lists[index].words.length);
        }
        else {
            historyCanvas.innerHTML = "There is not enough data to draw a graph";
        }
        location.href = "#history-article";
        renderLists();
    }
    else if (id.includes("checkbox-")) {
        var found = false;
        var foundIndex = void 0;
        for (var i = 0; i < selectedLists.length && !found; i++) {
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
        var duplicate = structuredClone(lists[index]);
        duplicate.name = "Duplicate of ".concat(duplicate.name);
        lists.push(duplicate);
        hasUnsavedChanges = true;
        renderLists();
    }
});
unionBtn.addEventListener("click", function () {
    var listToUnion = [];
    selectedLists.forEach(function (e) {
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
    var id = e.target.id;
    if (id == "yes") {
        selectedLists.sort(function (a, b) { return a - b; });
        for (var i = selectedLists.length - 1; i >= 0; i--) {
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
    var id = e.target.id;
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
            var userInput_1 = answerInput.value.trim().toLowerCase();
            var currentWord = practising.list.words[practising.questionIndex - 1];
            var isOk = false;
            if (practising.list.isReversed) {
                isOk = (userInput_1 === currentWord.word.toLowerCase());
            }
            else {
                var answersArray = Array.isArray(currentWord.answers) ? currentWord.answers : [{ ans: currentWord.answers }];
                isOk = answersArray.some(function (a) {
                    var text = (typeof a === 'string') ? a : a.ans;
                    return text.trim().toLowerCase() === userInput_1;
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
    var jsonfiles = JSON.stringify(lists);
    var blob = new Blob([jsonfiles], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
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
    var _a;
    var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
    var reader = new FileReader();
    reader.onload = function () {
        try {
            var listtext = reader.result;
            var importedlists = JSON.parse(listtext);
            if (!Array.isArray(importedlists)) {
                throw new Error("Invalid format");
            }
            lists = importedlists;
            hasUnsavedChanges = true;
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
        listsDiv.innerHTML = "<h3 id=\"no-lists\">There are no lists</h3>";
        return;
    }
    for (var i = 0; i < lists.length; i++) {
        listsDiv.innerHTML += "\n        <div class=\"list\">\n            <div class=\"checkbox-and-name\">\n                <input type=\"checkbox\" id=\"checkbox-".concat(i, "\" name=\"checkbok-").concat(i, "\"class=\"checkbox\"/>\n                <h3 class=\"list-name\">").concat(lists[i].name, "</h3>\n            </div>\n            <div class=\"buttons\">\n                <button id=\"practice-").concat(i, "\">Practice</button>\n                <button class=\"edit-button\" id=\"edit-").concat(i, "\">Edit</button>\n                <button class=\"duplicate-button\" id=\"duplicate-").concat(i, "\">Duplicate</button>\n                <button class=\"graph-button\" id=\"graph-").concat(i, "\">Graph</button>\n            </div>\n        </div>\n        ");
    }
}
function renderQuestion(wordObject) {
    var isReversed = practising.list.isReversed;
    var allTranslations = wordObject.answers.map(function (a) { return a.ans; }).join(" / ");
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
    bar.style.width = "".concat((practising.questionIndex / practising.list.words.length) * 100, "vw");
    practising.questionIndex++;
    answerInput.focus();
}
function renderCorrection(isCorrect) {
    questionContainer.style.display = "none";
    answerInput.value = "";
    isCorrected = true;
    var current = practising.list.words[practising.questionIndex - 1];
    var displayQuestion = practising.list.isReversed ? current.answers.map(function (a) { return a.ans; }).join(" / ") : current.word;
    if (isCorrect) {
        correct.style.display = "flex";
        correctAnswers.words.push(current);
    }
    else {
        incorrect.style.display = "flex";
        incorrect.innerHTML = "<div>\n        No!<br>The answer for <span class=\"black\">".concat(displayQuestion, "</span> was: <span class=\"green\">").concat(correctAnswer, "</span>\n        </div>");
        incorrectAnswers.words.push(current);
    }
}
function reverseList(listToReverse) {
    var list = structuredClone(listToReverse);
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
    canvasContainer.innerHTML = "<p id=\"no-data\">There is not enough data to draw a graph</p>";
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
        canvasContainer.innerHTML = "<canvas id=\"graph\" width=\"500px\" height=\"240px\"></canvas>";
        graph(lists[practising.listIndex].correctHistory, lists[practising.listIndex].words.length);
    }
    localStorage.setItem("data", JSON.stringify(lists));
}
function stringToWords(string) {
    if (!string.trim())
        return [];
    return string.split(",").map(function (pair) {
        var _a = pair.split(":"), wordPart = _a[0], answersPart = _a[1];
        if (!answersPart)
            return null;
        var answerObjects = answersPart.split("/")
            .map(function (a) { return new Answer(a.trim()); })
            .filter(function (a) { return a.ans !== ""; });
        return new Word(wordPart.trim(), answerObjects);
    }).filter(function (w) { return w !== null; });
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
    return words.map(function (w) {
        var answerString = w.answers.map(function (a) { return a.ans; }).join(" / ");
        return "".concat(w.word, ": ").concat(answerString);
    }).join(", ");
}
function random(max) {
    return Math.round(Math.random() * max);
}
function randomize(array) {
    var oldArray = structuredClone(array);
    var newArray = [];
    var randomIndex;
    while (oldArray.length > 0) {
        randomIndex = random(oldArray.length - 1);
        newArray.push(oldArray[randomIndex]);
        oldArray.splice(randomIndex, 1);
    }
    return newArray;
}
function graph(correctHistory, nQuestions) {
    var ctx = document.getElementById("graph").getContext("2d");
    var verticalK = 240 / nQuestions;
    var horizontalK = 500 / (correctHistory.length - 1);
    var maxHistory = 50;
    var lastIndex = 0;
    var gapX = 0;
    if (correctHistory.length > maxHistory) {
        lastIndex = correctHistory.length - maxHistory - 1;
        horizontalK = 500 / maxHistory;
        gapX = maxHistory;
    }
    ctx.fillStyle = "#6ab04c";
    ctx.translate(0, 240);
    ctx.moveTo(500, 0);
    ctx.beginPath();
    for (var i = correctHistory.length - 1; i >= lastIndex; i--) {
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
    for (var i = 0; i < array.length; i++) {
        if (wordEquals(array[i], w)) {
            return true;
        }
    }
    return false;
}
function wordsUnion(first, second) {
    var array = structuredClone(first);
    second.forEach(function (w) {
        if (!arrayIncludesWord(array, w)) {
            array.push(w);
        }
    });
    return array;
}
function listsUnion(lists) {
    var newList = lists[0];
    for (var i = 1; i < lists.length; i++) {
        newList = new List("Union", wordsUnion(newList.words, lists[i].words));
    }
    return newList;
}
function markExported() {
    hasUnsavedChanges = false;
    localStorage.setItem("lastExportTime", new Date().toISOString());
}
function exportListWords(selectedLists) {
    var selectedListsWords = [];
    selectedLists.forEach(function (e) {
        selectedListsWords.push(lists[e]);
    });
    var jsonData = JSON.stringify(selectedListsWords);
    var blob = new Blob([jsonData], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "lists.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    markExported();
}
function importListWords(event) {
    var _a;
    var target = event.target;
    var file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (event) {
        var _a;
        try {
            var jsonData = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            var importedLists = JSON.parse(jsonData);
            // Add imported lists to existing lists
            importedLists.forEach(function (importedList) {
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
window.addEventListener("beforeunload", function (e) {
    if (hasUnsavedChanges) {
        e.preventDefault();
    }
});
