(function(){
    
    angular.module("sharedModule")
    .service("screenService", screenService);
    
    //expose common canvas services
    function screenService(){
        
        this.setCanvasDPI = setCanvasDPI;
        this.centerThis = centerThis;  
        this.logPosition = logPosition;
        this.clicksound = clicksound;
        this.setCookie = setCookie;
        this.checkVolume = checkVolume;
       
    }
    
    var setCookie = function setCookie(cname, cvalue, exdays) {
          var d = new Date(), expires = "";
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    var getCookie = function getCookie(cname) {
            var name = cname + "=", ca = document.cookie.split(';'), c = "", i = "";
        for (i = 0; i < ca.length; i = i + 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    var checkVolume = function checkVolume() {
        var volume = getCookie("volume");
        if (volume !== "") {
            return volume;
        } else {setCookie("volume","1","30");return 1;}
    }
    
 
    
   var clicksound = function clicksound(){
           // if initializeDefaultPlugins returns false, we cannot play sound in this browser           
           createjs.Sound.registerSound("sounds/test.mp3", "mysoundID",1);
           var instance = createjs.Sound.play("mysoundID");
            // set the sound volume
             instance.volume = checkVolume();
    }
    
   var volume = function volume(){
       return 0;
       
   }
    
    //sets resolution and size on canvas passed and returns canvas
    var setCanvasDPI= function(canvas,width,height){
            var ctx = document.createElement("canvas").getContext("2d"),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
            
            ratio = dpr / bsr;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
            return canvas;
    }
    
    //returns object centered on canvas
    var centerThis = function(canvas, myObject){ 
        var b =myObject.getBounds();  
        myObject.x = canvas.width/2 - b.width/2; 
        myObject.y = canvas.height/2 - b.height/2;
        return myObject;
    }
    
    var logPosition = function(myObject){
        console.log(""+myObject.getBounds ());
    }
    
})();