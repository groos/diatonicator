var $ = require('jquery');
var _diatonicator = require('../diatonicator');
var _scales = require('../lib/scale');
var scales = _scales.KNOWN_SCALES;
var $wrapper = $('.wrapper');

function component () {
  var element = document.createElement('div');

  var diatonicator = new _diatonicator('a4', 'mixolydian');

  for (i = 1; i < 8; i++){
    console.log(diatonicator.chordAt(i));
  }

  return element
}

var buildScalesPicker = function(){
  var dropdownWrapper = $('<div />', {'class' : 'scales-picker-wrapper', 'css' : {'width' : '200px', 'border-style' : 'solid'}})

  scales.forEach(function(scale){

    // get the scale representation

    // create a list item for the picker

    // bind a click event

    // click: print out the diatonic chords 

    var s = new _diatonicator('a4', scale);

    var scaleItem = $('<span />', {'class' : 'scale-item', 'text' : scale, 'css' : {}});
    scaleItem.appendTo(dropdownWrapper);
  }, this);

  dropdownWrapper.appendTo($wrapper);
};

document.body.appendChild(component());
buildScalesPicker();