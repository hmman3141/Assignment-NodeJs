module.exports = {
    index:`<!DOCTYPE html>
<html lang="en">
<head>
    <title>Gross to Net</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/style.css">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script>
    <style>
        .currSign::after {
            content: 'VNĐ';
        }
    </style>
</head> 
<body>
    <div class="container">
        <div class="left-collum" style="float: left;">
<form action="/" method="post">
    <div class="title">
        <h1>GROSS TO NET</h1>
    </div>
    <div class="field">
        <label>Gross Salary:</label>
        <input type="number" min="0" name="gross" class="myDIV" />
        <br />
    </div>
    <div class="field">
        <label>Area:</label>
        <input type="number" name="area" value="1" size="50" min="1" max="4" required style="margin-left: 87px;" />
    </div>
    <div class="field">
        <label>Dependents:</label>
        <input type="number" name="dependents" value="0" size="50" min="0" required style="margin-left: 21px;" />
    </div>
    <div class="field">
        <input class="submit-btn" type="submit" value="Gross to Net" required />
    </div>
    <label id="error-message"></label>
</form>
</div>
<div class="right-collum" style="float: right;margin-top: 10px;">
<h1>DETAILS</h1>            
    <table class="table">
    <tbody>
        <tr>
        <td>Gross</td>
        <td class="myDIV"><%=gross%></td>
        </tr>
        <tr>
        <td>Social insurance</td>
        <td class="myDIV"><%=socialInsurance%></td>
        </tr>
        <tr>
        <td>Health insurance</td>
        <td class="myDIV"><%=healthInsurance%></td>
        </tr>
        <tr>
        <td>Unemployment insurance</td>
        <td class="myDIV"><%=unemploymentInsurance%></td>
        </tr>
        <tr>
        <td>Tax</td>
        <td class="myDIV"><%=tax%></td>
        </tr>
        <tr>
        <td>Net</td>
        <td class="myDIV"><%=net%></td>
        </tr>
    </tbody>
    </table>
</div>
</div>
<script>
    let x = document.querySelectorAll(".myDIV");
    for (let i = 0, len = x.length; i < len; i++) {
        let num = Number(x[i].innerHTML)
                    .toLocaleString('en');
        x[i].innerHTML = num;
        x[i].classList.add("currSign");
    }
</script>
</body>
</html> `,
    settings: `// This will load our .env file and add the values to process.env,
require("dotenv").config();

module.exports = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
    url: process.env.URL || "",
    dbName: process.env.DBNAME,
    host: process.env.HOST || "localhost",
    user: process.env.USER || "",
    password: process.env.PASSWORD || "",
    database: process.env.DATABASE
};`,
    app: `const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
        
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.get('/', (request, response) => {
    var gross, socialInsurance, healthInsurance, unemploymentInsurance, tax, net;

    response.render('index', { gross, socialInsurance, healthInsurance, unemploymentInsurance, tax, net });
});

app.listen(3000, () => {
    console.log('App is listening on port 3000');
    console.log('Server url: http://localhost:3000');
});`
}