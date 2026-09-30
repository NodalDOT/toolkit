document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".swiper-slide");
  slides.forEach((slide, index) => {
    slide.style.transform = `rotate(45deg) translateX(${(index - 2) * 300 * 0.7}px)`;
  });

  const updateSlidePositions = (swiperInstance) => {
    const { slides: swiperSlides, activeIndex, width } = swiperInstance;
    swiperSlides.forEach((slide, index) => {
      const offset = (index - activeIndex) * width * 0.7;
      slide.style.transform = `rotate(45deg) translateX(${offset}px)`;
    });
  };

  // eslint-disable-next-line no-undef
  new Swiper(".swiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    centeredSlides: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init() {
        updateSlidePositions(this);
      },
      slideChange() {
        updateSlidePositions(this);
      },
      transitionStart() {
        this.slides.forEach((slide) => {
          slide.style.transition = "transform 0.3s ease";
        });
      },
    },
  });
});
