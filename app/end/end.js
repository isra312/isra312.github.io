const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;
console.log(highScores);

finalScore.innerText = mostRecentScore;

username.disabled = mostRecentScore == 0;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value || mostRecentScore == 0;
});
saveHighScore = e => {

   e.preventDefault();
    const score = {
       score: mostRecentScore,
       name: username.value
   }; 
   highScores.push(score);

   highScores.sort((a, b) => b.score - a.score );
   highScores.splice(5);

   localStorage.setItem("highScores", JSON.stringify(highScores));
   window.location.assign("/");
}