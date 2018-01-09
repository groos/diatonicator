
var teoria = require('./teoria')

function Diatonic(root, scale){
	this.root = teoria.note(root);
	this.teoria = teoria;
	this.piu = require('./node_modules/piu')
	this.scale = this.root.scale(this.getModeName(scale));
};

Diatonic.prototype = {
	getModeName: function(key) {
		return this.modeNames[key] ? this.modeNames[key] : key;
	},
	modeNames: { 'Melodic Minor' : 'melodicminor', 'Phrygidorian' : 'phrygidorian', 'Lydian Augmented' : 'lydianaugmented', 'Lydian Dominant' : 'lydiandominant', 'Myxaeolian' : 'myxaeolian', 'Half-Diminished': 'halfdiminished', 'Altered Dominant' : 'altereddominant'},
	chordAt: function(index){
		//return this.diatonicChord(this.scale, index - 1);
		return this.getPiuChord(this.scale, index-1);
	},
	diatonicChord: function (scale, rootIndex){
		//debugger;
		var majorThird = this.majorOrPerfectInterval(scale, rootIndex, 'third');
		var perfectFifth = this.majorOrPerfectInterval(scale, rootIndex, 'fifth');
		var majorSeventh = this.majorOrPerfectInterval(scale, rootIndex, 'seventh');
		
		if (majorThird && majorSeventh && perfectFifth){
			// M7
			return scale.notes()[rootIndex].chord('M7'); // something like this
		} else if (!majorThird && !majorSeventh && perfectFifth) {
			// m7
			return scale.notes()[rootIndex].chord('m7');
		} else if (majorThird && !majorSeventh && perfectFifth) {
			// 7
			return scale.notes()[rootIndex].chord('7');
		} else if (!majorThird && !majorSeventh && !perfectFifth){
			return scale.notes()[rootIndex].chord('m7b5');
		}
	},
	getPiuChord: function(scale, rootIndex) {
		// get the 4 notes
		// interval is zero based, e.g. 'fifth' is 4
		// use piu to get the chord name
		var root = this.getIntervalNote(scale, rootIndex, 0);
		var third = this.getIntervalNote(scale, rootIndex, 2);
		var fifth = this.getIntervalNote(scale, rootIndex, 4);
		var seventh = this.getIntervalNote(scale, rootIndex, 6);

		var piuChord = this.piu.infer([root.toString(true), third.toString(true), fifth.toString(true), seventh.toString(true)].map(this.teoria.note))[0];

		var piuName = this.piu.infer([root.toString(true), third.toString(true), fifth.toString(true), seventh.toString(true)].map(this.teoria.note)).map(this.piu.name)[0];

		return this.teoria.chord(piuName);
	},
	getIntervalNote: function(scale, rootIndex, interval) {
		var rootNote = scale.notes()[this.modInterval(rootIndex)];
		var modInt = this.modInterval(rootIndex + interval);
		var intervalNote = scale.notes()[this.modInterval(modInt)];
		var intervalNote = modInt < rootIndex ? intervalNote.interval('P8') : intervalNote;

		return intervalNote;
	},
	getIntervalNotes: function (scale, rootIndex, interval){
		switch (interval){
			case 'third':
				interval = 2;
				break;
			case 'fifth':
				interval = 4;
				break;
			case 'seventh':
				interval = 6;
				break;
			case 'root':
				interval = 0;
				break;
			default:
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
		var notes = this.getIntervalNotes(scale, rootIndex, intervalName)
		
		if (notes && notes.root && notes.interval){
			var interval = teoria.interval(notes.root, notes.interval).toString();
			
			if (interval){
				return interval.indexOf('M') >= 0 || interval.indexOf('P') >= 0;
			}
		}
	},
	modInterval: function(interval){
		return interval % 7;
	}
};

module.exports = Diatonic;