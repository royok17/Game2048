Game2048 = window.Game2048 || {};
Game2048.GUI = function()
{
    let canvas,context;
    let canvasWidth, canvasHeight;

    const color = ["#312929","slateblue","hotpink","orange","forestgreen","indigo","brown","darkkhaki","darkmagenta","darkred","blue","yellowgreen"];   //  array of color - the user can change and add which color he ever want
    
    let initModule = function() {
        canvas = document.getElementById('myCanvas');
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        context = canvas.getContext('2d');

        Game2048.LOGIC.initModule();
        drawBoard(); 

         $(document).keydown(function(e)
        {
            var win = Game2048.LOGIC.getIsWin();
            var lose = Game2048.LOGIC.getIsLose();

            if(win)
                document.getElementById("msg").innerHTML = "winner!!!";
            
            if(lose)
                document.getElementById("msg").innerHTML = "losser!!!"; 

            drawBoard();

        if(win || lose)
        { 
            setTimeout(function()
            {
                alert("start new game");    // alert for start new game 
                location.reload();
            },500);
        }
        });

    };

    let drawBoard = function()      //draw board on canvas
    {
        const row = Game2048.LOGIC.getRows();
        const col = Game2048.LOGIC.getCols();
        const size = row*col;

        const TILE_W = canvasWidth / row;
        const TILE_H = canvasHeight / col;
       
        let x = y = 4;
        let w = z = 2;

        //size of text number in tile
        let strFontSize;
        if(TILE_H<TILE_W)
            strFontSize = TILE_H/5+"px serif";  //size font dinamically
        else
            strFontSize = TILE_W/5+"px serif";  //size font dinamically

        // draw board
        for(let i = 0; i < Game2048.LOGIC.getRows(); i++)
            for(let j = 0; j < Game2048.LOGIC.getCols(); j++) 
            {
                context.fillStyle = "white";
                context.fillRect(w+j*TILE_W,z+i*TILE_H,TILE_W-4,TILE_H-4);

                let value = Game2048.LOGIC.getTileValue(i,j);
                //draw tile color
                context.fillStyle = color[Game2048.LOGIC.getTileRange(i,j)%(color.length+1)];
                context.fillRect(x+j*TILE_W,y+i*TILE_H,TILE_W-8,TILE_H-8);
                context.fillStyle = "white";
                context.font = strFontSize;    
                
                //draw text number in tile
               if(value == Game2048.LOGIC.emptyValue)
                    context.fillText("",(x+j*TILE_W)+(TILE_W/4),(y+i*TILE_H)+(TILE_H/2));
                else if(value >= 1000)
                    context.fillText(value,(x+j*TILE_W)+(TILE_W/3.5),(y+i*TILE_H)+(TILE_H/2));
                else if(value >= 100 && value < 1000)
                    context.fillText(value,(x+j*TILE_W)+(TILE_W/3.5),(y+i*TILE_H)+(TILE_H/2));
                else
                    context.fillText(value,(x+j*TILE_W)+(TILE_W/3),(y+i*TILE_H)+(TILE_H/2));
            }   
    };

    return {initModule}
}();
