import Booking from '../../models/bookingModel.js';
import Tour from '../../models/tourModel.js';
import factory from './handlerFactory.js';

export const getBookings = factory.getAll(Booking);
export const getBooking = factory.getOne(Booking);
export const createBooking = factory.createOne(Booking, Tour);
export const updateBooking = factory.updateOne(Booking);
export const deleteBooking = factory.deleteOne(Booking);
