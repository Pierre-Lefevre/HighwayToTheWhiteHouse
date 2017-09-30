# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class FactItem(scrapy.Item):
	author = scrapy.Field()
	statement = scrapy.Field()
	source = scrapy.Field()
	date = scrapy.Field()
	meter = scrapy.Field()
	confidence = scrapy.Field()
	extra = scrapy.Field()
	url = scrapy.Field()
	image_urls = scrapy.Field()
	image_name = scrapy.Field()
	images = scrapy.Field()
