var _ = require('lodash');
var _teoriaPlay = require('../teoria-play');
var _teoria = require('../teoria');
var $ = require('jquery');

$('.output').html("jquery!");

function component () {
  var element = document.createElement('div');

  /* lodash is required for the next line to work */
  element.innerHTML = _.join(['Hello','webpack'], ' ');

  return element;
}

document.body.appendChild(component());