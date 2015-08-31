---
---
class window.ScaramangaUploader
  constructor: ->
    AWS.config.update { accessKeyId: 'AKIAJZ7PBT2CGRIBU56Q', secretAccessKey: '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' }
    @bucket = "scaramanga-site-uploads"
    @count = 0
    @el = document.getElementById('uploads')
    @el.addEventListener 'change', =>
      @initMeters()
      @upload(file) for file in @el.files
      @total = @el.files.length
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
      $meter.css("width", "#{pct}%")
    ).send( (err, data) =>
      if err
        console.log err
      else
        @count += 1
        $meter.replaceWith("<div class='upload'>Uploaded #{file.name}</div>")
        @clear() if @count == @total
    )
    true

  initMeters: ->
    @spinner?.stop()
    @$meters?.remove()
    @spinner = new Spinner(
      {color: '#fff', scale: 2.0}
    ).spin()
    @$meters = $("<div class='progress-meters' />")
    $(@el).parent().append(@$meters)
    $('body').append @spinner.el

  clear: ->
    @count = 0
    @spinner.stop()

document.addEventListener 'DOMContentLoaded', ->
  window.scara_uploader = new ScaramangaUploader()
, false
