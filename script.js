// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Create a 2D array to represent the maze
// 0 = open path, 1 = wall, 'R' = rock, 'S' = start, 'E' = end
const maze = [
  ['S', 0, 0, 0, 0, 0, 0],
  [1,   1, 1, 0, 1, 1, 1],
  [0,   0, 0, 0, 0, 'R', 0], // Dead end with a rock at (2,5)
  [0,   1, 1, 1, 1, 1, 0],
  [0,   0, 0, 0, 0, 0, 'E']
];

// You can log the maze to see its structure in the console
console.log(maze);

// Find the starting position ('S') in the maze
let playerRow = 0;
let playerCol = 0;
for (let row = 0; row < maze.length; row++) {
  for (let col = 0; col < maze[row].length; col++) {
    if (maze[row][col] === 'S') {
      playerRow = row;
      playerCol = col;
    }
  }
}

// Score variable for tracking points
let score = 0;

// Timer variable for countdown
let timeLeft = 60;
let gameOver = false; // Track if the game is over
let timerInterval; // Use a single timer variable
const timerSpan = document.getElementById('timer');
timerSpan.textContent = timeLeft;

// Hide the donate button at the start
const donateBtn = document.getElementById('donate-btn');
donateBtn.style.display = 'none';

// Difficulty settings
const difficulties = {
  easy: 15,
  normal: 10,
  hard: 5
};

// Track if the game has started (after difficulty selection)
let gameStarted = false;

// Get difficulty buttons
const difficultyContainer = document.getElementById('difficulty-container');
const easyBtn = document.getElementById('easy-btn');
const normalBtn = document.getElementById('normal-btn');
const hardBtn = document.getElementById('hard-btn');

// Hide maze and scoreboard until difficulty is selected
document.getElementById('maze-container').style.display = 'none';
document.getElementById('scoreboard').style.display = 'none';
document.getElementById('timer-container').style.display = 'none';
document.getElementById('level-container').style.display = 'none';

// Function to start the game with selected difficulty
function selectDifficulty(level) {
  // Set timeLeft based on difficulty
  timeLeft = difficulties[level];
  timerSpan.textContent = timeLeft;
  // Show maze and scoreboard
  document.getElementById('maze-container').style.display = 'grid';
  document.getElementById('scoreboard').style.display = 'block';
  document.getElementById('timer-container').style.display = 'block';
  document.getElementById('level-container').style.display = 'block';
  // Hide difficulty buttons
  difficultyContainer.style.display = 'none';
  // Start the timer
  gameStarted = true;
  startTimer();
}

// Add event listeners to difficulty buttons
easyBtn.onclick = function() { selectDifficulty('easy'); };
normalBtn.onclick = function() { selectDifficulty('normal'); };
hardBtn.onclick = function() { selectDifficulty('hard'); };

// Function to render the maze on the screen
function renderMaze(mazeArray) {
  // Get the maze container div from the HTML
  const mazeContainer = document.getElementById('maze-container');
  // Clear anything already inside
  mazeContainer.innerHTML = '';

  // Loop through each row in the maze
  for (let row = 0; row < mazeArray.length; row++) {
    // Create a div for this row
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex'; // Make cells appear in a row

    // Loop through each cell in the row
    for (let col = 0; col < mazeArray[row].length; col++) {
      const cell = mazeArray[row][col];
      const cellDiv = document.createElement('div');
      cellDiv.style.width = '40px';
      cellDiv.style.height = '40px';
      cellDiv.style.display = 'flex';
      cellDiv.style.alignItems = 'center';
      cellDiv.style.justifyContent = 'center';
      cellDiv.style.border = '1px solid #ccc';
      cellDiv.style.fontSize = '24px';

      // Set color or icon based on cell type
      if (cell === 0) {
        // Open path
        cellDiv.style.backgroundColor = '#fff';
        cellDiv.textContent = '';
      } else if (cell === 1) {
        // Wall
        cellDiv.style.backgroundColor = '#2E9DF7'; // blue
        cellDiv.textContent = '';
      } else if (cell === 'R') {
        // Rock
        cellDiv.style.backgroundColor = '#FFC907'; // yellow
        cellDiv.textContent = '🪨';
      } else if (cell === 'S') {
        // Start
        cellDiv.style.backgroundColor = '#4FCB53'; // green
        cellDiv.textContent = '💧'; // Water droplet for start
      } else if (cell === 'E') {
        // End
        cellDiv.style.backgroundColor = '#F5402C'; // red
        cellDiv.textContent = '🏠'; // House for end
      }

      // Add the cell to the row
      rowDiv.appendChild(cellDiv);
    }
    // Add the row to the maze container
    mazeContainer.appendChild(rowDiv);
  }
}

