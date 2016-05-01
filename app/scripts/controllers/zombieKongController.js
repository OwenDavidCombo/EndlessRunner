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
    }
    
    runMenuScreen=function(){
        stage.removeChild(SplashLogo);
        canvas.style.backgroundColor = 'rgba(223, 244, 215, 1)';
        stage.addChild(ZombieKong);
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
        }else if(event.item.id=="ZombieKong"){
            ZombieKong=new createjs.Bitmap(event.result); 
            ZombieKong.x = ((cWidth-ZombieKong.getBounds().width)/2)//position our logo centre x
        }
    }
    
    function setupManifest() {//code from http://code.tutsplus.com/tutorials/using-createjs-preloadjs-soundjs-and-tweenjs--net-36292
        manifest = [{
            src:  "images/SplashLogoFull.png",
            id: "SplashLogo"
        },
        {
            src:  "images/ZombieKong.png",
            id: "ZombieKong"
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
    var SplashLogo,ZombieKong;
})();