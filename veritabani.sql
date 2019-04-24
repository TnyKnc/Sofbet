
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


-- Veritabanı adı: `veritabani`

CREATE DATABASE IF NOT EXISTS `veritabani` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `veritabani`;

-- --------------------------------------------------------

-- Tablo yapısı `kullanici`

DROP TABLE IF EXISTS `kullanici`;
CREATE TABLE IF NOT EXISTS `kullanici` (
`id` int(11) NOT NULL,
  `kullaniciadi` text CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `durum` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- Tablo yapısı `mesajlar`

DROP TABLE IF EXISTS `mesajlar`;
CREATE TABLE IF NOT EXISTS `mesajlar` (
`id` int(11) NOT NULL,
  `gonderen` text CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `alici` text CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `mesaj` text CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `onof` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------------------------------------

-- Tablo indeksler `kullanici`

ALTER TABLE `kullanici`
 ADD PRIMARY KEY (`id`);

-- Tablo indeksler `mesajlar`

ALTER TABLE `mesajlar`
 ADD PRIMARY KEY (`id`);

-- Tablo için AUTO_INCREMENT değeri `kullanici`

ALTER TABLE `kullanici`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Tablo için AUTO_INCREMENT değeri `mesajlar`

ALTER TABLE `mesajlar`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
