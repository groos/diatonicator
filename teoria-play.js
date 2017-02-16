
var teoria = require('./teoria')

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