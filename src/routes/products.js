// ************ Require's ************
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const path = require('path');

const uploadFile = require('../middlewares/multerProduct');

const validations = [
    body('name').notEmpty().withMessage('Tiene que ingresar un nombre'),
    body('price').notEmpty().withMessage('Tiene que ingresar un precio'),
    body('discount').notEmpty().withMessage('Tiene que ingresar un descuento/0 para nada'),
    body('category').notEmpty().withMessage('Tiene que seleccionar una categoria'),
    body('description').notEmpty().withMessage('Tiene que ingresar una descripcion'),
    body('productImg').custom((value, { req }) => {
		let file = req.file;
		let acceptedExtensions = ['.jpg', '.png', '.gif'];
		
		if (!file) {
			throw new Error('Tienes que subir una imagen');
		} else {
			let fileExtension = path.extname(file.originalname);
			if (!acceptedExtensions.includes(fileExtension)) {
				throw new Error(`Las extensiones de archivo permitidas son ${acceptedExtensions.join(', ')}`);
			}
		}

		return true;
    })
]

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** GET ONE PRODUCT ***/ 
router.get('/detail/:id/', productsController.detail); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', productsController.create); 
router.post('/create', uploadFile.single('productImg'), validations, productsController.store); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id', productsController.edit); 
router.put('/edit/:id', uploadFile.single('productImg'), productsController.update); 

/*** DELETE ONE PRODUCT***/ 
router.delete('/delete/:id', productsController.destroy); 


module.exports = router;
