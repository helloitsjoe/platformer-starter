const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const http = require('http').Server(app);
const ip = require('ip');
const io = require('socket.io')(http);
// const getIpAddress = require('./getIpAddress');

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
    // const ipAddress = getIpAddress();
    const ipAddress = ip.address();
    console.log(`To play, point your browser to http://localhost:${port}`);
    console.log(`To use your phone as a controller, go to http://${ipAddress}:${port}/player`);
  });

  return http;
};

module.exports = {
  createServer,
};
