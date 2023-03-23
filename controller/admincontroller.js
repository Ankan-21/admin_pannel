
const AdminModel = require('../model/adminmodel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path')

const adminauth=(req, res,next)=>{
    if(req.user) {
        console.log(req.error);
        next();
    }else{
        console.log(req.user);
        res.redirect('/admin/')
    }
}
const admindashboard = (req, res) => {
    if (req.user) {
        AdminModel.find({}, function (error, userdetails) {
            if (!error) {
                res.render('./admin/admin-dashboard', {
                    data: req.user,
                    detail: userdetails
                });
            }
        })
    }

}

const adminlogin = (req, res) => {
    res.render('./admin/admin-login', {
        message: req.flash('message'),
        message2: req.flash('message2'),
        data: AdminModel.find()
    })
}

const adminregister = (req, res) => {
    res.render('./admin/admin-register', {
        message2: req.flash('message2'),
        data: AdminModel.find()
    })
}

const create_register = (req, res) => {
    AdminModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        organization: req.body.organization,
        password: bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10))
    }).save((error, data) => {
        if (!error) {
            req.flash('message', "User Registeration Successfully")
            console.log("User Added Successfully...");
            res.redirect('/admin/')
        } else {
            req.flash('message2', "Please Register First")
            console.log(error, "User not added...");
            res.redirect('/admin/admin-register')
        }
    })
}


const create_logIn = (req, res) => {
    AdminModel.findOne({
        email: req.body.email
    }, (error, data) => {
        if (data) {
            const haspassword = data.password
            if (bcrypt.compareSync(req.body.password, haspassword)) {
                const token = jwt.sign({
                    id: data._id,
                    firstname: data.firstname,
                    organization: data.organization,
                }, 'ankan34567', { expiresIn: '4m' })
                res.cookie('admintoken', token)
                if (req.body.rememberme) {
                    res.cookie('email', req.body.email)
                    res.cookie('password', req.body.password)
                }
                console.log(data, "Admin Login Successfully...");
                res.redirect('/admin/admin-dashboard')
            } else {
                req.flash('message2', "Password Incorrect")
                console.log("Invalid Password");
                res.redirect('/admin/')
            }
        } else {
            req.flash('message2', "Email not Found")
            console.log("Invalid email");
            res.redirect('/admin/')
        }
    })
}


const logout = (req, res) => {
    res.clearCookie('admintoken')
    console.log("Admin Logout Successfully...");
    req.flash('message', "Logout Successfully...")
    res.redirect('/admin/')
    
}

module.exports = {
    admindashboard,
    adminlogin,
    adminregister,
    adminauth,
    create_register,
    create_logIn,
    logout
}