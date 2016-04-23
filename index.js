var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.engine('html', require('ejs').renderFile);

app.set('views', __dirname + '/views');
app.set('view engine', 'html');


app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'seftesti-tokeni') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log('Text received, echo: '+ text.substring(0, 200));
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
      if (text === 'Generic') {
        sendGenericMessage(sender);
        continue;
      }
    }
  }
  res.sendStatus(200);
});

var token = "EAACsMTTvGyUBACuG9QTMlEd1w0BkJd60E12l7jbHmBsD6ZCEuUIxa3ErbUKktZB8ZCQHUq1MzbYXWl21ZB2ZArgZCr5W9MMGbtY7JT8bhnLUvyETqUOBZCAHkD6zFlDjVqKn4ZCT3Pf1VMHe1V8EGt9x57atQk31NIQZBA20IAvh0nQZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  };
  
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendGenericMessage(sender) {
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "https://www.falconsocial.com/wp-content/uploads/2014/12/Falcon_Social_logo_black-wing-800x800.png",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com/",
            "title": "Web url"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
        },{
          "title": "Second card",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "https://www.falconsocial.com/wp-content/uploads/2014/12/Falcon_Social_logo_black-wing-800x800.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble",
          }],
        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


