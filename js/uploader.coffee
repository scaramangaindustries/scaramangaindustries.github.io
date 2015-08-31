---
---
class window.ScaramangaUploader
  constructor: ->
    @bucket = "scaramanga-site-uploads"
    @el = document.getElementById('uploads')
    @el.addEventListener 'change', =>
      @initMeters()
      @upload(@el.files[0])
    , false

  upload: (file) ->
    $meter = $("<div class='progress-meter' />")
    @$meters.append $meter
    params =
      Bucket: @bucket
      Key: new Date().getTime() + "_" + file.name
      ContentType: file.type || "application/octet-stream"
      Body: file
    upload = new AWS.S3.ManagedUpload
      #partSize: 10 * 1024 * 1024
      #queueSize: 1
      params: params
    upload.on('httpUploadProgress', (event) ->
      pct = Math.floor(event.loaded/event.total*100)
      console.log pct
      $meter.css("width", "#{pct}%")
    )
    upload.send((err, data) ->
      if err
        console.log err
      else
        $meter.replaceWith("<div class='upload'>Successfully uploaded #{file.name}</div>")
    )
    true
    #new S3Upload
      #bucket: @bucket
      #file: file
      #onProgress: (percent, message) =>
      #onFinishS3Put: (public_url) =>
      #onError: (status) ->
        #console.log 'Upload error: ', status

  initMeters: ->
    return if @$meters
    @$meters = $("<div class='progress-meters' />")
    $(@el).parent().append @$meters

document.addEventListener 'DOMContentLoaded', ->
  window.scara_uploader = new ScaramangaUploader()
, false
