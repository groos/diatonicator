var $ = require('jquery');
var _diatonicator = require('../diatonicator');
var _scales = require('../lib/scale');
var scales = _scales.KNOWN_SCALES;
var $wrapper = $('.wrapper');
var $results = $('.results-wrapper');

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

  scales.forEach(function(name){

    // create a list item for the picker
    var scaleItem = $('<div />', {'data-scale' : name, 'class' : 'scale-item', 'css' : {'border-style' : 'solid'}});
    scaleItem.html(name);

    scaleItem.click(handleScaleClick.bind(this));
    
    scaleItem.appendTo(dropdownWrapper);
  }, this);

  dropdownWrapper.appendTo($wrapper);
};

var handleScaleClick = function(e){
  clearResults();
  
  var diatonic = new _diatonicator('a4', $(e.target).data('scale'));

  if (diatonic){
    for (i = 1; i < 8; i++){

      var chord = $('<div />');
      chord.html('<div>Interval: ' + i + ' | ' + diatonic.chordAt(i).name + '</div>');
      chord.appendTo($results);
    }
  }
};

var clearResults = function() {
  $results.find('*').off();
  $results.off().empty();
  $results.append(html);
};

//document.body.appendChild(component());

buildScalesPicker();