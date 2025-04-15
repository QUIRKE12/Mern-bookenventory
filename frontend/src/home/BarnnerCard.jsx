// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import './BarnnerCard.css';


// import required modules
import { EffectCards } from 'swiper/modules';

const BarnnerCard = () => {
  return (
    <div className='banner'>
<Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
 <SwiperSlide className="swiper-slide-1"></SwiperSlide>
<SwiperSlide className="swiper-slide-2"></SwiperSlide>
<SwiperSlide className="swiper-slide-3"></SwiperSlide>
<SwiperSlide className="swiper-slide-4"></SwiperSlide>
<SwiperSlide className="swiper-slide-5"></SwiperSlide>

      </Swiper>
          </div>
  )
}

export default BarnnerCard
