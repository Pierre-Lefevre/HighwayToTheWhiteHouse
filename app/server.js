let express = require('express');
let app = express();
let bodyParser = require('body-parser');

// Load dependency
let solr = require('solr-client');

// Create a client
let client = solr.createClient({
    "host": "127.0.0.1",
    "port": 8983,
    "path": "/solr",
    "core": "highway_to_the_white_house"
});

// Moteur de template
app.set('view engine', 'twig');

// Middleware
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/', (request, response) => {
    response.render('pages/index');
});

app.post('/search', (request, response) => {
    if (request.body.query === undefined || request.body.query === '') {
        response.redirect('/');
    } else {
        response.redirect('/search/' + encodeURIComponent(request.body.query));
    }
});

app.get('/search/:query', (request, response) => {
    let query = client.createQuery().q(request.params.query);
    client.search(query,function(err, obj) {
        if (err) {
            console.log(err);
        } else {
            console.log(obj.response.docs);
            response.render('pages/index', {facts: obj.response.docs});
        }
    });
});

app.listen(8080);