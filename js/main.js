document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const spNav = document.getElementById('sp-nav');

    if (menuBtn && spNav) {
        menuBtn.addEventListener('click', () => {
            console.log('Button clicked!'); // 動作確認用
            menuBtn.classList.toggle('active');
            spNav.classList.toggle('active');
        });

        // メニュー内のリンクをクリックしたら閉じる
        const navLinks = spNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                spNav.classList.remove('active');
            });
        });
    } else {
        console.error('Menu elements not found!');
    }
});
