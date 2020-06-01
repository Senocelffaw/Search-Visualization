export default class Cell{

    constructor(row, col){
        this.row = row;
        this.col = col;
        this.traversed = 0; // 0 == false; 1 == true; 3 == start; 4 == end
        this.previousCell = null;
    }

    print(){
        console.log(this.row + " " + this.col);
    }
}