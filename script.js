const solveBtn = document.getElementById('solve-btn');
const boardSizeInput = document.getElementById('board-size');
const solvingBoardDiv = document.getElementById('solving-board');
const solutionsDiv = document.getElementById('solutions');

let board, n, solutions;

solveBtn.addEventListener('click', () => {
    const boardSizeValue = boardSizeInput.value;
    
    if (boardSizeValue === "") {
        alert('Please enter a board size');
        return;
    }

    n = parseInt(boardSizeValue);
    if (n < 1 || n > 10) {
        alert('Please enter a board size between 1 and 10');
        return;
    }
    startSolving();
});

async function startSolving() {
    solvingBoardDiv.innerHTML = '';
    solutionsDiv.innerHTML = '';
    board = Array(n).fill().map(() => Array(n).fill('.'));
    solutions = [];
    
    solveBtn.disabled = true;
    displayBoard(solvingBoardDiv, board);
    await backtrack(0);

    if (solutions.length === 0) {
        solutionsDiv.innerHTML = '<p class="no-solution">No possible solutions</p>';
    }

    solveBtn.disabled = false;
}

async function backtrack(row) {
    if (row === n) {
        solutions.push(board.map(row => row.slice()));
        displayBoard(solutionsDiv, board);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Show solution for a second before backtracking
        return;
    }

    for (let col = 0; col < n; col++) {
        if (isValid(row, col)) {
            board[row][col] = 'Q';
            await updateBoard(row, col, true);
            
            await backtrack(row + 1);
            
            board[row][col] = '.';
            await updateBoard(row, col, false);
        }
    }
}

function isValid(row, col) {
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 'Q') return false;
    }

    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 'Q') return false;
    }

    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
        if (board[i][j] === 'Q') return false;
    }

    return true;
}

function displayBoard(container, board) {
    const boardDiv = document.createElement('div');
    boardDiv.className = 'board';
    boardDiv.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

    board.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = rowIndex % 2 === 0 ? 'row-even' : '';
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.id = `cell-${rowIndex}-${colIndex}`;
            cellDiv.textContent = cell === 'Q' ? '♛' : '';
            rowDiv.appendChild(cellDiv);
        });
        boardDiv.appendChild(rowDiv);
    });

    container.appendChild(boardDiv);
}

async function updateBoard(row, col, placing) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
        cell.textContent = placing ? '♛' : '';
        cell.classList.toggle('highlight', placing);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
}
