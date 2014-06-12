/**
 * @license ngLazyload.js v1.0.0
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

ngLazyload.directive('ngLazyload', function(){
  return {
    restrict: 'A',
    controller: function($scope){
      var _this = this;
      var img = new Image();
      var $attributes;
      var $element;
      this.setStyle = function(url){
        $element.removeClass('loading');
        if($element[0].nodeName === 'IMG'){
          $element[0].src = url;
        } else {
          $element[0].style.backgroundImage = 'url(' + url + ')';
          if($attributes.ngLazyloadStyle)
            return $element[0].style.backgroundSize = $attributes.ngLazyloadStyle;
          var w = img.width;
          var h = img.height;
          if(h / w < 9 / 16){
            $element[0].style.backgroundSize = '100% auto';
          } else {
            if(h > w){
              $element[0].style.backgroundSize = 'auto 100%';
            } else {
              $element[0].style.backgroundSize = 'cover';
            }
          }
        }
      };
      this.loadAdaptiveImg = function($attrs){
        $attributes = $attrs;
        $element = $attrs.$$element;
        var url = this.getAdaptiveUrl();
        img.onload = function(){
          _this.setStyle(url);
        };
        img.onerror = function(){
          _this.loadDefaultImg();
        };
        img.src = url;
      };
      this.loadDefaultImg = function(){
        var url = $attributes.ngLazyload;
        img.onload = function(){
          _this.setStyle(url);
        };
        img.onerror = function(){
          console.log('No img found, please check source');
        };
        img.src = url;
      };
      this.updateUrl = function(array, string){
        var piece = array.splice(-2, 1) + string;
        array.splice(-1, 0, piece);
        return array.join('.');
      };
      this.getAdaptiveUrl = function(){
        var w = window.outerWidth;
        var url = $attributes.ngLazyload.split('.');
        var newUrl;
        if($attributes.ngLazyloadAdaptive === 'true'){
          if(w < 768){
            newUrl = this.updateUrl(url, '-xs');
          } else if(w < 992){
            newUrl = this.updateUrl(url, '-sm');
          } else if(w < 1200){
            newUrl = this.updateUrl(url, '-md');
          } else {
            newUrl = $attributes.ngLazyload;
          }
        } else {
          newUrl = $attributes.ngLazyload;
        }
        return newUrl;
      };
    },
    link: function($scope, $element, $attributes, controller){
      $attributes.$observe('ngLazyload', function(newval){
        if(!newval) return;
        $element.addClass('loading');
        controller.loadAdaptiveImg($attributes);
      });
    }
  };
});

})(window, window.angular);