// Function to render the maze and player
function renderMazeWithPlayer(mazeArray, playerRow, playerCol) {
  const mazeContainer = document.getElementById('maze-container');
  mazeContainer.innerHTML = '';
  // Set up CSS grid for the maze
  mazeContainer.style.display = 'grid';
  mazeContainer.style.gridTemplateRows = `repeat(${mazeArray.length}, 40px)`;
  mazeContainer.style.gridTemplateColumns = `repeat(${mazeArray[0].length}, 40px)`;
  for (let row = 0; row < mazeArray.length; row++) {
    for (let col = 0; col < mazeArray[row].length; col++) {
      const cell = mazeArray[row][col];
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      // Add class based on cell type
      if (row === playerRow && col === playerCol) {
        cellDiv.classList.add('cell-player');
        // Use local yellow jerry can logo as the player icon
        cellDiv.innerHTML = `<img src="img/water-can-trans.png" alt="Jerry Can" class="jerrycan-icon">`;
      } else if (cell === 0) {
        cellDiv.classList.add('cell-path');
        cellDiv.textContent = '';
      } else if (cell === 1) {
        cellDiv.classList.add('cell-wall');
        cellDiv.textContent = '';
      } else if (cell === 'R') {
        cellDiv.classList.add('cell-rock');
        cellDiv.textContent = '🪨';
      } else if (cell === 'S') {
        cellDiv.classList.add('cell-start');
        cellDiv.textContent = '💧'; // Water droplet for start
      } else if (cell === 'E') {
        cellDiv.classList.add('cell-end');
        cellDiv.textContent = '🏠'; // House for end
      }
      mazeContainer.appendChild(cellDiv);
    }
  }
}

// Initial render with player (but maze is hidden until difficulty is chosen)
renderMazeWithPlayer(maze, playerRow, playerCol);
// Update the score display
const scoreSpan = document.getElementById('score');
scoreSpan.textContent = score;

// Create and hide the restart button at the start
let restartBtn = document.getElementById('restart-btn');
if (!restartBtn) {
  restartBtn = document.createElement('button');
  restartBtn.id = 'restart-btn';
  restartBtn.textContent = 'Restart';
  restartBtn.style.display = 'none';
  // Insert after donate button
  donateBtn.parentNode.insertBefore(restartBtn, donateBtn.nextSibling);
}

// List of random water facts
const waterFacts = [
  'Nearly 1 in 10 people worldwide lack access to clean water.',
  'Women and girls spend 200 million hours every day collecting water.',
  'Dirty water kills more people every year than all forms of violence, including war.',
  'Access to clean water can improve health, education, and income.',
  'Every $1 invested in clean water can yield $4–$12 in economic returns.'
];

// Get audio elements for sound effects
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

// Countdown timer function
function startTimer() {
  // Clear any previous timer to avoid multiple intervals
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    // Only count down if the game is started and not over
    if (gameStarted && !gameOver && timeLeft > 0) {
      timeLeft--;
      timerSpan.textContent = timeLeft;
      // Debug: log the timer value
      // console.log(`Timer: ${timeLeft}`);
      if (timeLeft === 0) {
        gameOver = true;
        clearInterval(timerInterval);
        alert('Time is up! Game over.');
        // Play lose sound effect after alert (so browser allows it)
        if (loseSound) {
          loseSound.currentTime = 0;
          loseSound.play().catch(() => {}); // Play sound, ignore errors
        }
        // Show restart and donate buttons if you want, or reset game
        restartGame();
      }
    }
  }, 1000);
}

// Track how many times the player has hit the rock
let rockHits = 0;

