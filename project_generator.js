var fs = require('fs');

const create = () => {
    var exec = require('child_process').exec,
        child;
    var lib = '';

    const data = fs.readFileSync(__dirname + "/package.json", { encoding: 'utf8', flag: 'r' });
    var jsonData = JSON.parse(data);

    if (Object.keys(jsonData).includes('dependencies')) {

        ['dotenv', 'express', 'nodemon', 'ejs'].forEach((ele) => {
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
        child = exec(`npm install dotenv express nodemon ejs`,
            function (error) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            })
    }

    var dir = __dirname + '/public';
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
    if (!fs.existsSync(dir + '/images'))
        fs.mkdirSync(dir + '/images');
    if (!fs.existsSync(dir + '/javascripts'))
        fs.mkdirSync(dir + '/javascripts');
    if (!fs.existsSync(dir + '/stylesheets'))
        fs.mkdirSync(dir + '/stylesheets');

    dir = __dirname + '/src';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    dir = __dirname + '/src/routes';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    if (!fs.existsSync(dir + '/User.js')) {
        var content = `const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    res.send("Hi there");
})

module.exports = router;`;
        fs.writeFile(dir + '/User.js', content, (err) => {
            if (err) throw err;
        })
    }

    dir = __dirname + '/src/controllers';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    dir = __dirname + '/src/models';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    dir = __dirname + '/src/views';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <span>a</span>
</body>
</html>`;
    fs.writeFile(dir + '/index.ejs', content, (err) => {
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
const userRoute = require('./src/routes/User');

const app = express();
        
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.get('/', (request, response) => {
    response.render('index');
});

app.use("/user",userRoute);

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
    const data = fs.readFileSync(__dirname + "/package.json", { encoding: 'utf8', flag: 'r' });
    var jsonData = JSON.parse(data);

    jsonData.scripts.start = "node app.js";
    jsonData.scripts.debug = "nodemon --trace-warnings app.js";
    fs.writeFile(__dirname + "/package.json", JSON.stringify(jsonData, null, 2), (err) => {
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
        var exec = require('child_process').exec,
            child;

        switch (database.toLowerCase()) {
            case 'mysql': {
                env = "DATABASE=mysql\nHOST=localhost\nUSER=root\nPASSWORD=root\nPORT=32769\nDBNAME=mydb";
                lib = 'knex mysql';
                var content = `const { host, port, user, password, dbName } = require('../settings')

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
        knex.raw('CREATE DATABASE IF NOT EXISTS ' + dbName).then(function () {
            knex.destroy();
        });
    }
}

module.exports = { Database }`;

                fs.writeFile(__dirname + '/src/connectdb.js', content, (err) => {
                    if (err) throw err;
                })

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

                fs.writeFile(__dirname + '/src/connectdb.js', content, (err) => {
                    if (err) throw err;
                })

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

        var data = fs.readFileSync(__dirname + "/package.json", { encoding: 'utf8', flag: 'r' });
        var jsonData = JSON.parse(data);

        if (Object.keys(jsonData).includes('dependencies')) {
            var uninstalled_lib = '';
            lib.split(' ').forEach(ele => {
                if (!Object.keys(jsonData.dependencies).includes(ele))
                    uninstalled_lib += `${ele} `;
            })

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

        data = fs.readFileSync(__dirname + "/app.js", { encoding: 'utf8', flag: 'r' });
        var content = `const {Database} = require('./src/connectdb.js')\nnew Database();\n\nconst app = express();`;
        if (!data.includes(content)) {
            var arr = data.split('const app = express();');
            fs.writeFile('app.js', arr[0] + `const {Database} = require('./src/connectdb.js')\nnew Database();\n\nconst app = express();` + arr[1], (err) => {
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
            break;
        }
        case 'mongodb': {
            model = `const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    Name: {
        type: String,
    },
    Age: {
        type: Number,
    },
    Address: {
        type: String,
    }
}, {
    collection: "Users",
});

module.exports = mongoose.model("Users", schema);`;

            controller = `const user = require('../models/User');
const { StatusCodes } = require('http-status-codes')
class Controller {
    async List(req, res) {
        try {
            let data = await user.find({});
            return res.status(StatusCodes.OK).send({ data: data });
        } catch (err) {
            res.status(StatusCodes.NOT_FOUND).send("Server error");
            return err;
        }
    }
}

module.exports = new Controller;`;

            var data = fs.readFileSync(__dirname + "/package.json", { encoding: 'utf8', flag: 'r' });
            var jsonData = JSON.parse(data);

            if (Object.keys(jsonData).includes('dependencies')) {
                if (!Object.keys(jsonData.dependencies).includes('http-status-codes')) {
                    var exec = require('child_process').exec,
                        child;
                    child = exec('npm install http-status-codes',
                        function (error) {
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        })
                }
            }

            var content = `const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');

router.get('/', userController.List);

module.exports = router;`
            fs.writeFile(__dirname + '/src/routes/User.js', content, (err) => {
                if (err) throw err;
            });

            break;
        }
    }

    fs.writeFile(__dirname + '/src/models/User.js', model, (err) => {
        if (err) throw err;
    });


    fs.writeFile(__dirname + '/src/controllers/User.js', controller, (err) => {
        if (err) throw err;
    });
}

const seed = () => {

}

module.exports = { create, script, database, seed, model };