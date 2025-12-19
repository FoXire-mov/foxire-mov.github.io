document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const spNav = document.getElementById('sp-nav');

    if (menuBtn && spNav) {
        menuBtn.addEventListener('click', () => {
            // クラスの付け外し
            menuBtn.classList.toggle('active');
            spNav.classList.toggle('active');
            
            // 開いている時はスクロール不可にする（お好みで）
            if (spNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // メニュー内のリンクをクリックしたら閉じる
        const navLinks = spNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                spNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
});
