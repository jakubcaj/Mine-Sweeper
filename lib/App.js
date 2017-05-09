/**
 * Created by Kuba on 06.05.2017.
 */


var onRow = 30;
var columns = 15;
var bombCount = 50;
var tiles;
var flagsCount = 0;
var end = false;

var Q = window.Q = Quintus({development: true})
                    .include("Sprites, Scenes, Input, 2D, Anim, UI, Touch")
                    .setup({maximize: false, width: window.innerWidth, height: window.innerHeight})
                    .touch();
Q.input.mouseControls({cursor: "on"});
Q.input.keyboardControls();
//Q.input.mouseControls();

Q.scene('hud', function(stage) {
   var container = stage.insert(new Q.UI.Container({
       x: window.innerWidth/2, y: 0
   }));
   var score = container.insert(new Q.UI.Text({
       x:20, y:20, label: "Timer: " + 0, color: "black", align:"center"
   }));
});

Q.Sprite.extend("Tile", {
   init: function(p) {
       this._super(p,{
           x:p.x,
           y:p.y,
           //sprite: "tile1"
           sheet: "undecided",
           value: "empty",
           bombsAround: 0,
           objX:p.ObjX,
           objY:p.ObjY

       });
       //p.value = "empty";
       //this.on("touch", this, "clicked");
       //Q.inputs.on("mouseup",this,"clicked")
       // this.on("mouseup", this, function (evt) {
       //     console.log("clicked ");
       // });
       this.on("touchEnd");

   },
    touchEnd: function () {
        // console.log("clicked ");
        // this.p.sheet = "tile2";
        //this._super({sheet: "tile2"});
        switch (this.p.value){
            case "bomb":
                this.p.sheet = "tileMine";
                $('#video1').click();
                end = true;
                break;
            case "tile1": this.p.sheet = "tile1";break;
            case "tile2": this.p.sheet = "tile2";break;
            case "tile3": this.p.sheet = "tile3";break;
            case "tile4": this.p.sheet = "tile4";break;
            case "tile5": this.p.sheet = "tile5";break;
            case "tile6": this.p.sheet = "tile6";break;
            case "tile7": this.p.sheet = "tile7";break;
            case "tile8": this.p.sheet = "tile8";break;
            default: uncoverEmpty(this.p.objY, this.p.objX);
        }
    },
    flag: function () {
       if(this.p.sheet == "undecided") {
           this.p.sheet = "tileFlag";
           flagsCount++;
           if(checkIfWin()){
               alert("Vyhrali jste, zneskodnili jste vsechny bomby.")
           }
       }else if (this.p.sheet == "tileFlag"){
           this.p.sheet = "undecided";
           flagsCount--;
       }

    }
});

// Q._each(["touchend", "mouseup"], function (evt) {
//     Q.wrapper.addEventListener(evt,)
// });

Q.load("1.png, 2.png, 3.png, 4.png, 5.png, 6.png, 7.png, 8.png, default.png, flag.png, mine.png, undecided.png ", function () {
    Q.sheet("tile1","1.png", {tilew: 50, tileh: 50});
    Q.sheet("tile2","2.png",{tilew:50, tileh:50});
    Q.sheet("tile3","3.png",{tilew:50, tileh:50});
    Q.sheet("tile4","4.png",{tilew:50, tileh:50});
    Q.sheet("tile5","5.png",{tilew:50, tileh:50});
    Q.sheet("tile6","6.png",{tilew:50, tileh:50});
    Q.sheet("tile7","7.png",{tilew:50, tileh:50});
    Q.sheet("tile8","8.png",{tilew:50, tileh:50});
    Q.sheet("tileDefault","default.png",{tilew:50, tileh:50});
    Q.sheet("tileFlag","flag.png",{tilew:50, tileh:50});
    Q.sheet("tileMine","mine.png",{tilew:50, tileh:50});
    Q.sheet("undecided","undecided.png",{tilew:50, tileh:50});
    Q.stageScene("sweeper");

});

Q.scene("sweeper", function (stage) {
    dataInit();
    tiles = new Array(columns);
    var i;
    for(i = 0; i < columns;i++){
        var j;
        tiles[i] = new Array(onRow);
        for (j = 0; j < onRow;j++){
            tiles[i][j] = stage.insert(new Q.Tile({x:25 + (50 *j), y:75 +(50*i), objX:j,objY:i}));
        }
    }
    initTiles();
    var container = stage.insert(new Q.UI.Container({
        x: 0, y: 0
    }));
    var score = container.insert(new Q.UI.Text({
        x:20, y:20, label: "Počet bomb: " + bombCount, color: "black", align:"left"
    }));
});

