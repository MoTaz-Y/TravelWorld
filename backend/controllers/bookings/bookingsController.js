const Booking = require('../../models/bookingModel');
const Tour = require('../../models/tourModel');
const factory = require('./handlerFactory');

exports.getBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking, Tour);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
