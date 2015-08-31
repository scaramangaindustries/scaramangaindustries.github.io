(function() {
  window.ScaramangaUploader = (function() {
    function ScaramangaUploader() {
      this.bucket = "scaramanga-site-uploads";
      this.el = document.getElementById('uploads');
      this.el.addEventListener('change', (function(_this) {
        return function() {
          _this.initMeters();
          return _this.upload(_this.el.files[0]);
        };
      })(this), false);
    }

    ScaramangaUploader.prototype.upload = function(file) {
      var $meter, params, upload;
      $meter = $("<div class='progress-meter' />");
      this.$meters.append($meter);
      params = {
        Bucket: this.bucket,
        Key: new Date().getTime() + "_" + file.name,
        ContentType: file.type || "application/octet-stream",
        Body: file
      };
      upload = new AWS.S3.ManagedUpload({
        params: params
      });
      upload.on('httpUploadProgress', function(event) {
        var pct;
        pct = Math.floor(event.loaded / event.total * 100);
        console.log(pct);
        return $meter.css("width", pct + "%");
      });
      upload.send(function(err, data) {
        if (err) {
          return console.log(err);
        } else {
          return $meter.replaceWith("<div class='upload'>Successfully uploaded " + file.name + "</div>");
        }
      });
      return true;
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
