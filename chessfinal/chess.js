var pieces = document.querySelectorAll('.piece');
var square = document.querySelectorAll('.square');
var selectedSquare = null;
var turn = 'white';

for (var i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener('click', function () {
        var color = this.classList.contains('whitep') ? 'white' : 'black';
        if (turn !== color) {
            return;
        }
        if (selectedSquare) {
            selectedSquare.classList.remove('selected');
        }
        selectedSquare = this.parentNode;
        selectedSquare.classList.add('selected');
        possiblemoves(selectedSquare);
    });
}
document.querySelectorAll('.piece').forEach(piece => {
    piece.addEventListener('click', function() {
        const pieceColor = this.classList.contains('whitep') ? 'white' : 'black';
        if (canCaptureKing(pieceColor)) {
            alert('\u{1F534} ' + pieceColor.toUpperCase() + ' wins!! \u{1F534}\nBecause you did not protect your king...\nNew game will be loaded.');
            location.reload()
        }
    });
});

function removeSelected() {
    var selectedSquares = document.querySelectorAll('.possiblemove');
    selectedSquares.forEach(function (square) {
        square.classList.remove('possiblemove');
        square.removeEventListener('click', movePieceToSquare);
    });
}

function addMove(square) {
    if (!square) {
        return false; 
    }
    if (!square.firstChild) {
        square.classList.add('possiblemove');
        square.addEventListener('click', movePieceToSquare);
        return true; 
    }
    var pieceColor = square.firstChild.classList.contains('white') ? 'white' : 'black';
    var currentTurnColor = turn === 'white' ? 'white' : 'black';
    if (pieceColor !== currentTurnColor) {
        square.classList.add('possiblemove');
        square.addEventListener('click', movePieceToSquare);
        return false; 
    }
    return false; 
}
function possiblemoves(square) {
    removeSelected();
    var pos = square.classList[0];
    var row = parseInt(pos.charAt(0));
    var col = pos.charAt(1);
    var color = square.querySelector('.piece').classList.contains('whitep') ? 'white' : 'black';
    if (!square.querySelector('.wpawn') && !square.querySelector('.bpawn') && (square.querySelector('.wrook') || square.querySelector('.brook'))) {
        // Rook movements 
        // Horizontal moves
        for (var i = col.charCodeAt(0) + 1; i <= 'H'.charCodeAt(0); i++) {
            var nextSquare = document.querySelector('.pos-' + row + String.fromCharCode(i));
            if (!addMove(nextSquare)) break;
        }
        for (var i = col.charCodeAt(0) - 1; i >= 'A'.charCodeAt(0); i--) {
            var nextSquare = document.querySelector('.pos-' + row + String.fromCharCode(i));
            if (!addMove(nextSquare)) break;
        }
        // Vertical moves
        for (var i = row + 1; i <= 8; i++) {
            var nextSquare = document.querySelector('.pos-' + i + col);
            if (!addMove(nextSquare)) break;
        }
        for (var i = row - 1; i >= 1; i--) {
            var nextSquare = document.querySelector('.pos-' + i + col);
            if (!addMove(nextSquare)) break;
        }
    }
    //checking for check
    function isKingInCheck(color, board) {
        const enemyColor = color === 'white' ? 'black' : 'white';
        const enemyPieces = board.querySelectorAll('.' + enemyColor + 'p');
      
        for (let i = 0; i < enemyPieces.length; i++) {
          const possibleMoves = getPossibleMoves(enemyPieces[i]);
          if (possibleMoves.some(move => move.square === board.querySelector('.king.' + color))) {
            return true;
          }
        }
      
        return false;
      }
      function isKingInCheckmate(color, board) {
        if (!isKingInCheck(color, board)) {
          return false;
        }
      
        const possibleMoves = getAllPossibleMoves(color, board);
      
        for (let i = 0; i < possibleMoves.length; i++) {
          const move = possibleMoves[i];
          const newBoard = makeMove(move, board);
      
          if (!isKingInCheck(color, newBoard)) {
            return false;
          }
      
          restoreBoard(move, newBoard);
        }
      
        return true;
      }
    // Pawn movements
    if (square.querySelector('.wpawn')) {
        var nextSquare = document.querySelector('.pos-' + (row + 1) + col);
        if (!addMove(nextSquare)) return;

        var leftDiagonalSquare = document.querySelector('.pos-' + (row + 1) + String.fromCharCode(col.charCodeAt(0) - 1));
        var rightDiagonalSquare = document.querySelector('.pos-' + (row + 1) + String.fromCharCode(col.charCodeAt(0) + 1));
        if (leftDiagonalSquare && leftDiagonalSquare.firstChild && !leftDiagonalSquare.firstChild.classList.contains('whitep')) {
            leftDiagonalSquare.classList.add('possiblemove');
            leftDiagonalSquare.addEventListener('click', movePieceToSquare);
        }
        if (rightDiagonalSquare && rightDiagonalSquare.firstChild && !rightDiagonalSquare.firstChild.classList.contains('whitep')) {
            rightDiagonalSquare.classList.add('possiblemove');
            rightDiagonalSquare.addEventListener('click', movePieceToSquare);
        }
    } else if (square.querySelector('.bpawn')) {
        var nextSquare = document.querySelector('.pos-' + (row - 1) + col);
        if (!addMove(nextSquare)) return;

        var leftDiagonalSquare = document.querySelector('.pos-' + (row - 1) + String.fromCharCode(col.charCodeAt(0) + 1));
        var rightDiagonalSquare = document.querySelector('.pos-' + (row - 1) + String.fromCharCode(col.charCodeAt(0) - 1));
        if (leftDiagonalSquare && leftDiagonalSquare.firstChild && !leftDiagonalSquare.firstChild.classList.contains('blackp')) {
            leftDiagonalSquare.classList.add('possiblemove');
            leftDiagonalSquare.addEventListener('click', movePieceToSquare);
        }
        if (rightDiagonalSquare && rightDiagonalSquare.firstChild && !rightDiagonalSquare.firstChild.classList.contains('blackp')) {
            rightDiagonalSquare.classList.add('possiblemove');
            rightDiagonalSquare.addEventListener('click', movePieceToSquare);
        }
    }

    // Knight movements
    if (square.querySelector('.wknight') || square.querySelector('.bknight')) {
        var knightMoves = [
            { row: row + 2, col: String.fromCharCode(col.charCodeAt(0) + 1) },
            { row: row + 2, col: String.fromCharCode(col.charCodeAt(0) - 1) },
            { row: row - 2, col: String.fromCharCode(col.charCodeAt(0) + 1) },
            { row: row - 2, col: String.fromCharCode(col.charCodeAt(0) - 1) },
            { row: row + 1, col: String.fromCharCode(col.charCodeAt(0) + 2) },
            { row: row + 1, col: String.fromCharCode(col.charCodeAt(0) - 2) },
            { row: row - 1, col: String.fromCharCode(col.charCodeAt(0) + 2) },
            { row: row - 1, col: String.fromCharCode(col.charCodeAt(0) - 2) }
        ];

        for (var i = 0; i < knightMoves.length; i++) {
            var nextRow = knightMoves[i].row;
            var nextCol = knightMoves[i].col;
            if (nextRow >= 1 && nextRow <= 8 && nextCol >= 'A' && nextCol <= 'H') {
                var nextSquare = document.querySelector('.pos-' + nextRow + nextCol);
                if (!nextSquare.firstChild || (nextSquare.firstChild && !nextSquare.firstChild.classList.contains(color.charAt(0)))) {
                    nextSquare.classList.add('possiblemove');
                    nextSquare.addEventListener('click', movePieceToSquare);
                }
            }
        }
    }

    // Bishop movements
    if (square.querySelector('.wbishop') || square.querySelector('.bbishop')) {
        // Top-Right diagonal
        for (var i = 1; i <= 7; i++) {
            var nextRow = row + i;
            var nextCol = String.fromCharCode(col.charCodeAt(0) + i);
            if (!addMove(document.querySelector('.pos-' + nextRow + nextCol))) break;
        }

        // Top-Left diagonal
        for (var i = 1; i <= 7; i++) {
            var nextRow = row + i;
            var nextCol = String.fromCharCode(col.charCodeAt(0) - i);
            if (!addMove(document.querySelector('.pos-' + nextRow + nextCol))) break;
        }

        // Bottom-Right diagonal
        for (var i = 1; i <= 7; i++) {
            var nextRow = row - i;
            var nextCol = String.fromCharCode(col.charCodeAt(0) + i);
            if (!addMove(document.querySelector('.pos-' + nextRow + nextCol))) break;
        }

        // Bottom-Left diagonal
        for (var i = 1; i <= 7; i++) {
            var nextRow = row - i;
            var nextCol = String.fromCharCode(col.charCodeAt(0) - i);
            if (!addMove(document.querySelector('.pos-' + nextRow + nextCol))) break;
        }
    }

    // King movements
if (square.querySelector('.wking') || square.querySelector('.bking')) {
    var kingMoves = [
        { row: row + 1, col: col },
        { row: row - 1, col: col },
        { row: row, col: String.fromCharCode(col.charCodeAt(0) + 1) },
        { row: row, col: String.fromCharCode(col.charCodeAt(0) - 1) },
        { row: row + 1, col: String.fromCharCode(col.charCodeAt(0) + 1) },
        { row: row + 1, col: String.fromCharCode(col.charCodeAt(0) - 1) },
        { row: row - 1, col: String.fromCharCode(col.charCodeAt(0) + 1) },
        { row: row - 1, col: String.fromCharCode(col.charCodeAt(0) - 1) }
    ];

    for (var i = 0; i < kingMoves.length; i++) {
        var nextRow = kingMoves[i].row;
        var nextCol = kingMoves[i].col;
        if (nextRow >= 1 && nextRow <= 8 && nextCol >= 'A' && nextCol <= 'H') {
            var nextSquare = document.querySelector('.pos-' + nextRow + nextCol);
            if (!nextSquare.firstChild || (nextSquare.firstChild && !nextSquare.firstChild.classList.contains(color.charAt(0)))) {
                nextSquare.classList.add('possiblemove');
                nextSquare.addEventListener('click', movePieceToSquare);
            }
        }
    }
}


    // Queen movements
    if (square.querySelector('.wqueen') || square.querySelector('.bqueen')) {
        // Rook-like movements (horizontal and vertical)
        for (var i = col.charCodeAt(0) + 1; i <= 'H'.charCodeAt(0); i++) {
            var nextSquare = document.querySelector('.pos-' + row + String.fromCharCode(i));
            if (!addMove(nextSquare)) break;
        }
        for (var i = col.charCodeAt(0) - 1; i >= 'A'.charCodeAt(0); i--) {
            var nextSquare = document.querySelector('.pos-' + row + String.fromCharCode(i));
            if (!addMove(nextSquare)) break;
        }
        for (var i = row + 1; i <= 8; i++) {
            var nextSquare = document.querySelector('.pos-' + i + col);
            if (!addMove(nextSquare)) break;
        }
        for (var i = row - 1; i >= 1; i--) {
            var nextSquare = document.querySelector('.pos-' + i + col);
            if (!addMove(nextSquare)) break;
        }
        // Bishop-like movements
        for (var i = 1; i <= Math.min(8 - row, 'H'.charCodeAt(0) - col.charCodeAt(0)); i++) {
            var nextSquare = document.querySelector('.pos-' + (row + i) + String.fromCharCode(col.charCodeAt(0) + i));
            if (!addMove(nextSquare)) break;
        }
        for (var i = 1; i <= Math.min(8 - row, col.charCodeAt(0) - 'A'.charCodeAt(0)); i++) {
            var nextSquare = document.querySelector('.pos-' + (row + i) + String.fromCharCode(col.charCodeAt(0) - i));
            if (!addMove(nextSquare)) break;
        }
        for (var i = 1; i <= Math.min(row - 1, 'H'.charCodeAt(0) - col.charCodeAt(0)); i++) {
            var nextSquare = document.querySelector('.pos-' + (row - i) + String.fromCharCode(col.charCodeAt(0) + i));
            if (!addMove(nextSquare)) break;
        }
        for (var i = 1; i <= Math.min(row - 1, col.charCodeAt(0) - 'A'.charCodeAt(0)); i++) {
            var nextSquare = document.querySelector('.pos-' + (row - i) + String.fromCharCode(col.charCodeAt(0) - i));
            if (!addMove(nextSquare)) break;
        }
    }
}

function movePieceToSquare() {
    var targetSquare = this;
    if (!targetSquare.classList.contains('possiblemove')) return;
    if (selectedSquare && selectedSquare !== targetSquare) {
        if (targetSquare.firstChild) {
            targetSquare.removeChild(targetSquare.firstChild);
        }
        targetSquare.appendChild(selectedSquare.firstChild);
        removeSelected();
        selectedSquare.classList.remove('selected');
        selectedSquare = null;

        // Switch turn
        turn = turn === 'white' ? 'black' : 'white';



    }
}
function canCaptureKing(color) {
    const opponentKing = document.querySelector('.bking');
    const kingColor = color === 'white' ? 'bking' : 'wking';
    const possibleMoves = opponentKing.parentElement.classList.contains('possiblemove');

    return possibleMoves;
}

