var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var key = require('./confidential/token.js');
var bodyParser = require('body-parser');
var request = require('request');

app.use(express.static(__dirname + '/public'));  
app.use(bodyParser.json());

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + 'index.html');
});


app.set('port', (process.env.PORT || 5000));

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


io.on('connection', function (socket) {
  
  // New connection on port
  console.log('New Connection: ', socket.id);
  
  // Emit name for testing purposes
  socket.emit('status: ok', {
    status: true
  });


  /*
    Facebook Messaging
  */

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
        console.log('message is' + event.message);
        text = event.message.text;
        socket.emit('message:simple', {
              text: text
        });
        sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
        if (text === 'Generic') {
          socket.emit('message:generic', {
              text: text
          });
          sendGenericMessage(sender);
          continue;
        }
      }
    }
    res.sendStatus(200);
  });

  function sendTextMessage(sender, text) {
    messageData = {
      text:text
    };
    
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:key.token.page},
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
      qs: {access_token:key.token.page},
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

});
