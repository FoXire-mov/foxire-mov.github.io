const menuBtn = document.getElementById('menu-btn');
const spNav = document.getElementById('sp-nav');

menuBtn.addEventListener('click', () => {
    // ボタンとメニューの両方に active クラスを付け外し
    menuBtn.classList.toggle('active');
    spNav.classList.toggle('active');
});

// メニュー内のリンクをクリックしたら、メニューを閉じる
const navLinks = document.querySelectorAll('.sp-nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        spNav.classList.remove('active');
    });
});
