class AppError extends Error {
  constructor(message, statusCode, statusText) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = statusText;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

// class AppError extends Error {
//   constructor() {
//     super();
//   }
//   create(message, statusCode, statusText) {
//     this.message = message;
//     this.statusCode = statusCode;
//     this.statusText = statusText;
//     return this;
//   }
// }

// export default AppError;
