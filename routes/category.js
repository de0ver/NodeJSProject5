const { Router } = require('express');
const router = Router();
const controller = require('../controllers/category');
const { categoryValidators } = require('../utils/validator');
const auth = require('../middleware/auth');
const Category = require("../models/Category");

router.get('/category', controller.getAll);

router.post('/add-category', auth, categoryValidators, controller.create);

router.get('/add-category', auth, async (req, res) => {
    res.render('add-category', {
        title: 'Добавление категории',
        categoryError: req.flash('categoryError'),
        isAddCategory: true,
    });
});

router.post('/category/edit', auth, controller.update);

router.get('/category/edit/:id', auth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render('edit-category', {
            title: `Редактировать ${category.name}`,
            category
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/category/remove/:id', auth, controller.remove);

module.exports = router;