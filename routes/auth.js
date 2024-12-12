const { Router } = require('express');
const router = Router();
const controller = require('../controllers/auth');
const categoty = require('../controllers/category');
const { registerValidators, loginValidators, categoryValidators } = require('../utils/validator');

router.get('/', async (req, res) => { res.render('index', { title: 'Главная', isHome: true }); });
router.get('/register', async (req, res) => { res.render('register', { title: 'Регистрация', registerError: req.flash('registerError'), isRegister: true }); });

router.post('/register', registerValidators, controller.register);

router.get('/login', async (req, res) => { res.render('login', { title: 'Авторизация', loginError: req.flash('loginError'), isLogin: true }); });

router.post('/login', loginValidators, controller.login);

router.get('/logout', controller.logout);

router.post('/add-category', categoryValidators, categoty.create);

router.get('/add-category', async(req, res) => { res.render('add-category', { title: 'Добавление категории', categoryError: req.flash('categoryError'), isAddCategory: true }); });

module.exports = router;