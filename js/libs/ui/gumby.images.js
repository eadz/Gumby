/**
* Gumby Images
*/
!function() {

	'use strict';

	function Images($el) {

		this.$el = $el;
		// is this an <img> or background-image?
		// set handler function accordingly
		this.handler = this.$el.is('img') ? this.insertImage : this.insertBgImage;
		// supports attribute in format test:image
		this.supports = Gumby.selectAttr.apply(this.$el, ['supports']) || false;
		// media attribute in format mediaQuery:image
		this.media = Gumby.selectAttr.apply(this.$el, ['media']) || false;
		// default image to load
		this.def = Gumby.selectAttr.apply(this.$el, ['default']) || false;
		// feature supported or media query matched
		this.success = false;

		// if support attribute supplied and Modernizr is present
		if(this.supports && Modernizr) {
			this.supports = this.parseAttr(this.supports);
			this.success = this.handleSupports();
		}

		// if media attribute supplied and matchMedia is supported
		// and success is still false, meaning no supporting feature was found
		if(this.media && window.matchMedia && !this.success) {
			this.media = this.parseAttr(this.media);
			this.success = this.handleMedia();
		}

		// no feature supported or media query matched so load default if supplied
		if(!this.success && this.def) {
			this.success = this.def;
		}

		if(!this.success) {
			return false;
		}

		this.handler(this.success);
	}

	// handle media object checking each prop for matching media query 
	Images.prototype.handleMedia = function() {
		var scope = this,
			supported = false;

		$(this.media).each(function(key, val) {
			// media query matched
			// supplied in order of preference so halt each loop
			if(window.matchMedia(val.test).matches) {
				supported = val.img;
				return false;
			}
		});

		return supported;
	};

	// handle supports object checking each prop for support
	Images.prototype.handleSupports = function() {
		var scope = this,
			supported = false;

		$(this.supports).each(function(key, val) {
			// modernizr test passes so load in image 
			// supplied in order of preference so halt each loop
			if(Modernizr[val.test]) {
				supported = val.img;
				return false;
			}
		});

		return supported;
	};

	// preload image and update image src
	Images.prototype.insertImage = function(img) {
		var scope = this,
			image = $(new Image());

		image.load(function() {
			scope.$el.attr('src', img);
		}).attr('src', img);
	};

	// preload image and update background-image
	Images.prototype.insertBgImage = function(img) {
		var scope = this,
			image = $(new Image());

		image.load(function() {
			console.log(scope.$el.css('backgroundImage'));
			scope.$el.css('background-image', 'url('+img+')');
		}).attr('src', img);
	};

	// parse attribute strings, media/support
	Images.prototype.parseAttr = function(support) {
		var supp = support.split(','),
			res = [], splt = [];

		// multiple can be supplied so loop round and create object 
		$(supp).each(function(key, val) {
			splt = val.split('|');
			if(splt.length !== 2) {
				return true;
			}

			// object containing Modernizr test or media query and image url
			res.push({
				'test' : splt[0],
				'img' : splt[1]
			});
		});

		return res;
	};

	// add initialisation
	Gumby.addInitalisation('images', function() {
		$('[gumby-supports],[data-supports],[supports],[gumby-media],[data-media],[media]').each(function() {
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
