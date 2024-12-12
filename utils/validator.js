const { body } = require('express-validator');
const User = require('../models/User');
const Category = require('../models/Category');

exports.registerValidators = [
    body('name')
        .isLength({min: 3}).withMessage('Имя должно быть минимум 3 символа')
        .trim(),
    body('login')
        .isLength({min: 3}).withMessage('Логин должен быть минимум 3 символа')
        .trim(),
    body('email')
        .isEmail().withMessage('Введите корректный Email')
        .normalizeEmail(),
    body('password', 'Пароль должен быть минимум 6 символов')
        .isLength({min: 3, max: 64})
        .trim()
];

exports.loginValidators = [
    body('login')
        .isLength({min: 3}).withMessage('Логин должен быть минимум 3 символа')
        .trim(),
    body('password', 'Пароль должен быть минимум 6 символов')
        .isLength({min: 3, max: 64})
        .trim()
];

exports.categoryValidators = [
    body('name')
        .isLength({min: 3}).withMessage('Название должно быть минимум 3 символа')
        .trim()
];