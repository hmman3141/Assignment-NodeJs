#!/usr/bin/env node
const fs = require('fs');
const { create, script, database, seed, model } = require('./project_generator');

process.stdout.write('\033c');

dir = __dirname + '/package.json';
if (!fs.existsSync(dir)) {
    console.log('Please create package.json first using npm init.');
    process.exit(1);
}

switch (process.argv[2]) {
    case 'create': {
        create();
        break;
    }

    case 'script': {
        script();
        break;
    }

    case 'database': {
        dir = __dirname + '/settings.js';
        if (!fs.existsSync(dir)) {
            console.log(`Please use the 'project-cli create' command to create mvc project first.`);
            process.exit(1);
        }
        database();
        break;
    }

    case 'model': {
        dir = __dirname + '/src';
        if (!fs.existsSync(dir)) {
            console.log(`Please use the 'project-cli create' command to create mvc project first.`);
            process.exit(1);
        }
        if (!fs.existsSync(dir+'/connectdb.js')) {
            console.log(`Please use the 'project-cli database' command to create database first.`);
            process.exit(1);
        }
        model();
        break;
    }

    case 'seed': {
        break;
    }

    default: {
        console.log('create: Create MVC project');
        console.log('database: Create database');
        console.log('seed: Create database seed');
        console.log('script: Create npm script');
        console.log('model: Create database model');
    }
}