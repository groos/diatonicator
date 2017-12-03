
var teoria = require('./teoria')

function Diatonic(root, scale){
	this.root = teoria.note(root);
	this.scale = this.root.scale(scale);
};

Diatonic.prototype = {
	chordAt: function(index){
		return this.diatonicChord(this.scale, index - 1);
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
	getIntervalNotes: function (scale, rootIndex, interval){
		//debugger;

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