/**
* Gumby Images
*/
!function() {

	'use strict';

	function Images($el) {

		this.$el = $el;
		// supports attribute in format test:image
		this.supports = Gumby.selectAttr.apply(this.$el, ['supports']) || false;
		// media attribute in format mediaQuery:image
		this.media = Gumby.selectAttr.apply(this.$el, ['media']) || false;
		// default image to load
		this.def = Gumby.selectAttr.apply(this.$el, ['default']) || false;

		// if support attribute supplied and Modernizr is present
		if(this.supports && Modernizr) {
			// parse and handle that attribute
			this.supports = this.parseSupport(this.supports);
			this.handleSupports(this.supports);
		}
	}

	// handle supports object checking each prop for support
	Images.prototype.handleSupports = function() {
		var scope = this,
			supported = false;

		$(this.supports).each(function(key, val) {
			// modernizr test passes so load in image 
			// supplied in order of preference so halt each loop
			if(!!Modernizr[val.test]) {
				scope.insertImage(val.img);
				supported = true;
				return false;
			}
		});

		// no feature supported so load default if supplied
		if(!supported && this.def) {
			this.insertImage(this.def);
		}
	};

	// preload image and update image src
	Images.prototype.insertImage = function(img) {
		var scope = this,
			image = $(new Image());

		image.load(function() {
			scope.$el.attr('src', img);
		}).attr('src', img);
	};

	// parse support attribute string
	Images.prototype.parseSupport = function(support) {
		var supp = support.split(','),
			res = [], splt = [];

		// multiple can be supplied so loop round and create object 
		$(supp).each(function(key, val) {
			splt = val.split('|');
			if(splt.length !== 2) {
				return true;
			}

			// object containing Modernizr test and image url
			res.push({
				'test' : splt[0],
				'img' : splt[1]
			});
		});

		return res;
	};

	// add initialisation
	Gumby.addInitalisation('images', function() {
		$('img[gumby-supports],img[data-supports],img[supports],img[gumby-media],img[data-media],img[media]').each(function() {
			var $this = $(this);
			// this element has already been initialized
			if($this.data('isImage')) {
				return true;
			}
			// mark element as initialized
			$this.data('isImage', true);
			new Images($this);
		});
	});

	// register UI module
	Gumby.UIModule({
		module: 'images',
		events: [],
		init: function() {
			Gumby.initialize('images');
		}
	});
}();
