
const mysql = require('mysql');
const inquire = require('inquirer')
const figlet = require('figlet');

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

connection.connect(function(error) {
    if (error) throw error;
    console.log ('Connected as id ' + connection.threadId);
    console.log ('');
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

    connection.query('SELECT * FROM products;', function(error, res) {
        if (error) throw error;
        // console.log(res)
        inventory = res;
        console.table(res);
        // console.table(inventory);
        appStore();
        // connection.end();
    });
}

function appStore() {

    // console.log('This will be more infor for the user');
    console.log('');
    inquire.prompt(questions).then (answers => {

        let newQuantity;

        for (let i = 0; i < inventory.length; i++) {
            if (answers.product_ID === inventory[i].item_id.toString()) {
                console.log('');
                console.log('Product_ID entered: ' + inventory[i].item_id);
                console.log('');
                if (inventory[i].stock_quantity === 0 || inventory[i].stock_quantity < answers.quantity){
                    console.log('There is not enough inventory to fullfil your request. There is only ' + inventory[i].stock_quantity + ' units available');
                    console.log('Please choose another quantity.');
                    returnAll();
                } else{
                    newQuantity = inventory[i].stock_quantity - answers.quantity;
                    console.log('You have requested: ' + answers.quantity);
                    console.log('There are ' + newQuantity + ' left.');
                    console.log('');
                    updateProduct(newQuantity, inventory[i].item_id);
                }
            }
        }
        // console.log(answers.product_ID + " " + answers.quantity); //for testing
    });
}

function updateProduct(newQuant, item_id) {
    console.log("Updating quantities...\n");
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [{
          stock_quantity: newQuant
        },
        {
          item_id: item_id
        }
      ],
      function (err, res) {
          inquire.prompt([
              {
                  type: 'input',
                  name: 'continue',
                  message: 'Would you like to keep shoping? Y/n '
              }
          ]).then (answers => {
            if (answers.continue.toLowerCase() === 'y' || answers.continue.toLowerCase() === 'yes') {
                returnAll();
                console.log(res.affectedRows + " products updated!\n");
            } else{
                console.log('Thank you for shopping at Buy-N-Large');
                connection.end();
            }
          });    
      });
  
    // logs the actual query being run
    console.log(query.sql);
}

appEntry();