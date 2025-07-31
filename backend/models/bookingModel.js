const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: Number, required: true },
    bookAt: { type: Date, required: true },
    guestSize: { type: Number, required: true },
    tourName: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
