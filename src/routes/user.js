const path = require('path');

const uploadFile = require('../middlewares/multer');

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
const usersController = require('../controllers/usersController');

/*** GET ONE USER ***/ 
router.get('/login/:id/', usersController.login); 

/*** CREATE ONE USER ***/ 
router.get('/create', usersController.create); 
router.post('/create', uploadFile.single('productImg'), validations, usersController.store); 

/*** EDIT ONE USER ***/ 
router.get('/edit/:id', usersController.edit); 
router.put('/edit/:id', uploadFile.single('productImg'), usersController.update); 

/*** DELETE ONE USER ***/ 
router.delete('/delete/:id', usersController.destroy); 


module.exports = router;
