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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Callback
let callBackLoadFacts = function (facts, inputQuery, response) {
    io.sockets.emit('loadFacts', facts.map((jsonFact) => new Fact(jsonFact._source).attributes()));
};
let callBackPagesIndex = function (facts, inputQuery, response) {
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
    executeFactQuery(callBackPagesIndex, request.params.query, undefined, undefined, response);
});

io.on('connection', function (socket) {
    socket.on('getFacts', function (data) {
        executeFactQuery(callBackLoadFacts, data.inputQuery, data.inputMeterFilter, data.inputSort);
    });
});

function executeFactQuery(cb, inputQuery, inputMeterFilter = [], inputSort = {}, response = null) {
    let query = buildQuery(inputQuery, inputMeterFilter, inputSort);
    client.search(query).then(function (data) {
        cb(data.hits.hits, inputQuery, response);
    });
}

function buildQuery(inputQuery, inputMeterFilter, inputSort) {
    let sort = [];
    for (let key in inputSort) {
        switch (key) {
            case "date":
                sort.push({date: {order: inputSort[key]}});
                break;
            case "_score":
                sort.push({_score: {order: inputSort[key]}});
                break;
            case "confidence":
                sort.push({confidence: {order: inputSort[key]}});
                break;
        }
    }

    inputQuery = inputQuery.trim();
    /*let query = "";
    if (inputQuery.length === 0) {
        query = "*";
    } else {
        inputQuery.replace(/\s\s+/g, ' ').split(" ").forEach(function (element, index, array) {
            query += element;
            if (["AND", "OR", "NOT"].indexOf(element) === -1) {
                //query += "~3";
            }
            if (index < array.length - 1) {
                query += " ";
            }
        });
    }*/

    let meterFilter = [];
    for (let i = 0; i < inputMeterFilter.length; i++) {
        meterFilter.push(inputMeterFilter[i])
    }

    let filter = [];
    if (meterFilter.length > 0) {
        filter.push({terms: {meter: meterFilter}});
    }

    return {
        from: 0,
        size: 100,
        body: {
            sort: sort,
            query: {
                bool: {
                    must: {
                        multi_match : {
                            fields: ["author", "statement^3"],
                            query: inputQuery,
                            operator : "and",
                            fuzziness: "AUTO"
                        }
                    },
                    /*must: {
                        query_string: {
                            fields: ["author", "statement^3"],
                            query: query,
                            default_operator: "AND"
                        }
                    },*/
                    filter: filter
                }
            }
        }
    };
}

server.listen(8080);
