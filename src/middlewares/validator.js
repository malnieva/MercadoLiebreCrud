const { body } = require('express-validator');
const path = require('path');

const validations = [
    body('name').notEmpty().withMessage('Tiene que ingresar un nombre'),
    body('price').notEmpty().withMessage('Tiene que ingresar un precio'),
    body('discount').notEmpty().withMessage('Tiene que ingresar un descuento/0 para nada'),
    body('category').notEmpty().withMessage('Tiene que seleccionar una categoria'),
    body('description').notEmpty().withMessage('Tiene que ingresar una descripcion'),
    body('productImg').custom((value, { req }) => {
        let file = req.file;
        console.log(file);
        let acceptedExtensions = ['.jpg', '.png', '.gif'];
        let fileExtension = path.extname(file.originalname);

        if (!file) {
            throw new Error('Tienes que subir una imagen');
        }

        if (!acceptedExtensions.includes(fileExtension)){
            throw new Error(`Las extensiones de archivo permitidas son ${acceptedExtensions.join(', ')}`);
        }
        return true;
    })
]

const validaciones = { validations : validations };

module.exports = validaciones;