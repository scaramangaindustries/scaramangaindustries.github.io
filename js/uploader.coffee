---
---
class window.ScaramangaUploader
  constructor: ->
    @bucket = "scaramanga-site-uploads"
    @el = document.getElementById('uploads')
    @el.addEventListener 'change', =>
      @batchUpload.apply(@)
    , false

  batchUpload: (e) ->
    @initMeters()
    @upload(file) for file in @el.files

  upload: (file) ->
    $meter = $("<div class='progress-meter' />")
    @$meters.append $meter
    new S3Upload
      bucket: @bucket
      owner: "scaramanga_at_twcny.rr.com".replace("_at_","@")
      file: file
      onProgress: (percent, message) =>
        $meter.css("width", "#{percent}%")
      onFinishS3Put: (public_url) =>
        $meter.replaceWith("<div class='upload'>Successfully uploaded #{file.name}</div>")
      onError: (status) ->
        console.log 'Upload error: ', status

  initMeters: ->
    return if @$meters
    @$meters = $("<div class='progress-meters' />")
    $(@el).parent().append @$meters

document.addEventListener 'DOMContentLoaded', ->
  window.scara_uploader = new ScaramangaUploader()
, false
