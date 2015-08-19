require 'nokogiri'
require 'open-uri'
page = Nokogiri::HTML(open("http://www.scaramangaindustries.com/songs"))
songs = page.css('.song')
date = Date.today
songs.each do |song|
  date_string = date.strftime "%Y-%m-%d"
  name = song.attributes['data-name'].to_s
  f = open("songs/_posts/#{date_string}-#{name.gsub(/\ /i, '-')}.md", "w")
  f.write "---\n"
  f.write "title: #{name}\n"
  f.write "mp3_url: #{song.attributes['data-src'].to_s}\n"
  f.write "artist_name: #{song.css('.artist').text}\n"
  f.write "---"
  f.close
  date = date.prev_month
end

