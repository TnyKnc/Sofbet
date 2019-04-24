# Sofbet

![socketio-logo](https://user-images.githubusercontent.com/9505978/56699791-aad09200-66ff-11e9-8961-752da61107df.png)

## Node JS - Socket IO Sohbet Uygulaması
#### Tanım
Proje Node JS üzerinde Socket IO modülünü kullanarak sohbet uygulamasını barındırmaktadır.

![proje_gif](https://user-images.githubusercontent.com/9505978/56699831-dfdce480-66ff-11e9-8dac-c93751c78e65.gif)

Projede yayın (broadcast) mesajı ile açık olan tüm kullanıcılara (genel mesaj), istenilen kullanıcılara (grup mesajı), tek kullanıcıya (özel mesaj), kapalı kullanıcılara (çevrimdışı mesaj) atılabilir.

Çevrimdışı kullanıcılar çevrimiçi olduklarında kendilerine gelen mesajları okuyabilmektedir.

Kullanıcılar (online ve offline olma durumları), mesajlar (gönderilen ve gönderen) bilgisi veritabanında tutulmaktadır.

Arayüz üzerinde online kullanıcı adları yeşil renk ile, offline kullanıcı adları kırmızı renk ile görüntülenmektedir.

#### Kurulum
Yerel deponuza klonladığınız projenin çalışması için sisteminizde Node JS ve Mysql veri tabanı yüklü olması gerekmektedir.
>Veritabanı tabloları ve alanları "veritabani.sql" dosyası içerisinde mevcuttur.

Projeyi çalıştırmadan önce index.js dosyası içerisindeki veritabanı ayarları kendi veritabanınıza uyarlanmalıdır;

```javascript
var connection = mysql.createConnection({
    host     : 'host_adınız',
    user     : 'kullanıcı_adınız',
    password : 'şifreniz',
    database : 'veritabanı_adınız'
});
```
Projenin çalışabilmesi için terminal üzerinden gerekli modüller kurulmalıdır;

Mysql bağlantısı için gerekli modül;
```bash
npm install mysql
```
Web uygulaması için gerekli modül;
```bash
npm install express
```
Server - Client arasında tcp bağlantısı kullanarak haberleşmeyi sağlayan modül;
```bash
npm install socket.io
```
xml formatındaki dosya işlemleri yapabilmek için gerekli olan modül;
```bash
npm install xml2js
```
#### Çalıştırma
Mysql veritabanınız açıkken terminal üzerinden proje dizini içerisinde
```bash
node .\index.js
```
yazılarak proje çalıştırılabilir.
>Proje 8000 portu üzerinde çalışmaktadır!

