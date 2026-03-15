var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, ChangePasswordValidator, validatedResult } = require('../utils/validator')
let {CheckLogin} = require('../utils/authHandler')
//login
router.post('/login',async function (req, res, next) {
    let { username, password } = req.body;
    let result = await userController.QueryLogin(username,password);
    if(!result){
        res.status(404).send("thong tin dang nhap khong dung")
    }else{
        res.send(result)
    }
    
})
router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    let { username, password, email } = req.body;
    let newUser = await userController.CreateAnUser(
        username, password, email, '69b6231b3de61addb401ea26'
    )
    res.send(newUser)
})
router.get('/me',CheckLogin,function(req,res,next){
    res.send(req.user)
})

router.post('/changepassword', CheckLogin, ChangePasswordValidator, validatedResult, async function (req, res, next) {
    let { oldpassword, newpassword } = req.body;
    let currentUser = Array.isArray(req.user) ? req.user[0] : req.user;
    if (!currentUser) {
        res.status(403).send({ message: "ban chua dang nhap" });
        return;
    }
    let result = await userController.ChangePassword(currentUser._id, oldpassword, newpassword);
    if (!result) {
        res.status(400).send({ message: "oldpassword khong dung" });
        return;
    }
    res.send({ message: "doi mat khau thanh cong" });
})

//register
//changepassword
//me
//forgotpassword
//permission
module.exports = router;