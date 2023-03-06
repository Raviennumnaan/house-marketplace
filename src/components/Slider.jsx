import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import Spinner from './Spinner';

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));

      const querySnap = await getDocs(q);

      const listings = [];
      querySnap.forEach(doc => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListing();
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <p className='exploreHeading'>Recommended</p>

      <Swiper
        slidesPerView={1}
        modules={[Pagination, Navigation, A11y, Scrollbar, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
      >
        {listings.map(({ data, id }) => (
          <SwiperSlide
            key={id}
            onClick={() => navigate(`category/${data.type}/${id}`)}
          >
            <img
              style={{
                width: '100%',
                height: '300px',
                borderRadius: '1.5rem',
                objectFit: 'cover',
              }}
              src={data.imageUrls[0]}
              alt='{listing.title}'
            />
            <p className='swiperSlideText'>{data.name}</p>
            <p className='swiperSlidePrice'>
              ${data.discountedPrice ?? data.regularPrice}{' '}
              {data.type === 'rent' && '/ month'}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Slider;
