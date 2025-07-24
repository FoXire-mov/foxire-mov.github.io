$(document).ready(function () {
$(".slide").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000, // 自動再生のスピード（ミリ秒単位）
    infinite: true, // スライドのループを有効にするか
    accessibility: true,
    arrows: true,
    swipe: true,
    swipeToSlide: true
  });
});
