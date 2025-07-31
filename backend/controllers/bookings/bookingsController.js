const Booking = require('../../models/bookingsModel');
const Tour = require('../../models/tourModel');
const factory = require('../handlers/handlerFactory');

exports.getBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking, Tour);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
