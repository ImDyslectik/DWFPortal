const multer  = require('multer');
const path = require('path');

// Multer configuratie + filtering voor .xls supported files
const storage = multer.memoryStorage()
function fileFilter (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls' ) {
        return cb(new Error('Only Excel .xlsx or .xls files are allowed'))
    }
    cb(null, true)
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;