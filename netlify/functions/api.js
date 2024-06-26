require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path')
const serverless = require('serverless-http')

const authController = require('../../controllers/auth.js');
const travelController = require('../../controllers/travel.js')
const communityController = require('../../controllers/community.js')

const User = require('../../models/user.js')
const Conversation = require('../../models/conversation.js')


// const port = process.env.PORT ? process.env.PORT : '3000';

async function connectToDb() {
    await mongoose.connect(process.env.MONGODB_URI);
}
connectToDb()

// mongoose.connect(process.env.MONGODB_URI);
// mongoose.connection.on('connected', () => {
//     console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
// });

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

app.use((req, res, next) => {
    if (req.session.message) {
        res.locals.message = req.session.message;
        req.session.message = null;
    }
    next();
});

app.use(express.json())

app.use('/auth', authController);
app.use('/travel/:userId', travelController);
app.use('/community', communityController)


app.get('/', (req, res) => {
    res.render('home.ejs')
})


app.get('*', function (req, res) {
    res.status(404).render('error/error.ejs', {
        errorMessage: 'Route not found!',
    });
});



// const handleServerError = (error) => {
//     if (error.code === 'EADDRINUSE') {
//         console.log(`Warning! Port ${port} is already in use!`);
//     } else {
//         console.log('Error:', error);
//     }
// }


module.exports.handler = serverless(app)

// app.listen(port, () => {
//     console.log(`The express app is ready on port ${port}!`);
// }).on('error', handleServerError)