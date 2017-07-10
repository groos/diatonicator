angular.module('diatonicator', [])
  .controller('diatonicController', function(){
    var $ = require('jquery');
    var _teoria = require('../teoria');
    var _diatonicator = require('../diatonicator');
    var _scale = require('../lib/scale');
    var scales = _scale.KNOWN_SCALES;
    var $keysWrapper = $('.keys-wrapper');
    var $scalesWrapper = $('.scales-wrapper');
    var $resultsWrapper = $('.results-wrapper');

    var _tonic = "c4";

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

    var build = function(){
      buildRootPicker();
      buildScalesPicker();
    };

    var buildRootPicker = function(){
      var keys = $('<div />', { 'class' : 'keys picker'})

      // get the chromatic scale starting at some c4
      var middleC = _teoria.note('c4');
      var chromatic = middleC.scale('chromatic');
      chromatic.scale.forEach(function(interval){
        var name = chromatic.interval(interval).get('unison').toString();
        
        var note = $('<div />', {'data-note' : name, 'class' : 'note-item picker'});
        note.html('<span> ' + name + '</span>');
        note.click(chooseRoot.bind(this));
        note.appendTo(keys);
      }.bind(this));

      keys.appendTo($keysWrapper);
    };

    var chooseRoot = function(note){
      _root = note.target ? note : "c4";
    };

    var buildScalesPicker = function(){
      var dropdownWrapper = $('<div />', {'class' : 'scales-picker-wrapper picker'})
      
      scales.forEach(function(name){
        var scaleItem = $('<div />', {'data-scale' : name, 'class' : 'scale-item', 'css' : {'border-style' : 'solid'}});
        scaleItem.html(name);

        scaleItem.click(handleScaleClick.bind(this));
        
        scaleItem.appendTo(dropdownWrapper);
      }, this);

      dropdownWrapper.appendTo($scalesWrapper);
    };

    var handleScaleClick = function(e){
      clearResults();
      var diatonic = new _diatonicator(getTonic(), $(e.target).data('scale'));

      if (diatonic){
        for (i = 1; i < 8; i++){

          var chordData = diatonic.chordAt(i);

          if (chordData){
            var chord = $('<div />', { 'class' : 'chord-details'});
            chord.html('<div>Interval: ' + i + ' | ' + chordData.name + '</div>');
            chord.appendTo($resultsWrapper);

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
      $resultsWrapper.find('*').off();
      $resultsWrapper.off().empty();
     
      // TODO - reset vexflow staff 
    };

    var getTonic = function(){
      return _tonic;
    };



    build();
  });