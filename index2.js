var $ = require('jquery');
var Tone = require('tone');

angular.module('diatonicator', [])
  .controller('diatonicController', function(){
    
    var Teoria = require('../teoria');
    var Diatonicator = require('../diatonicator');
    var Scale = require('../lib/scale');
    var ScaleTypes = ['major', 'melodicminor', 'harmonicminor'];
    var Modes = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];

    // get modes given a scale type
    var ModesDict = ['major' : ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian']
        , 'melodicminor': ['superlocrian', 'etc']
        , 'harmonicminor' : ['crazy mode', 'crazy mode']];


    var VexChords = require('../lib/vexchords/chord.js');
    var Vex = require('vexflow');

    var Raphael = require('../lib/raphael/raphael.js');

    ///////////////////////// Vex Staff Notation /////////////////////////
    var vf = Vex.Flow;

    var div = document.getElementById('notation');
    var renderer = new vf.Renderer(div, vf.Renderer.Backends.SVG);
    renderer.resize(500, 500);

    var context = renderer.getContext();

    var stave = new vf.Stave(10, 40, 400);
    stave.addClef('treble');
    stave.setContext(context).draw();

    // https://github.com/0xfe/vexflow/wiki/The-VexFlow-Tutorial
    

    var diatonicator = this;

    diatonicator.description = "Diatonicator is a music theory practice tool that helps you learn and practice diatonic modes in any key. It began as a proof of concept, and continues to be a work in progress. Some day I will refactor the code :)";
    diatonicator.links = {
      github: { text: 'Github', link: 'https://github.com/groos/diatonicator'},
      teoria: { text: 'Teoria.js', link: 'https://github.com/saebekassebil/teoria'},
      tone: { text: 'Tone.js', link: 'https://tonejs.github.io/'},
      twitter: { text: 'Twitter', link: 'https://twitter.com/ntgroos'}
    }

    diatonicator.keywords = "music, theory, guitar, piano, modes, ionian, dorian, phrygian, lydian, mixolydian, aeolian, locrian, jazz, improvisation, scale, scales, tonic, diatonic, practice, key, diatonicator";
    diatonicator.disclaimer = "Diatonicator is not approved for commercial use."


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    diatonicator._tonic = "C3";
    //diatonicator._scale = "major";
    diatonicator._scale = "harmonicminor"

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

    diatonicator.setScaleType = function(scaleType) {
      this._scaleType = scaleType;
    }

    diatonicator.pickChord = function(chord){
      playChord(chord);
      updateStaff(chord);
    };

    var playChord = function(chord){
      var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
      
      //play a chord
      polySynth.triggerAttackRelease([chord.get("first").toString(), chord.get("third").toString(), chord.get("fifth").toString(), chord.get("seventh").toString()], "2n");
    };

    var updateStaff = function(chord){
      var state = resetStaff();

      notes = [];
      var key = getKey(chord.toString());
      

      chord.simple().map(function(note){
        var accidental = getAccidental(note);

        if (accidental){
          notes.push(new vf.StaveNote({clef: 'treble', keys: [note + '/4'], duration : 'q'}).addAccidental(0, new vf.Accidental(accidental)));
        } else {
          notes.push(new vf.StaveNote({clef: 'treble', keys: [note + '/4'], duration : 'q'}));
        }
        
      }.bind(this));

      vf.Formatter.FormatAndDraw(state.context, state.stave, notes);
    };

    var getKey = function(root) {
      if (root && root.length){
        return root[0].toUpperCase();
      }
    };

    var getAccidental = function(root){
      if (root && root.length > 1){
        if (root.indexOf('#')){
          return '#';
        }

        if (root.subString(1).indexOf('b')){
          return 'b';
        }
      }
    };

    var resetStaff = function() {
      $('#notation svg').remove();
      var renderer = new vf.Renderer(div, vf.Renderer.Backends.SVG);
      renderer.resize(500, 500);
  
      var context = renderer.getContext();
  
      var stave = new vf.Stave(10, 40, 400);
      stave.addClef('treble');
      stave.setContext(context).draw();

      return {
        context: context,
        stave: stave
      }
    }

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
      resetStaff();
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

    var getModes = function(scaleType){
      var modesList = ModesDict[scaleType];

      return modesList.map(function(modeName){
        return {
          name : modeName
        };
      });
    };

    diatonicator._scales = getModes(this._scaleType);

    diatonicator._scaleTypes = ScaleTypes.map(function(scaleTypeName){
      return {
        name: scaleTypeName
      }
    });
  });