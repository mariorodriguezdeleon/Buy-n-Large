console.log("This is running");

const mysql = require('mysql');
const figlet = require('figlet');
const fs = require('fs');
const cTable = require('console.table');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ark3d1a!8328',
    database: 'bamazon_db',
    port: 3306,
    insecureAuth: true
});

function tableBoard() {
    //TODO: add the figlet logic and then call the store
}

function returnAll() {
    connection.connect(function(error){
        if (error) throw error;
        console.log ('Connected as id ' + connection.threadId);
    
        connection.query('SELECT * FROM products;', function(error, results) {
            if (error) throw error;
            console.table(results);
    
            connection.end();
        });
    });
}

returnAll();
