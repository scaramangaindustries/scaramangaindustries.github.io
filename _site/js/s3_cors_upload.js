(function() {
  window.S3Upload = (function() {
    S3Upload.prototype.with_credentials = false;

    S3Upload.prototype.onFinishS3Put = function(public_url) {
      return console.log('base.onFinishS3Put()', public_url);
    };

    S3Upload.prototype.onProgress = function(percent, status) {
      return console.log('base.onProgress()', percent, status);
    };

    S3Upload.prototype.onError = function(status) {
      return console.log('base.onError()', status);
    };

    function S3Upload(options) {
      var option;
      if (options == null) {
        options = {};
      }
      for (option in options) {
        this[option] = options[option];
      }
      this.handleFileSelect(this.file);
    }

    S3Upload.prototype.handleFileSelect = function(file) {
      this.onProgress(0, 'Upload started.');
      return this.uploadFile(file);
    };

    S3Upload.prototype.createCORSRequest = function(method, url) {
      var xhr;
      xhr = new XMLHttpRequest();
      if (xhr.withCredentials != null) {
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest !== "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        xhr = null;
      }
      return xhr;
    };

    S3Upload.prototype.uploadToS3 = function(file, url, public_url) {
      var data, file_type, this_s3upload, xhr;
      this_s3upload = this;
      xhr = this.createCORSRequest('POST', url);
      if (!xhr) {
        this.onError('CORS not supported');
      } else {
        xhr.onload = function() {
          var ref;
          if ((200 <= (ref = xhr.status) && ref < 210)) {
            this_s3upload.onProgress(100, 'Upload completed.');
            return this_s3upload.onFinishS3Put(public_url);
          } else {
            return this_s3upload.onError('Upload error: ' + xhr.status);
          }
        };
        xhr.onerror = function() {
          return this_s3upload.onError('XHR error.');
        };
        xhr.upload.onprogress = function(e) {
          var percentLoaded;
          if (e.lengthComputable) {
            percentLoaded = Math.round((e.loaded / e.total) * 100);
            return this_s3upload.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
          }
        };
      }
      file_type = this.getFileType(file);
      data = new FormData();
      data.append("key", public_url);
      data.append('Content-Type', file_type);
      data.append('file', file);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      return xhr.send(data);
    };

    S3Upload.prototype.uploadFile = function(file) {
      var public_url, this_s3upload, url;
      url = "http://" + this.bucket + ".s3.amazonaws.com/";
      public_url = new Date().getTime() + "_" + file.name;
      this_s3upload = this;
      return this_s3upload.uploadToS3(file, url, public_url);
    };

    S3Upload.prototype.getFileType = function(file) {
      return file.type || "application/octet-stream";
    };

    return S3Upload;

  })();

}).call(this);
