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
            worldx+=-5;
        }
    }

    var worldx=1;
    var worldy=1;
    runGame = function(){
        stage.removeAllChildren();
        canvas.style.backgroundColor = 'rgba(223, 44, 43, 0.8)';
        grid = createBgGrid(8,6);
        runloop=true;
        stage.addChild(grid);
    }
    
    createBgGrid = function(numX, numY) {//taken from tutorial: http://indiegamr.com/retro-style-platform-runner-game-for-mobile-with-easeljs-part-3-adding-movement-more-collision/
        var w=cWidth;
        var h=cHeight;
        var grid = new createjs.Container();
        grid.snapToPixel = true;
        // calculating the distance between
        // the grid-lines
        var gw = w/numX;
        var gh = h/numY;
        // drawing the vertical line
        var verticalLine = new createjs.Graphics();
        verticalLine.beginFill(createjs.Graphics.getRGB(101, 60, 176));
        verticalLine.drawRect(0,0,gw * 0.02,gh*(numY+2));
        var vs;
        // placing the vertical lines:
        // we're placing 1 more than requested
        // to have seamless scrolling later
        for ( var c = -1; c < numX+1; c++) {
            vs = new createjs.Shape(verticalLine);
            vs.snapToPixel = true;
            vs.x = c * gw;
            vs.y = -gh;
            grid.addChild(vs);
        }
        // drawing a horizontal line
        var horizontalLine = new createjs.Graphics();
        horizontalLine.beginFill(createjs.Graphics.getRGB(101, 60, 176));
        horizontalLine.drawRect(0,0,gw*(numX+1),gh * 0.02);
        var hs;
        // placing the horizontal lines:
        // we're placing 1 more than requested
        // to have seamless scrolling later
        for ( c = -1; c < numY+1; c++ ) {
            hs = new createjs.Shape(horizontalLine);
            hs.snapToPixel = true;
            hs.x = 0;
            hs.y = c * gh;
            grid.addChild(hs);
        }

        // return the grid-object
        return grid;
    }

    
    runMenuScreen=function(){
        pauseRendering=true;
        stage.removeChild(SplashLogo);
        stage.addChild(ZombieEye);
        stage.addChild(ZombieKongMenu);
        stage.addChild(runButton);
        setTimeout(function(){
            canvas.style.backgroundColor = 'rgba(223, 244, 215, 1)';
            pauseRendering=false;
        },500);
        
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
         
    }
    
    
    
    runSplashscreen =function(){//display Splashscreen. PreloadJs to load game assets
            createjs.Tween.get(SplashLogo, { loop: false })
            .to({ y:((cHeight-SplashLogo.getBounds().height)/2)}, 2000, createjs.Ease.getPowInOut(4))
            .to({ alpha:0, visible:false}, 2000)//move to center then alpha out
            .call(runMenuScreen);  
    }
    
    loadComplete =function(){   
        //stage.update();
        pauseRendering=false;
    }
    
    handleFileLoad = function(event){
        if(event.item.id=="SplashLogo"){
            SplashLogo=new createjs.Bitmap(event.result); 
            SplashLogo.x = ((cWidth-SplashLogo.getBounds().width)/2)//position our logo centre x
            stage.addChild(SplashLogo);
            runSplashscreen();
        }else if(event.item.id=="ZombieKongMenu"){
            ZombieKongMenu=new createjs.Bitmap(event.result); 
            ZombieKongMenu.x = ((cWidth-ZombieKongMenu.getBounds().width)/2)//position our logo centre x
        }else if(event.item.id=="ZombieEye"){
            ZombieEye=new createjs.Bitmap(event.result); 
            ZombieEye.regX=ZombieEye.getBounds().width/2;
            ZombieEye.regY=ZombieEye.getBounds().height/2;
            ZombieEye.x = (cWidth*(474/800))+ZombieEye.regX//position our logo centre x
            ZombieEye.y = (cHeight*(106/600))+ZombieEye.regY; //106
        }else if(event.item.id=="runButton"){
            runButton=new createjs.Bitmap(event.result); 
            runButton.x = 30;
            runButton.y = cHeight-((runButton.getBounds().height)+30);
            runButton.cursor="pointer";
            runButton.addEventListener("click", function(){
                runGame();
            })
        }
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
    var SplashLogo,ZombieKongMenu,ZombieEye,runButton,grid;
    var runloop=false;
})();