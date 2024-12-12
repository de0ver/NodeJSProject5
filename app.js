const express = require('express');
const handlebars = require('express-handlebars');
const { default: mongoose } = require('mongoose');
const auth = require('./routes/auth');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const categoryRoutes = require('./routes/category');
const userMiddleware = require('./middleware/user');
const varMiddleware = require('./middleware/variables');
const uploadImage = require('./middleware/upload');
const csrf = require('csurf');
const path = require('path');

const flash = require('express-flash');
const session = require('express-session');

const hbs = handlebars.create({
    layoutsDir: 'views/layouts', 
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
});

hbs.handlebars.registerHelper('ifCond', function(v1, v2, options) { return v1 == v2 ? options.fn(this) : options.inverse(this); } );

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(uploadImage.single('imgsrc'));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use(auth);
app.use(categoryRoutes);

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log('Mongo connected!'))
            .catch(error => console.log(error));
        app.listen(PORT, () => { console.log('Started... PORT: ', PORT); });
    } catch (e) { console.log(e); }
}

start();