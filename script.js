// Function to generate a complete Sudoku grid
function generateSudoku() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillGrid(grid);
    return grid;
}

// Recursive function to fill the Sudoku grid
function fillGrid(grid) {
    const empty = findEmptyLocation(grid);
    if (!empty) return true; // No empty location means grid is filled

    const [row, col] = empty;
    const numbers = shuffleArray([...Array(9).keys()].map(n => n + 1)); // Shuffle numbers 1-9

    for (let num of numbers) {
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0; // Backtrack
        }
    }

    return false; // Trigger backtracking
}

// Helper function to find an empty location in the grid
function findEmptyLocation(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) return [row, col];
        }
    }
    return null;
}

// Helper function to check if a number is valid in a given location
function isValid(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num || 
            grid[Math.floor(row / 3) * 3 + Math.floor(x / 3)][Math.floor(col / 3) * 3 + x % 3] === num) {
            return false;
        }
    }
    return true;
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to generate a Sudoku puzzle by removing numbers from a completed grid
function generatePuzzle() {
    const grid = generateSudoku();
    const puzzle = grid.map(row => row.slice()); // Clone the grid
    const numCellsToRemove = 40; // Number of cells to remove

    for (let i = 0; i < numCellsToRemove; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        } while (puzzle[row][col] === 0);

        puzzle[row][col] = 0;
    }

    fillGrid(grid); // Refill the grid for solving purposes
    return { puzzle, solution: grid };
}

// Function to fill the grid with the puzzle values
function fillGridWithPuzzle(puzzle) {
    const inputs = document.querySelectorAll('table input');
    puzzle.forEach((row, rIndex) => {
        row.forEach((value, cIndex) => {
            const index = rIndex * 9 + cIndex;
            inputs[index].value = value === 0 ? '' : value;
            inputs[index].disabled = value !== 0; // Disable cells with initial values
        });
    });
}

// Function to solve the Sudoku puzzle
function solvePuzzle() {
    const inputs = document.querySelectorAll('table input');
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    inputs.forEach((input, index) => {
        const value = parseInt(input.value, 10);
        if (!isNaN(value)) {
            grid[Math.floor(index / 9)][index % 9] = value;
        }
    });

    if (fillGrid(grid)) {
        fillGridWithPuzzle(grid);
    } else {
        alert("No solution found.");
    }
}

// Function to check the current Sudoku status
function checkSudokuStatus() {
    const inputs = document.querySelectorAll('table input');
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    let isComplete = true;

    inputs.forEach((input, index) => {
        const value = parseInt(input.value, 10);
        if (!isNaN(value)) {
            grid[Math.floor(index / 9)][index % 9] = value;
        } else {
            isComplete = false;
        }
    });

    const isValidSudoku = isComplete && fillGrid([...grid.map(row => row.slice())]);

    const statusButton = document.getElementById('statusIndicator');
    if (isValidSudoku) {
        statusButton.style.backgroundColor = 'green';
    } else {
        statusButton.style.backgroundColor = 'red';
        alert("The entered Sudoku problem is incorrect.");
    }
}

// Event listeners
document.getElementById('getPuzzle').addEventListener('click', () => {
    const { puzzle, solution } = generatePuzzle();
    fillGridWithPuzzle(puzzle);
    window.solution = solution; // Store the solution for solving
    //checkSudokuStatus(); // Check the status after generating a new puzzle
});

document.getElementById('solve').addEventListener('click', () => {
    solvePuzzle();
    checkSudokuStatus(); // Check the status after solving
});

document.getElementById('statusIndicator').addEventListener('click', checkSudokuStatus);
