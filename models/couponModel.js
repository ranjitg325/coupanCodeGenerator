const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        //required: true,
        default:function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          
            for (var i = 0; i < 5; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          
            return text;
          }
    },
    issueDate: {
        type: Date,
        default: () => new Date()
    },
    expirationDate: Date,
    redeemedDate: Date,
    cancellationDate: Date,
    value: Number,
    unit: String,
    title: String,
    body: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Createuser",
        //required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }

}, { timestamps: true })

module.exports = mongoose.model('coupon', couponSchema);