const Category = require('../models/Category')
const { validationResult } = require("express-validator")

module.exports.getAll = async function (req, res) {
    const categories = await Category.find()
        .populate('userId')
        .select('name imageSrc')
    res.render('categories', {
        title: 'Список категорий',
        isCategories: true,
        userId: req.user ? req.user._id.toString().toLowerCase() : null,
        categories
    });
};

module.exports.remove = async function (req, res) {
    try {
        await Category.deleteOne({
            _id: req.params.id
        });
        res.redirect('/category');
    } catch (e) {
        console.log(e);
    }
}

module.exports.create = async function (req, res) {
    const { name } = req.body;
    const checkCategory = await Category.findOne({ name: name });
    if (checkCategory) {
        req.flash('categoryError',
            {
                field: 'db',
                message: 'Такая категория уже есть',
            });
        res.redirect('/add-category');
    } else {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            errors.array().forEach((error) => {
                errs.push({
                    field: error.path,
                    message: error.msg,
                });
            });

            req.flash('categoryError', errs);
            return res.redirect('/add-category');
        } else {
            const category = new Category({
                name: name,
                imageSrc: req.file ? req.file.path : 'images\\category.png',
                userId: req.user ? req.user._id.toString() : null
            });
            try {
                await category.save();
                return res.redirect('/category');
            } catch (e) {
                console.log(e);
            }
        }
    }
}

module.exports.update = async function (req, res) {

    const { name, id } = req.body

    const category = await Category.findById(id)

    try {

        const result = await Category.findByIdAndUpdate(id, {

            name: name ? name : category.name,

            imageSrc: req.file ? req.file.path : category.imageSrc

        },

            { new: true })

        res.redirect('/category')

    } catch (e) {

        console.log(e)

    }

}