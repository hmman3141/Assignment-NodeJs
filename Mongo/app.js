const express = require('express');
const bodyParser = require('body-parser');

const { Database } = require('./src/connectdb.js')
new Database();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
        
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.get('/', (request, response) => {
    var gross, socialInsurance, healthInsurance, unemploymentInsurance, tax, net;

    response.render('index', { gross, socialInsurance, healthInsurance, unemploymentInsurance, tax, net });
});

app.post('/', async (request, response) => {
    let gross, tax;

    let grossToNet = require('./src/services/grossToNet')

    gross = parseInt(request.body.gross);
    var area = parseInt(request.body.area),
        dependents = request.body.dependents || 0;

    response.render('index', await grossToNet.toNet(area, gross, dependents));
})

app.listen(3000, () => {
    console.log('App is listening on port 3000');
    console.log('Server url: http://localhost:3000');
});