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

// Countdown timer function
function startTimer() {
  timerInterval = setInterval(function() {
    if (timeLeft > 0) {
      timeLeft--;
      timerSpan.textContent = timeLeft;
    } else {
      gameOver = true;
      clearInterval(timerInterval);
      alert('Time is up! Game over.');
      restartBtn.style.display = 'inline-block';
      donateBtn.style.display = 'inline-block';
    }
  }, 1000);
}

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

// Initial render with player
renderMazeWithPlayer(maze, playerRow, playerCol);
// Update the score display
const scoreSpan = document.getElementById('score');
scoreSpan.textContent = score;

// Hide the donate button at the start
const donateBtn = document.getElementById('donate-btn');
donateBtn.style.display = 'none';
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

// Listen for keydown events to move the player
// Arrow keys or WASD
window.addEventListener('keydown', function(event) {
  if (gameOver) {
    return; // Stop movement if game is over
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
        // Clear the maze box
        mazeContainer.innerHTML = '';
        // Add event listeners to the new buttons
        document.getElementById('donate-btn').onclick = function() {
          window.open('https://www.charitywater.org/donate', '_blank');
        };
        document.getElementById('restart-btn').onclick = function() {
          restartGame();
        };
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
    }
    // If it's a wall (1), do nothing (can't move)
  }
});

// Start the timer when the page loads
startTimer();

// Restart game logic as a function for reuse
function restartGame() {
  score = 0;
  timeLeft = 60;
  gameOver = false;
  // Reset player position
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 'S') {
        playerRow = row;
        playerCol = col;
      }
    }
  }
  // Reset score and timer display
  scoreSpan.textContent = score;
  timerSpan.textContent = timeLeft;
  // Redraw the maze and player
  renderMazeWithPlayer(maze, playerRow, playerCol);
  // Restart the timer
  clearInterval(timerInterval);
  startTimer();
  // Clear the win message
  document.getElementById('message-container').innerHTML = '';
}
