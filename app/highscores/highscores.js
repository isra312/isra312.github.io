const highScoresTable = document.getElementById("highScoresTable");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresTable.innerHTML = highScores
  .map((score) => {
    return `<tr class="high-score">
                <td>${score.name}</td>
                <td>${score.score}</td>
            </tr>`;
  })
  .join("");
