// Load dependency
let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let bodyParser = require('body-parser');
let elasticsearch = require('elasticsearch');

// Create a client
let client = new elasticsearch.Client({
    host: 'localhost:9200'
});

// Load class
let Fact = require('./models/fact');

// Template engine
app.set('view engine', 'twig');

// Middleware
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Callback
let callBackLoadFacts = function (facts, inputQuery, response) {
    io.sockets.emit('loadFacts', facts.map((jsonFact) => new Fact(jsonFact._source).attributes()));
};
let callBackPagesIndex = function(facts, inputQuery, response) {
    response.render('pages/index', {facts: facts.map((jsonFact) => new Fact(jsonFact._source)), query: inputQuery});
};

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
    executeFactQuery(callBackPagesIndex, request.params.query, undefined, response);
});

io.on('connection', function(socket) {
    socket.on('getFacts', function (inputQuery) {
        executeFactQuery(callBackLoadFacts, inputQuery);

    });
    socket.on('getFactsWithFilter', function(data){
       executeFactQuery(callBackLoadFacts, data.query, data.filters);
    })
});

function executeFactQuery(cb, inputQuery, inputMeterFilter = [], response = null) {
    let query = buildQuery(inputQuery, inputMeterFilter);
    client.search(query).then(function (data) {
        cb(data.hits.hits, inputQuery, response);
    });
}

function buildQuery(inputQuery, inputMeterFilter) {
    let meterFilter = [];
    for (let i = 0; i < inputMeterFilter.length; i++) {
        meterFilter.push("meter/" + inputMeterFilter[i])
    }

    let filter = [];
    if (meterFilter.length > 0) {
        filter.push({terms: { meter: meterFilter }});
    }

    return {
        from : 0,
        size : 100,
        body: {
            query: {
                bool : {
                    must: {
                        query_string: {
                            fields : ["author", "statement"],
                            query: inputQuery
                        }
                    },
                    filter: filter
                }
            }
        }
    };
}

server.listen(8080);
