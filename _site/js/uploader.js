(function() {
  window.ScaramangaUploader = (function() {
    function ScaramangaUploader() {
      this.bucket = "scaramanga-site-uploads";
      this.el = document.getElementById('uploads');
      this.el.addEventListener('change', (function(_this) {
        return function() {
          return _this.batchUpload.apply(_this);
        };
      })(this), false);
    }

    ScaramangaUploader.prototype.batchUpload = function(e) {
      var file, i, len, ref, results;
      this.initMeters();
      ref = this.el.files;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        file = ref[i];
        results.push(this.upload(file));
      }
      return results;
    };

    ScaramangaUploader.prototype.upload = function(file) {
      var $meter;
      $meter = $("<div class='progress-meter' />");
      this.$meters.append($meter);
      return new S3Upload({
        bucket: this.bucket,
        file: file,
        onProgress: (function(_this) {
          return function(percent, message) {
            return $meter.css("width", percent + "%");
          };
        })(this),
        onFinishS3Put: (function(_this) {
          return function(public_url) {
            return $meter.replaceWith("<div class='upload'>Successfully uploaded " + file.name + "</div>");
          };
        })(this),
        onError: function(status) {
          return console.log('Upload error: ', status);
        }
      });
    };

    ScaramangaUploader.prototype.initMeters = function() {
      if (this.$meters) {
        return;
      }
      this.$meters = $("<div class='progress-meters' />");
      return $(this.el).parent().append(this.$meters);
    };

    return ScaramangaUploader;

  })();

  document.addEventListener('DOMContentLoaded', function() {
    return window.scara_uploader = new ScaramangaUploader();
  }, false);

}).call(this);
