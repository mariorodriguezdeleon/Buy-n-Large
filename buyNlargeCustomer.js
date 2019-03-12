// console.log("This is running");

const mysql = require('mysql');
const inquire = require('inquirer')
const figlet = require('figlet');
const fs = require('fs');

let inventory = [];
let questions = [
    {
        type: 'input',
        name: 'product_ID',
        message: 'Please endter the product ID: '
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'Please enter the number of units to purchase: '
    }
];

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ark3d1a!8328',
    database: 'bamazon_db',
    port: 3306,
    insecureAuth: true
});

function appEntry() {
    figlet('Welcome to Buy-N-Large', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        returnAll();
    });
}

function returnAll() {

    connection.connect(function(error){
        if (error) throw error;
        console.log ('Connected as id ' + connection.threadId);
    
        connection.query('SELECT * FROM products;', function(error, res) {
            if (error) throw error;
            // console.log(res)
            inventory = res;
            console.table(res);
            console.table(inventory);
            appStore();
            // connection.end();
        });
    });
}

function appStore() {
    // console.log('This will be more infor for the user');
    console.log('');
    inquire.prompt(questions).then (answers => {

        for (let i = 0; i < inventory.length; i++) {
            if (answers.product_ID === inventory[i].item_id.toString()) {
                console.log('This is the product_ID entered: ' + inventory[i].item_id);
                if (inventory[i].stock_quantity === 0 || inventory[i].stock_quantity < answers.quantity){
                    //TODO: Update the table to reflect the items purchased
                    console.log('There is not enough inventory to fullfil your request. There is only ' + inventory[i].stock_quantity + ' units available');
                } else{
                    console.log('There are ' + inventory[i].stock_quantity);
                }
            }
        }
        
        console.log(answers.product_ID + " " + answers.quantity);

        connection.end();

        //TODO: Add logic to other functions to query the database
    });
}

appEntry();