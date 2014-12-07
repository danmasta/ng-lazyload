/**
 * @license ngLazyload.js v2.0.0
 * (c) 2014 Daniel Smith http://www.danmasta.com
 * License: MIT
 */
(function(window, angular, undefined){ 'use strict';

/**
 * @name ngLazyload
 * @description
 *
 * # ngLazyload
 *
 * The ngLazyload module provides an angular directive for lazyloading images.
 * Works on any image type
 * Adds loading class while loading
 * Can load adaptive image sizes if into that kind of thing
 * Responds to url changes/ updates
 * Automatically sets background-image on non <img> tags
 * Automatically sets background-size on non <img> tags
 * Can pass background size manually if you prefer a specific setting
 */

// define ngLazyload module
var ngLazyload = angular.module('ngLazyload', []);

ngLazyload.provider('lazyload', [function lazyloadProvider(){

  // default global options
  var defaults = {
    adaptive: false,
    size: false,
    classes: true
  };

  // returns defaults or specified default by key
  this.get = function(key){
    return key ? defaults[key] : defaults;
  };

  // set defaults
  this.set = function(opts){
    return angular.extend(defaults, opts);
  };

  // service object
  this.$get = ['$q', '$window', '$log',  function($q, $window, $log){

    var _this = this;

    // capitalize string
    function capitalize(string){
      return string.charAt(0).toUpperCase() + string.substring(1);
    };

    // normalize options between defaults, attributes, and params
    function normalizeOpts($attr, opts){
      var aopts = {};
      if($attr){
        var keys = Object.keys(defaults);
        for(var i = 0; i < keys.length; i++){
          var name = 'lazyload' + capitalize(keys[i]);
          if($attr[name]) aopts[keys[i]] = $attr[name];
        }
      }
      return angular.extend({}, defaults, aopts, opts);
    };

    // toggle class helper
    function toggle($elem, opts){
      var keys = Object.keys(opts);
      for(var i = 0; i < keys.length; i++){
        $elem.toggleClass(keys[i], opts[keys[i]]);
      }
    };

    // append string to url
    function appendToImgUrl(url, string, separator){
      if(string){
        var array = url.split('.');
        var piece = [array.splice(-2, 1), separator || '-', string].join('');
        array.splice(-1, 0, piece);
        url = array.join('.');
      }
      return url;
    };

    // get adaptive url based on window width
    function getAdaptiveUrl(url){
      var w = $window.innerWidth;
      var string = w < 768 ? 'xs' : w < 992 ? 'sm' : w < 1200 ? 'md' : '';
      return appendToImgUrl(url, string);
    };

    // load a url, return a promise with url or img object
    function load(url){
      var defer = $q.defer();
      var img = new Image();

      // resolve on load
      img.onload = function(){
        defer.resolve(img);
      };

      // reject on error
      img.onerror = function(event, data){
        defer.reject(url);
      };

      // set src, begin loading
      img.src = url;

      // return promise
      return defer.promise;
    };

    // adaptive load function, falls back to original url if error
    function aload(url){
      var defer = $q.defer();
      var aurl = getAdaptiveUrl(url);

      // load adaptive url
      load(aurl).then(function(img){
        defer.resolve(img);
      }, function(){
        load(url).then(function(img){
          defer.resolve(img);
        }, function(){
          defer.reject(url);
        });
      });

      // return promise
      return defer.promise;
    };

    // set img src or css background
    function setImg($elem, img){
      if(/img/i.test($elem[0].nodeName)){
        $elem[0].src = img.src;
      } else {
        $elem.css({
          backgroundImage: ['url(', img.src, ')'].join(''),
        });
      }
    };

    // set background-size based on options and aspect ratio
    function setSize($elem, img, opts){
      if(!/img/i.test($elem[0].nodeName)){
        if(/true|auto/i.test(opts.size)){
          var w = img.width;
          var h = img.height;
          var string = h/w < 9/16 ? '100% auto' : h > w ? 'auto 100%' : 'cover';
          opts.size = string;
        }
        $elem.css({ backgroundSize: opts.size });
      }
    };

    // start lazyload process
    // returns promise
    function lazyload(url, $elem, $attr, opts){
      var opts = normalizeOpts($attr, opts);
      var promise = opts.adaptive ? aload(url) : load(url);

      // set state classes on element
      if(opts.classes){
        toggle($elem, {loading: true, error: false});
        promise.then(null, function(){
          toggle($elem, {error: true});
        });
        promise.finally(function(){
          toggle($elem, {loading: false});
        });
      }

      // on load set img and size
      promise.then(function(img){
        setImg($elem, img);
        setSize($elem, img, opts);
      }, function(url){
        $log.warn('img not found', url);
      });

      // return promise
      return promise;
    };

    // helper for managing lazyload vs preload
    function preload(url, $elem, $attr, opts){
      if($elem){
        return lazyload.apply(null, arguments);
      } else {
        return load(url);
      }
    };

    // return helper function
    return preload;

  }];

}]);

// returns promise that resolves when all images have loaded
ngLazyload.service('preload', ['lazyload', '$q', function(lazyload, $q){
  return function(urls){
    var promises = [];
    for(var i = 0; i < urls.length; i++){
       promises.push(lazyload(urls[i]));
    }
    return $q.all(promises);
  };
}]);

// lazyload directive
ngLazyload.directive('lazyload', ['lazyload', function(lazyload){
  return{
    compile: function(tElem, tAttr){
      return function($scope, $element, $attributes){
        $attributes.$observe('lazyload', function(newval, oldval){
          if(newval){
            lazyload(newval, $element, $attributes);
          }
        });
      }
    }
  }
}]);

})(window, window.angular);
