import Cycle from '@cycle/core';
import {div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
// var io = require('socket.io-client');

function main(sources) {
  const sinks = {
    DOM: sources.DOM.select('.field').events('input')
      .map(ev => ev.target.value)
      .startWith('')
      .map(name =>
        div([
          label('Name:'),
          input('.field', {attributes: {type: 'text'}}),
          hr(),
          h1('Hello ' + name),
        ])
      )
  };
  return sinks;
}

Cycle.run(main, { DOM: makeDOMDriver('#application') });

// var socket = io.connect('http://localhost:5000');
var socket = io.connect();

socket.on('status:ok', function (data) {  
  console.log('Connected',data.status);
});

socket.on('message:simple', function (data) {  
  console.log('Simple Message', data.text);
});

socket.on('message:generic', function (data) {  
  console.log('Generic Message', data.text);
});

