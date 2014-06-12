var app = angular.module('app', ['ngLazyload']);

app.directive('lazyloadTest', [function(){
  var array = [];
  for(var i = 0; i < 100; i++){
    array.push(400 + i);
  };
  return{
    restrict:'A',
    controller: function($scope){
      $scope.randomNumber = function(){
        return array[parseInt(Math.random() * array.length)];
      };
      $scope.getUrl = function(){
        return['http://placekitten.com/', $scope.randomNumber(), '/', $scope.randomNumber()].join('');
      };
      $scope.load = function(){
        $scope.$broadcast('load.url');
      };
    },
    template:function(){
      return '<li data-test-item ng-repeat="item in testitems" class="col-xs-4" ng-lazyload="">{{item.title}}</li>'
    },
    link:function($scope, $element, $attributes, controller){
      $scope.testitems = [];
      for( var i = 0; i < 21; i++){
        $scope.testitems.push({title:'test item ' + i, value:i});
      }
    }
  };
}]);

app.directive('testItem', function(){
  return{
    restrict:'A',
    controller: function($scope){

    },
    link: function($scope, $element, $attributes, controller){
      function setUrl(){
        $attributes.$set('ngLazyload', $scope.getUrl());
      };
      $scope.$on('load.url', function(){
        setUrl();
      });
      setUrl();
    }
  };
});
