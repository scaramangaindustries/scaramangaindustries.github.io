require 'nokogiri'
require 'open-uri'
page = Nokogiri::HTML(open("http://www.scaramangaindustries.com/discs"))
discs = page.css('.disc')
date = Date.today
discs.each do |disc|
  date_string = date.strftime "%m-%d"
  name = disc.css('.name').text
  artist = disc.css('.artist').text
  role = disc.css('.role').text
  year = disc.css('.year').text
  f = open("discs/_posts/#{year}-#{date_string}-#{name.gsub(/\ /i, '-').gsub('/','_')}.md", "w")
  f.write "---\n"
  f.write "title: #{name}\n"
  f.write "artist: #{artist}\n"
  f.write "role: #{role}\n"
  f.write "---"
  f.close
  date = date.prev_day
end

