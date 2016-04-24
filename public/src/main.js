import Cycle from '@cycle/core';
import {div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';

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

var socket = io('http://localhost:5000');
socket.on('connect', function(){
  console.log('connected');
});
socket.on('event', function(data){});
socket.on('disconnect', function(){});