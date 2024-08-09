// middlewares/multer.js
const multer = require('multer');
const path = require('path');
const shortid = require('shortid');

const configuracionMulter = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadsDir = path.join(__dirname, '../uploads'); // Usar path.join para asegurar compatibilidad SO
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato No válido'));
        }
    }
};

const upload = multer(configuracionMulter).single('imagen');

module.exports = upload;
