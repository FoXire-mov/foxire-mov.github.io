document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ハンバーガーメニュー (そのまま) ---
    const menuBtn = document.getElementById('menu-btn');
    const spNav = document.getElementById('sp-nav');
    if (menuBtn && spNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            spNav.classList.toggle('active');
            document.body.style.overflow = spNav.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // --- 2. 究極の掛け合わせフィルター機能 ---
    const typeButtons = document.querySelectorAll('.type-filters .filter-btn');
    const artistButtons = document.querySelectorAll('.artist-filters .filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    function updateFilters() {
        // 現在アクティブなフィルター名を取得
        const activeType = document.querySelector('.type-filters .filter-btn.active').getAttribute('data-filter');
        const activeArtist = document.querySelector('.artist-filters .filter-btn.active').getAttribute('data-artist');

        workItems.forEach(item => {
            // TYPEの条件チェック
            const matchType = (activeType === 'all' || item.classList.contains(activeType));
            // ARTISTの条件チェック
            const matchArtist = (activeArtist === 'all' || item.classList.contains(activeArtist));

            // 両方の条件を満たした場合だけ表示
            if (matchType && matchArtist) {
                item.classList.remove('is-hidden');
            } else {
                item.classList.add('is-hidden');
            }
        });
    }

    // TYPEボタンのクリックイベント
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateFilters();
        });
    });

    // ARTISTボタンのクリックイベント
    artistButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            artistButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateFilters();
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const worksGrid = document.getElementById('works-grid');
    const loadMoreBtn = document.getElementById('load-more');
    const itemsPerPage = 6; // 最初に見せる数
    const loadCount = 4;    // ボタンを押して増える数
    
    const items = Array.from(worksGrid.querySelectorAll('.work-item'));

    // 1. 最初：6個より後ろのアイテムを隠す
    function updateVisibility() {
        items.forEach((item, index) => {
            if (index < itemsPerPage) {
                item.classList.remove('is-hidden');
            } else {
                item.classList.add('is-hidden');
            }
        });
        
        // アイテムが6個以下ならボタンを消す
        if (items.length <= itemsPerPage) {
            loadMoreBtn.style.display = 'none';
        }
    }

    updateVisibility();

    // 2. ボタンを押した時の処理
    loadMoreBtn.addEventListener('click', () => {
        const hiddenItems = items.filter(item => item.classList.contains('is-hidden'));
        
        // 隠れているものを4つだけ表示させる
        for (let i = 0; i < loadCount; i++) {
            if (hiddenItems[i]) {
                hiddenItems[i].classList.remove('is-hidden');
            }
        }

        // 全部表示されたらボタンを消す
        if (items.filter(item => item.classList.contains('is-hidden')).length === 0) {
            loadMoreBtn.style.display = 'none';
        }
    });
});