// Listen for keydown events to move the player
// Arrow keys or WASD
window.addEventListener('keydown', function(event) {
  // Only allow movement after game has started
  if (!gameStarted || gameOver) {
    return; // Stop movement if game is not started or is over
  }
  let newRow = playerRow;
  let newCol = playerCol;
  if (event.key === 'ArrowUp' || event.key === 'w') {
    newRow--;
  } else if (event.key === 'ArrowDown' || event.key === 's') {
    newRow++;
  } else if (event.key === 'ArrowLeft' || event.key === 'a') {
    newCol--;
  } else if (event.key === 'ArrowRight' || event.key === 'd') {
    newCol++;
  } else {
    return; // Ignore other keys
  }
  // Check if new position is inside the maze
  if (newRow >= 0 && newRow < maze.length && newCol >= 0 && newCol < maze[0].length) {
    // Only move if the cell is open (0) or end ('E')
    if (maze[newRow][newCol] === 0) {
      playerRow = newRow;
      playerCol = newCol;
      renderMazeWithPlayer(maze, playerRow, playerCol);
    } else if (maze[newRow][newCol] === 'E') {
      // Player reached the goal
      playerRow = newRow;
      playerCol = newCol;
      renderMazeWithPlayer(maze, playerRow, playerCol);
      score += 10; // Add 10 points for reaching the goal
      score += timeLeft; // Add remaining time as bonus
      scoreSpan.textContent = score;
      gameOver = true; // Stop the game
      clearInterval(timerInterval); // Stop the timer
      // Add flash animation to maze container
      const mazeContainer = document.getElementById('maze-container');
      mazeContainer.classList.add('flash');
      setTimeout(function() {
        mazeContainer.classList.remove('flash');
        // Hide the maze box so only the congratulations section is visible
        mazeContainer.style.display = 'none';
        // Show a win message above the maze with centered buttons
        const messageContainer = document.getElementById('message-container');
        const randomFact = waterFacts[Math.floor(Math.random() * waterFacts.length)];
        messageContainer.innerHTML = `<div style="padding:20px;text-align:center;">
          <h2>Congratulations! You reached the goal. 🎉</h2>
          <p>Your final score: <strong>${score}</strong></p>
          <p><em>Water Fact:</em> ${randomFact}</p>
          <div class='button-container'>
            <button id='donate-btn'>Donate</button>
            <button id='restart-btn'>Restart</button>
          </div>
        </div>`;
        // Add event listeners to the new buttons
        document.getElementById('donate-btn').onclick = function() {
          window.open('https://www.charitywater.org/donate', '_blank');
        };
        document.getElementById('restart-btn').onclick = function() {
          restartGame();
        };
        // Play win sound effect after DOM updates (so browser allows it)
        if (winSound) {
          winSound.currentTime = 0;
          winSound.play().catch(() => {}); // Play sound, ignore errors
        }
      }, 700); // Match flash animation duration
    } else if (maze[newRow][newCol] === 'R') {
      // If player tries to move into a rock, subtract 5 points
      score -= 5;
      scoreSpan.textContent = score;
      // Add shake animation to maze container
      const mazeContainer = document.getElementById('maze-container');
      mazeContainer.classList.add('shake');
      setTimeout(function() {
        mazeContainer.classList.remove('shake');
      }, 400); // Match shake animation duration

      // Track how many times the rock has been hit
      rockHits++;
      // Debug: log rock hits
      // console.log(`Rock hits: ${rockHits}`);
      // If hit twice, break the rock and turn it into an open path
      if (rockHits === 2) {
        maze[newRow][newCol] = 0; // Break the rock
        // Show a message to the player
        alert('You broke the rock! You can now go through.');
        // Redraw the maze to show the broken rock
        renderMazeWithPlayer(maze, playerRow, playerCol);
      }
    }
    // If it's a wall (1), do nothing (can't move)
  }
});

// Restart game logic as a function for reuse
function restartGame() {
  score = 0;
  gameOver = false;
  gameStarted = false;
  // Reset player position
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 'S') {
        playerRow = row;
        playerCol = col;
      }
    }
  }
  // Reset rock if it was broken
  maze[2][5] = 'R';
  rockHits = 0;
  // Hide maze and scoreboard until difficulty is selected again
  document.getElementById('maze-container').style.display = 'none';
  document.getElementById('scoreboard').style.display = 'none';
  document.getElementById('timer-container').style.display = 'none';
  document.getElementById('level-container').style.display = 'none';
  // Show difficulty buttons again
  difficultyContainer.style.display = 'block';
  // Reset score and timer display
  scoreSpan.textContent = score;
  timerSpan.textContent = '';
  // Redraw the maze and player
  renderMazeWithPlayer(maze, playerRow, playerCol);
  // Stop any running timer
  clearInterval(timerInterval);
  // Clear the win message
  document.getElementById('message-container').innerHTML = '';
}
