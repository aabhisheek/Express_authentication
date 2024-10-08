//logic is at the end


// const User = require('./../Models/userModel');
// const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
// const jwt=require('jsonwebtoken');
// const CustomError =require('./../Utils/CustomError');
// const util =require('util');
// const sendEmail= require('./../Utils/email');
// const crypto =require('crypto');


// const createSendResponse=(user,statusCode,res) => {

//     const token=signToken(user._id);
    
//     const options={
//         expires:process.env.LOGIN_EXPIRES,
//         httpOnly:true
//     }
   
//     if(process.env.NODE_ENV==='production')
//          options.secure=true;

//     res.cookie('jwt',token,options);
     
//      user.password=undefined;
    

//     res.status(statusCode).json({
//         status: 'success',
//         token,
//         data: {
//             user: newUser
//         }
//     });
// }

// exports.signup = asyncErrorHandler(async (req, res, next) => {
//     const newUser = await User.create(req.body);
//     createSendResponse(newUser,201,res);
//     const token=jwt.sign({id:new_User._id},process.env.SECRET_STR,{expiresIn:process.env.LOGIN_EXPIRES});


//     res.status(201).json({
//         status: 'success',
//         token,
//         data: {
//             user: newUser
//         }
//     });
// });


// exports.login=asyncErrorHandler(async (req,res,next)=>{
//     const email=req.body.email;
//     const password=req.body.password;
//     // const {email, password}=req.body;

//     //Check if email & password is present in request body
//     if(!email|| !password) {
//     const error=new CustomError('Please provide email ID & Password for login in!', 400);
//     return next(error);
//     }
//     //Check if user exists with given email
//     const user=await User.findOne({ email }).select('+password');

//     // const isMatch=await user.comparePasswordInDb(password,user.password);



//     //Check if the user exists & password matches
//     if(!user || !(await user.comparePasswordInDb(password,user.password))) {
//     const error = new CustomError('Incorrect email or password', 400);
//     return next(error);
//     }
     
//     createSendResponse(user,201,res);  
//     const token=signToken(user._id);


//     res.status(200).json({
//     status: 'success',
//     token:'',
//     user
//     })
// });



// exports.protect=asyncErrorHandler(async (req, res, next) => {
//     //1. Read the token & check if it exist
//     const testToken =req.headers.authorization
//     let token;
//     if(testToken && testToken.startsWith('bearer')){
//     token =testToken.split('')[1];
//     if(!token) {
//       next(new CustomError('You are not logged inl', 401))
//     }
//     }
//     //2. validate the token
//     const decodedToken= await util.promisify(jwt.verify) (token, process.env.SECRET_STR);

//     console.log(decodedToken);
    

//     //3. If the user exists

//     const user=await User.findById(decodedToken.id);
//      if(!user) {
//      const error =new CustomError('The user with the given token does not exist', 401);
//      next(error); 
//     } 
     
//     const isPasswsordChanged=await user.isPasswordChanged(decodedToken.iat);
//     //4. If the user changed password after the token was issued
//      if(isPasswsordChanged){
//          const error=new CustomError('The password has been changed recently.Please login again',401);
//          return next(error);
//      }

     


//     //5.   Allow user to access route
//       req.user=user;
//       next();
// })  



// exports.restrict=(role)=>{
//     return (req,res,next)=>{
//          if(req.user.role!==role){
//             const error = new CustomError('You do not have permission to perform this action',403);
//                next(error);
//            } 
//        next();     
//     }
// }



// exports.restrict=(...role)=>{
//     return (req,res,next)=>{
//          if(!role.includes(req.user.role)){
//             const error = new CustomError('You do not have permission to perform this action',403);
//                next(error);
//            } 
//        next();     
//     }
// }






// exports.forgotPassword=asyncErrorHandler(async (req, res, next) =>{
//     //1. GET USER BASED ON POSTED EMAIL
//     const user = await User.findOne({email: req.body.email});

//     if(!user) {
//     const error = new CustomError('We could not find the user with given email', 404); 
//     next(error);
//     }
//    // 2. GENERATE A RANDOM RESET TOKEN
//     const resetToken =user.createResetPasswordToken();
//     await user.save({validateBeforeSave:false});//otherwise error that confirmPassowrd is a required field so to disable all schema  ruless
//     //3. SEND THE TOKEN BACK TO THE USER EMAIL
//        const resetUrl='${req.protocol}://${req.get('host')}/api/v1/users/resetPassword';
//        const message:'We have received a password reset request.Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes.' ; 
//        try{
//        await sendEmail(
//        {
//                  email:user.email,
//                  subject:'Password change request received',
//                  message:message
//         });

//         res.status(200).json({
//             status:'success',
//             message:'password reset link send to the user email'
//         })
//     }catch(err){
//         user.passwordResetToken = undefined;
//         user.passwordResetTokenExpires =undefined
//         user.save((validateBeforeSave:false));

//         return next(new CustomError('There was an error sending password reset email. Please try again later', 500));
//     }
// })
  


