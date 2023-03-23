
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path=require('path');
const Admincontroller = require('../controller/admincontroller');





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + 'blog' + path.extname(file.originalname));
    }
})

const maxSize = 2 * 1024 * 1024; // for 1MB

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
    limits: {
        fileSize: maxSize
    }
});



router.get('/', Admincontroller.adminlogin);
router.get('/admin-dashboard', Admincontroller.admindashboard);
router.get('/register',upload.single('image'), Admincontroller.adminregister);
router.post('/signup', Admincontroller.create_register);
router.post('/signin', Admincontroller.create_logIn);
router.get('/logout', Admincontroller.logout);

module.exports = router;