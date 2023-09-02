let countSpan = document.querySelector(".count span") as HTMLSpanElement;
let bulletsSpanContainer = document.querySelector(
  ".bullets .spans"
) as HTMLDivElement;
let quizArea = document.querySelector(".quiz-area") as HTMLDivElement;
let answersArea = document.querySelector(".answers-area") as HTMLDivElement;
let submitBtn = document.querySelector(".submit-button") as HTMLButtonElement;
let bullets = document.querySelector(".bullets") as HTMLDivElement;
let resultsContainer = document.querySelector(".results") as HTMLDivElement;
let countDownElement = document.querySelector(".countdown") as HTMLDivElement;

interface questions {
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  right_answer: string;
  title: string;
}

// set some options
let currentIndex: number = 0;
let rightAnswers: number = 0;
let countDownInterval: number;
const getQuestions = async () => {
  //   Fetching questions
  let response = await fetch("../question.json");
  let questions: questions[] = await response.json();
  let qCount = questions.length;
  createBullets(qCount);
  addQuestionData(questions[currentIndex], qCount);

  //   start countdown
  countdown(2, qCount);

  submitBtn.onclick = (): void => {
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

function createBullets(num: number): void {
  countSpan.innerHTML = num.toString();

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}

// question extends questions interface
interface question extends questions {
  [x: string]: any;
}

function addQuestionData(obj: question, count: number): void {
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

function checkAnswer(rAnswer: string, count: number): void {
  let answers: NodeListOf<HTMLElement> = document.getElementsByName("question");
  let theChoosenAnswer: string = "";

  for (let i = 0; i < answers.length; i++) {
    if ((answers[i] as HTMLInputElement).checked) {
      theChoosenAnswer = (answers[i] as HTMLInputElement).dataset.answer!;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets(): void {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");

  bulletsSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count: number) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitBtn.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration: number, count: number) {
  if (currentIndex < count) {
    let minutes: number | string, seconds: number | string;
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
