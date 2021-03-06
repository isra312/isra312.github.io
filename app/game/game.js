const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

/// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 21;

let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(`https://opentdb.com/api.php?amount=${MAX_QUESTIONS}`)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => console.log(err));

startGame = () => {
  questionCounter = 0;
  score = 0;

  availableQuestions = [...questions];

  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);

    // go to the end page
    return window.location.assign("/app/end/end.html");
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number]
      ? currentQuestion["choice" + number]
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
      : null;

    !currentQuestion["choice" + number]
      ? (choice.parentElement.style.display = "none")
      : (choice.parentElement.style.display = "flex");
  });

  availableQuestions.splice(questionIndex, 1);

  acceptingAnswer = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    acceptingAnswer = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") incrementScore(CORRECT_BONUS);

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

const confirmExit = (btnId) => {
  const homeAddress = "/index.html";
  const highScoresAddress = "/app/highscores/highscores.html";

  var ok = confirm("Are you sure? All the progress will be lost.");
  console.log("ok", ok);

  if (!ok) return;

  console.log("btnId", btnId);

  if (btnId === "homeButton") {
    window.location.href = homeAddress;
  } else if (btnId === "highScoresButton") {
    window.location.href = highScoresAddress;
  }
};
