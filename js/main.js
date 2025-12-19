document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ハンバーガーメニュー機能 ---
    const menuBtn = document.getElementById('menu-btn');
    const spNav = document.getElementById('sp-nav');

    if (menuBtn && spNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            spNav.classList.toggle('active');
            document.body.style.overflow = spNav.classList.contains('active') ? 'hidden' : 'auto';
        });

        const navLinks = spNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                spNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // --- 2. WORKS フィルター機能 ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    if (filterButtons.length > 0 && workItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // ボタンの active クラスを切り替え
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterType = button.getAttribute('data-filter'); // HTML側の data-filter を取得
                const filterArtist = button.getAttribute('data-artist'); // もしアーティスト別なら

                workItems.forEach(item => {
                    // クラス名にフィルター名が含まれているかチェック
                    const categoryMatch = filterType === 'all' || item.classList.contains(filterType);
                    const artistMatch = !filterArtist || filterArtist === 'all' || item.classList.contains(filterArtist);

                    if (categoryMatch && artistMatch) {
                        item.classList.remove('is-hidden'); // CSSで display: block になる
                    } else {
                        item.classList.add('is-hidden');    // CSSで display: none になる
                    }
                });
            });
        });
    }
});
