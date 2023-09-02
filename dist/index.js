"use strict";
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
// set some options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
const getQuestions = async () => {
    //   Fetching questions
    let response = await fetch("../question.json");
    let questions = await response.json();
    let qCount = questions.length;
    createBullets(qCount);
    addQuestionData(questions[currentIndex], qCount);
    //   start countdown
    countdown(2, qCount);
    submitBtn.onclick = () => {
        // Get the right answer
        let theRightAnswer = questions[currentIndex].right_answer;
        // Increase index
        currentIndex++;
        // Check answer
        checkAnswer(theRightAnswer, qCount);
        // Remove previous question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        // Add question data
        addQuestionData(questions[currentIndex], qCount);
        // Handle bullets classes
        handleBullets();
        // Show results
        showResults(qCount);
        //   start countdown
        clearInterval(countDownInterval);
        countdown(2, qCount);
    };
};
getQuestions();
function createBullets(num) {
    countSpan.innerHTML = num.toString();
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if (i === 0) {
            theBullet.className = "on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
}
function addQuestionData(obj, count) {
    if (currentIndex < count) {
        let questionTitle = document.createElement("h2");
        questionTitle.innerText = obj.title;
        quizArea.appendChild(questionTitle);
        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";
            // * Create radio input
            let radioInput = document.createElement("input");
            // Add type + name + id + data attribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer-${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            if (i === 1) {
                radioInput.checked = true;
            }
            // Create label
            let answerLabel = document.createElement("label");
            answerLabel.htmlFor = `answer-${i}`;
            answerLabel.innerText = obj[`answer_${i}`];
            // Append radioInput and label
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(answerLabel);
            answersArea.appendChild(mainDiv);
        }
    }
}
function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer = "";
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    bulletsSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}
function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        bullets.remove();
        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        }
        else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        }
        else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }
}
function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(() => {
            minutes = parseInt((duration / 60).toString());
            seconds = parseInt((duration % 60).toString());
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countDownElement.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitBtn.click();
            }
        }, 1000);
    }
}
