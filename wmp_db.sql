CREATE DATABASE music_player;

CREATE TABLE music_player.songs (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `artist` varchar(100) NOT NULL,
  `album` varchar(50) NOT NULL,
  `duration` float UNSIGNED NOT NULL,
  `file_hash` varchar(64) NOT NULL,
  `file_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE music_player.songs
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `file_hash` (`file_hash`);


ALTER TABLE music_player.songs
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;