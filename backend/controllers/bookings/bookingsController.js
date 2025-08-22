import Booking from '../../models/bookingModel.js';
import Tour from '../../models/tourModel.js';
import factory from './handlerFactory.js';
import User from '../../models/userModel.js';

export const getBookings = factory.getAll(Booking);
export const getBooking = factory.getOne(Booking);
export const createBooking = factory.createOne(Booking, Tour, User);
export const updateBooking = factory.updateOne(Booking);
export const deleteBooking = factory.deleteOne(Booking);
