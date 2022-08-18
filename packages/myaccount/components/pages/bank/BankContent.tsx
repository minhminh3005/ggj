import {IBankInfo, nsBank} from 'store/bankSlice'
import {useAppSelector} from 'store/hooks'
import {Swiper, SwiperSlide} from 'swiper/react'
import BankCard from './BankCard'

import 'swiper/css'
import 'swiper/css/pagination'
import {Pagination} from 'swiper'
import {css} from '@emotion/react'
import {useState} from 'react'
import BankModal from './BankModal'

const BankContent = () => {
  const data = useAppSelector((state) => state[nsBank]?.bankInfoArr)
  const [show, setShow] = useState(false)

  return (
    <>
      <Swiper
        modules={[Pagination]}
        pagination={true}
        css={css`
          margin-top: 24px;
          padding-bottom: 50px;
          .swiper-pagination {
            bottom: 0px;
            .swiper-pagination-bullet-active {
              background: #222222;
            }
          }
          .swiper-slide-next,
          .swiper-slide-prev {
            transform: scale(0.7);
            transition: all 0.3s ease-in-out;
          }
          .swiper-slide {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .swiper-slide-active{
            width: 240px !important;
          }
          @media (min-width: 600px) {
            padding-bottom: 0px;
            .swiper-slide-next,
            .swiper-slide-prev {
              transform: scale(1);
            }
          }
        `}
        breakpoints={{
          280: {
            slidesPerView: 1.1,
            centeredSlides: true,
          },
          320: {
            slidesPerView: 1.2,
            centeredSlides: true,
          },
          375: {
            slidesPerView: 1.5,
            centeredSlides: true,
          },
          600: {
            slidesPerView: 2,
            centeredSlides: false,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2,
            centeredSlides: false,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 2,
            centeredSlides: false,
            spaceBetween: 16,
          },
        }}
      >
        {
          data[0].accountNumber ? (
            <SwiperSlide key={`${data[0].bankType}`}>
              <BankCard data={data[0]} show={() => setShow(true)}/>
            </SwiperSlide>
          ) : (
            data[0].bankType == 1 && (
              <SwiperSlide key={`${data[0].bankType}`}>
                <BankCard data={{} as IBankInfo} show={() => setShow(true)}/>
              </SwiperSlide>
            )
          )
        }
      </Swiper>
      <BankModal open={show} close={() => setShow(false)}/>
    </>
  )
}
export default BankContent
