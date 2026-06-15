import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import './BarnnerCard.css';
import { EffectCards, Autoplay } from 'swiper/modules';

const BarnnerCard = () => {
  return (
    <div className='banner'>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="mySwiper"
      >
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
      </Swiper>
    </div>
  );
};

export default BarnnerCard;
