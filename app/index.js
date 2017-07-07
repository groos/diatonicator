var $ = require('jquery');
var _teoria = require('../teoria');
var _diatonicator = require('../diatonicator');
var _scales = require('../lib/scale');
var scales = _scales.KNOWN_SCALES;
var $wrapper = $('.wrapper');
var $results = $('.results-wrapper');
var Vex = require('vexflow');


/*

This code is verbose in order to be pedantic


*/

var vf = new Vex.Flow.Factory({
  renderer: {selector: 'notation', width: 500, heith: 200}
});

var score = vf.EasyScore();
var system = vf.System();

system.addStave({
  voices: [
    score.voice(score.notes('C#5/q, B4, A4, G#4', {stem: 'up'})),
    score.voice(score.notes('C#4/h, C#4', {stem: 'down'}))
  ]
}).addClef('treble').addTimeSignature('4/4');

vf.draw();


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

  // get each note in the chromatic scale
  // add it to a dropdown
  var cNote = _teoria.note('c4');

  scales.forEach(function(name){
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

      var chordData = diatonic.chordAt(i);

      if (chordData){
        var chord = $('<div />', { 'class' : 'chord-details'});
        chord.html('<div>Interval: ' + i + ' | ' + chordData.name + '</div>');
        chord.appendTo($results);

        var notes = chordData.notes();

        // TODO - build the EasyScore string for vexflow - something like: 'C#5/q, B4, A4, G#4'
        notes.forEach(function(note){
          var name = note.toString();
          console.log(name);
          
          
          // TODO add the voicing to vexflow
        });
      }
    } 
  }
};
 
var clearResults = function(){
  $results.find('*').off();
  $results.off().empty();
  $results.append(html);
 
  // TODO - reset vexflow staff
};

buildScalesPicker(); 