
var teoria = require('./teoria.js')

var root = 'a4';
var vamp = 'd4';

var rootChord = root.chord('m7');
var vampChord = vamp.chord('7');

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

var dorian = a4.scale('dorian');
// dorian.scale = [ 'P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7' ]

var root = dorian.notes()[0];
var third = dorian.notes()[2];
var fifth = dorian.notes()[4];
var seventh = dorian.notes()[6];

var interval1 = t.interval(root, third); // 'm3'
var interval2 = t.interval(root, fifth); // 'P5'
var interval3 = t.interval(root, seventh); // 'm7'

/*
	now we have enough information to determine that the root chord is a minor7
	
	to find the other chords in the scale, simply adjust the root and index where we look in dorian.notes()
*/


var diatonicChord = function (scale, rootIndex){
	var majorThird = majorOrPerfectInterval(scale, rootIndex, 'third');
	var perfectFifth = majorOrPerfectInterval(scale, rootIndex, 'fifth');
	var majorSeventh = majorOrPerfectInterval(scale, rootIndex, 'seventh');
	
	if (majorThird && majorSeventh && perfectFifth){
		// M7
	} else if (!majorThird && !majorSeventh && perfectFifth) {
		// m7
	} else if (majorThird && !majorSeventh && perfectFifth) {
		// 7
	}
};

var modInterval = function(interval){
	return interval % 7;
};

var getIntervalNotes = function (scale, rootIndex, interval){
	switch (interval){
		case 'third':
			interval = 2;
		case 'fifth':
			interval = 4;
		case 'seventh':
			interval = 6;
		default:
			return "invalid interval name: use 'third', 'fifth', or 'seventh'"
	}
	
	var rootNote = scale.notes()[modInterval(rootIndex)];
	var intervalNote = scale.notes()[modInterval(interval)];
	
	return {
		root : rootNote,
		interval : intervalNote
	};
};

var majorOrPerfectInterval = function (scale, rootIndex, intervalName){
	var notes = getIntervalNotes(scale, rootIndex, intervalName)
	
	if (notes && notes.root && notes.interval){
		var interval = teoria.interval(notes.root, notes.interval).toString();
		
		if (interval){
			return interval.contains('M') || interval.contains('P');
		}
	}
};