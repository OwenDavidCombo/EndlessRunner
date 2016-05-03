(function(){
    
    angular.module("zombieKong")
    .controller("zombieKongController", zombieKongController);
    
    zombieKongController.$inject=["$scope","screenService"];
    
    function zombieKongController($scope,screenService){
        $scope.init=init(screenService);
        $scope.screenService=screenService;
    }//endOfZombieKongController
    
    init = function(screenService){//sets up the gameScreen and initialises 
       screenService=screenService;
       canvas =document.getElementById("demoCanvas");
       $("#main").width(cWidth).height(cHeight);
       $("#demoCanvas").width(cWidth).height(cHeight);
       canvas = screenService.setCanvasDPI(canvas,cWidth,cHeight);//set appropiate canvas resolution
       context =canvas.getContext("2d");
       stage = new createjs.Stage("demoCanvas");  
       stage.enableMouseOver(10);
       createjs.Ticker.setFPS(fps); //set our frameRate;
       createjs.Ticker.addEventListener("tick", render);//call our render loop on each tick
       setupManifest();//set up our assets array
       startPreload();//init preload queue
       
       canvas.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    }
    
    render = function(event){//render loop call stage.update when we want to show changes.
        if(!pauseRendering){ 
            stage.update();
        }
        if(runloop){
            grid.x = (worldx * .45) % (cWidth/8); // horizontal
            grid.y = (worldy * .45) % (cHeight/6);   // vertical
            rect.x=(worldx * .45) % (cWidth/8); 
            worldx+=-7;
            stage.update();
        }
    }

    var worldx=1;
    var worldy=1;
    runGame = function(){
        pauseRendering=true;
        stage.removeAllChildren();
        canvas.style.backgroundColor = 'rgba(223, 44, 43, 0.8)';
       
        var graphics=new createjs.Graphics().beginBitmapFill(preload.getResult("background"),'repeat').drawRect(0,0,canvas.width,canvas.height);
        back = new createjs.Shape(graphics);
        back.x = 0;back.y = 0;
        grid = createBgGrid(8,6);
        runloop=true;
        stage.addChild(back);
        stage.addChild(rect);
        stage.addChild(grid);
        stage.addChild(player)
        document.addEventListener("keydown",jumpChicken)
    }
    
    jumpChicken=function(){//jump the chicken
     if (event.which == 38 || event.keyCode == 38) {
         if(!isMidJump){
               isMidJump=true
               player.gotoAndPlay("stand")
               createjs.Tween.get(player, { loop: false })
                .to({ y:player.getTransformedBounds().y-100}, 600, createjs.Ease.getPowOut(4))
                .to({ y:(cHeight*(6/5))-player.getBounds().height}, 600, createjs.Ease.getPowIn(4))
               .call(function(){
                    player.gotoAndPlay("runRight")
                    isMidJump=false;
               })
         }//end isMidJump
       }  
    }
    
    createBgGrid = function(numX, numY) {//taken from tutorial: http://indiegamr.com/retro-style-platform-runner-game-for-mobile-with-easeljs-part-3-adding-movement-more-collision/
        var w=cWidth;
        var h=cHeight;
        var grid = new createjs.Container();
        grid.snapToPixel = true;
        // calculating the distance between
        // the grid-lines
        var gw = w/numX;
        var gh = h/numY+10;
        // drawing the vertical line
        var verticalLine = new createjs.Graphics();
        verticalLine.beginFill(createjs.Graphics.getRGB(0, 0, -0));
        verticalLine.drawRect(0,0,gw * 0.02,gh*(numY+3));
        
        var vs;
        // placing the vertical lines:
        // we're placing 1 more than requested
        // to have seamless scrolling later
        for ( var c = 0; c < numX+3; c++) {
            vs = new createjs.Shape(verticalLine);
            vs.snapToPixel = true;
            vs.x = c * gw;
            vs.y = -gh;
            grid.addChild(vs);
        }
        // drawing a horizontal line
        var horizontalLine = new createjs.Graphics();
        horizontalLine.beginFill(createjs.Graphics.getRGB(0, 0, 0));
        horizontalLine.drawRect(0,0,gw*(numX+3),gh * 0.02);
        
        
        var hs;
        // placing the horizontal lines:
        // we're placing 1 more than requested
        // to have seamless scrolling later
        for ( c = -1; c < numY+3; c++ ) {
            hs = new createjs.Shape(horizontalLine);
            hs.snapToPixel = true;
            hs.x = 0;
            hs.y = c * gh;
            grid.addChild(hs);
        }
        graphics = new createjs.Graphics().beginBitmapFill(preload.getResult("path")).drawRect(0, gh*6, gw*(numX+3), gh);//create the path
        rect = new createjs.Shape(graphics);
        return grid;
    }

    
    enterPressed=function(event){//if user presses enter then start
        if (event.which == 13 || event.keyCode == 13) {
            document.removeEventListener("keydown",enterPressed)
            runGame();
        }
    }
    
    
    runMenuScreen=function(){
        stage.removeChild(SplashLogo);
        stage.update();
        canvas.style.backgroundColor = 'rgba(223, 244, 215, 1)';
       var graphics=new createjs.Graphics().beginBitmapFill(preload.getResult("background"),'repeat').drawRect(0,0,canvas.width,canvas.height);
        back = new createjs.Shape(graphics);
        back.x = 0;back.y = 0;
        grid = createBgGrid(8,6);
        runloop=true;
        stage.addChild(back);
        stage.addChild(rect);
        stage.addChild(grid);
        stage.addChild(player);
        
        stage.addChild(ZombieEye);
        stage.addChild(ZombieKongMenu);
        stage.addChild(optionsButton);
        stage.addChild(runButton);
        
        document.addEventListener("keydown",jumpChicken)
        document.addEventListener("keydown",enterPressed);
                                
         createjs.Tween.get(ZombieEye, { loop: true })//animate eyeball
         .to({ rotation: Math.random() * (360)   }, Math.random() * (1500) + 500, createjs.Ease.getPowInOut(4))
         .to({ rotation: Math.random() * (360)   }, Math.random() * (1500) + 500, createjs.Ease.getPowInOut(4))
         .to({ rotation: Math.random() * (360)   }, Math.random() * (1500) + 500, createjs.Ease.getPowInOut(4))
         .to({ rotation: Math.random() * (360)   }, Math.random() * (1500) + 500, createjs.Ease.getPowInOut(4))
         .to({ rotation: Math.random() * (360)   }, Math.random() * (1500) + 500, createjs.Ease.getPowInOut(4))
         .to({ rotation: Math.random() * (360)   }, Math.random() * (1500) + 500, createjs.Ease.getPowInOut(4))
         .to({ rotation: Math.random() * (360)   }, Math.random() * (1500) + 500, createjs.Ease.getPowInOut(4))
         .to({ rotation: Math.random() * (360)   }, Math.random() * (1500) + 500, createjs.Ease.getPowInOut(4))
         .to({ rotation:0}, 1000)
         .to({ rotation:0}, 10000)//move to center then alpha out
         
        createjs.Tween.get(runButton, { loop: true })//animate runbutton
          .to({ scaleX: 1.1   }, 500, createjs.Ease.getPowInOut(4))
          .to({ scaleX: 1   }, 500, createjs.Ease.getPowInOut(4))
          
         createjs.Tween.get(runButton, { loop: true })//animate runbutton
          .to({ scaleY: 1.1   }, 500, createjs.Ease.getPowInOut(4))
          .to({ scaleY: 1   }, 500, createjs.Ease.getPowInOut(4))
         
         createjs.Tween.get(optionsButton, { loop: true })//animate runbutton
          .to({ scaleX: 1.1   }, 500, createjs.Ease.getPowInOut(4))
          .to({ scaleX: 1   }, 500, createjs.Ease.getPowInOut(4))
          
         createjs.Tween.get(optionsButton, { loop: true })//animate runbutton
          .to({ scaleY: 1.1   }, 500, createjs.Ease.getPowInOut(4))
          .to({ scaleY: 1   }, 500, createjs.Ease.getPowInOut(4))
         
        
    }
    
    
    
    runSplashscreen =function(){//display Splashscreen. PreloadJs to load game assets
            createjs.Tween.get(SplashLogo, { loop: false })
            .to({ y:((cHeight-SplashLogo.getBounds().height)/2)}, 2000, createjs.Ease.getPowInOut(4))
            .to({ alpha:0, visible:false}, 2000)//move to center then alpha out
            .call(runMenuScreen);  
    }
    
    runOptionsMenu =function(){
        stage.removeChild(runButton);
        stage.removeChild(optionsButton);
        
    }
    
    loadComplete =function(){//when preload has finished loading assets allow skipSplash screen on click
        canvas.addEventListener("click",skipIntro);
        pauseRendering=false;
        
        var data = {
                images: [preload.getResult("chickenRight"),preload.getResult("chickenStraight"),preload.getResult("chickenLeft"),preload.getResult("chickenStraight")],
                frames: {width:200,height:150},
                animations: {
                    stand:1,
                    runRight:[0,3,"front",4/fps],
                    back:[1,1,"back"],//was 1,1
                    speed:10
                }
            };
            var chickenSprite = new createjs.SpriteSheet(data);
            player = new createjs.Sprite(chickenSprite, "runRight");
            player.frequency=0.1;
            player.x=30;
            player.y=(cHeight*(6/5))-player.getBounds().height;
    }
    
    handleFileLoad = function(event){
        if(event.item.id=="SplashLogo"){
            SplashLogo=new createjs.Bitmap(event.result); 
            SplashLogo.x = ((cWidth-SplashLogo.getBounds().width)/2)//position our logo centre x
            stage.addChild(SplashLogo);
            runSplashscreen();
        }else if(event.item.id=="ZombieKongMenu"){
            ZombieKongMenu=new createjs.Bitmap(event.result); 
            
            ZombieKongMenu.scaleX =1.4;
            ZombieKongMenu.scaleY =1.3;
        }else if(event.item.id=="ZombieEye"){
            ZombieEye=new createjs.Bitmap(event.result); 
            ZombieEye.regX=ZombieEye.getBounds().width/2;
            ZombieEye.regY=ZombieEye.getBounds().height/2;
            ZombieEye.x = cWidth-0;
            ZombieEye.y = 260 //106
            ZombieEye.scaleX =1.4;
            ZombieEye.scaleY =1.3;
        }else if(event.item.id=="runButton"){
            runButton=new createjs.Bitmap(event.result); 
            runButton.x = 30;
            runButton.y = cHeight-((runButton.getBounds().height)+110);
            runButton.cursor="pointer";
            runButton.addEventListener("click", function(){
                runGame();
            })
        }else if(event.item.id=="optionsButton"){
            optionsButton=new createjs.Bitmap(event.result);
            optionsButton.x = 20;
            optionsButton.y = cHeight-((optionsButton.getBounds().height)+10);
            optionsButton.cursor="pointer";
            optionsButton.addEventListener("click", function(){
                runOptionsMenu();
            })
        }
    }
    
    skipIntro=function(event){    
         createjs.Tween.removeAllTweens();
         canvas.removeEventListener("click",skipIntro);
         runMenuScreen();
    }
      
    function setupManifest() {//code from http://code.tutsplus.com/tutorials/using-createjs-preloadjs-soundjs-and-tweenjs--net-36292
        manifest = [{
            src:  "images/SplashLogoFull.png",
            id: "SplashLogo"
        },
        {
            src:  "images/ZombieKongMenu.png",
            id: "ZombieKongMenu"
        },
        {
            src:  "images/ZombieEye2.png",
            id: "ZombieEye"
        },
        {
            src:  "images/runButton.png",
            id: "runButton"
         },
         {
            src:  "images/optionsButton.png",
            id: "optionsButton"
         },
         {
            src:  "images/chickenLeft.png",
            id: "chickenLeft"
         },
         {
            src:  "images/chickenRight.png",
            id: "chickenRight"
         },
         {
            src:  "images/chickenStraight.png",
            id: "chickenStraight"
         },
         {
            src:  "images/path.png",
            id: "path"
         },
         {
            src:  "images/background.png",
            id: "background"
         }
        ];
    }
       
    startPreload = function() {//init our preloadQueue. callback functions can be reenabled if needed and appropiate
        preload = new createjs.LoadQueue(true);
        preload.installPlugin(createjs.Sound);          
        preload.on("fileload", handleFileLoad);
        //preload.on("progress", handleFileProgress);
        preload.on("complete", loadComplete);
        //preload.on("error", loadError);
        preload.loadManifest(manifest);
 
    }
    
    var manifest; //a list of our assets to load
    var preload; //preloadJs queue which we will init with our assets in manifest
    var pauseRendering = true; //we will use this in render loop if needed to pause rendering for asset loading
    var context; //we will use 2d context for this game
    var canvas; //our html canvas object
    var stage; //our createJs stage
    var cWidth=800;
    var cHeight=600; //using 800*600. to see appropiate scaling use same aspect ratio 4:3 when increasing sizes
    var fps = 30;  //Frames Per Second. Lower this for analysis during development
    var player;
    var screenService; //Attach injectable screenService as a global lib
    var SplashLogo,ZombieKongMenu,ZombieEye,runButton,optionsButton,grid,chickenStraight,chickenRight,chickenLeft,chickenSprite,rect;
    var runloop=false;
    var isMidJump=false;

})();