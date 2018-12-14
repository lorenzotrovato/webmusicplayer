# Web Music Player [![Build Status](https://camo.githubusercontent.com/cfcaf3a99103d61f387761e5fc445d9ba0203b01/68747470733a2f2f7472617669732d63692e6f72672f6477796c2f657374612e7376673f6272616e63683d6d6173746572)]()
Music Player browser based. Listen to your favourite songs on your local network

## Features
* Single page template 
* Music list auto-update with ID3 tag recognition and album cover support
* Songs queue
* Search
* Visual effects
* Offline usage: all libraries are locally stored

## Installation
#### Prerequisites
* Web Server
* PHP and MySQL installed
#### Instructions# webmusicplayer
* Download the repo: 
```bash 
git clone https://github.com/lorenzotrovato/webmusicplayer.git
```
* Copy the files into your web server public directory (for Apache on linux `/var/www/html`)
* Create the database: 
```bash 
mysql -u your_user --password=your_passw < wmp_db.sql
```
* Edit `wmp.ini` to suit your needs

## Configuration
All configurations are in `wmp.ini`
#### Needed configuration
```ini
dir_path = "/path/to/your/music/files" ;IMPORTANT

[db_conf]
dn_name = "music_player" ;should not be changed
db_host = "localhost" ;change if the database is remote
db_user = "root"
db_pass = "password" ;put your real password
```
#### File types
You can choose allowed file types to include in your library adding new lines using the format shown below: (please note the incrementing index)
```ini
[allowed_file_types]
allowed_file_type0 = "audio/mpeg"     ;MP3
allowed_file_type1 = "audio/x-flac"   ;FLAC1
allowed_file_type2 = "audio/flac"   ;FLAC2
allowed_file_type3 = "audio/aac"   ;AAC
```
Please keep in mind that some audio files may not be supported by your browser.

## Disclaimer
WARNING! If you plan to run the player open to the internet, you shouldn't use your mysql root account and protect config file from external access. 
I'm not responsible for undesidered external intrusions on your systems. This project is tested only for basic attacks (such as Mysql injection)

## Credits
Thanks to getID3 (https://www.getid3.org) licensed under GNU Public License (GPL) for open source softwares
