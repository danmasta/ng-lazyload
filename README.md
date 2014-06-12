ngLazyload
========

Angular module for lazyloading images in your angular js applications. Some of goals of this project worth noting include:

* Be lightweight, powerful and easy to use
* Work on any image type
* Add loading class while image is loading
* Load adaptive image size for tablets/ mobiles
* Respond to url changes/ updates
* Automatically set background-image for non `<img>` tags
* Automatically set background-size for non `<img>` tags
* Manual configuration via attributes

#Usage
ngLazyload is composed of one directive and two attributes for configuration. The directive can be used like regular angular directives:

###Directive: ng-lazyload
The `ng-lazyload` directive takes only one argument, the image url. The url will be loaded in the background, the class 'loading' will be added to the element. When the image has finished loading the `src` attribute will be set with the correct url and the 'loading' class will be removed. If the element is not an `<img>` tag, the `background-image` url will be set, as well as the `background-size` property.

```html
<div ng-lazyload="http://path-to-image.filetype"></div>
```
###Attribute: ng-lazyload-style
The `ng-lazyload-style` attribute is to specify the custom `background-size` if needed. By default the module will try to determine the best `background-size` based on image aspect ratio to container aspect ratio. This only applies to non `<img>` tag elements.

```html
<div ng-lazyload="http://path-to-image.filetype" ng-lazyload-style="contain"></div>
```

###Attribute: ng-lazyload-adaptive
The `ng-lazyload-adaptive` attribute takes a boolean value of `true` or `false`. When set to true, before loading the image url, the module will append -xs, -sm, or -md to the url based on screen width. If the appended url is not found, it will revert to the default url and try to load again.

```html
<div ng-lazyload="http://path-to-image.filetype" ng-lazyload-adaptive="true"></div>
```

affix | breakpoint
---- | ----
-xs | < 768
-sm | < 992
-md | < 1200
