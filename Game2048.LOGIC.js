Game2048 = window.Game2048 || {};


Game2048.LOGIC = function()
{
    //args
    const ROWS = COLS = 4;
    const SIZE = ROWS*COLS;
    let tilesArr = [];

    let tilesAtStart = 2;   //number of shown tiles at start
    let startValue = 2;     //the smallest value in the game
    let endValue = 2048;    //the largest value in the game - incase we have it once the user is win
    let emptyValue = -1;    //empty tile value 
    let startRange = 0;     //the range of the value

    let isWin = isLose = false;

    //getters
    let getRows = () => ROWS;
    let getCols = () => COLS;
    let getIsWin = () => isWin;
    let getIsLose = () => isLose;

    let initModule = function() 
    {   
        initTiles();
        keyBoardListeners();        //listeners to keyboard arrows
    };
    
    let initTiles = function()  
    {
        var rand = [tilesAtStart];
        var temp = [SIZE];
        for(var i = 0; i<SIZE;i++)
            temp[i] = i;

        for(var i=0;i<tilesAtStart;i++) //select random started tiles
        {
            var num = Math.floor((Math.random()*100) % (temp.length));
            rand[i] = temp[num];
            temp.splice(num,1);
        }
    
        var c = -1;
        for(var i=0;i<SIZE;i++)
        {
            if(i%ROWS == 0)
                c++;     
            tilesArr.push(new Tile(c,i%ROWS,emptyValue,startRange));
            tilesArr[i].range = startRange;

            for(var j=0;j<rand.length;j++)
                if(i==rand[j])
                {
                    tilesArr[i].value = startValue;
                    tilesArr[i].range = startRange+1;
                }
        }
    };

    let keyBoardListeners = function()      //keyboard listener
    {
        $(document).keydown(function(e)
        {
            var isMoved = false;
            var i=0;
            var r,c;
            if (e.keyCode == 37) //pressed left
            {
                for(;i<SIZE;i++)
                {
                    if(tilesArr[i].value != emptyValue)
                    {
                        r = parseInt(i / COLS);
                        c = (i - (COLS * r))-1;
                        for(;c>=0;c--)
                        {
                            if(tilesArr[toInd(r,c)].value == emptyValue)
                            {
                                isMoved = true;
                                swapTilesValue(i,toInd(r,c));
                                i--;
                            }
                            else
                            {
                                if(tilesArr[toInd(r,c)].value==tilesArr[i].value)
                                    if(tilesArr[toInd(r,c)].col+1 == tilesArr[i].col && !(tilesArr[toInd(r,c)].isMerged))
                                    {
                                        isMoved = true;
                                        tilesArr[toInd(r,c)].isMerged = true;
                                        mergeTilesValues(toInd(r,c),i);
                                    }
                            }
                        }
                    }
                }
            }
            if(e.keyCode == 38) //pressed up
            {
                for(;i<SIZE;i++)
                {
                    if(tilesArr[i].value != emptyValue)
                    {
                        r = parseInt(i / COLS)-1;
                        c = (i - (COLS * (r+1)));

                        for(;r>=0;r--)
                        {
                            if(tilesArr[toInd(r,c)].value == emptyValue)
                            {
                                isMoved = true;
                                swapTilesValue(i,toInd(r,c));
                                i=i-ROWS;
                            }
                            else
                            {
                                if(tilesArr[toInd(r,c)].value==tilesArr[i].value)
                                    if(tilesArr[toInd(r,c)].row+1 == tilesArr[i].row && !(tilesArr[toInd(r,c)].isMerged))
                                    {
                                        isMoved = true;
                                        tilesArr[toInd(r,c)].isMerged = true;
                                        mergeTilesValues(toInd(r,c),i);
                                    }                            
                            }
                        }
                    }
                }
            }
            if (e.keyCode == 39) //pressed right
            {
                for(i=SIZE-1;i>=0;i--)
                {
                    if(tilesArr[i].value != emptyValue)
                    {
                        r = parseInt(i / COLS);
                        c = (i - (COLS * r))+1;
                        for(;c<COLS;c++)
                        {
                            if(tilesArr[toInd(r,c)].value == emptyValue)
                            {
                                isMoved = true;
                                swapTilesValue(i,toInd(r,c));
                                i++;
                            }
                            else
                            {
                                if(tilesArr[toInd(r,c)].value==tilesArr[i].value)
                                    if(tilesArr[toInd(r,c)].col-1 == tilesArr[i].col && !(tilesArr[toInd(r,c)].isMerged))
                                    {
                                        isMoved = true;
                                        tilesArr[toInd(r,c)].isMerged = true;
                                        mergeTilesValues(toInd(r,c),i);
                                    }
                            }    
                        }
                    }
                }
            }
            if (e.keyCode == 40) // pressed down
            {
                for(i=SIZE-1;i>=0;i--)
                {
                    if(tilesArr[i].value != emptyValue)
                    {
                        r = parseInt(i / COLS);
                        c = (i - (COLS *r));

                        for(;r<ROWS;r++)
                        {
                            if(tilesArr[toInd(r,c)].value == emptyValue)
                            {
                                isMoved = true;
                                swapTilesValue(i,toInd(r,c));
                                i=i+ROWS;
                            }
                            else
                            {
                                if(tilesArr[toInd(r,c)].value==tilesArr[i].value)
                                    if(tilesArr[toInd(r,c)].row-1 == tilesArr[i].row && !(tilesArr[toInd(r,c)].isMerged))
                                    {
                                        isMoved = true;
                                        tilesArr[toInd(r,c)].isMerged = true;
                                        mergeTilesValues(toInd(r,c),i);
                                    } 
                            }
                        }
                    }
                }
            }
            if(isMoved)
                addRandomTile();
            checkGameStatus();
        });
    };

    let checkGameStatus = function()
    {
        var isFull = true;
        for(var i=0;i<SIZE;i++)
        {
            tilesArr[i].isMerged = false;
            if(tilesArr[i].value == endValue)
            {
                isWin = true;
                return;
            }
            if(tilesArr[i].value==emptyValue)
                isFull = false;
        }
        if(isFull)
        {
            var gameOver = true;
            var curVal = upVal = bottomVal = leftVal = rightVal = -1;
            for(let i = 0; i < ROWS; i++) 
            {
                for(let j = 0; j < COLS; j++)
                {
                    curVal = tilesArr[toInd(i,j)].value;
                    if(i-1 >= 0)
                        upVal = tilesArr[toInd(i-1,j)].value;
                    if(i+1<ROWS)
                        bottomVal = tilesArr[toInd(i+1,j)].value;
                    if(j-1>=0)
                        leftVal = tilesArr[toInd(i,j-1)].value;
                    if(j+1<COLS)
                        rightVal = tilesArr[toInd(i,j+1)].value;
                    
                    if(curVal == upVal || curVal == bottomVal || curVal == leftVal || curVal == rightVal)
                    {
                        gameOver = false;
                        return;
                    }
                    upVal = bottomVal = leftVal = rightVal = -1;
                }
            }
            if(gameOver)
                isLose = true;
        }
    }

    let addRandomTile = function()
    {
        var randArr = [];
        
        for(var i=0;i<SIZE;i++)
            if(tilesArr[i].value == emptyValue)
                randArr.push(i);
        
        if(randArr.length == 0) // incase all tiles value arn't emptyValue
            return;

        var num = Math.floor((Math.random()*100) % (randArr.length));   //choose tail in keyboard
        var val = Math.floor((Math.random()*100) % 2);
        if(val == 0)    //add random value 
        {
            tilesArr[randArr[num]].value = startValue;
            tilesArr[randArr[num]].range = 1;
        }
        else
        {
            tilesArr[randArr[num]].value = startValue+startValue;
            tilesArr[randArr[num]].range = 2;
        }
    }

    let swapTilesValue = function(x, y) {
        let temp = tilesArr[x].value;
        let tempRange = tilesArr[x].range;
        tilesArr[x].value = tilesArr[y].value;
        tilesArr[x].range = tilesArr[y].range;
        tilesArr[y].value = temp;
        tilesArr[y].range = tempRange;
    };

    let mergeTilesValues = function(x,y)
    {
        tilesArr[x].value += tilesArr[y].value;
        tilesArr[x].range++;
        tilesArr[y].value = emptyValue;
        tilesArr[y].range = 0;
    };

    let toInd = (row, col) => row * COLS + col; // get correct index to one dimantional array
    let getTileValue = (row,col) => tilesArr[toInd(row,col)].value;
    let getTileRange = (row,col) => tilesArr[toInd(row,col)].range;

    let Tile = function(row,col,value,range)   //tile object 
    {
        this.row = row;		
        this.col = col;
        this.value = value;
        this.range = range;

        var isMerged = false;

        return {row:row,col:col,value:value,isMerged:isMerged}
    };
    return {initModule,getTileValue,getTileRange,getRows, getCols,emptyValue,getIsWin,getIsLose}
}();