#!/usr/bin/python

# everything we want is in `ul#posts`, with each list item in `li.post`
# div class='caption' <-- returned in caption variable
# p
# <strong> tag
# div class='photo_div'

# posts_container.findAll("strong", text=re.compile(","))

from bs4 import BeautifulSoup
from urllib2 import urlopen
import csv
import re

BASE_URL = "http://cabinporn.com/page/"

my_list = []

# could get through 118, but only <strong> tags are reliable for locations around 98 / 99

# Page range for results
for count in range(1, 133):
  my_list.append(BASE_URL + str(count))

with open("../data/scraped.tsv", "w") as f:
  fieldnames = ("location", "cabin url", "image url", "caption", "cabin_page_url")
  output = csv.writer(f, delimiter="\t")
  output.writerow(fieldnames)

  print "Scraping urls...."
  for url in my_list:

    cabin_page_url = url
    html = urlopen(url).read()
    soup = BeautifulSoup(html, "lxml")
    photo_content = soup.find_all("div", "photo")

    number_of_photos_divs = len(photo_content)
    print url + "\t" + "Number of photos on page: {0} ".format(number_of_photos_divs)

    for item in photo_content:

      if item.find("div", "caption"):
        caption = item.find("div", "caption").find("p")
      else:
        caption = ""

      if caption:
        caption_text = caption.text.encode('utf-8')
      else:
        caption_text = ""

      if item.a:
        cabin_url = item.a['href']
      else:
        cabin_url = ""

      image_url = item.img["src"]

      if caption and caption.find("strong"):
        location = caption.find("strong").text.encode('utf-8')
        print location
      elif caption:
        line = caption_text
        regex_location = re.search(r'([A-Z][a-z]*|[A-Z][a-z]+(?=\s[A-Z])(?:\s[A-Z][a-z]+)+)*,\S*(?:\s[A-Z][a-z]*[a-zA-Z]+|\s[A-Z][a-z]+(?=\s[A-Z])(?:\s[A-Z][a-z]+)+)*', line)
        if regex_location != None:
          location = regex_location.group(0)
          print location
      else:
        location = ""

      output.writerow([location, cabin_url, image_url, caption_text, cabin_page_url])

print "Done scraping locations into file"
