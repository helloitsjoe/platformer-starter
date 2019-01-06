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
    socket.on('tap', () => {
      console.log(`tapped`);
      socket.broadcast.emit('relay-tap');
    });

    socket.on('disconnect', () => {
      console.log(`user disconnected`);
    });
  });

  http.listen(port, () => {
    console.log(`listening on port ${port}`);
  });

  ipLog(port);

  return http;
};

module.exports = {
  createServer,
};
