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

// Routes
app.get('/', (request, response) => {
    response.render('pages/index');
});

io.on('connection', function (socket) {
    socket.on('getFacts', function (data) {
        executeFactQuery(callBackLoadFacts, data.inputQuery, data.inputDate, data.inputTypeSort, data.inputOrderSort, data.inputMeterFilter, data.from);
    });
});

function executeFactQuery(cb, inputQuery, inputDate = {}, inputTypeSort = "", inputOrderSort = "", inputMeterFilter = [], from = 0, response = null) {
    let query = buildQuery(inputQuery, inputDate, inputTypeSort, inputOrderSort, inputMeterFilter, from);
    client.search(query).then(function (data) {
        cb(data.hits.hits, inputQuery, response);
    });
}

function buildQuery(inputQuery, inputDate, inputTypeSort, inputOrderSort, inputMeterFilter, from) {
    inputQuery = inputQuery.trim();
    let match = {};
    if (inputQuery.length === 0) {
        match.match_all = {};
    } else {
        match.multi_match = {
            fields: ["author", "statement^3"],
            query: inputQuery,
            operator: "and",
            fuzziness: "AUTO"
        };
    }

    let date = {};
    if (inputDate.min !== "") {
        date.gte = inputDate.min;
    }
    if (inputDate.max !== "") {
        date.lt = inputDate.max;
    }

    let sort;
    switch (inputTypeSort) {
        case "date":
            sort = {date: {order: inputOrderSort}};
            break;
        case "_score":
            sort = {_score: {order: inputOrderSort}};
            break;
        case "confidence":
            sort = {confidence: {order: inputOrderSort}};
            break;
    }

    let filter = [];
    if (inputMeterFilter.length > 0) {
        filter.push({terms: {meter: inputMeterFilter}});
    }

    return {
        from: from,
        size: 22,
        body: {
            sort: sort,
            query: {
                bool: {
                    must: [
                        match,
                        {
                            range: {
                                date: date
                            }
                        }
                    ],
                    filter: filter
                }
            }
        }
    };
}

server.listen(8080);
