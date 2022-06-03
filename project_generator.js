var path = require('path')
var fs = require('fs');

const create = () => {
    var exec = require('child_process').exec,
        child;
    var lib = '';

    const data = fs.readFileSync(path.join(__dirname, "package.json"), { encoding: 'utf8', flag: 'r' });
    var jsonData = JSON.parse(data);

    var dir = path.join(__dirname, 'node_models');
    if (!fs.existsSync(dir))
        child = exec(`npm install`,
            function (error) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            })

    if (Object.keys(jsonData).includes('dependencies')) {

        ['dotenv', 'express', 'nodemon', 'ejs', 'body-parser'].forEach((ele) => {
            if (!Object.keys(jsonData.dependencies).includes(ele))
                lib += `${ele}  `;
        })
        if (lib !== '')
            child = exec(`npm install ${lib}`,
                function (error) {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                })
    } else {
        child = exec(`npm install dotenv express nodemon ejs body-parser`,
            function (error) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            })
    }

    var dir = path.join(__dirname, 'public');
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
    if (!fs.existsSync(path.join(dir, 'images')))
        fs.mkdirSync(path.join(dir, 'images'));
    if (!fs.existsSync(path.join(dir, 'javascripts')))
        fs.mkdirSync(path.join(dir, 'javascripts'));
    if (!fs.existsSync(path.join(dir, 'stylesheets')))
        fs.mkdirSync(path.join(dir, 'stylesheets'));

    dir = path.join(__dirname, 'src');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    dir = path.join(__dirname, 'src', 'routes');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    //     if (!fs.existsSync(path.join(dir, 'PersonalIncomeTax.js'))) {
    //         var content = `const express = require('express');
    // const router = express.Router();

    // router.get('/',(req,res) => {
    //     res.send("Hi there");
    // })

    // module.exports = router;`;
    //         fs.writeFile(path.join(dir, 'PersonalIncomeTax.js'), content, (err) => {
    //             if (err) throw err;
    //         })
    //     }

    dir = path.join(__dirname, 'src', 'controllers');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    dir = path.join(__dirname, 'src', 'models');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    dir = path.join(__dirname, 'src', 'views');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var content = `<!DOCTYPE html>
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
</html> `;
    fs.writeFile(path.join(dir, 'index.ejs'), content, (err) => {
        if (err) throw err;
    })

    content = `// This will load our .env file and add the values to process.env,
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
};`;

    fs.writeFile('settings.js', content, (err) => {
        if (err) throw err;
    })

    if (!fs.existsSync(__dirname + '/app.js')) {
        content = `const express = require('express');
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
});`;

        fs.writeFile('app.js', content, (err) => {
            if (err) throw err;
        })
    }
}

const script = () => {
    const data = fs.readFileSync(path.join(__dirname, "package.json"), { encoding: 'utf8', flag: 'r' });
    var jsonData = JSON.parse(data);

    jsonData.scripts.start = "node app.js";
    jsonData.scripts.debug = "nodemon --trace-warnings app.js";
    fs.writeFile(path.join(__dirname, "package.json"), JSON.stringify(jsonData, null, 2), (err) => {
        if (err) throw err;
    });
    console.log(`Use "npm run start" to start the project.`);
    console.log(`Use "npm run debug" to start the project in dev mode.`);
}

