$(document).ready(function () {
$(".slide").slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    dot: false,
    autoplay: true,
    autoplaySpeed: 3000, // 自動再生のスピード（ミリ秒単位）
    infinite: true, // スライドのループを有効にするか
    accessibility: true,
  });
});
