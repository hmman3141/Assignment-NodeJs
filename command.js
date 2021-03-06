#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { create, database, seed, model } = require('./project_generator');

process.stdout.write('\033c');

dir = path.join(__dirname, 'package.json');
if (!fs.existsSync(dir)) {
    console.log('Please create package.json first using npm init.');
    process.exit(1);
}

switch (process.argv[2]) {
    case 'create': {
        create();
        break;
    }

    case 'database': {
        dir = path.join(__dirname, 'settings.js');
        if (!fs.existsSync(dir)) {
            console.log(`Please use the 'project-cli create' command to create mvc project first.`);
            process.exit(1);
        }

        database();
        break;
    }

    case 'model': {
        dir = path.join(__dirname, 'src');
        if (!fs.existsSync(dir)) {
            console.log(`Please use the 'project-cli create' command to create mvc project first.`);
            process.exit(1);
        }
        if (!fs.existsSync(path.join(dir, 'connectdb.js'))) {
            console.log(`Please use the 'project-cli database' command to create database first.`);
            process.exit(1);
        }
        model();
        break;
    }

    case 'seed': {
        dir = path.join(__dirname, 'src');
        if (!fs.existsSync(dir)) {
            console.log(`Please use the 'project-cli create' command to create mvc project first.`);
            process.exit(1);
        }
        if (!fs.existsSync(path.join(dir, 'connectdb.js'))) {
            console.log(`Please use the 'project-cli database' command to create database first.`);
            process.exit(1);
        }
        seed();
        break;
    }

    default: {
        console.log('create: Create MVC project');
        console.log('database: Create database');
        console.log('seed: Create database seed');
        console.log('model: Create database model');
    }
}