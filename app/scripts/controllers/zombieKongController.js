(function(){
    
    angular.module("zombieKong")
    .controller("zombieKongController", zombieKongController);
    
    zombieKongController.$inject=["$scope","screenService"];
    
    function zombieKongController($scope,screenService){
        $scope.init=init(screenService);
        $scope.screenService=screenService;
    }//endOfZombieKongController
    
    init = function(screenService){
       screenService=screenService;
    }
    
    var canvas;
    var stage;
    var cWidth;
    var cHeight;
    var fps = 30;
    var player;
    var screenService;
    
})();