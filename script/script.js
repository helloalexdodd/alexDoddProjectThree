const checkers = {};
// an empty array to create our boardGrid inside of
checkers.boardGrid = [];
// an empty array to create our playerPosition index inside of
checkers.playerPosition = [];
// empty arrays to hold x and y axis
checkers.boardx = [];
checkers.boardy = [];
// variables to hold clicked board positions
checkers.xy;
checkers.storedxy;
// variables to hold each player's move count
checkers.playerOneCounter = 0;
checkers.playerTwoCounter = 0;
// variable to hold each player's eat count
checkers.playerOneEatCounter = 0;
checkers.playerTwoEatCounter = 0;
// some useful variable declarations
checkers.$instructionsBox = $(`.instructions-box`);
checkers.$instructions = $(`.instructions`)
checkers.$gameboard = $(`#game-board`);
checkers.$h2 = $(`h2`);
checkers.$h3 = $(`h3`);
// function for setting up the board by looping through nested arrays and creating divs. also fills empty global divs for access to x and y axis
checkers.setup = (rows, cols) => {

	for (let i = 0; i < rows; i++) {
		checkers.boardGrid[i] = [];
		checkers.playerPosition[i] = [];
		checkers.boardx[i] = i;
		checkers.boardy[i] = [];
		let n = String.fromCharCode(104 - i);
		for (let j = 0; j < cols; j++) {
			checkers.playerPosition[i][j] = 0;
			checkers.boardy[j] = j;
			if (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) {
				checkers.boardGrid[i][j] = `<div id="${i}_${j}" class="white-square square" role="button"></div>`
			} else {
				checkers.boardGrid[i][j] = `<div id="${i}_${j}" class="black-square square" tabIndex="${i + 1}_${j + 2}" aria-label="${n}${j + 1}" role="button"></div>`
			};
		}
	}
	// looping through the boardGrid array and appending the divs to the main game-board
	checkers.boardGrid.forEach((row) => {
		checkers.$gameboard.append(`<div class="row">${row.join('')}</div>`)
	});
};
// function for looping through the boardGrid array and placing the game pieces in their starting positions
checkers.setupPieces = (rows, cols) => {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i <= 2) {
				let cellID = `#${i}_${j}`;
				$(`#${i}_${j}`).addClass(`black-piece`);
				checkers.playerPosition[i][j] = 1;
			} else if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i >= 5) {
				let cellID = `#${i}_${j}`;
				$(cellID).addClass(`red-piece`);
				checkers.playerPosition[i][j] = 2;
			}
		}
	};
};
// function for switching players
checkers.playerSwitch = () => {
	if (checkers.$gameboard.hasClass(`player-two`)) {
		checkers.$h2.toggleClass(`player-two-turn`);
		checkers.$h3.toggleClass(`player-two-turn`)
	};
	checkers.$h2.toggleClass(`player-one-turn`);
	checkers.$h3.toggleClass(`player-one-turn`);
	checkers.$h2.toggleClass(`player-turn`);
	checkers.$gameboard.toggleClass(`player-one player-two`);
};
// function that alerts to the winner that they are the best
checkers.winnerAlert = (winnerMessage) => {
	checkers.$gameboard.append(`<div class="winner">${winnerMessage}</div>`);
	setTimeout(function () {
	}, 2000);
};
// add a move onto the PlayerOneCounter and display it to the user
checkers.addToPlayerCounter = () => {
	if (checkers.$gameboard.hasClass(`player-two`)) {
		checkers.playerOneCounter = checkers.playerOneCounter + 1;
		$('.player-one-counter').text(checkers.playerOneCounter);
	} else {
		checkers.playerTwoCounter = checkers.playerTwoCounter + 1;
		$('.player-two-counter').text(checkers.playerTwoCounter);
	}
};
// add an opponent piece onto the PlayerOneEatCounter and display it to the user
checkers.addToPlayerEatCounter = () => {
	if (checkers.$gameboard.hasClass(`player-one`)) {
		checkers.playerOneEatCounter = checkers.playerOneEatCounter + 1
		$('.player-one-eat-counter').text(checkers.playerOneEatCounter);
	} else {
		checkers.playerTwoEatCounter = checkers.playerTwoEatCounter + 1
		$('.player-two-eat-counter').text(checkers.playerTwoEatCounter);
	}
	if (checkers.playerOneEatCounter === 12 || checkers.playerTwoEatCounter === 12) {
		let winnerMessage = `You Win!`
		checkers.winnerAlert(winnerMessage);
	}
};
// function for checking if there's an opponent piece on jump when moving down and to the left
checkers.checkForOpponentPiece = (cellValue, storedxy, direction) => {
	let originSquareX;
	let originSquareY;
	let opponentSquareX;
	let opponentSquareY;

	switch (direction) {
		case `downLeft`:
			originSquareX = storedxy[0] - 2;
			originSquareY = storedxy[1] + 2;
			opponentSquareX = storedxy[0] - 1;
			opponentSquareY = storedxy[1] + 1;
			break;
		case `downRight`:
			originSquareX = storedxy[0] - 2;
			originSquareY = storedxy[1] - 2;
			opponentSquareX = storedxy[0] - 1;
			opponentSquareY = storedxy[1] - 1;
			break;
		case `upLeft`:
			originSquareX = storedxy[0] + 2;
			originSquareY = storedxy[1] + 2;
			opponentSquareX = storedxy[0] + 1;
			opponentSquareY = storedxy[1] + 1;
			break;
		case `upRight`:
			originSquareX = storedxy[0] + 2;
			originSquareY = storedxy[1] - 2;
			opponentSquareX = storedxy[0] + 1;
			opponentSquareY = storedxy[1] - 1;
			break;
	}
	// making an array of the origin of the player
	const originSquarePosition = [];
	originSquarePosition.push(originSquareX, originSquareY);
	// turning that array into an ID
	const originDOMId = originSquarePosition.join(`_`);
	const $originDOMId = $(`#${originDOMId}`);
	// making an array of the opponent piece; position
	const opponentSquarePosition = [];
	opponentSquarePosition.push(opponentSquareX, opponentSquareY);
	// turning that array into an ID
	const opponentDOMId = opponentSquarePosition.join(`_`);
	const $opponentDOMId = $(`#${opponentDOMId}`);
	//check to make sure the opponent piece isn't off the board
	if (opponentSquareX <= 7 && opponentSquareX >= 0) {
		// getting the cellValue of the opponent and destination
		const opponentCellValue = checkers.playerPosition[opponentSquareX][opponentSquareY];
		// if the opponent's piece is between the origin and new location of the piece
		if (opponentCellValue == 2 && $($originDOMId).hasClass(`black-selected`) && cellValue == 0) {
			// remove the opponent piece
			$($opponentDOMId).removeClass(`red-piece king-piece`);
			// change the opponent piece position's cellValue
			checkers.playerPosition[opponentSquareX][opponentSquareY] = 0;
			// run this function
			return true
			// if the opponent's piece is between the origin and new location of the piece
		} else if (opponentCellValue == 1 && $($originDOMId).hasClass(`red-selected`) && cellValue == 0) {
			// remove the opponent piece
			$($opponentDOMId).removeClass(`black-piece king-piece`);
			// change the opponent piece position's cellValue
			checkers.playerPosition[opponentSquareX][opponentSquareY] = 0;
			// run this function
			return true
		} else {
			return false
		};
	};
};
// function for checking if there's a double jump opportunity down and to the left
checkers.doubleJumpDetection = (cellValue, storedxy, direction) => {
	let destinationSquareX;
	let destinationSquareY;
	let opponentSquareX;
	let opponentSquareY;

	switch (direction) {
		case `downLeft`:
			destinationSquareX = storedxy[0] + 2;
			destinationSquareY = storedxy[1] - 2;
			opponentSquareX = storedxy[0] + 1;
			opponentSquareY = storedxy[1] - 1;
			break;
		case `downRight`:
			destinationSquareX = storedxy[0] + 2;
			destinationSquareY = storedxy[1] + 2;
			opponentSquareX = storedxy[0] + 1;
			opponentSquareY = storedxy[1] + 1;
			break;
		case `upLeft`:
			destinationSquareX = storedxy[0] - 2;
			destinationSquareY = storedxy[1] - 2;
			opponentSquareX = storedxy[0] - 1;
			opponentSquareY = storedxy[1] - 1;
			break;
		case `upRight`:
			destinationSquareX = storedxy[0] + -2;
			destinationSquareY = storedxy[1] + 2;
			opponentSquareX = storedxy[0] - 1;
			opponentSquareY = storedxy[1] + 1;
			break;
	}// making an array of the destination of the player
	const destinationSquarePosition = [];
	destinationSquarePosition.push(destinationSquareX, destinationSquareY);
	// making an array of the opponent piece position
	const opponentSquarePosition = [];
	opponentSquarePosition.push(opponentSquareX, opponentSquareY);
	//check to make sure the player destination isn't off the board
	if (destinationSquareX <= 7 && destinationSquareX >= 0 && destinationSquareY <= 7 && destinationSquareY >= 0) {
		// getting the cellValue of the opponent piece
		const opponentCellValue = checkers.playerPosition[opponentSquareX][opponentSquareY];
		const destinationCellValue = checkers.playerPosition[destinationSquareX][destinationSquareY];
		// if the opponent's piece is between the origin and new location of the piece
		if ((opponentCellValue == 2 && destinationCellValue == 0 && cellValue == 0 && ($(`#game-board`).hasClass(`player-one`))) ||
			(opponentCellValue === 1 && destinationCellValue === 0 && cellValue === 0 && ($(`#game-board`).hasClass(`player-two`)))) {
			// run this function
			return true
		} else {
			return false
		};
	};
};
//function for alerting the user that they can't play in this square
checkers.noPlay = ($this) => {
	$this.addClass(`no-play`)
	setTimeout(() => {
		$this.removeClass(`no-play`)
	}, 1000);
};
// double jump animation
checkers.doubleJumpAnimation = ($blackSquares, $whiteSquares, string) => {
	// switch back players
	checkers.playerSwitch();
	setTimeout(function () {
	    $blackSquares.addClass('black-flicker');
	    setTimeout(function () {
	        $blackSquares.removeClass('black-flicker');
	    }, 4000);
	}, 1000);
	setTimeout(function () {
	    $whiteSquares.addClass('white-flicker');
	    setTimeout(function () {
	        $whiteSquares.removeClass('white-flicker');
	    }, 4000);
	}, 1000);
// text notification
	setTimeout(function () {
		checkers.$instructionsBox.css(`height`, `100px`);
		checkers.$instructionsBox.fadeIn(`1000`);
		checkers.$instructions.text(string);
		setTimeout(() => {
			checkers.$instructionsBox.fadeOut(`slow`);
		}, 2500);
	}, 2000);
};
// kinging animation
checkers.goldAnimation = ($this, $blackSquares, $whiteSquares, $allSquares) => {
	$this.addClass(`king-piece`);
	$blackSquares.addClass(`gold-jump`);
	$whiteSquares.addClass(`black-jump`)
	setTimeout(function () {
		$allSquares.removeClass('gold-jump black-jump');
	}, 3500);
};
// black and red animations
checkers.jumpAnimation = ($allSquares) => {
	if (checkers.$gameboard.hasClass(`player-two`)) {
		$allSquares.addClass('black-jump');
	} else {
		$allSquares.addClass('red-jump');
	};
	setTimeout(function () {
		$allSquares.removeClass(`red-jump`);
		$allSquares.removeClass(`black-jump`)
	}, 2000);
	//add an opponent piece to the counter and display it to the user
	checkers.addToPlayerEatCounter();
};
// can't play here, user
checkers.userInstructions = (string) => {
	checkers.$instructionsBox.css(`height`, `150px`);
	checkers.$instructionsBox.fadeIn(`1000`);
	checkers.$instructions.text(string);
	setTimeout(() => {
		checkers.$instructionsBox.fadeOut(`slow`);
	}, 2500);
};
//play the piece
checkers.playThePiece = ($this, $allSquares, add, remove, position, i, j) => {
	//place the piece here
	$this.addClass(add)
	// remove the piece from its original square
	$allSquares.removeClass(remove)
	// change the playerPosition
	checkers.playerPosition[i][j] = position;
	// add a move onto the counter and display it to the user
	checkers.addToPlayerCounter();
	// switch players
	checkers.playerSwitch();
};
//select or unselect the piece
checkers.selectOrUnselectThePiece = ($this, add, remove, position, i, j) => {
// select the piece
$this.addClass(add)
// remove styling
$this.removeClass(remove)
//change the playerPosition
checkers.playerPosition[i][j] = position
};
// listening event for selecting the piece a user wants to move
checkers.click = () => {
	checkers.$gameboard.on(`click keypress`, `.row > div`, function () {

		//some useful variables declarations
		const allSquares = `#game-board > div > div`;
		const $allSquares = $(allSquares);
		const $blackSquares = $(`.black-square`);
		const $whiteSquares = $(`.white-square`);
		const $this = $(this);

		//make the instructions disappear
		checkers.$instructionsBox.hide()

		// this stuff lets me access the i and j axis of my global arrays by using the id's of each div and passing it
		const $idString = $this.attr(`id`);
		const idArrayString = $idString.split("_", 2);
		const i = idArrayString[0];
		const j = idArrayString[1];

		//variable to hold clicked playerPosition
		cellValue = (checkers.playerPosition[i][j]);

		// store the new x and y axis
		checkers.xy = [checkers.boardx[i], checkers.boardy[j]];

		//passing the arguments to the function and placing it in a variable to use later on in an if statement
		const hasOpponentPieceDownLeft = checkers.checkForOpponentPiece(cellValue, checkers.xy, `downLeft`);
		const hasOpponentPieceDownRight = checkers.checkForOpponentPiece(cellValue, checkers.xy, `downRight`);
		const hasOpponentPieceUpLeft = checkers.checkForOpponentPiece(cellValue, checkers.xy, `upLeft`);
		const hasOpponentPieceUpRight = checkers.checkForOpponentPiece(cellValue, checkers.xy, `upRight`);
		const hasDoubleJumpDownLeft = checkers.doubleJumpDetection(cellValue, checkers.xy, `downLeft`);
		const hasDoubleJumpDownRight = checkers.doubleJumpDetection(cellValue, checkers.xy, `downRight`);
		const hasDoubleJumpUpLeft = checkers.doubleJumpDetection(cellValue, checkers.xy, `upLeft`);
		const hasDoubleJumpUpRight = checkers.doubleJumpDetection(cellValue, checkers.xy, `upRight`);

		// if this click is a black square (because pieces can only move on black squares)
		if ($this.hasClass(`black-square`)) {

			// if this is a red piece and a different black piece is already selected
			if (cellValue === 2 && (checkers.$gameboard.hasClass(`player-one`)) || (cellValue === 1 && checkers.$gameboard.hasClass(`player-two`))) {

				// can't play here animation
				checkers.noPlay($this);

				// give user instructions
				checkers.userInstructions(`Please stop trying to pick up your opponent's pieces.`)
			};

			// if any black piece is already selected
			if ($allSquares.hasClass(`black-selected`)) {

				// if this click is already a selected black piece
				if ($this.hasClass(`black-selected`) && ($this.hasClass(`king-selected`) === false)) {

					// unselected the piece
					checkers.selectOrUnselectThePiece($this, `black-piece`, `black-selected`, 1, i, j);

					// if this click is already a selected black king
				} else if ($this.hasClass(`king-selected`)) {

					// unselected the piece
					checkers.selectOrUnselectThePiece($this, `black-piece king-piece`, `black-selected king-selected`, 1, i, j);

					// if this is a black piece and a different black piece is already selected
				} else if (cellValue === 1 && ($allSquares.hasClass(`black-selected`))) {

					// can't play here animation
					checkers.noPlay($this);

					// give user instructions
					checkers.userInstructions(`Please unselect the first piece before selecting a new one.`)


/////////////////////////////////


					// if this isn't already where any piece already sits and the piece that's selected is black
				} else if (cellValue === 0 && $allSquares.hasClass(`black-selected`)) {

					// if the piece is being moved forward on the board and isn't a king  
					if (checkers.xy[0] > checkers.storedxy[0] && $allSquares.hasClass(`king-selected`) === false) {

						// if any piece is already selected and it is the first or last row
						if (checkers.xy[0] === 7) {
					
							// kinging animation
							checkers.goldAnimation($this, $blackSquares, $whiteSquares, $allSquares)
						};
					
						// if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one more than the starting position
						if (checkers.xy[1] === (checkers.storedxy[1] + 1) || checkers.xy[1] === (checkers.storedxy[1] - 1) && (checkers.xy[0]) === (checkers.storedxy[0] + 1)) {
					
							// place the piece
							checkers.playThePiece($this, $allSquares, `black-piece`, `black-selected`, 1, i, j);
					
							// if the x axis is two rows down from the starting point
						} else if (checkers.xy[0] === (checkers.storedxy[0] + 2)) {
					
							// and the y axis is two columns to the left and the square in between those two squares has an opposing player's piece in it
							if ((checkers.xy[1] === (checkers.storedxy[1] - 2)) && hasOpponentPieceDownLeft) {
					
								// place the piece
								checkers.playThePiece($this, $allSquares, `black-piece`, `black-selected`, 1, i, j);
					
								// black animation
								checkers.jumpAnimation($allSquares);
					
								// and has a double jump opportunity down
								if (hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
					
									// double jump animation
									checkers.doubleJumpAnimation($blackSquares, $whiteSquares, `Go for the Double Jump!`);
								};
					
								// and the y axis of the click is two columns to the right and the square in between those two squares has an opposing player's piece in it
							} else if ((checkers.xy[1] === (checkers.storedxy[1] + 2)) && hasOpponentPieceDownRight) {
					
								// place the piece
								checkers.playThePiece($this, $allSquares, `black-piece`, `black-selected`, 1, i, j);
					
								// black animation
								checkers.jumpAnimation($allSquares);
					
								// and has a double jump opportunity down
								if (hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
					
									// double jump animation
									checkers.doubleJumpAnimation($blackSquares, $whiteSquares, `Go for the Double Jump!`);
								};
							} else {
					
								// can't play here animation
								checkers.noPlay($this);
							};
						} else {
					
							// can't play here animation
							checkers.noPlay($this);
						};
					
						// if the x and y axis is only one space away from the starting position
					} else if (((checkers.xy[1] === (checkers.storedxy[1] + 1)) || (checkers.xy[1] === (checkers.storedxy[1] - 1) || (checkers.xy[0]) === (checkers.storedxy[0] + 1)) || (checkers.xy[0] === (checkers.storedxy[0] - 1))) && ($allSquares.hasClass(`king-selected`))) {
					
						//place the piece
						checkers.playThePiece($this, $allSquares, `black-piece king-piece`, `black-selected king-selected`, 1, i, j);
					
						//if the x and y axis are two rows away from the starting point and there's an opponent's piece in between
					} else if
						(((checkers.xy[0] === (checkers.storedxy[0] - 2)) && (checkers.xy[1] === (checkers.storedxy[1] - 2))) ||
						((checkers.xy[0] === (checkers.storedxy[0] - 2)) && (checkers.xy[1] === (checkers.storedxy[1] + 2))) ||
						((checkers.xy[0] === (checkers.storedxy[0] + 2)) && (checkers.xy[1] === (checkers.storedxy[1] + 2))) ||
						((checkers.xy[0] === (checkers.storedxy[0] + 2)) && (checkers.xy[1] === (checkers.storedxy[1] - 2))) && (hasOpponentPieceUpLeft || hasOpponentPieceUpRight || hasOpponentPieceDownLeft || hasOpponentPieceDownRight)) {
					
						//place the piece
						checkers.playThePiece($this, $allSquares, `black-piece king-piece`, `black-selected king-selected`, 1, i, j);
					
						//red animation
						checkers.jumpAnimation($allSquares)
					
						//has double jump opportunity up and to the left
						if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight || hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
					
							//double jump animation
							checkers.doubleJumpAnimation($blackSquares, $whiteSquares, `Go for the Double Jump!`);
						};
					} else {
			
					// can't play here animation
					checkers.noPlay($this);
				}
				} else {
					
					// can't play here animation
					checkers.noPlay($this);
				};

				// if any red piece is already selected
			} else if ($allSquares.hasClass(`red-selected`)) {

				//if this click is already a selected red piece
				if (this.classList.contains(`red-selected`) && (this.classList.contains(`king-selected`) === false)) {

					// unselected the piece
					checkers.selectOrUnselectThePiece($this, `red-piece`, `red-selected`, 2, i, j);

					//if this click is already a selected red king
				} else if (this.classList.contains(`king-selected`)) {

					// unselected the piece
					checkers.selectOrUnselectThePiece($this, `red-piece king-piece`, `red-selected king-selected`, 2, i, j);

					//if this is a red piece and a different red piece is already selected
				} else if (cellValue === 2 && ($allSquares.hasClass(`red-selected`))) {
					checkers.noPlay($this);
					checkers.userInstructions(`Please unselect the first piece before selecting a new one.`)

					// if this isn't already where any piece already sits and the piece that is selected is red
				} else if (cellValue === 0 && $allSquares.hasClass(`red-selected`)) {

					// store the new x and y axis
					checkers.xy = [checkers.boardx[i], checkers.boardy[j]];

					// if the piece is being moved forward on the board and isn't a king
					if (checkers.xy[0] < checkers.storedxy[0] && $allSquares.hasClass(`king-selected`) === false) {

						//if any piece is already selected and it is the first or last row
						if (checkers.xy[0] === 0) {

							// kinging animation
							checkers.goldAnimation($this, $blackSquares, $whiteSquares, $allSquares)
						};
						//if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one down than the starting position
						if (checkers.xy[1] === (checkers.storedxy[1] + 1) || checkers.xy[1] === (checkers.storedxy[1] - 1) && (checkers.xy[0]) === (checkers.storedxy[0] - 1)) {

							//place the piece
							checkers.playThePiece($this, $allSquares, `red-piece`, `red-selected`, 2, i, j);

							//if the x axis is two rows down from the starting point
						} else if (checkers.xy[0] === (checkers.storedxy[0] - 2)) {

							// and the y axis of the click is two columns to the left and the square in between those two squares has an opposing player's piece in it
							if ((checkers.xy[1] === (checkers.storedxy[1] - 2)) && hasOpponentPieceUpLeft) {

								//place the piece
								checkers.playThePiece($this, $allSquares, `red-piece`, `red-selected`, 2, i, j);

								//red animation
								checkers.jumpAnimation($allSquares);

								//has double jump opportunity up and to the left
								if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight) {

									//double jump animation
									checkers.doubleJumpAnimation($blackSquares, $whiteSquares, `Go for the Double Jump!`);
								};
							} else if ((checkers.xy[1] === (checkers.storedxy[1] + 2)) && hasOpponentPieceUpRight) {

								//place the piece
								checkers.playThePiece($this, $allSquares, `red-piece`, `red-selected`, 2, i, j);

								// red animation
								checkers.jumpAnimation($allSquares);

								// has double jump opportunity up and to the left
								if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight) {

									//double jump animation
									checkers.doubleJumpAnimation($blackSquares, $whiteSquares, `Go for the Double Jump!`);
								};
							} else {

								// can't play here animation
								checkers.noPlay($this);
							};
						} else {

							// can't play here animation
							checkers.noPlay($this);
						};

						// if the x and y axis is only one space away from the starting position
					} else if (((checkers.xy[1] === (checkers.storedxy[1] + 1)) || (checkers.xy[1] === (checkers.storedxy[1] - 1) || (checkers.xy[0]) === (checkers.storedxy[0] + 1)) || (checkers.xy[0] === (checkers.storedxy[0] - 1))) && ($allSquares.hasClass(`king-selected`))) {
						
						//place the piece
						checkers.playThePiece($this, $allSquares, `red-piece king-piece`, `red-selected king-selected`, 2, i, j);
						
						//if the x axis is two rows down from the starting point
					} else if
						(((checkers.xy[0] === (checkers.storedxy[0] - 2)) && (checkers.xy[1] === (checkers.storedxy[1] - 2))) ||
						((checkers.xy[0] === (checkers.storedxy[0] - 2)) && (checkers.xy[1] === (checkers.storedxy[1] + 2))) ||
						((checkers.xy[0] === (checkers.storedxy[0] + 2)) && (checkers.xy[1] === (checkers.storedxy[1] + 2))) ||
						((checkers.xy[0] === (checkers.storedxy[0] + 2)) && (checkers.xy[1] === (checkers.storedxy[1] - 2))) && (hasOpponentPieceUpLeft || hasOpponentPieceUpRight || hasOpponentPieceDownLeft || hasOpponentPieceDownRight)) {
						
						//place the piece
						checkers.playThePiece($this, $allSquares, `red-piece king-piece`, `red-selected king-selected`, 2, i, j);
						
						//red animation
						checkers.jumpAnimation($allSquares);
						
						//has double jump opportunity up and to the left
						if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight || hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
						
							//double jump animation
							checkers.doubleJumpAnimation($blackSquares, $whiteSquares, `Go for the Double Jump!`);
						};
					} else {

						// can't play here animation
						checkers.noPlay($this);
					}
				} else {
				
					// can't play here animation
					checkers.noPlay($this);
				};
			}
			
			// if no pieces are already selected
			else if ($allSquares.hasClass(`black-selected` || `red-selected`) === false) {

				// store the x and y axis
				checkers.storedxy = [checkers.boardx[i], checkers.boardy[j]]

				//if it's a black king
				if (cellValue === 1 && (checkers.$gameboard.hasClass(`player-one`) && $this.hasClass(`king-piece`))) {
					// unselected the piece
					checkers.selectOrUnselectThePiece($this, `black-selected king-selected`, `black-piece king-piece`, 0, i, j);
				}
			
				//if it's a red king
				if (cellValue === 2 && (checkers.$gameboard.hasClass(`player-two`) && $this.hasClass(`king-piece`))) {
					// unselected the piece
					checkers.selectOrUnselectThePiece($this, `red-selected king-selected`, `red-piece king-piece`, 0, i, j);
				}
			
				// if it's a black piece  
				else if (cellValue === 1 && (checkers.$gameboard.hasClass(`player-one`))) {
			
					// unselected the piece
					checkers.selectOrUnselectThePiece($this, `black-selected`, `black-piece`, 0, i, j);

					// if it's a red piece
				} else if (cellValue === 2 && (checkers.$gameboard.hasClass(`player-two`))) {
			
					// unselected the piece
					checkers.selectOrUnselectThePiece($this, `red-selected`, `red-piece`, 0, i, j);
				} else {
			
					// can't play here animation
					checkers.noPlay($this);
				}
			};
		} else {
			
			// can't play here animation
			checkers.noPlay($this);
		};
	});
};

//init
checkers.init = () => {
	// calling the setup functions and passing it the columns and rows
	checkers.setup(8, 8);
	checkers.setupPieces(8, 8);
	checkers.click();
}

$(document).ready(() => {
	checkers.init();
});