const database = () => {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question("Database(mysql/mongodb): ", database => {
        var env = "";
        var lib = '';
        var content = '';
        var exec = require('child_process').exec,
            child;

        switch (database.toLowerCase()) {
            case 'mysql': {
                env = "DATABASE=mysql\nHOST=localhost\nUSER=root\nPASSWORD=root\nPORT=32769\nDBNAME=mydb";
                lib = 'knex mysql objection';
                content = `const { Model } = require('objection');
const { host, port, user, password, dbName } = require('../settings')

var conn = {
    host: host,
    port: port,
    user: user,
    password: password,
}

var knex = require('knex')({
    client: 'mysql',
    connection: conn
});

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        knex.raw('CREATE DATABASE IF NOT EXISTS ' + dbName).then(() => {
            knex.destroy();
        });
    }
}

module.exports = { Database }`;

                fs.writeFile(path.join(__dirname, 'src', 'connectdb.js'), content, (err) => {
                    if (err) throw err;
                })

                content = `const { Database } = require('./src/connectdb.js')
new Database();

const { Model } = require('objection');
const { host, port, user, password, dbName } = require('./settings')
var conn = {
    host: host,
    port: port,
    user: user,
    password: password,
    database: dbName
}
const db = require('knex')({
    client: 'mysql',
    connection: conn
})
Model.knex(db);

const app = express();`;

                break;
            }
            case 'mongodb': {
                env = "DATABASE=mongodb\nURL=mongodb://localhost:27017/\nDBNAME=mydb";
                lib = 'mongoose';
                var content = `const mongoose = require('mongoose')
const {url, dbName} = require('../settings')

class Database {
    constructor(){
        this._connect();
    }

    _connect(){
        mongoose.connect(url + dbName)
        .then(() => {
            console.log('Database connection successful')
        })
        .catch(err => {
            console.error('Database connection error')
        })
    }
}

module.exports = {Database}`;

                fs.writeFile(path.join(__dirname, 'src', 'connectdb.js'), content, (err) => {
                    if (err) throw err;
                })

                content = `const { Database } = require('./src/connectdb.js')\nnew Database();\n\nconst app = express();`;

                break;
            }
            default: {
                console.error("Unsupported database");
                readline.close();
                process.exit(1);
            }
        }

        fs.writeFile('.env', env, (err) => {
            if (err) throw err
        });

        var data = fs.readFileSync(path.join(__dirname, "package.json"), { encoding: 'utf8', flag: 'r' });
        var jsonData = JSON.parse(data);

        if (Object.keys(jsonData).includes('dependencies')) {
            var uninstalled_lib = '';
            lib.split(' ').forEach(ele => {
                if (!Object.keys(jsonData.dependencies).includes(ele))
                    uninstalled_lib += `${ele} `;
            })

            if (uninstalled_lib !== '')
                child = exec(`npm install ${uninstalled_lib}`,
                    function (error) {
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                    })
        } else {
            child = exec(`npm install ${lib}`,
                function (error) {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                })
        }

        data = fs.readFileSync(path.join(__dirname, "app.js"), { encoding: 'utf8', flag: 'r' });
        if (!data.includes(content)) {
            [`\nconst { Database } = require('./src/connectdb.js')
new Database();

const { Model } = require('objection');
const { host, port, user, password, dbName } = require('./settings')
var conn = {
    host: host,
    port: port,
    user: user,
    password: password,
    database: dbName
}
const db = require('knex')({
    client: 'mysql',
    connection: conn
})
Model.knex(db);
`
                ,
                `\nconst { Database } = require('./src/connectdb.js')\nnew Database();\n`].forEach(ele => {
                    if (ele !== content && data.includes(ele)) {
                        var data_split = data.split(ele);
                        data = data_split[0] + data_split[1];
                    }
                })
            var arr = data.split('const app = express();');
            fs.writeFile('app.js', arr[0] + content + arr[1], (err) => {
                if (err) throw err;
            });
        }

        readline.close();
    });

}

