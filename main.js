$(document).ready(function () {
$(".slide").slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500, // 自動再生のスピード（ミリ秒単位）
    infinite: true, // スライドのループを有効にするか
    accessibility: true,
    arrows: true,
    swipe: true,
    swipeToSlide: true
  });
});
