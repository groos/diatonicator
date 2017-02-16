var _teoriaPlay = require('../teoria-play');

function component () {
  var element = document.createElement('div');

  var diatonicator = new _teoriaPlay('a4', 'mixolydian');
  // var root = diatonicator.chordAt(1);
  // var second = diatonicator.chordAt(2);
  // var fourth = diatonicator.chordAt(4);
  //var sixth = diatonicator.chordAt(6);

  for (i = 1; i < 8; i++){
    console.log(diatonicator.chordAt(i));
  }

  debugger;
  return element
}

document.body.appendChild(component());