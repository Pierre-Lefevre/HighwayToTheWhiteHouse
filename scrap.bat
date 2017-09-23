cd scraper
scrapy crawl factspider -o ..\facts.json -t json
cd ..
powershell -Command "(Get-Content facts.json) ` -replace '\"images\": \[([^\]]*)\]', '\"images\": $1' ` " > facts_tmp.json
del facts.json
ren facts_tmp.json facts.json
java -Dc=highway_to_the_white_house -Dtype=application/json -jar solr-6.6.0\example\exampledocs\post.jar facts.json
