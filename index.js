var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(cookieParser());

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    nickname = req.cookies['nickname'];
    if(nickname === undefined) {
        res.render('setnick');
    } else {
        res.render('index', { 'nick' : nickname });
    }
});

app.post('/setnick', function(req, res) {
    var nickname = req.body.nickname;
    res.cookie('nickname', nickname);
    var data = { 'status' : 'ok' };
    res.send(data);
});

io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    socket.on('typing', function() {
        io.emit('typing');
    });

});

http.listen(5000, function() {
    console.log('listening on *:5000');
});