const model = () => {
    var { database } = require('./settings')
    var model, controller;
    switch (database) {
        case 'mysql': {
            model = `const {Model} = require('objection')

class PersonalIncomeTax extends Model {
    static get tableName() {
        return 'PersonalIncomeTax'
    }
}

module.exports = PersonalIncomeTax`;

            controller = `const PersonalIncomeTax = require('../models/PersonalIncomeTax');

class Controller {
    async List() {
        try{
            const personalIncomeTax = await PersonalIncomeTax.query();
            return personalIncomeTax;
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = new Controller;`;

            fs.writeFile(path.join(__dirname, 'src', 'models', 'PersonalIncomeTax.js'), model, (err) => {
                if (err) throw err;
            });


            fs.writeFile(path.join(__dirname, 'src', 'controllers', 'PersonalIncomeTax.js'), controller, (err) => {
                if (err) throw err;
            });

            model = `const {Model} = require('objection')

class InsuranceTax extends Model {
    static get tableName() {
        return 'InsuranceTax'
    }
}

module.exports = InsuranceTax`;

            controller = `const InsuranceTax = require('../models/InsuranceTax');

class Controller {
    async List() {
        try{
            const insuranceTax = await InsuranceTax.query();
            return insuranceTax;
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = new Controller;`;

            fs.writeFile(path.join(__dirname, 'src', 'models', 'InsuranceTax.js'), model, (err) => {
                if (err) throw err;
            });


            fs.writeFile(path.join(__dirname, 'src', 'controllers', 'InsuranceTax.js'), controller, (err) => {
                if (err) throw err;
            });

            //             var content = `const express = require('express');
            // const router = express.Router();
            // const personalIncomeTaxController = require('../controllers/PersonalIncomeTax');

            // router.get('/', personalIncomeTaxController.List);

            // module.exports = router;`
            //             fs.writeFile(path.join(__dirname, 'src', 'routes', 'PersonalIncomeTax.js'), content, (err) => {
            //                 if (err) throw err;
            //             });

            break;
        }
        case 'mongodb': {
            model = `const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    tax: {
        type: Number,
    },
    min: {
        type: Number,
    },
    max: {
        type: Number,
    }
}, {
    collection: "PersonalIncomeTax",
});

module.exports = mongoose.model("PersonalIncomeTaxs", schema);`;

            controller = `const personalIncomeTax = require('../models/PersonalIncomeTax');

class Controller {
    async List() {
        try {
            let data = await personalIncomeTax.find({});
            return data;
        } catch (err) {
            return err;
        }
    }
}

module.exports = new Controller;`;

            fs.writeFile(path.join(__dirname, 'src', 'models', 'PersonalIncomeTax.js'), model, (err) => {
                if (err) throw err;
            });

            fs.writeFile(path.join(__dirname, 'src', 'controllers', 'PersonalIncomeTax.js'), controller, (err) => {
                if (err) throw err;
            });

            model = `const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    tax: {
        type: Number,
    }
}, {
    collection: "InsuranceTax",
});

module.exports = mongoose.model("InsuranceTax", schema);`;

            controller = `const insuranceTax = require('../models/InsuranceTax');

class Controller {
    async List() {
        try {
            let data = await insuranceTax.find({});
            return data;
        } catch (err) {
            return err;
        }
    }
}

module.exports = new Controller;`;

            fs.writeFile(path.join(__dirname, 'src', 'models', 'InsuranceTax.js'), model, (err) => {
                if (err) throw err;
            });

            fs.writeFile(path.join(__dirname, 'src', 'controllers', 'InsuranceTax.js'), controller, (err) => {
                if (err) throw err;
            });

            //             var content = `const express = require('express');
            // const router = express.Router();
            // const personalIncomeTaxController = require('../controllers/PersonalIncomeTax');

            // router.get('/', personalIncomeTaxController.List);

            // module.exports = router;`
            //             fs.writeFile(path.join(__dirname, 'src', 'routes', 'PersonalIncomeTax.js'), content, (err) => {
            //                 if (err) throw err;
            //             });

            break;
        }
    }
    var content = `app.post('/', async (request, response) => {
    let gross, socialInsurance, healthInsurance, unemploymentInsurance, tax, net;

    let insuranceController = require('./src/controllers/InsuranceTax');
    let personalIncomeController = require('./src/controllers/PersonalIncomeTax');

    gross = parseInt(request.body.gross);
    var area = parseInt(request.body.area),
        dependents = request.body.dependents || 0,
        unemploymentTaxMax = [884000, 784000, 686000, 614000],
        socialTaxMax = 2384000,
        healthTaxMax = 447000,
        PersonalIncomeTaxDeduction = 11000000,
        FamilyDeduction = 4400000;

    net = parseInt(gross);

    const insurances = await insuranceController.List();
    insurances.forEach((item) => {
        switch (item.name) {
            case 'Social insurance': {
                socialInsurance = gross * item.tax / 100;
                if (socialInsurance > socialTaxMax)
                    socialInsurance = socialTaxMax;
                break;
            }
            case 'Health insurance': {
                healthInsurance = gross * item.tax / 100;
                if (healthInsurance > healthTaxMax)
                    healthInsurance = healthTaxMax
                break;
            }
            case 'Unemployment insurance': {
                unemploymentInsurance = gross * item.tax / 100;
                if (unemploymentInsurance > unemploymentTaxMax[area - 1])
                    unemploymentInsurance = unemploymentTaxMax[area - 1];
                break;
            }
        }
    })

    net = net - (socialInsurance + healthInsurance + unemploymentInsurance);

    tax = 0;

    const personalIncomes = await personalIncomeController.List();
    const personalIncomes_sort = personalIncomes.sort((a, b) => a.tax - b.tax)
    var remain = net - PersonalIncomeTaxDeduction - FamilyDeduction * dependents;
    var personalTaxMax = 0;
    personalIncomes_sort.forEach((item) => {
        if (remain > 0) {
            if (remain <= (parseInt(item.max) - parseInt(item.min)) * 1000000) {
                tax += remain * parseInt(item.tax) / 100;
            } else {
                tax += (parseInt(item.max) - parseInt(item.min)) * 1000000 * parseInt(item.tax) / 100
            }
            remain -= (parseInt(item.max) - parseInt(item.min)) * 1000000;
            personalTaxMax = parseInt(item.tax);
        }
    })

    if (remain > 0) {
        tax += remain * personalTaxMax / 100;
    }

    net -= tax;

    response.render('index', { gross, socialInsurance, healthInsurance, unemploymentInsurance, tax, net });
})`;
    const data = fs.readFileSync(path.join(__dirname, "app.js"), { encoding: 'utf8', flag: 'r' });
    if (!data.includes(content)) {
        var split_position = `app.listen(3000, () => {
    console.log('App is listening on port 3000');
    console.log('Server url: http://localhost:3000');
});`;

        fs.writeFile(path.join(__dirname, 'app.js'), data.split(split_position)[0] + content + '\n\n' + split_position, (err) => {
            if (err) throw err;
        })

    }
}

