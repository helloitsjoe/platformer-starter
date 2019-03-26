const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const ipLog = require('./ipLog');

const createServer = (port = 3001) => {
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../public')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/player.html'));
  });

  io.on('connection', socket => {
    console.log(`A new user connected!`);
    socket.emit('connected');

    const handleEvent = eventName => command => {
      socket.broadcast.emit(eventName, command);
    };

    socket.on('tapDown', handleEvent('relay-tapDown'));
    socket.on('tapUp', handleEvent('relay-tapUp'));
    socket.on('handled', handleEvent('handled'));

    socket.on('disconnect', () => {
      console.log(`user disconnected`);
    });
  });

  http.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
  });

  ipLog(port);

  return http;
};

module.exports = {
  createServer,
};
