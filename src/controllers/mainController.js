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
		palabra = (req.query.keywords).toLowerCase();
		const pFound = products.some(product => product.name.toLowerCase().includes(palabra))
		const pToSearch = products.filter(product => product.name.toLowerCase().includes(palabra));
		res.render('results.ejs', { pToSearch, palabra, pFound });
	},
};

module.exports = controller;
