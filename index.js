//db connection
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'veritabani'
});

var express=require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs'),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser();
var durum=0;
var global="";
var kontrol;
var users=[];
connection.connect();

//kullanıcı kontrolü yapılıyor
//user's control is checked
function ara(varmi)
{
    var key = varmi;
    var queryString = 'SELECT  * FROM kullanici WHERE kullaniciadi = ?';
    var aradakisonuc=0;
    connection.query(queryString, [key], function(err, rows, fields) {
        if (err) throw err;
        for (var i in rows) {
            if((rows[i].kullaniciadi)==key)
            {
                aradakisonuc=1;
                kontrol=1;

                connection.query("UPDATE kullanici SET durum = 1 WHERE kullaniciadi = ?",[key]);
                break;
                return;
            }
        }
        if(aradakisonuc=='0')
        {
            durum=1;
            kontrol=0;
            var post  = {
                kullaniciadi: global,
                durum: durum
            };
            var query = connection.query('INSERT INTO kullanici SET ?', post, function(err, result) {

            });
        }

    });
}
//gelen kullanıcı index sayfasına yönlendiriliyor
// routing index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//kullanılna dosyalar belirtiliyor
// mandority files
app.use("/css",express.static(__dirname + '/css'));
app.use("/fonts",express.static(__dirname + '/fonts'));
app.use("/img",express.static(__dirname + '/img'));
app.use("/js",express.static(__dirname + '/js'));
app.use("/xml",express.static(__dirname + '/xml'));


// port listening
http.listen(8000, function(){
  console.log('listening  port 8000');
});

//istek varsa bağlantı kuruluyor
//connection is loading
io.on('connection', function(socket)
{

    console.log('Bir kullanıcı bağlandı');
//kullanıcı kaydı yapılıyor
    socket.on('chat message', function(msg)
    {
        //console.log('girdi');
        socket.nickname=msg;
        users[socket.nickname]=socket;
        ara(msg);
        global=msg;
            // watching the xml file

    });

    //List of users
    socket.on('KullnicilariListele',function(msss){
        connection.query('SELECT kullaniciadi,durum FROM kullanici', function(err, rows, fields) {
            if (!err)
            {
                var send=new Array();
                for(var i in rows) {
                    if (!(rows[i].kullaniciadi == msss)) {
                        send.push(rows[i]);

                    }

                }
                console.log('Kullanıcılar ', send);
                socket.emit('KullnicilariListele',send);
            }
            else
                console.log('Error while performing Query.');
        });
    });
    //if have a both of new connection or exit, then updating list
    socket.on("güncelle",function(msg){
       if(kontrol==0) {
           socket.broadcast.emit("gncl", msg);
       }
        else{
           socket.broadcast.emit("opennn", msg);

       }

    });
    //özel mesaj işlemi yapılmaktadır.
    // private message
    socket.on("private", function (msg1,msg2,msg3) {
        var key = msg1;
        var queryString = 'SELECT  * FROM kullanici WHERE kullaniciadi = ?';
        connection.query(queryString, [key], function(err, rows, fields) {
            if (err) throw err;
            if(rows[0].durum == 0) {
                var post = {
                    gonderen: msg3,
                    alici: msg1,
                    mesaj:msg2,
                    onof:0
                };
                var query = connection.query('INSERT INTO mesajlar SET ?', post, function (err, result) {

                });
            }
            else{

                var post = {
                    gonderen: msg3,
                    alici: msg1,
                    mesaj:msg2,
                    onof:1
                };
                var query = connection.query('INSERT INTO mesajlar SET ?', post, function (err, result) {

                });
            }


        });
        if(msg1 in users)
        {
            users[msg1].emit("whisper1",msg2,msg3,msg1);
            
        }
    });

    //group messages
    socket.on("group", function (msg1,msg2,msg3) {
            var queryString = 'SELECT  kullaniciadi,durum FROM kullanici WHERE kullaniciadi = ?';
        var drm= new Array();
        for(var i in msg1) {
            connection.query(queryString, [msg1[i]], function (err, rows, fields) {
                if (err) throw err;
                if ((rows[0].durum == 0)) {
                    var post = {
                        gonderen: msg3,
                        alici: rows[0].kullaniciadi,
                        mesaj: msg2,
                        onof:0

                    };
                    var query = connection.query('INSERT INTO mesajlar SET ?', post, function (err, result) {

                    });
                }
                else {


                    var post = {
                        gonderen: msg3,
                        alici: rows[0].kullaniciadi,
                        mesaj: msg2,
                        onof:1

                    };

                    var query = connection.query('INSERT INTO mesajlar SET ?', post, function (err, result) {

                    });
                }

            });

        }
        for(var i in msg1) {
            if (msg1[i] in users) {
                users[msg1[i]].emit("whisper", msg2, msg3, msg1);
            }
        }
    });

    // offline messages
    socket.on("offlinemessage",function(msgg){
        var key = msgg;
        var queryString = 'SELECT  gonderen,mesaj FROM mesajlar WHERE alici = ? AND onof=0 ';
        connection.query(queryString, [key], function(err, rows, fields) {
            if (err) throw err;
            for(var i in rows) {
                connection.query("UPDATE mesajlar SET onof =1 WHERE alici = ? AND onof=0", [msgg]);
            }
            if(msgg in users)
            {
                users[msgg].emit("ofmessage",rows);
            }
        });
    });

    //broadcast messages
    socket.on('chatmesajyolla',function(msg2,ad){

        connection.query('SELECT kullaniciadi,durum FROM kullanici', function(err, rows, fields) {
            if (!err)
            {

                for(var i in rows) {
                    if(rows[i].durum=='0') {
                        var post = {
                            gonderen: ad,
                            alici: rows[i].kullaniciadi,
                            mesaj:msg2,
                            onof:0
                        };
                        var query = connection.query('INSERT INTO mesajlar SET ?', post, function (err, result) {
                        });
                    }
                    else{

                        var post = {
                            gonderen: ad,
                            alici: rows[i].kullaniciadi,
                            mesaj:msg2,
                            onof:1
                        };
                        var query = connection.query('INSERT INTO mesajlar SET ?', post, function (err, result) {

                        });
                    }
                }
            }
            else
                console.log('Error while performing Query.');
        });
        var ss="all";
        io.emit('chatmesajyolla', msg2,ad,ss);
        console.log('Gönderici--> ', ad, ' Alıcı-->Herkes ', 'Mesaj: ', msg2);
        
    });


socket.on("ddd",function(adim){
    parser.addListener('end', function(result) {
        console.dir(result);
      //  socket.volatile.emit('ntf', result);
        if(adim in users)
        {
            users[adim].emit("ntf",result);
        }
        console.log('Done.');
    });
    /*
    fs.readFile(__dirname + '/Duyurular.xml', function(err, data) {
        if (err) throw err;

        // parsing the new xml data and converting them into json file
        // send the new data to the client
        parser.parseString(data);
    });*/
});
//bağlantı kapatıldığında çalışmaktadır
// when connection is closed, it works
socket.on("kapat",function(mss){
    socket.broadcast.emit("kapatma",mss);
    socket.on('disconnect', function()
    {
        console.log('Kullanıcı ayrıldı...');
            console.log(mss);
            connection.query("UPDATE kullanici SET durum =0 WHERE kullaniciadi = ?",[mss]);


    });
});


});
