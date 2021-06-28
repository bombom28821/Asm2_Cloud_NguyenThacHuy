const express = require('express');
const hbs = require('hbs');
const session = require('express-session');

var app = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'abcc##$$0911233$%%%32222',
    cookie: { maxAge: 60000 }
}));

app.set('view engine', 'hbs');


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

const dbHandler = require('./databaseHandler');

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/manage', async (req, res) => {
    if (req.session.username != null) {
        const results = await dbHandler.searchProduct('', 'Products');
        res.render('manage', { model: results });
    } else {
        res.render('login');
    }

})

app.post('/loginAccount', async (req, res) => {
    const nameInput = req.body.txtName;
    const passInput = req.body.txtPassword;
    req.session.nameAccount = nameInput;
    req.session.passAccount = passInput;
    const found = await dbHandler.checkUser(nameInput, passInput);
    if (nameInput.endsWith('.com') == false) {
        res.render('login', { accountError: 'Name must end with .com', nameAccount: req.session.nameAccount, pass: req.session.passAccount })
    } else if (nameInput.indexOf('@') == -1) {
        res.render('login', { accountError: 'Name must have @ character', nameAccount: req.session.nameAccount, pass: req.session.passAccount })
    } else if (passInput.trim().length < 4) {
        res.render('login', { passError: 'Password is more than 3 character', nameAccount: req.session.nameAccount, pass: req.session.passAccount })
    } else if (found) {
        req.session.username = nameInput;
        const results = await dbHandler.searchProduct('', 'Products');
        res.render('manage', { model: results });
    } else {
        res.render('login', {errorMsg: "Login failed!", nameAccount: req.session.nameAccount, pass: req.session.passAccount });
    }
})

app.post('/search', async (req, res) => {
    const searchText = req.body.txtName;
    const results = await dbHandler.searchProduct(searchText, 'Products');
    res.render('manage', { model: results });
})

app.get('/addProduct', (req, res) => {
    res.render('addProduct');
})

app.post('/doAddProduct', async (req, res) => {
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var descInput = req.body.txtDescription;
    req.session.nameProduct = nameInput;
    req.session.priceProduct = priceInput;
    req.session.descProduct = descInput;
    if (nameInput.trim().length < 3) {
        res.render('addProduct', { nameError: 'Name has length >= 3',nameProduct: req.session.nameProduct, priceProduct: req.session.priceProduct, descProduct: req.session.descProduct});
    } else if (isNaN(priceInput) || priceInput.trim().length == 0 || priceInput > 1000 || priceInput <= 0) {
        res.render('addProduct', { priceError: 'Price is number and has price <= 1000 USD',nameProduct: req.session.nameProduct, priceProduct: req.session.priceProduct, descProduct: req.session.descProduct });
    } else {
        var newProduct = { name: nameInput, price: priceInput, description: descInput };
        await dbHandler.insertOneIntoCollection(newProduct, 'Products');
        const results = await dbHandler.searchProduct('', 'Products');
        res.render('manage', { model: results });
    }
})

app.get('/edit', async (req, res) => {
    const id = req.query.id;

    const productToEdit = await dbHandler.findById(id);
    res.render('edit', { product: productToEdit })
})

app.post('/update', async (req, res) => {
    const id = req.body.id;
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const descInput = req.body.txtDescription;
    const results = await dbHandler.findById(id);
    if (nameInput.trim().length < 3) {
        res.render('edit', {product: results, nameError: 'Name has length >= 3' });
    } else if (isNaN(priceInput) || priceInput.trim().length == 0 || priceInput > 1000 || priceInput <= 0) {
        res.render('edit', {product: results, priceError: 'Price is number and has price <= 1000 USD' });
    } else {
        const newValues = { $set: { name: nameInput, price: priceInput, description: descInput } };
        await dbHandler.updateProduct(newValues, id);
        res.redirect('manage');
    }
})

app.get('/delete', async (req, res) => {
    const id = req.query.id;
    await dbHandler.deleteProduct(id);
    const results = await dbHandler.searchProduct('', 'Products');
    res.render('manage', { model: results });

})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('');
})

var PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running at: " + PORT);

