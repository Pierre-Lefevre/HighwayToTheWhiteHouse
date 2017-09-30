#!/bin/bash
# ./reloadFactsInElastic.sh

curl -XDELETE 'http://localhost:9200/highway_to_the_white_house/'

curl -XPUT 'http://localhost:9200/highway_to_the_white_house/' -d '{"mappings": {"fact": {"properties": {"date": {"type": "date"}, "meter": {"type": "keyword"}, "confidence": {"type": "keyword"}}}}}'

curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@import.json"; echo
