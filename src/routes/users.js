const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const path = require('path');

const uploadFile = require('../middlewares/multer');

const validations = [
    body('name').notEmpty().withMessage('Tienes que ingresar un nombre y apellido'),
	body('username').notEmpty().withMessage('Tienes que ingresar un nombre de usuario'),

	body('email')
		.notEmpty().withMessage('Tienes que escribir un correo electrónico').bail()
		.isEmail().withMessage('Debes escribir un formato de correo válido')
		.custom(async value => {
			const existingUser = await Users.findByEmail(value);
			if (existingUser) {
				throw new Error('Existe un usuario con esta direccion de correo electronico');
			}
		  }),

	body('birth').notEmpty().withMessage('Tienes que ingresar una fecha de nacimiento'),
    body('address').notEmpty().withMessage('Tiene que ingresar una direccion'),
    body('options').notEmpty().withMessage('Tiene que seleccionar una opcion'),

	body('password').notEmpty().isLength({ min: 5 }).withMessage('Tienes que escribir una contraseña'),
	body('passwordConfirmation').custom((value, { req }) => {
	  return value === req.body.password;
	}),
	(req, res) => {
		throw new Error('Las contraseñas ingresadas no coinciden');
	},

    body('photo-username').custom((value, { req }) => {
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
const usersController = require('../controllers/usersController');

/*** GET ONE USER ***/ 
router.get('/login/:id/', usersController.login); 

/*** CREATE ONE USER ***/ 
router.get('/create', usersController.create); 
router.post('/create', uploadFile.single('photo-username'), validations, usersController.store); 

/*** EDIT ONE USER ***/ 
router.get('/users/edit/:id', usersController.edit); 
router.put('/users/edit/:id', uploadFile.single('photo-username'), usersController.update); 

/*** DELETE ONE USER ***/ 
router.delete('/users/delete/:id', usersController.destroy); 


module.exports = router;
