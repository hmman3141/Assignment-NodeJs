var path = require('path')
var fs = require('fs');
var generation_script = require('./script/generation-script')

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

    fs.writeFile(path.join(dir, 'index.ejs'), generation_script.create.index, (err) => {
        if (err) throw err;
    })

    fs.writeFile('settings.js', generation_script.create.settings, (err) => {
        if (err) throw err;
    })

    if (!fs.existsSync(__dirname + '/app.js')) {
        fs.writeFile('app.js', generation_script.create.app, (err) => {
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

                fs.writeFile(path.join(__dirname, 'src', 'connectdb.js'), generation_script.database.mysql.connectdb, (err) => {
                    if (err) throw err;
                })

                content = generation_script.database.mysql.app;

                break;
            }
            case 'mongodb': {
                env = "DATABASE=mongodb\nURL=mongodb://localhost:27017/\nDBNAME=mydb";
                lib = 'mongoose';

                fs.writeFile(path.join(__dirname, 'src', 'connectdb.js'), generation_script.database.mongo.connectdb, (err) => {
                    if (err) throw err;
                })

                content = generation_script.database.mongo.app;

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
    switch (database) {
        case 'mysql': {

            fs.writeFile(path.join(__dirname, 'src', 'models', 'PersonalIncomeTax.js'), generation_script.model.mysql.PersonalIncomeTax.model, (err) => {
                if (err) throw err;
            });

            fs.writeFile(path.join(__dirname, 'src', 'controllers', 'PersonalIncomeTax.js'), generation_script.model.mysql.PersonalIncomeTax.controller, (err) => {
                if (err) throw err;
            });

            fs.writeFile(path.join(__dirname, 'src', 'models', 'InsuranceTax.js'), generation_script.model.mysql.InsuranceTax.model, (err) => {
                if (err) throw err;
            });


            fs.writeFile(path.join(__dirname, 'src', 'controllers', 'InsuranceTax.js'), generation_script.model.mysql.InsuranceTax.controller, (err) => {
                if (err) throw err;
            });

            break;
        }
        case 'mongodb': {

            fs.writeFile(path.join(__dirname, 'src', 'models', 'PersonalIncomeTax.js'), generation_script.model.mongo.PersonalIncomeTax.model, (err) => {
                if (err) throw err;
            });

            fs.writeFile(path.join(__dirname, 'src', 'controllers', 'PersonalIncomeTax.js'), generation_script.model.mongo.PersonalIncomeTax.controller, (err) => {
                if (err) throw err;
            });

            fs.writeFile(path.join(__dirname, 'src', 'models', 'InsuranceTax.js'), generation_script.model.mongo.InsuranceTax.model, (err) => {
                if (err) throw err;
            });

            fs.writeFile(path.join(__dirname, 'src', 'controllers', 'InsuranceTax.js'), generation_script.model.mongo.InsuranceTax.controller, (err) => {
                if (err) throw err;
            });

            break;
        }
    }

    const data = fs.readFileSync(path.join(__dirname, "app.js"), { encoding: 'utf8', flag: 'r' });
    if (!data.includes(generation_script.model.app)) {
        var split_position = `app.listen(3000, () => {
    console.log('App is listening on port 3000');
    console.log('Server url: http://localhost:3000');
});`;

        fs.writeFile(path.join(__dirname, 'app.js'), data.split(split_position)[0] + generation_script.model.app + '\n\n' + split_position, (err) => {
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
            var { database } = require('./settings');
            var content = '';
            switch (database) {
                case 'mysql': {
                    content = generation_script.seed.mysql
                    break;
                }
                case 'mongodb': {
                    content = generation_script.seed.mongo;
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