const mongooose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: {
                id: Number,
                name: String,
                price: String,
                image: String
            },
            quantity: Number,
            price: String
        }
    ],
    total: { type: String, required: true },
    status: {  type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
