(function() {
  var Playlist, Song;

  soundManager.url = "/images/audio/soundmanager2.swf";

  window.nepotist || (window.nepotist = {});

  Playlist = (function() {
    function Playlist(params) {
      this.songs = [];
      this.playhead = 0;
      if (params.songSelector) {
        this.set_songs(params.songSelector);
      }
    }

    Playlist.prototype.set_songs = function(songSelector) {
      var i, len, results, song, songs_to_set;
      songs_to_set = $(songSelector);
      results = [];
      for (i = 0, len = songs_to_set.length; i < len; i++) {
        song = songs_to_set[i];
        results.push(this.add(song));
      }
      return results;
    };

    Playlist.prototype.add = function(song) {
      return this.songs.push(new Song({
        playlist: this,
        div: song,
        track: this.songs.length
      }));
    };

    Playlist.prototype.next = function() {
      var next_song;
      next_song = this.songs[this.playhead + 1];
      if (next_song) {
        return next_song.play();
      }
    };

    Playlist.prototype.prev = function() {
      var prev_song;
      prev_song = this.songs[this.playhead - 1];
      if (prev_song) {
        return prev_song.play();
      }
    };

    return Playlist;

  })();

  Song = (function() {
    function Song(params) {
      this.playlist = params.playlist;
      this.div = $(params.div);
      this.src = this.div.attr('data-src');
      this.button = this.div.find(this.div.attr('data-button-selector'));
      this.seeker = this.div.find(this.div.attr('data-seek-selector'));
      this.playhead = this.div.find(this.div.attr('data-playhead-selector'));
      this.progress = this.div.find(this.div.attr('data-progress-selector'));
      this.track = params.track;
      this.playing = false;
      this.seeking = false;
      this.initSound();
      this.controls();
    }

    Song.prototype.initSound = function() {
      return this.sound = soundManager.createSound({
        url: this.src,
        id: this.div.attr('id'),
        whileplaying: (function(_this) {
          return function() {
            var pct;
            pct = _this.sound.position / _this.sound.duration * 100;
            return _this.setTime(pct);
          };
        })(this),
        onfinish: (function(_this) {
          return function() {
            return _this.playlist.next();
          };
        })(this)
      });
    };

    Song.prototype.isLoaded = function() {
      return Math.abs(this.sound.duration - this.sound.durationEstimate) < 15000;
    };

    Song.prototype.controls = function() {
      this.button.on('click', (function(_this) {
        return function(event) {
          event.preventDefault();
          return _this.toggle();
        };
      })(this)).one('touchstart', (function(_this) {
        return function(event) {
          return _this.seeker.css('display', 'none');
        };
      })(this));
      return this.seeker.on('dragstart', (function(_this) {
        return function() {
          if (_this.isLoaded()) {
            return _this.onSeekStart();
          }
        };
      })(this)).on('drag', (function(_this) {
        return function(event) {
          if (_this.isLoaded()) {
            return _this.onDrag(event.pageX);
          }
        };
      })(this)).on('dragend', (function(_this) {
        return function(event) {
          if (_this.isLoaded()) {
            return _this.onDragEnd(event.pageX);
          }
        };
      })(this)).on('click', (function(_this) {
        return function(event) {
          return _this.onDragEnd(event.pageX);
        };
      })(this)).on('touchstart', (function(_this) {
        return function() {
          return _this.onSeekStart();
        };
      })(this)).on('touchmove', (function(_this) {
        return function(event) {
          return _this.onDrag(event.originalEvent.pageX);
        };
      })(this)).on('touchend', (function(_this) {
        return function(event) {
          return _this.onDragEnd(event.originalEvent.changedTouches[0].pageX);
        };
      })(this));
    };

    Song.prototype.onSeekStart = function() {
      this.seeking = true;
      return this.pause({
        no_ui: true
      });
    };

    Song.prototype.onDrag = function(xOff) {
      var pct;
      pct = (xOff - this.playhead.offset().left) / this.seeker.width() * 100;
      return this.updateTime(pct);
    };

    Song.prototype.onDragEnd = function(xOff) {
      var pct;
      pct = (xOff - this.playhead.offset().left) / this.seeker.width() * 100;
      this.seek(pct);
      return this.play({
        no_ui: true
      });
    };

    Song.prototype.toggle = function() {
      if (this.playing) {
        return this.pause();
      } else {
        return this.play();
      }
    };

    Song.prototype.play = function(params) {
      var opts;
      opts = params || {};
      if (!opts.no_ui) {
        this.stop_all();
        this.div.addClass("playing");
        this.playlist.playhead = this.track;
      }
      this.playing = true;
      this.seeking = false;
      return this.sound.play();
    };

    Song.prototype.pause = function(params) {
      var opts;
      opts = params || {};
      if (!opts.no_ui) {
        this.div.removeClass("playing");
      }
      this.playing = false;
      return this.sound.stop();
    };

    Song.prototype.stop_all = function() {
      var i, len, ref, results, song;
      ref = this.playlist.songs;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        song = ref[i];
        results.push(song.pause());
      }
      return results;
    };

    Song.prototype.setTime = function(percent) {
      if ((0 < percent && percent < 100)) {
        if (!this.seeking) {
          return this.updateTime(percent);
        }
      }
    };

    Song.prototype.updateTime = function(percent) {
      this.playhead.css('width', percent + "%");
      return this.progress.css('width', this.sound.bytesLoaded / this.sound.bytesTotal * 100 + '%');
    };

    Song.prototype.seek = function(percent) {
      var loadPct, pos;
      if ((0 <= percent && percent <= 100)) {
        loadPct = this.sound.bytesLoaded / this.sound.bytesTotal * 100;
        if (percent > loadPct) {
          percent = loadPct;
        }
        pos = Math.floor(percent / 100 * this.sound.duration);
        this.sound.setPosition(pos);
        this.sound.play();
        return this.updateTime(percent);
      }
    };

    return Song;

  })();

  nepotist.Playlist = Playlist;

  nepotist.Song = Song;

}).call(this);
