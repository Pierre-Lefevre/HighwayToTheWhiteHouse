# -*- coding: utf-8 -*-
# scrapy crawl factspider -o ../facts.json -t json

import scrapy
import re
from urllib.parse import urlparse
from os.path import splitext, basename
from scrapy.loader import ItemLoader
from scraper.items import FactItem
from datetime import datetime

class Factspider(scrapy.Spider):
	name = 'factspider'
	start_urls = ['http://www.politifact.com/truth-o-meter/statements/']
	confidence = {"true": 9, "mostly_true": 8, "half_true": 7, "mostly_false": 6, "false": 5, "pants_on_fire": 4, "no_flip": 3, "half_flip": 2, "full_flop": 1}

	def parse(self, response):
		for current_fact in response.xpath('//div[contains(concat(" ", @class, " "), " scoretable__item ")]'):
			fact = FactItem()
			fact["author"] = current_fact.xpath('.//div[contains(concat(" ", @class, " "), " statement__source ")]/a/text()').extract_first().strip()
			fact["statement"] = current_fact.xpath('.//p[contains(concat(" ", @class, " "), " statement__text ")]/a/text()').extract_first().strip()
			fact["source"] = current_fact.xpath('.//p[contains(concat(" ", @class, " "), " statement__edition ")]/a/text()').extract_first().replace(u'\u2014', '').strip()

			fact["date"] = current_fact.xpath('.//p[contains(concat(" ", @class, " "), " statement__edition ")]/span[contains(concat(" ", @class, " "), " article__meta ")]/text()').extract_first().strip()
			fact["date"] = re.sub(' (\d*)(th|st|nd|rd), ', ' \\1, ', fact["date"])
			fact["date"] = str(datetime.strptime(fact["date"], 'on %A, %B %d, %Y').strftime('%Y-%m-%d'))

			fact["meter"] = current_fact.xpath('.//div[contains(concat(" ", @class, " "), " meter ")]//img/@alt').extract_first().lower().replace(" ", "_").replace("-", "_").replace("!", "").strip()
			fact["confidence"] = self.confidence[fact["meter"]]

			fact["extra"] = current_fact.xpath('.//div[contains(concat(" ", @class, " "), " meter ")]/p[contains(concat(" ", @class, " "), " quote ")]/text()').extract_first().strip()
			fact["url"] = 'http://www.politifact.com' + current_fact.xpath('.//p[contains(concat(" ", @class, " "), " statement__text ")]/a/@href').extract_first().strip()
			src = current_fact.xpath('.//div[contains(concat(" ", @class, " "), " mugshot ")]//img/@src').extract()
			fact["image_urls"] = src
			filename, file_ext = splitext(basename(urlparse(src[0]).path))
			fact["image_name"] = filename + file_ext
			yield fact

		url = response.xpath('//a[contains(concat(" ", @class, " "), " step-links__next ")]/@href').extract_first().strip()
		if url is not None:
			yield scrapy.Request(response.urljoin(url), callback=self.parse)
