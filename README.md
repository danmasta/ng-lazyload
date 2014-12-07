ngLazyload
========

Angular module for lazyloading images in your applications. Some of goals of this project worth noting include:

* Be lightweight, powerful and easy to use
* Work on any image type
* Add loading class while image is loading
* Load adaptive image size for tablets/ mobiles
* Respond to url changes/ updates
* Automatically set background-image for non `<img>` tags
* Automatically set background-size for non `<img>` tags
* Manual configuration via attributes

##Usage
ngLazyload is composed of one provider, two services, and one directive. The preload and lazyload services can be injected into other parts of your app for preloading/ lazyloading on the fly. The directive can be used in templates to lazyload images via attributes. The provider can be injected into your app's configuration phase and used to set default global options.

###Provider
```javascript
app.config(['lazyloadProvider', function(lazyloadProvider){
  lazyloadProvider.set({adaptive: false, size: false, classes: true});
}]);
```

####Methods
name | description
---- | ----
<pre>get(key)</pre> | returns current default options, optional key returns that value only
<pre>set(opts)</pre> | sets default options, accepts an object with key value pairs of options

####Default Options
name | value | description
---- | ----- | -----------
<pre>adaptive</pre> | false | boolean - attempt to load adaptive image url
<pre>size</pre> | false | boolean or string - css property string to use as `background-size` on non `<img>` elements. value of true will determine best setting automatically. false disables output.
<pre>classes</pre> | true | boolean - enable/ disable loading and error classes

###Service: lazyload
Lazyload service is itself a function that accepts four arguments and manages the lazyloading process. Always returns a promise that resolves with an `<img>` object if succesful or rejects with url if there is an error.

```javascript
app.directive('someThing', ['lazyload', function(lazyload){
  return{
    link: function($scope, $element, $attributes, controller){
      var opts = {adaptive: true, classes: false};
      var load = lazyload('some-url.filetype', $element, $attributes, opts);
      load.then(function(img){
        // do stuff after img successfully loaded
      });
    }
  }
}]);
```
####Arguments
name | description
---- | ----
<pre>url</pre> | required - string - url path of image to load
<pre>$elem</pre> | optional - array - angular or jquery element to bind image to
<pre>$attr</pre> | optional - object - angular post-link normalized attributes object, necessary if setting options via element attributes
<pre>opts</pre> | optional - object - lazyload configuration options

###Service: preload
Preload service is a helper/ utility function for loading an array of image urls at once. It does not set any values on elements or modify the dom at all, it only loads urls and returns a promise using `$q.all()` that resolves when all urls have loaded. You can use the `.notify()` method to receive updates on loading status.
```javascript
app.run(['preload', function(preload){
  var urls = [
    'some-img-url.filetype',
    'some-img-url.filetype',
    'some-img-url.filetype',
    'some-img-url.filetype'
  ];
  preload(urls).then(function(){
    // do something when images have loaded
  });
}]);
```
####Arguments
name | description
---- | ----
<pre>urls</pre> | required - array - array of url paths to load


###Directive: lazyload
The lazyload directive is a very useful tool for lazyloading images from templates or dom elements. This is great for things like image sliders, page headers, blog images, etc. It will automatically watch the lazyload attribute for url changes and load the image whenever changed or updated.
```html
<div lazyload="http://path-to-image.filetype"></div>
```

####Configuring options via attributes
Any of the default options can be overriden on an individual basis with attributes by prefixing the option name with 'lazyload'
```html
<div lazyload="http://path-to-image.filetype" lazyload-adaptive="true" lazyload-size="cover"></div>
```

##Notes
The adaptive image loading breakpoints are as follows

affix | breakpoint
----- | ----------
<pre>-xs</pre> | $window.innerWidth < 768
<pre>-sm</pre> | $window.innerWidth < 992
<pre>-md</pre> | $window.innerWidth < 1200

When adaptive is set to true, the url is affixed with one of the options above. If the affixed url is not found, it will fall back to the original non-affixed url and try again.

##Roadmap
A few things I'm interested in pursuing with this project in the future are

* option to set custom breakpoints and affixes for adaptive loading urls
* api for setting `<img>` element styles similar to how `background-styles` are handled now
