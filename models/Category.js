const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    imageSrc: { type: String, default: '' },
    userId: { ref: 'users', type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('categories', categorySchema);