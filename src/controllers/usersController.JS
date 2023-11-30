const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Login 
	login: (req, res) => {
		const productSelected = products.find(product => product.id == req.params.id)
		const precioFinal = productSelected.price - (productSelected.discount * productSelected.price / 100)
		res.render('detail.ejs', { productSelected, precioFinal })
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('user-create-form.ejs')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const resultValidations = validationResult(req);
		if (resultValidations.errors.length > 0){
			return res.render('user-create-form.ejs', {
				errors : resultValidations.mapped(),
				oldData : req.body
			});
		}
		//console.log(req.file); //para un solo archivo, para varios es req.files
		const newUser = {
			//id: uuidv4(),  id unico uuid // npm install uuid
			id : users.length + 1,
			image: req.file?.filename || 'default-image.png',
			//image: 'default-image.png',
			...req.body //spread operator // propagacion
		}		
		users.push(newUser)
		fs.writeFileSync(usersFilePath, JSON.stringify(users, null, ' '))
		res.redirect('/login')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const pToEdit = users.find(user => user.id == req.params.id)
		res.render('user-edit-form.ejs', { pToEdit })
	},
	// Update - Method to update
	update: (req, res) => {
		const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
		const pToEdit = users.find(user => user.id == req.params.id)
		pToEdit.name = req.body.name || pToEdit.name
		pToEdit.price = req.body.price || pToEdit.price
		pToEdit.discount = req.body.discount || pToEdit.discount
		pToEdit.category = req.body.category || pToEdit.category
		pToEdit.description = req.body.description || pToEdit.description
		pToEdit.image = req.file?.filename || pToEdit.image
		fs.writeFileSync(usersFilePath, JSON.stringify(users, null, ' '))
		res.redirect('/login')
	},

	// Delete - Delete one user from DB
	destroy : (req, res) => {
		const pToDelete = users.filter(user => user.id != req.params.id)
		fs.writeFileSync(usersFilePath, JSON.stringify(pToDelete, null, ' '))
		res.redirect('/login')
	}
};

module.exports = controller;