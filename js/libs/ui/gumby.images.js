/**
* Gumby Images
*/
!function() {

	'use strict';

	function Images($el) {

		this.$el = $el;

		// set up module based on attributes
		this.setup();
		this.init();
	}

	// set up module based on attributes
	Images.prototype.setup = function() {
		// is this an <img> or background-image?
		this.type = this.$el.is('img') ? 'img' : 'bg';
		// supports attribute in format test:image
		this.supports = Gumby.selectAttr.apply(this.$el, ['supports']) || false;
		// media attribute in format mediaQuery:image
		this.media = Gumby.selectAttr.apply(this.$el, ['media']) || false;
		// default image to load
		this.def = Gumby.selectAttr.apply(this.$el, ['default']) || false;
		// feature supported or media query matched
		this.success = false;

		// check functions
		this.checks = {
			supports : function(val) {
				return Modernizr[val];
			},
			media: function(val) {
				return window.matchMedia(val).matches;
			}
		};
	};

	// fire required checks and load resulting image
	Images.prototype.init = function() {
		// if support attribute supplied and Modernizr is present
		if(this.supports && Modernizr) {
			this.success = this.handleTests('supports', this.parseAttr(this.supports));
		}

		// if media attribute supplied and matchMedia is supported
		// and success is still false, meaning no supporting feature was found
		if(this.media && window.matchMedia && !this.success) {
			this.success = this.handleTests('media', this.parseAttr(this.media));
		}

		// no feature supported or media query matched so load default if supplied
		if(!this.success && this.def) {
			this.success = this.def;
		}

		// no image to load
		if(!this.success) {
			return false;
		}

		// preload image and insert or set background-image property
		this.insertImage(this.type, this.success);
	};

	// handle media object checking each prop for matching media query 
	Images.prototype.handleTests = function(type, array) {
		var scope = this,
			supported = false;

		$(array).each(function(key, val) {
			// media query matched
			// supplied in order of preference so halt each loop
			if(scope.check(type, val.test)) {
				supported = val.img;
				return false;
			}
		});

		return supported;
	};

	// return the result of test function 
	Images.prototype.check = function(type, val) {
		return this.checks[type](val);
	};

	// preload image and insert or set background-image property
	Images.prototype.insertImage = function(type, img) {
		var scope = this,
			image = $(new Image());

		image.load(function() {
			return type === 'img' ? scope.$el.attr('src', img) :
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
