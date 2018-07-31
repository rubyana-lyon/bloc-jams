var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

  var $row = $(template);

    var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));
         if(currentlyPlayingSongNumber !== null) {
             var currentlyPlayingCell = $(".song-item-number[data-song-number='" + currentlyPlayingSongNumber + "']");
             currentlyPlayingCell.html(currentlyPlayingSongNumber);
         }
         if (currentlyPlayingSongNumber !== songNumber) {
             setSong(songNumber);
             currentSoundFile.play();
             $(this).html(pauseButtonTemplate);
             updatePlayerBarSong();
         }
        else if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            $(".main-controls .play-pause").html(playerBarPlayButton);
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $(".main-controls .play-pause").html(playerBarPauseButton);
                currentSoundFile.play();
            }
            else {
                $(this).html(playButtonTemplate);
                $(".main-controls .play-pause").html(playerBarPlayButton);
                currentSoundFile.pause();
            }
        }
    };


    var onHover = function(event) {
    getSongNumberCell(this);
    var songNumber = parseInt(songNumberCell.attr("data-song-number"));
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
     };

  var offHover = function(event) {
    //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    getSongNumberCell(this);
    var songNumber = parseInt(songNumberCell.attr("data-song-number"));
         if (songNumber !== currentlyPlayingSongNumber) {
             songNumberCell.html(songNumber);
         }
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
};

var setCurrentAlbum = function (album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');


     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);


    $albumSongList.empty();


     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };


var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var updatePlayerBarSong = function() {
    $(".currently-playing .song-name").text(currentSongFromAlbum.title);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $(".main-controls .play-pause").html(playerBarPauseButton);
};


var nextSong = function() {

    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }


    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();


    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {

    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }


    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    //added on own
    updatePlayerBarSong();


    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var setSong = function (songNumber) {
       if (currentSoundFile) {
         currentSoundFile.stop();
     }

    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

     currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {

         formats: [ 'mp3' ],
         preload: true
     });

     setVolume(currentVolume);
};

 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number) {
    songNumberCell = $(number).find(".song-item-number");

};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');



 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $playPause.click(function togglePlayFromPlayerBar() {
        if (currentSoundFile.isPaused()) {
            if ($(this).html(playerBarPlayButton)) {
                $(".song-item-number[data-song-number='" + currentlyPlayingSongNumber + "']").html(pauseButtonTemplate);
                $(this).html(playerBarPauseButton);
                currentSoundFile.play();
            }
        }
         else {
                $(".song-item-number[data-song-number='" + currentlyPlayingSongNumber + "']").html(playButtonTemplate);
                $(this).html(playerBarPlayButton);
                currentSoundFile.pause();
            }

        });
});
