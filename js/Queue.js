export default class Queue{

    constructor(){
        this.items = [];
    }

    enqueue(item){
        this.items.push(item);
    }

    dequeue(){
        if(this.items.length == 0){
            return "Underflow";
        }
        return this.items.shift();
    }

    front(){
        if(this.items.length == 0){
            return "No elements in Queue"
        }
        return this.items[0];
    }

    printQueue() 
    { 
        var str = ""; 
        for(var i = 0; i < this.items.length; i++) 
            str += this.items[i] +" "; 
        return str; 
    } 

    isEmpty(){
        return this.items.length == 0;
    }

}