var currentObj = null;
Q.el.addEventListener('mouseup', function (e) {
    if(!end) {
        if (e.which == 1) {
            var x = e.offsetX || e.layerX,
                y = e.offsetY || e.layerY,
                stage = Q.stage();

            // Use the helper methods from the Input Module on Q to
            // translate from canvas to stage
            var stageX = Q.canvasToStageX(x, stage),
                stageY = Q.canvasToStageY(y, stage);

            // Find the first object at that position on the stage
            var obj = stage.locate(stageX, stageY);


            // Set a `hit` property so the step method for the
            // sprite can handle scale appropriately

            if (currentObj) {
                currentObj.p.over = false;
            }
            if (obj) {
                currentObj = obj;
                obj.p.over = true;
                //obj.p.sheet = "tile2";
                obj.touchEnd();
                //console.log("clicked ");
            }
        }
    }
});

Q.el.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    if(!end) {
        if (e.which == 3) {
            var x = e.offsetX || e.layerX,
                y = e.offsetY || e.layerY,
                stage = Q.stage();

            // Use the helper methods from the Input Module on Q to
            // translate from canvas to stage
            var stageX = Q.canvasToStageX(x, stage),
                stageY = Q.canvasToStageY(y, stage);

            // Find the first object at that position on the stage
            var obj = stage.locate(stageX, stageY);


            // Set a `hit` property so the step method for the
            // sprite can handle scale appropriately

            if (currentObj) {
                currentObj.p.over = false;
            }
            if (obj) {
                currentObj = obj;
                obj.p.over = true;
                //obj.p.sheet = "tile2";
                obj.flag();
                //console.log("clicked ");
            }
        }
    }
});


var initTiles = function () {
    for(var i = 0; i < bombCount; i++){
        var rnd = randomTile();
        while (tiles[rnd.y][rnd.x].p.value == "bomb"){
            rnd = randomTile();
        }
        tiles[rnd.y][rnd.x].p.value = "bomb";
    }

    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < onRow; j++) {
            if (tiles[i][j].p.value == "bomb") {

                if (tileExists( i - 1, j - 1)) {
                    tiles[i - 1][j - 1].p.bombsAround++;
                }
                if (tileExists( i - 1, j )) {
                    tiles[i - 1][j].p.bombsAround++;
                }
                if (tileExists( i - 1, j + 1)) {
                    tiles[i - 1][j + 1].p.bombsAround++;
                }
                if (tileExists( i, j - 1)) {
                    tiles[i][j - 1].p.bombsAround++;
                }
                if (tileExists( i, j + 1)) {
                    tiles[i][j + 1].p.bombsAround++;
                }
                if (tileExists( i + 1, j - 1)) {
                    tiles[i + 1][j - 1].p.bombsAround++;
                }
                if (tileExists( i + 1, j)) {
                    tiles[i + 1][j].p.bombsAround++;
                }
                if (tileExists( i + 1, j + 1)) {
                    tiles[i + 1][j + 1].p.bombsAround++;
                }
            }
        }
    }

    for(var i = 0; i < columns;i++){
        for (var j = 0; j < onRow;j++){
            if(tiles[i][j].p.value !== "bomb"){
                switch (tiles[i][j].p.bombsAround){
                    case 1: tiles[i][j].p.value = "tile1";break;
                    case 2: tiles[i][j].p.value = "tile2";break;
                    case 3: tiles[i][j].p.value = "tile3";break;
                    case 4: tiles[i][j].p.value = "tile4";break;
                    case 5: tiles[i][j].p.value = "tile5";break;
                    case 6: tiles[i][j].p.value = "tile6";break;
                    case 7: tiles[i][j].p.value = "tile7";break;
                    case 8: tiles[i][j].p.value = "tile8";break;
                    default: tiles[i][j].p.value = "empty";
                }
            }
        }
    }
    globalTiles = tiles;
};

var randomTile = function () {

    var x = Math.floor((Math.random() * onRow) );
    var y = Math.floor((Math.random() * columns));
    var rnd =  {x:x, y:y};
    return rnd;
};

var tileExists = function (y,x) {
    try{
        var value = tiles[y][x].p.value;
        return true;
    }catch (err){
        return false;
    }
};

