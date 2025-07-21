import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import galleryImages from './galleryImages';
import './galleryMasonry.css';

const MasonryImagesGallery = () => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 1, 768: 3, 992: 4 }}
      gutterBreakpoints={{ 350: '12px', 750: '16px', 900: '24px' }}
    >
      <Masonry gutter='1rem'>
        {galleryImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Gallery Image ${index + 1}`}
            // style={{ width: '100%', display: 'block', borderRadius: '10px' }}
            className='masonry__img'
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryImagesGallery;
