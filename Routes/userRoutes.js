const express=require('express');
const router=express.Router();
const authController= require('./../Controllers/authController');
const userController =require('./../Controllers/userController');



router.route('/getAllUsers').get(
    
    userController.getAllUsers
    );




router.route('/updatePassword').patch(
authController.protect,
userController.updatePassword
);

//updateMe logic not correct in handler
router.route('/updateMe').patch(
    authController.protect,
    userController.updateMe
    );


    router.route('/deleteMe').delete(
        authController.protect,
        userController.deleteMe
        );



module.exports = router;


