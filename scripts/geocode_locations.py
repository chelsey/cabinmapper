#!/usr/bin/python

# example: Mount Desert Island, Maine
# http://maps.googleapis.com/maps/api/geocode/json?%22%20%22sensor=false&address=Mount%20Desert%20Island,%20Maine

from urllib2 import urlopen
import csv
import json
from time import sleep

def geocode_location(address):
  url = ('http://maps.googleapis.com/maps/api/geocode/json?'
    'sensor=false&address={0}'.format(address.replace(' ', '+')))
  return json.loads(urlopen(url).read())

with open('../data/scraped.tsv', 'r') as f:
    reader = csv.DictReader(f, delimiter='\t')

    print 'Converting locations to Lat & Lng...' + '\n' + '\n'

    with open('../data/scraped-geocoded.tsv', 'w') as w:
        fields = ['location', 'cabin url', 'image url', 'caption', 'lat', 'lng', 'cabin_page_url']
        writer = csv.DictWriter(w, fieldnames=fields, delimiter='\t')
        writer.writeheader()

        for line in reader:
            response = geocode_location(line['location'])
            if response['status'] == u'OK':
                results = response.get('results')[0]
                line['location'] = results['formatted_address'].encode('utf-8')
                line['lat'] = results['geometry']['location']['lat']
                line['lng'] = results['geometry']['location']['lng']
                print 'Geocoded: {0}'.format(line['location'])
                print 'Wrote: {0} to file'.format(line['lat'])
            else:
                line['location'] = ''
                line['lat'] = ''
                line['lng'] = ''
                print 'FAILURE'
                print '\t' + 'location: {0}'.format(line['location'])
                print '\t' + 'caption: {0}'.format(line['caption'])
                print '\t' + 'URL: {0}'.format(line['cabin_page_url'])
            sleep(1)
            writer.writerow(line)

print 'Done writing file'
