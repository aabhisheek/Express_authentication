//IMPORT PACKAGE
const express = require('express');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit');
const moviesRoutes = require('./Routes/moviesRoutes');
const authRoutes = require('./Routes/authRoutes')
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController')
const  userRoutes = require('./Routes/userRoutes');
const helmet=require('helmet');
const sanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const  hpp=require('hpp');

let app = express();

app.use(helmet());

//error in below two paras
let limiter=rateLimit({
    max:3,
    windows:60*60*1000,
    message:'We have received too many requests from this IP.Please try after one hour.'
})

app.use('/api',limiter);


app.use(express.json({limit:'10kb'}));
// app.use(express.json());


app.use(express.static('./public'))

app.use(sanitize());
app.use(xss());
app.use(hpp());
app.use(hpp({whitelist:['duration']}));
app.use(hpp({whitelist:['duration','ratings','releaseYear','releaseDate','genres']}));

//USING ROUTES


app.use('/api/v1/movies', moviesRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);



app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server!`
    // });
    // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;

