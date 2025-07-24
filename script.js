const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let car = { x: 180, y: 500, width: 40, height: 80 };
let enemyCars = [];
let score = 0;
let muted = false;

// Draw car
function drawCar(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 40, 80);
}

// Spawn enemy car
function spawnEnemyCar() {
  let x = Math.floor(Math.random() * 360);
  enemyCars.push({ x: x, y: -80 });
}

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCar(car.x, car.y, 'blue');

  enemyCars.forEach((enemy, index) => {
    enemy.y += 5;
    drawCar(enemy.x, enemy.y, 'red');

    // Collision
    if (
      car.x < enemy.x + 40 &&
      car.x + 40 > enemy.x &&
      car.y < enemy.y + 80 &&
      car.y + 80 > enemy.y
    ) {
      speak("Car ahead! Slow down!");
      alert("Game Over! Score: " + score);
      resetGame();
    }

    if (enemy.y > 600) {
      enemyCars.splice(index, 1);
      score++;
      document.getElementById('score').innerText = "Score: " + score;
      if (score % 5 === 0) speak("Great driving!");
    }
  });

  requestAnimationFrame(update);
}

// Reset
function resetGame() {
  enemyCars = [];
  score = 0;
  car.x = 180;
  document.getElementById('score').innerText = "Score: 0";
}

// Voice
function speak(message) {
  if (muted) return;
  document.getElementById('voiceMessage').innerText = "AI: " + message;
  let utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
}

// Move
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowLeft" && car.x > 0) car.x -= 20;
  if (e.key === "ArrowRight" && car.x < 360) car.x += 20;
});

// Spawn cars every 1.5s
setInterval(spawnEnemyCar, 1500);

// Mute toggle
document.getElementById('muteButton').addEventListener('click', () => {
  muted = !muted;
  document.getElementById('muteButton').innerText = muted ? "Unmute" : "Mute";
});

update();