var uncoverEmpty = function (y, x) {
    if(tiles[y][x].p.value == "empty" && tiles[y][x].p.sheet == "undecided"){
        tiles[y][x].p.sheet = "tileDefault";
        if(tileExists( tiles[y][x].p.objY, tiles[y][x].p.objX -1)){
            uncoverEmpty(tiles[y][x].p.objY,tiles[y][x].p.objX-1);
        }
        if(tileExists( tiles[y][x].p.objY, tiles[y][x].p.objX +1)){
            uncoverEmpty(tiles[y][x].p.objY,tiles[y][x].p.objX+1);
        }
        if(tileExists( tiles[y][x].p.objY-1, tiles[y][x].p.objX)){
            uncoverEmpty(tiles[y][x].p.objY-1,tiles[y][x].p.objX);
        }
        if(tileExists( tiles[y][x].p.objY+1, tiles[y][x].p.objX -1)){
            uncoverEmpty(tiles[y][x].p.objY+1,tiles[y][x].p.objX);
        }
    }
    if(tiles[y][x].p.value !== "bomb" && tiles[y][x].p.sheet == "undecided"){
        tiles[y][x].p.sheet = tiles[y][x].p.value;
    }
};

var checkIfWin = function () {
    var win = true;
    if(bombCount == flagsCount){
        for(var i = 0; i < columns;i++) {
            for (var j = 0; j < onRow; j++) {
                if(tiles[i][j].p.sheet == "tileFlag" && tiles[i][j].p.value !== "bomb") {
                    win = false;
                }
            }
        }
        return win;
    }else {
        return false;
    }
};

var popup = function () {

    $.fn.VideoPopUp = function (options) {

        var defaults = {
            backgroundColor: "#000000",
            opener: "video",
            maxweight: "640",
            pausevideo: false,
            idvideo: ""
        };

        var patter = this.attr('id');

        var settings = $.extend({}, defaults, options);

        var video = document.getElementById(settings.idvideo);
        function stopVideo() {
            video.pause();
            video.currentTime = 0;
        }

        $('#' + patter + '').css("display", "none");
        $('#' + patter + '').append('<div id="opct"></div>');
        $('#opct').css("background", settings.backgroundColor);
        $('#' + patter + '').css("z-index", "100001");
        $('#' + patter + '').css("position", "fixed")
        $('#' + patter + '').css("top", "0");
        $('#' + patter + '').css("bottom", "0");
        $('#' + patter + '').css("right", "0");
        $('#' + patter + '').css("left", "0");
        $('#' + patter + '').css("padding", "auto");
        $('#' + patter + '').css("text-align", "center");
        $('#' + patter + '').css("background", "none");
        $('#' + patter + '').css("vertical-align", "vertical-align");
        $("#videCont").css("z-index", "100002");
        $('#' + patter + '').append('<div id="closer_videopopup">&otimes;</div>');
        $("#" + settings.opener + "").on('click', function () {
            $('#' + patter + "").show();
            $('#'+settings.idvideo+'').trigger('play');

        });
        $("#closer_videopopup").on('click', function () {
            if(settings.pausevideo==true){
                $('#'+settings.idvideo+'').trigger('pause');
            }else{
                stopVideo();
            }
            $('#' + patter + "").hide();
        });
        return this.css({

        });
    };

}(jQuery);

function saveToLocal() {
    var x = {SBig : $("#Sbig").prop("checked"), SMedium : $("#SMedium").prop("checked"), SSmall : $("#SSmall").prop("checked"), Udef: $("#Udef").prop("checked"),
        Xcount: $("#Xcount").val() ,YCount: $("#Ycount").val(), BCount: $("#Bombcount").val()};
    localStorage.datas = JSON.stringify(x);
    location.reload();
}

var dataInit = function () {

    if(localStorage.datas) {
        var localX = JSON.parse(localStorage.datas);
        if (localX.SBig) {
            onRow = 30;
            columns = 15;
            bombCount = 50;
        } else if (localX.SMedium) {
            onRow = 20;
            columns = 10;
            bombCount = 30;
        } else if (localX.SSmall) {
            onRow = 10;
            columns = 8;
            bombCount = 12;
        } else if (localX.Udef) {
            onRow = localX.Xcount;
            columns = localX.YCount;
            bombCount = localX.BCount;
        } else {
            onRow = 30;
            columns = 15;
            bombCount = 50;
        }
    }

};

