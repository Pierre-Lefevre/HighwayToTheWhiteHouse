let moment = require('moment');

const GIF_METER = ["meter/pants_on_fire"];

class Fact {

    constructor (jsonFact) {
        this._date = jsonFact.date;
        this._author = jsonFact.author;
        this._url = jsonFact.url;
        this._extra = jsonFact.extra;
        this._imageName = jsonFact.image_name;
        this._meter = jsonFact.meter;
        this._source = jsonFact.source;
        this._imageUrls = jsonFact.image_urls;
        this._statement = jsonFact.statement;
        this._imageUrl = jsonFact.image_url;
        this._imagePath = jsonFact.image_path;
        this._imageChecksum = jsonFact.image_checksum;
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
            imageChecksum: this.imageChecksum,
            id: this.id
        }
    }

    get date() {
        return moment(this._date, 'on dddd, MMMM Do, YYYY').fromNow();
    }

    get author() {
        return this._author;
    }

    get url() {
        return "http://" + this._url;
    }

    get extra() {
        return this._extra;
    }

    get imageName() {
        return this._imageName;
    }

    get meter() {
        return this._meter + (GIF_METER.indexOf(this._meter) === 0 ? ".gif" : ".png");
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

    get id() {
        return this._id;
    }
}

module.exports = Fact;
