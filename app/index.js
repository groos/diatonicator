angular.module('diatonicator', [])
  .controller('diatonicController', function(){
    var $ = require('jquery');
    var _teoria = require('../teoria');
    var _diatonicator = require('../diatonicator');
    var _scale = require('../lib/scale');

    var diatonicator = this;

    diatonicator._tonic = "c4";
    var middleC = _teoria.note(diatonicator._tonic);
    var chromatic = middleC.scale('chromatic');
    diatonicator._tonics = chromatic.scale.map(function(interval, index){
      return {
        name : chromatic.interval(interval).get('unison').toString(),
        interval : index + 1
      };
    });

    diatonicator._scales = _scale.KNOWN_SCALES.map(function(scaleName){
      return {
        name : scaleName
      };
    });

    ///////////////////////// Vex Staff Notation /////////////////////////
    var Vex = require('vexflow');

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

    //vf.draw();
    ///////////////////////// Vex Staff Notation /////////////////////////

    diatonicator.handleScaleClick = function(scaleName){
      clearResults();
      var diatonic = new _diatonicator(getTonic(), scaleName);
      diatonicator.results = [];

      if (diatonic){
        for (i = 1; i < 8; i++){
          var chord = diatonic.chordAt(i);
          chord.interval = i;
          diatonicator.results.push(chord);
        }
      }
    };
     
    var clearResults = function(){
      diatonicator.results = [];
    };

    var getTonic = function() {
      return diatonicator._tonic;
    };

    diatonicator.setTonic = function(noteName) {
      diatonicator._tonic = noteName;
    };
  });