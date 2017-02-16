
var teoria = require('./teoria')

var root = 'a4';
var rootNote = teoria.note(root);

var vamp = 'd4';
var vampNote = teoria.note(vamp);


var rootChord = rootNote.chord('m7');
var vampChord = vampNote.chord('7');

// ['a', 'c', 'e', 'g']
var rootArp = rootChord.simple();
var vampArp = vampChord.simple();

/*
	rootArp and vampArmp contain our valid notes
	
	given the root note, we want to iterate through all scales
	to look for the scales that contain ALL of the notes in rootArp and vampArp.
	
	in this case we should find a match with "A Dorian"
*/

/*
	this approach could be expanded to provide a suggested scales
	for each individual chord as you play
*/


// TODO - Implement logic to match scale based on input notes from chord arpeggios






/*
	use the matching scale to build the list of available chords
*/

var dorian = rootNote.scale('dorian');
// dorian.scale = [ 'P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7' ]

var root = dorian.notes()[0];
var third = dorian.notes()[2];
var fifth = dorian.notes()[4];
var seventh = dorian.notes()[6];

var interval1 = teoria.interval(root, third); // 'm3'
var interval2 = teoria.interval(root, fifth); // 'P5'
var interval3 = teoria.interval(root, seventh); // 'm7'

/*
	now we have enough information to determine that the root chord is a minor7
	
	to find the other chords in the scale, simply adjust the root and index where we look in dorian.notes()
*/

function Diatonic(){
	this.root = teoria.note('a4');
	this.scale = this.root.scale('dorian');

	this.chordAt = function(index){
		return this.diatonicChord(this.scale, index - 1);
	};
};

Diatonic.prototype = {
	modInterval: function(interval){
		return interval % 7;
	},
	getIntervalNotes: function (scale, rootIndex, interval){
		//debugger;
		if (interval === 'third'){
			interval = 2;
		} else if (interval === 'fifth'){
			interval = 4;
		} else if (interval === 'seventh'){
			interval = 6;
		} else {
			return "invalid interval name: use 'third', 'fifth', or 'seventh'"
		}

		var rootNote = scale.notes()[this.modInterval(rootIndex)];

		// Get the interval note, but check if we need to bump it up an octave
		var modInt = this.modInterval(rootIndex + interval);
		var intervalNote = scale.notes()[this.modInterval(modInt)];
		var intervalNote = modInt < rootIndex ? intervalNote.interval('P8') : intervalNote;
		
		return {
			root : rootNote,
			interval : intervalNote
		};
	},
	majorOrPerfectInterval: function (scale, rootIndex, intervalName){
		//debugger;
		var notes = this.getIntervalNotes(scale, rootIndex, intervalName)
		
		if (notes && notes.root && notes.interval){
			var interval = teoria.interval(notes.root, notes.interval).toString();
			
			if (interval){
				return interval.indexOf('M') >= 0 || interval.indexOf('P') >= 0;
			}
		}
	},
	diatonicChord: function (scale, rootIndex){
		//debugger;
		var majorThird = this.majorOrPerfectInterval(scale, rootIndex, 'third');
		var perfectFifth = this.majorOrPerfectInterval(scale, rootIndex, 'fifth');
		var majorSeventh = this.majorOrPerfectInterval(scale, rootIndex, 'seventh');
		
		if (majorThird && majorSeventh && perfectFifth){
			// M7
			return scale.notes()[rootIndex].chord('M7') // something like this
		} else if (!majorThird && !majorSeventh && perfectFifth) {
			// m7
			return scale.notes()[rootIndex].chord('m7')
		} else if (majorThird && !majorSeventh && perfectFifth) {
			// 7
			return scale.notes()[rootIndex].chord('7')
		}
	},
	helloWorld: function(){
		console.log("hello!");
		return "Hello!";
	}
};

module.exports = new Diatonic();