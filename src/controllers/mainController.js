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
		palabra = (req.query.keywords).trim();
		let pFound = products.some(product => product.name.includes(palabra))
		if (pFound){
			const pToSearch = products.filter(product => product.name.includes(palabra));
			console.log(pToSearch);
			res.render('results.ejs', { pToSearch, palabra, pFound });
		}// else{
		//	console.log('llego un error');
		//}
	},
};

module.exports = controller;
