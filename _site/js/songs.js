(function() {
  window.scaramanga || (window.scaramanga = {});

  soundManager.onready(function() {
    return scaramanga.playlist = new nepotist.Playlist({
      songSelector: ".song"
    });
  });

}).call(this);
