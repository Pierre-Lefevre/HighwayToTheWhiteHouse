let moment = require('moment');

class Fact {

    constructor (jsonFact) {
        this._date = jsonFact.date;
        this._author = jsonFact.author;
        this._url = jsonFact.url;
        this._extra = jsonFact.extra;
        this._imageName = jsonFact.image_name;
        this._meter = jsonFact.meter;
        this._source = jsonFact.source;
        this._imageUrls = jsonFact.image_urls[0];
        this._statement = jsonFact.statement;
        this._imageUrl = jsonFact.images[0].url;
        this._imagePath = jsonFact.images[0].path;
        this._imageChecksum = jsonFact.images[0].checksum;
    }

    attributes() {
        return {
            date: this.date,
            author: this.author,
            url:this.url,
            extra:this.extra,
            imageName:this.imageName,
            meter: this.meter,
            source: this.source,
            imageUrls: this.imageUrls,
            statement: this.statement,
            imageUrl: this.imageUrl,
            imagePath: this.imagePath,
            imageChecksum: this.imageChecksum
        }
    }

    get date() {
        return moment(this._date, 'YYYY-MM-DD').fromNow();
    }

    get author() {
        return this._author;
    }

    get url() {
        return this._url;
    }

    get extra() {
        return this._extra;
    }

    get imageName() {
        return this._imageName;
    }

    get meter() {
        return this._meter;
    }

    get source() {
        return this._source;
    }

    get imageUrls() {
        return this._imageUrls;
    }

    get statement() {
        return this._statement;
    }

    get imageUrl() {
        return this._imageUrl;
    }

    get imagePath() {
        return this._imagePath;
    }

    get imageChecksum() {
        return this._imageChecksum;
    }
}

module.exports = Fact;
