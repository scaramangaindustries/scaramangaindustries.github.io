---
---
class window.ScaramangaUploader
  constructor: ->
    AWS.config.update { accessKeyId: 'AKIAJZ7PBT2CGRIBU56Q', secretAccessKey: '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' }
    @bucket = "scaramanga-site-uploads"
    @el = document.getElementById('uploads')
    @el.addEventListener 'change', =>
      @initMeters()
      @upload(file) for file in @el.files
    , false

  upload: (file) ->
    $meter = $("<div class='progress-meter' />")
    @$meters.append $meter
    params =
      Key: new Date().getTime() + "_" + file.name
      ContentType: file.type || "application/octet-stream"
      Bucket: @bucket
    s3obj = new AWS.S3
      params: params
    s3obj.upload(
      Body: file
    ).on('httpUploadProgress', (event) ->
      pct = Math.floor(event.loaded/event.total*100)
      console.log pct
      $meter.css("width", "#{pct}%")
    ).send( (err, data) ->
      if err
        console.log err
      else
        $meter.replaceWith("<div class='upload'>Uploaded #{file.name}</div>")
    )
    true

  initMeters: ->
    return if @$meters
    @$meters = $("<div class='progress-meters' />")
    $(@el).parent().append @$meters

document.addEventListener 'DOMContentLoaded', ->
  window.scara_uploader = new ScaramangaUploader()
, false
