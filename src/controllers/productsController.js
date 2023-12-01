const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		res.render('products.ejs', { products })
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const productSelected = products.find(product => product.id == req.params.id)
		const precioFinal = productSelected.price - (productSelected.discount * productSelected.price / 100)
		res.render('detail.ejs', { productSelected, precioFinal })
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form.ejs')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const resultValidations = validationResult(req);
		if (resultValidations.errors.length > 0){
			return res.render('product-create-form.ejs', {
				errors : resultValidations.mapped(),
				oldData : req.body
			});
		}
		console.log(req.file); //para un solo archivo, para varios es req.files
		const newProduct = {
			//id: uuidv4(),  id unico uuid // npm install uuid
			id : products.length + 1,
			image: req.file?.filename || 'default-image.png',
			//image: 'default-image.png',
			...req.body //spread operator // propagacion
		}		
		products.push(newProduct)
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '))
		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const pToEdit = products.find(product => product.id == req.params.id)
		res.render('product-edit-form.ejs', { pToEdit })
	},
	// Update - Method to update
	update: (req, res) => {
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		const pToEdit = products.find(product => product.id == req.params.id)
		pToEdit.name = req.body.name || pToEdit.name
		pToEdit.price = req.body.price || pToEdit.price
		pToEdit.discount = req.body.discount || pToEdit.discount
		pToEdit.category = req.body.category || pToEdit.category
		pToEdit.description = req.body.description || pToEdit.description
		pToEdit.image = req.file?.filename || pToEdit.image
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '))
		res.redirect('/products')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const id = req.params.id
		productToDelete = product.find(product => product.id == id)
		const pToDelete = products.filter(product => product.id != req.params.id)
		fs.writeFileSync(productsFilePath, JSON.stringify(pToDelete, null, ' '))
		fs.unlinkSync(path.join(__dirname, '../../public/images/', productToDelete.image))
		res.redirect('/products')
	}
};

module.exports = controller;