//     exports.resetPassword =asyncErrorHandler(async (req, res, next) =>{
//     //1. IF THE USER EXISTS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED
//     const token = crypto.create-lash("sha256").update(req.params.token).digest('hex');
//     const user=await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}});
//     if(!user){
//     const error=CustomError('Token is invalid or has expired!', 400);
//     next(error);
//     }
//     //2. RESETING THE USER PASSWORD
//     user.password= req.body.password;
//     user.confirmPassword =req.body.confirmPassword;
//     user.passwordResetToken= undefined;
//     user.passwordResetTokenExpires = undefined;
//     user.passwordChangedAt= Date.now();
//     user.save();
     

//     //3. LOGIN THE USER
//     //  createSendResponse(user,200,res);//either this line of code or below lines of code
//      const  loginToken=signToken(user._id);

//     res.status(200).json({
//         status:'success',
//         token:loginToken
//     })
// });









// exports.updatePassword =asyncErrorHandler(async (req, res, next) =>{
     
//     //GET CURRENT USER DATA FROM DATABASE
//     const  user= await User.findById(req.user._id).select('password');

//     //CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT
//     if(!(await user.comparePasswordInDb(req.body.currentPassword, user.password))){
//     return next(new CustomError('The current password you provided is wrong', 401));
//     }
//     //IF SUPPLIED PASSWORD IS CORRECT, UPDATE USER PASSWORD WITH NEW VALUE
//     user.password=req.body.password;
//     user.confirmPassword=req.body.confirmPassword;
//     await user.save();

//     //LOGIN USER & SEND JWT
//     const token=signToken(user._id);
     
//     res.status(200).json({
//         status:'success',
//         token,
//         data: {
//             user
//         }
//     })
// }) 


//corrected by gpt


const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomError');
const util = require('util');
const sendEmail = require('./../Utils/email');
const crypto = require('crypto');


// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    });
};



const createSendResponse = (user, statusCode, res) => {
    const token = signToken(user._id); // This should be defined

    const options = {
        expires: new Date(Date.now() + Number(process.env.LOGIN_EXPIRES)),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') options.secure = true;

    res.cookie('jwt', token, options);
    user.password = undefined; // Do not send the password back

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createSendResponse(newUser, 201, res); // Sends the response with user data and token
});

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email & password are present in request body
    if (!email || !password) {
        return next(new CustomError('Please provide email ID & Password for login!', 400));
    }

    // Check if user exists with the given email
    const user = await User.findOne({ email }).select('+password');

    // Validate user existence
    if (!user) {
        return next(new CustomError('User not found', 404));
    }

    // Log user and password for debugging
    console.log('User:', user);
    console.log('Password from DB:', user.password);

    // Check if the user exists & password matches
    if (!(await user.comparePasswordInDb(password))) {
        return next(new CustomError('Incorrect email or password', 400));
    }

    // Generate token and send response
    const token = signToken(user._id); // Ensure this function is defined
    createSendResponse(user, token, 200, res); // Sends the response with user data and token
});



// Protect middleware to check authentication
exports.protect = asyncErrorHandler(async (req, res, next) => {
    // 1. Read the token & check if it exists
    const testToken = req.headers.authorization;
    let token;

    if (testToken && testToken.startsWith('Bearer ')) {
        token = testToken.split(' ')[1]; // Fix split logic
    }

    if (!token) {
        return next(new CustomError('You are not logged in!', 401));
    }

    // 2. Validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    // 3. Check if the user exists
    const user = await User.findById(decodedToken.id);
    if (!user) {
        return next(new CustomError('The user with the given token does not exist', 401));
    }

    // 4. Check if the user changed password after the token was issued
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
    if (isPasswordChanged) {
        return next(new CustomError('The password has been changed recently. Please login again', 401));
    }

    // 5. Allow user to access route
    req.user = user;
    next();
});

// Restrict access to specific roles
exports.restrict = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new CustomError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

// Forgot Password
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    // 1. GET USER BASED ON POSTED EMAIL
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new CustomError('We could not find the user with the given email', 404));
    }

    // 2. GENERATE A RANDOM RESET TOKEN
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false }); // Disable validation for saving

    // 3. SEND THE TOKEN BACK TO THE USER EMAIL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request. Please use the link below to reset your password:\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password change request received',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Password reset link sent to the user email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new CustomError('There was an error sending the password reset email. Please try again later', 500));
    }
});

// Reset Password
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    // 1. IF THE USER EXISTS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED
    const token = crypto.createHash("sha256").update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new CustomError('Token is invalid or has expired!', 400));
    }

    // 2. RESET THE USER PASSWORD
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    // 3. LOGIN THE USER
    createSendResponse(user, 200, res); // Sends response with new token
});

// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    // GET CURRENT USER DATA FROM DATABASE
    const user = await User.findById(req.user._id).select('+password');

    // CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT
    if (!(await user.comparePasswordInDb(req.body.currentPassword, user.password))) {
        return next(new CustomError('The current password you provided is wrong', 401));
    }

    // IF SUPPLIED PASSWORD IS CORRECT, UPDATE USER PASSWORD WITH NEW VALUE
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    // LOGIN USER & SEND JWT
    createSendResponse(user, 200, res); // Sends response with new token
});
