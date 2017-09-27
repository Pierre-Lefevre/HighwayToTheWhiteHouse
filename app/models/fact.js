let moment = require('moment');

const GIF_METER = ["meter/pants_on_fire"];

class Fact {

    constructor (jsonFact) {
        this._date = jsonFact.date[0];
        this._author = jsonFact.author[0];
        this._url = jsonFact.url[0];
        this._extra = jsonFact.extra[0];
        this._imageName = jsonFact.image_name[0];
        this._meter = jsonFact.meter[0];
        this._source = jsonFact.source[0];
        this._imageUrls = jsonFact.image_urls[0];
        this._statement = jsonFact.statement[0];
        this._imageUrl = jsonFact.image_url[0];
        this._imagePath = jsonFact.image_path[0];
        this._imageChecksum = jsonFact.image_checksum[0];
        this._id = jsonFact.id[0];
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
