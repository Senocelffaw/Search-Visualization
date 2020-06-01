//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////             CLASSES                /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import Cell from './Node.js'
import Queue from './Queue.js'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////           GLOBAL VARIABLES        /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//mouse states
var mousedown = false;
var disableMouse = false;

var wall = 'wall'; //wall class
var traversed = 'traversed'; //path class
var start = 'start';    //start class
var end = 'end';        //end class

var cellSize = 40; //Size of each cell in the grid (width or height) as a square.  Must change Cell size in css if changed



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////        GRID CREATION FUNCTIONS      ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create a grid with row rows, col columns at divID ID. 
function createGrid(row, col, divID){
    //create an unselectable grid with class grid
    var grid = "<table id=\"table\" class=\"grid unselectable\" border=\"1\">";
    for(var i = 0; i < row; i++){
        grid += "<tr>\n";
        for(var j = 0; j < col; j++){
            grid += "<td></td>\n"
        }
        grid += "</tr>\n";
    }
    grid += "</table>";
    document.getElementById('grid').innerHTML += grid;
}

//Find the amount of rows needed to fill the screen
function findRows(){

    var body = document.body;
    var html = document.documentElement;

    var pageHeight = Math.max(  body.scrollHeight, 
                                body.offsetHeight, 
                                html.clientHeight, 
                                html.scrollHeight, 
                                html.offsetHeight );

    var height = document.getElementById('nav').clientHeight;
    height += document.getElementById('text').clientHeight;

    height = pageHeight - height;

    return Math.floor(height/cellSize);
}

//fidn the amount of columns needed to fill the screen
function findColumns(){
    return Math.floor(Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      )/cellSize);
}


//Create start and end cells within the table and the Array of Cells (visualize and in array)
function createDefaultStartEndCells(){
    var table = document.getElementById('table');

    //Create Start Cell in table and in Array of Cells
    if(document.getElementsByClassName(start).length == 0){
        var row = Math.floor(table.rows.length / 3); 
        var col = Math.floor(table.rows[0].cells.length / 4);
        table.rows[row].cells[col].classList.add(start);
    }

    //Create End Cell in table and in Array of Cells
    if(document.getElementsByClassName(end).length == 0){
        var row = Math.floor(table.rows.length / 3); 
        var col = Math.floor(table.rows[0].cells.length * 3/4);
        table.rows[row].cells[col].classList.add(end);
    }
}

function createStartEndCellsInGrid(grid){
    var table = document.getElementById('table');

    //Create Start Cell in table and in Array of Cells
    if(document.getElementsByClassName(start).length <= 1){
        var row = Math.floor(table.rows.length / 3); 
        var col = Math.floor(table.rows[0].cells.length / 4);
        grid[row][col].traversed = 3;
    }

    //Create End Cell in table and in Array of Cells
    if(document.getElementsByClassName(end).length <= 1){
        var row = Math.floor(table.rows.length / 3); 
        var col = Math.floor(table.rows[0].cells.length * 3/4);
        grid[row][col].traversed = 4;
    }
}

//Create an array of Cells used in order to pathfind
function createNodeGrid(row, col){
    var grid = new Array(row);

    for(var i = 0; i < row; i++){
        grid[i] = new Array(col);
    }
    
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            grid[i][j] = new Cell(i, j);
        }
    }


    createStartEndCellsInGrid(grid);

    return grid;
}

//gets all the walls in the table and updates the grid
function updateWalls(grid){
    var table = document.getElementById('table');
    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[i].length; j++){
            if(table.rows[i].cells[j].classList.contains(wall)){
                grid[i][j].traversed = 1;
            }
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////          Pathfinding Algorithms         ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Finds the Start Cell in the 2d Array of Cells
//grid is a 2d Array of Cells
function findStartCell(grid){
    var start;

    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[0].length; j++){
            if(grid[i][j].traversed == 3){
                start = grid[i][j];
            }
        }
    }
    return start;
}

