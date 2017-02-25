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
    var scaleItem = $('<span />', {'class' : 'scale-item', 'text' : scale.name, 'css' : {}});
    scaleItem.appendTo(dropdownWrapper);
  }, this);

  dropdownWrapper.appendTo($wrapper);
};

document.body.appendChild(component());
buildScalesPicker();