import cloudinary from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUploads, {
      resource_type: 'auto',
    });
    return data;
  } catch (error) {
    return error;
  }
};

module.exports = cloudinaryUploadImg;