//Takes a 2d array of Cells and outputs a 2d array of Cells
function breadthFirstSearch(grid){
    var list = new Queue();
    var toReturn = new Queue();
    var startCell = findStartCell(grid);
    var row = grid.length;
    var col = grid[0].length;
    var found = false;

    list.enqueue(startCell);

    while(!list.isEmpty() && !found){
        var front = list.front();
        //enqueue top Cell
        if(front.row - 1 >= 0 && !found){
            if(grid[front.row-1][front.col].traversed == 0){
                grid[front.row-1][front.col].traversed = 1;
                grid[front.row-1][front.col].previousCell = front;
                list.enqueue(grid[front.row-1][front.col]);
            }
            else if(grid[front.row-1][front.col].traversed == 4){
                grid[front.row-1][front.col].previousCell = front;
                list.enqueue(grid[front.row-1][front.col]);
                
                found = true;
            }
        }
        //enqueue right cell
        if(front.col + 1 < col && !found){
            if(grid[front.row][front.col + 1].traversed == 0){
                grid[front.row][front.col + 1].traversed = 1;
                grid[front.row][front.col + 1].previousCell = front;
                list.enqueue(grid[front.row][front.col + 1]);
            }
            else if(grid[front.row][front.col + 1].traversed == 4){
                grid[front.row][front.col + 1].previousCell = front;
                list.enqueue(grid[front.row][front.col + 1]);
                found = true;
            }
        }
        //enqueue bottom cell
        if(front.row + 1 < row && !found){
            if(grid[front.row+1][front.col].traversed == 0){
                grid[front.row+1][front.col].traversed = 1;
                grid[front.row+1][front.col].previousCell = front;
                list.enqueue(grid[front.row+1][front.col]);
            }
            else if(grid[front.row+1][front.col].traversed == 4){
                grid[front.row+1][front.col].previousCell = front;
                list.enqueue(grid[front.row+1][front.col]);
                found = true;
            }
        }
        //enqueue left cell
        if(front.col - 1 >= 0 && !found){
            if(grid[front.row][front.col-1].traversed == 0){
                grid[front.row][front.col-1].traversed = 1;
                grid[front.row][front.col-1].previousCell = front;
                list.enqueue(grid[front.row][front.col-1]);
            }
            else if(grid[front.row][front.col-1].traversed == 4){
                grid[front.row][front.col-1].previousCell = front;
                list.enqueue(grid[front.row][front.col-1]);
                found = true;
            }
        }

        toReturn.enqueue(front);
        list.dequeue();

    }

    if(found == true){
        while(list.front().traversed != 4){
            list.dequeue();
        }
        toReturn.enqueue(list.front());
    }

    return toReturn;

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////           Visualization                   /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Takes in a Queue 
function slowVisualization(list){
    var table = document.getElementById('table');
    var id = setInterval(frame, 1);
    var last = new Queue;

    function frame(){
        table.rows[list.front().row].cells[list.front().col].classList.add('traversed');
        last.enqueue(list.front());
        list.dequeue();
        if(list.isEmpty()){
            visualizePath(last);
            document.getElementById('clear').disabled = false;
            disableMouse = false;
            clearInterval(id);
        }
    }

}

//Takes in a Queue of Cells and colours in a table according to the cells in the list
function visualizePathfinding(list){
    var table = document.getElementById('table');
    while(!list.isEmpty()){
        table.rows[list.front().row].cells[list.front().col].classList.add('traversed');
        list.dequeue();
    }
}

//Takes in a Queue of Cells and colours in a table according to the cells in the list
function visualizePath(list){
    var table = document.getElementById('table');
    var cell;
    while(!list.isEmpty()){
        cell = list.front();
        list.dequeue();
    }
    
    

    if(cell.traversed == 4){
        while(cell.previousCell != null){
            table.rows[cell.row].cells[cell.col].classList.add('shortest');
            cell = cell.previousCell;
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////           Grid Editing                    /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearTraversed(){
    var traversed = document.getElementsByClassName('traversed');
    var shortest = document.getElementsByClassName('shortest');
    while(traversed.length > 0){
        traversed[0].classList.remove('traversed');
    }
    while(shortest.length > 0){
        shortest[0].classList.remove('shortest');
    }
}

function clearGrid(){
    var walls = document.getElementsByClassName(wall);
    var traversed = document.getElementsByClassName('traversed');
    var shortest = document.getElementsByClassName('shortest');
    while(traversed.length > 0){
        traversed[0].classList.remove('traversed');
    }
    while(shortest.length > 0){
        shortest[0].classList.remove('shortest');
    }
    while(walls.length > 0){
        walls[0].className = '';
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////           MOUSE EVENTS                    /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


document.getElementById('visualize').addEventListener('click', function(){
    clearTraversed();
    document.getElementById('clear').disabled = true;
    disableMouse = true;
    var rows = findRows();
    var cols = findColumns();
    grid = createNodeGrid(rows, cols);
    updateWalls(grid);
    var list = breadthFirstSearch(grid);
    slowVisualization(list);
}, false);

//  Add wall to the TD element
document.addEventListener('mousedown', function(e){
    mousedown = true;
    if(e.target.tagName == "TD" && mousedown && !disableMouse){
        if(!e.target.classList.contains('start') && !e.target.classList.contains('end')){
            e.target.classList.add(wall);
        }
    }
}, false);

//  Do not draw after mouseup
document.addEventListener('mouseup', function(e){
    mousedown = false;
}, false);

// If mouse is down and over element, add wall to the td element
document.addEventListener('mouseover', function(e){
    if(e.target.tagName == "TD" && mousedown && !disableMouse){
        if(!e.target.classList.contains('start') && !e.target.classList.contains('end')){
            e.target.classList.add(wall);
        }
    }
}, false);

document.getElementById('clear').onclick = function(){
    clearGrid();
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////             MAIN FUNCTION           /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener ('load', function load(){
    var rows = findRows();
    var cols = findColumns();
    createGrid(rows, cols, 'grid');
    createDefaultStartEndCells();
})