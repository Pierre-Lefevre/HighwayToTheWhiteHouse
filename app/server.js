let express = require('express')
let app = express()

// Load dependency
let solr = require('solr-client');

// Create a client
let client = solr.createClient({
    "host": "127.0.0.1",
    "port": 8983,
    "path": "/solr",
    "core": "highway_to_the_white_house"
});

// Add a new document
var query = client.createQuery().q({'*' : '*'});
client.search(query,function(err,obj){
    if(err){
        console.log(err);
    }else{
        console.log(obj.response.numFound);
    }
});

app.set('view engine', 'ejs')

app.use('/assets', express.static('public'))

app.get('/', (request, response) => {
    response.render('pages/index', {test: 'Salut'})
})

app.listen(8080)