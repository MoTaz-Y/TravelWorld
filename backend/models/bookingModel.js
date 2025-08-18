import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userEmail: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: Number, required: true },
    bookAt: { type: Date, required: true },
    guestSize: { type: Number, required: true },
    tourId: { type: String, required: true },
    totalFee: { type: Number, required: true },
    tourName: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
