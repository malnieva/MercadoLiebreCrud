const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		const inDiscount = products.filter(product => product.discount > 0)
		const visited = products.filter(product => product.category === "visited")
		res.render('index.ejs', { inDiscount, visited })
	},
	search: (req, res) => {
		//console.log(req.params.keywords);

		if (products.some(product => product.name == 'cafetera')){
			const pToEdit = products.find(product => product.id == req.params.id)
			res.render('results.ejs', { pToEdit })
			//res.render('product-edit-form.ejs', { pToEdit })
		}


		//const found = products.filter(product => product.name === req.params.name)
		//res.render('results.ejs')
	},
};

module.exports = controller;
