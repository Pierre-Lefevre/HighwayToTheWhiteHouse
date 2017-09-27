// Load dependency
let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let bodyParser = require('body-parser');
let solr = require('solr-client');

// Load class
let Fact = require('./models/fact');

// Create a client
let solrClient = solr.createClient({
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
    executeFactQuery(request.params.query, function(obj) {
        response.render('pages/index', {facts: obj.map((jsonFact) => new Fact(jsonFact)), query: request.params.query});
    });
});

io.on('connection', function(socket) {
    socket.on('getFacts', function (data) {
        executeFactQuery(data, function(obj) {
            io.sockets.emit('loadFacts', obj.map((jsonFact) => new Fact(jsonFact).attributes()));
        });
    });
});

server.listen(8080);

function executeFactQuery(query, cb) {
    solrClient.search(solrClient.createQuery().q(query), function(err, obj) {
        if (err) {
            throw err;
        } else {
            cb(obj.response.docs);
        }
    });
}
