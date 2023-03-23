
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const { urlencoded } = require('body-parser');
const multer = require('multer');
const path = require('path');
const port = 4567;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(flash());
app.use(cookie_parser());
app.use(session({
    cookie: { maxAge: 6000 },
    secret: "ankan",
    saveUninitialized: false,
    resave: false
}))

app.use(express.static(path.join(__dirname, 'public')));
 app.use('/uplaod', express.static(path.join(__dirname, 'upload')));


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './upload')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname +"_"+Date.now()+file.originalname);
    }
})


// const upload=multer({
//     storage: storage,
// }).single("image")

// const upload=multer({
//     storage:storage,
//      fileFilter: (req, file, cb) => {
//     if (file.mimetype.includes("png") ||
//         file.mimetype.includes("jpg") ||
//         file.mimetype.includes("jpeg")) {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }
// })


// app.use(multer({ storage: fileStorage, fileFilter: fileFilter, limits: { fieldSize: 1024 * 1024 * 2 } }).single('image'))

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminauth = require('./middleware/adminauth')
app.use(adminauth.authejwt)


const UserRoute = require('./route/userroute')
const AdminRoute = require('./route/adminroute')

app.use(UserRoute)
app.use('/admin', AdminRoute)

const dbConnect = "mongodb+srv://ankandb:vnkhSzkCKB5LXe20@cluster0.jmt30c3.mongodb.net/dashboard";
mongoose.connect(dbConnect, ({ useNewUrlParser: true, useUnifiedTopology: true }))
    .then(results => {
        app.listen(port, () => {
            console.log("DataBase Connected...");
            console.log(`server running http://localhost:${port}`);
        })
    }).catch(err => {
        console.log(err);
    })