const seed = () => {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question("This action will overwrite 'connectdb.js'? (yes/no):", answer => {
        if (answer === 'yes') {
            var { database } = require('./settings')
            switch (database) {
                case 'mysql': {
                    var content = `const { Model } = require('objection');
const { host, port, user, password, dbName } = require('../settings')

var conn = {
    host: host,
    port: port,
    user: user,
    password: password,
}

var knex = require('knex')({
    client: 'mysql',
    connection: conn
});

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        knex.raw('CREATE DATABASE IF NOT EXISTS ' + dbName).then(() => {
            knex.destroy();
            conn.database = dbName;
            knex = require('knex')({
                client: 'mysql',
                connection: conn
            })

            knex.schema.createTableIfNotExists('PersonalIncomeTax', (table) => {
                table.increments('id').primary();
                table.integer('tax').notNullable();
                table.integer('min').notNullable();
                table.integer('max').notNullable();
            }).then(() => {
                Model.knex(knex);
                const PersonalIncomeTax = require('./controllers/PersonalIncomeTax');
                (async () => {
                    const value = await PersonalIncomeTax.List();
                    if (value.length === 0) {
                        knex('PersonalIncomeTax').insert([
                            { tax: 5, min: 0, max: 5 },
                            { tax: 10, min: 5, max: 10 },
                            { tax: 15, min: 10, max: 18 },
                            { tax: 20, min: 18, max: 32 },
                            { tax: 25, min: 32, max: 52 },
                            { tax: 30, min: 52, max: 80 },
                            { tax: 35, min: 80, max: 100 }
                        ]).then(() => { ; });
                    }
                })();
            })

            knex.schema.createTableIfNotExists('InsuranceTax', (table) => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.float('tax').notNullable();
            }).then(() => {
                Model.knex(knex);

                const InsuranceTax = require('./controllers/InsuranceTax');
                (async () => {
                    const value = await InsuranceTax.List();
                    if (value.length === 0) {
                        knex('InsuranceTax').insert([
                            { name: 'Social insurance', tax: 8 },
                            { name: 'Health insurance', tax: 1.5 },
                            { name: 'Unemployment insurance', tax: 1 }
                        ]).then(() => { ; });
                    }
                })();
            })
        });
    }
}

module.exports = { Database }`;
                    break;
                }
                case 'mongodb': {
                    var content = `const mongoose = require('mongoose')
const PersonalIncomeTax = require('./models/PersonalIncomeTax')
const InsuranceTax = require('./models/InsuranceTax')
const { url, dbName } = require('../settings')

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(url + dbName)
            .then(() => {
                console.log('Database connection successful');
            }).then(() => {
                (async () => {
                    const personalIncomeTaxs = await PersonalIncomeTax.find({});
                    if (personalIncomeTaxs.length === 0) {
                        const documents = [
                            { tax: 5, min: 0, max: 5 },
                            { tax: 10, min: 5, max: 10 },
                            { tax: 15, min: 10, max: 18 },
                            { tax: 20, min: 18, max: 32 },
                            { tax: 25, min: 32, max: 52 },
                            { tax: 30, min: 52, max: 80 },
                            { tax: 35, min: 80, max: 100 }
                        ]

                        PersonalIncomeTax.collection.insertMany(documents).then(doc => {
                            console.log(doc)
                        })
                            .catch(err => {
                                console.error(err)
                            });
                    }
                })();
            }).then(() => {
                (async () => {
                    const insuranceTaxs = await InsuranceTax.find({});
                    if (insuranceTaxs.length === 0) {
                        const documents = [
                            { name: 'Social insurance', tax: 8 },
                            { name: 'Health insurance', tax: 1.5 },
                            { name: 'Unemployment insurance', tax: 1 }
                        ]

                        InsuranceTax.collection.insertMany(documents).then(doc => {
                            console.log(doc)
                        })
                            .catch(err => {
                                console.error(err)
                            });
                    }
                })();
            })
            .catch(err => {
                console.error('Database connection error')
            })
    }
}

module.exports = { Database }`;
                    break;
                }
            }

            var dir = path.join(__dirname, 'src', 'connectdb.js');
            fs.writeFile(dir, content, (err) => {
                if (err) throw err;
            });

            console.log('Run the program to create seed data');
        }
        readline.close();
    });
}

module.exports = { create, script, database, seed, model };