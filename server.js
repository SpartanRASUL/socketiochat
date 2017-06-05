'use strict';

var port = 3000;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var log4js = require('log4js');
var logger = log4js.getLogger();


logger.debug('Script has been started...');
server.listen(port);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) { // ������� ���������� ������� 'connection' ������� ������� io.connect(port); � ���������� socket
    var name = 'U' + (socket.id).toString().substr(1, 4); // ������� ������� ������ �������. � ������ ����� 'U' ������ ����� 3 ������� ID (������) ����� ������� �������, � ��� ��� ����� � ������� '+'
    socket.broadcast.emit('newUser', name); // �������� ������� 'newUser' ���� ������������, ����� ��������. �� ������� �������� ���������� �� 'newUser' (���������� �������� ������� � ����������� ������ �����)
    socket.emit('userName', name); // ���������� �������� ������� ������� 'userName' � ��� ����� (name) (���������� ������� ��� ��������)
    logger.info(name + ' connected to chat!'); // ������������

    socket.emit('userName', name);
    // ���������� ���� // �� ��� ������� ������ ��������

    socket.on('message', function (msg) { // ���������� �� ������� 'message' � ���������� (msg) �� ���������� message
        logger.warn('-----------'); // Logging
        logger.warn('User: ' + name + ' | Message: ' + msg);
        logger.warn('====> Sending message to other chaters...');
        io.sockets.emit('messageToClients', msg, name); // ���������� ���� ������� ������� 'messageToClients' � ���������� ���� �� ��� ��������� (�����, ��� �����)
    });
});