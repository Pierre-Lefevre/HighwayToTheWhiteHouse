#!/bin/bash
# ./prepareFactsToImport.sh facts.json > import.json

sed -i 's/\r//g' $1

if [[ $(head -n 1 $1) =~ ^\[$ ]]; then
	sed -i '1d' $1
fi

if [[ $(tail -1 $1 | head -1) =~ ^\]$ ]]; then
	sed -i '$ d' $1
fi

while IFS='' read -r line || [[ -n "$line" ]]; do
	((id++))
	echo "{ \"index\" : { \"_index\" : \"highway_to_the_white_house\", \"_type\" : \"fact\", \"_id\" : \"$id\" } }"
	echo "$line" | sed 's|\},$|\}|g'
done < "$1"
