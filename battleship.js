// JavaScript Document

var rows = 10; 
var cols =10; 
var squareSize = 50; 

//get the Container element
var gameBoardContainer = document.getElementById("gameboard"); 

// make the grid columns and rows
for (i = 0; i < cols; i++) {
	for (j = 0; j < rows; j++) {
		
		// create a new div HTML element for each grid square and make it the right size
		var square = document.createElement("div");
		gameBoardContainer.appendChild(square);

    // give each div element a unique id based on its row and column, like "s00"
		square.id = 's' + j + i;			
		
		// set each grid square's coordinates: multiples of the current row or column number
		var topPosition = j * squareSize;
		var leftPosition = i * squareSize;			
		
		// use CSS absolute positioning to place each grid square on the page
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';
	//	square.innerHTML = square.id; 						
	}
}

/* lazy way of tracking when the game is won: just increment hitCount on every hit
   in this version, and according to the official Hasbro rules (http://www.hasbro.com/common/instruct/BattleShip_(2002).PDF)
   there are 17 hits to be made in order to win the game:
      Carrier     - 5 hits
      Battleship  - 4 hits
      Destroyer   - 3 hits
      Submarine   - 3 hits
      Patrol Boat - 2 hits
*/
var hitCount = 0;

/* create the 2d array that will contain the status of each square on the board
   and place ships on the board (later, create function for random placement!)
   0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
*/

//array for the 5 ships 
var ships = [5, 4 , 3, 3, 2]; 

var gameBoard = [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
				];

//This part randomizes the locations of the ships 
for(var k = 0; k < ships.length; k++){
	var fit = false; 
	while(!fit){
		var r = Math.floor(Math.random()*10); 
		var c = Math.floor(Math.random()*10);
		var horizontal = true; 
		
		//The following code determines whether the code is placed horizontally or vertically
		//0 for horizontal
		//1 for vertical 
		if(Math.floor(Math.random()*2) == 1){
			horizontal = false;
			}
		
		//The following code makes sure the ships do not extend beyond the edge of the board	
		if(horizontal){
			if(ships[k] + c > 9){
				fit = false; 
				continue; 
				}
			}
		else{
			if(ships[k] + r > 9){
				fit = false; 
				continue; 
				}
			}
		fit = check(horizontal, ships[k], r, c); 
		}
	var len = ships[k]; 
	place(len, r, c, horizontal);
}

//the function makes sures there are no overlaps between ships 
function check(h_alignment, len, r, c){
	if(h_alignment){
		for(var i = 0; i < len; i++){
			//If a section of the board contains a ship, it's marked with a one
			//thus, if the function detects the section is marked with one, it returns false 
			if(gameBoard[r][c + i] == 1){
				return false; 
			}
		}
	}
	else{
		for(var i = 0; i < len; i++){
			if(gameBoard[r + i][c] == 1){
				return false; 
			}
		}
	}
	return true; 
}

//places the ships onto the board 
function place(ship_length, r, c, h_alignment){
	for(var i = 0; i < ship_length; i++){
		if(h_alignment){
			gameBoard[r][c + i] += 1; 
		}
		else{
			gameBoard[r + i][c] += 1; 
		}
	}
}

/*
for(var i = 0; i < rows; i++){
	for(var j = 0; j < cols; j++){
		var ident = 's' + i + j;
		document.getElementById(ident).innerHTML = gameBoard[i][j]; 
	}
}*/

/*
var gameBoard = [
				[0,0,0,1,1,1,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,1,0,0,0],
				[0,0,0,0,0,0,1,0,0,0],
				[1,0,0,0,0,0,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0],
				[1,0,0,1,0,0,0,0,0,0],
				[1,0,0,1,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0,0,0]
				]; 
	
*/				
// set event listener for all elements in gameboard, run fireTorpedo function when square is clicked
gameBoardContainer.addEventListener("click", fireTorpedo, false);

// initial code via http://www.kirupa.com/html5/handling_events_for_many_elements.htm:
function fireTorpedo(e) {
    // if item clicked (e.target) is not the parent element on which the event listener was set (e.currentTarget)
	if (e.target !== e.currentTarget) {
        // extract row and column # from the HTML element's id
		var row = e.target.id.substring(1,2);
		var col = e.target.id.substring(2,3);
        //alert("Clicked on row " + row + ", col " + col);
				
		// if player clicks a square with no ship, change the color and change square's value
		if (gameBoard[row][col] == 0) {
			e.target.style.background = '#bbb';
			// set this square's value to 3 to indicate that they fired and missed
			gameBoard[row][col] = 3;
			
		// if player clicks a square with a ship, change the color and change square's value
		} else if (gameBoard[row][col] == 1) {
			e.target.style.background = 'red';
			// set this square's value to 2 to indicate the ship has been hit
			gameBoard[row][col] = 2;
			
			// increment hitCount each time a ship is hit
			hitCount++;
			// this definitely shouldn't be hard-coded, but here it is anyway. lazy, simple solution:
			if (hitCount == 17) {
				alert("All enemy battleships have been defeated! You win!");
			}
			
		// if player clicks a square that's been previously hit, let them know
		} else if (gameBoard[row][col] > 1) {
			alert("Stop wasting your torpedos! You already fired at this location.");
		}		
    }
    e.stopPropagation();
}

