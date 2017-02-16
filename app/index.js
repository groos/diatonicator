var _ = require('lodash');
var _teoriaPlay = require('../teoria-play');
var _teoria = require('../teoria');
var $ = require('jquery');

$('.output').html("jquery!");

function component () {
  var element = document.createElement('div');

  element.innerHTML = _teoriaPlay.helloWorld();

  var root = _teoriaPlay.chordAt(1);
  var second = _teoriaPlay.chordAt(2);
  var fourth = _teoriaPlay.chordAt(4);

  debugger;
  return element;
}

document.body.appendChild(component());