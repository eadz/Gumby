/**
* Gumby Shuffle
*/
!function() {

	'use strict';

	function Shuffle($el) {

		this.$el = $el;

		// array of children
		this.children = $.makeArray(this.$el.children('.columns,.column'));
		// parse shuffle attribute into array of test:sequence objects
		this.shuffles = this.parseAttrValue(Gumby.selectAttr.apply(this.$el, ['shuffle']));
		this.shuffled = false;

		var scope = this;

		// handle tests now and then on resize
		this.handleTests();
		$(window).on('resize', function() {
			scope.handleTests();
		});
	}

	// loop round each test
	// if matchMedia passes then shuffle with that sequence
	Shuffle.prototype.handleTests = function() {
		var scope = this, succes = false;

		$(this.shuffles).each(function(key, val) {
			if(window.matchMedia(val.test).matches) {
				scope.shuffle(val.sequence);
				succes = true;
			}
		});

		// no tests passed so use original order
		// no arg passed for this
		if(!succes) {
			this.shuffle();
		}
	};

	// shuffle children into supplied sequence
	// sequence in format 1-2-3-4-5
	Shuffle.prototype.shuffle = function(sequence) {
		var scope = this,
			seq = [],
			newArr = [];

		// if sequence passed then fill newArr up with reordered children
		if(sequence) {
			seq = sequence.split('-');
			$(seq).each(function(index) {
				newArr.push($(scope.children[Number(seq[index])]));
			});

		// otherwise newArr is just the children array
		} else {
			newArr = this.children;
		}

		// empty parent and loop round newArr appending each child
		this.$el.html('');
		$(newArr).each(function() {
			scope.$el.append($(this));
		});
	};

	// return array of test:sequence objects
	Shuffle.prototype.parseAttrValue = function(str) {
		var supp = str.split(','),
			res = [], splt = [];

		// multiple can be supplied so loop round and create object 
		$(supp).each(function(key, val) {
			splt = val.split('|');
			if(splt.length !== 2) {
				return true;
			}

			// object containing Modernizr test or media query and dash separated sequence
			res.push({
				'test' : splt[0],
				'sequence' : splt[1]
			});
		});

		return res;
	};

	// add initialisation
	Gumby.addInitalisation('shuffle', function() {
		$('[data-shuffle],[gumby-shuffle],[shuffle]').each(function() {
			var $this = $(this);
			// this element has already been initialized
			if($this.data('isShuffle')) {
				return true;
			}
			// mark element as initialized
			$this.data('isShuffle', true);
			new Shuffle($this);
		});
	});

	// register UI module
	Gumby.UIModule({
		module: 'shuffle',
		events: [],
		init: function() {
			Gumby.initialize('shuffle');
		}
	});
}();
