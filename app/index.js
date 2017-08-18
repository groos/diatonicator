var $ = require('jquery');
var Tone = require('tone');

angular.module('diatonicator', [])
  .controller('diatonicController', function(){
    
    var Teoria = require('../teoria');
    var Diatonicator = require('../diatonicator');
    var Scale = require('../lib/scale');
    var Modes = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
    var VexChords = require('../lib/vexchords/chord.js');

    // vex chords stuff
    var notation = $('#notation');
    var Raphael = require('../lib/raphael/raphael.js');
    //var paper = Raphael(notation, 150, 140);
    //var chord = new ChordBox(paper, 30, 30);
    

    var diatonicator = this;
    diatonicator._tonic = "C3";
    diatonicator._scale = "major";

    var chromatic = Teoria.note(diatonicator._tonic).scale('chromatic');

    var formatTonicName = function (name) {
      if (name) {
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/[0-9]/g, '');
      }
    };

    diatonicator.handleScaleClick = function(scaleName){
      clearResults();

      diatonicator._scale = scaleName;

      var diatonic = new Diatonicator(getTonic(), scaleName);
      diatonicator.results = [];

      if (diatonic){
        for (i = 1; i < 8; i++){
          var chord = diatonic.chordAt(i);
          chord.interval = i;
          diatonicator.results.push(chord);
        }
      }
    };

    diatonicator.playChord = function(chord){
      var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
      
      //play a chord
      polySynth.triggerAttackRelease([chord.get("first").toString(), chord.get("third").toString(), chord.get("fifth").toString(), chord.get("seventh").toString()], "2n");
    };

    var updateResults = function() {
      diatonicator.handleScaleClick(getActiveScale());
    };
     
    var clearResults = function(){
      diatonicator.results = [];
    };

    var getActiveScale = function() {
      return diatonicator._scale;
    };

    var getTonic = function () {
      return diatonicator._tonic;
    };

    diatonicator.setTonic = function(noteName) {
      diatonicator._tonic = noteName + "3";
      updateResults();
    };

    diatonicator._tonics = chromatic.scale.map(function (interval, index) {
        var name = chromatic.interval(interval).get('unison').toString();
        return {
          name: name ? formatTonicName(name) : "could not get name",
          interval: index + 1
        };
    });

    diatonicator._scales = Modes.map(function (scaleName) {
      return {
        name: scaleName
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
  });