let currentIndex = 0;
const images = document.querySelectorAll("#carousel > div");
const totalImages = images.length;

function moveCarousel(direction) {
  currentIndex = (currentIndex + direction + totalImages) % totalImages;
  updateCarouselPosition();
}

function updateCarouselPosition() {
  const carousel = document.getElementById("carousel");
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

setInterval(() => {
  moveCarousel(1);
}, 5000);
