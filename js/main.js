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
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    const INITIAL_COUNT = 6; // 最初に見せる数
    const LOAD_COUNT = 4;    // MORE VIEWで追加する数

    let currentFilter = 'all';
    let currentArtist = 'all';

    // 表示を更新するメイン関数
    function updateWorksDisplay(isFirstLoad = false) {
        const allItems = Array.from(worksGrid.querySelectorAll('.work-item'));
        
        // 1. フィルターに合致するものを抽出
        const filteredItems = allItems.filter(item => {
            const matchType = currentFilter === 'all' || item.classList.contains(currentFilter);
            const matchArtist = currentArtist === 'all' || item.classList.contains(currentArtist);
            return matchType && matchArtist;
        });

        // 2. 一旦すべて非表示にする
        allItems.forEach(item => {
            item.style.display = 'none';
            item.classList.add('is-hidden');
        });

        // 3. フィルター後のアイテムのうち、最初の「表示枠」分だけ表示
        filteredItems.forEach((item, index) => {
            if (index < INITIAL_COUNT) {
                item.style.display = 'block';
                item.classList.remove('is-hidden');
            }
        });

        // 4. MORE VIEW ボタンの表示制御
        if (filteredItems.length > INITIAL_COUNT) {
            loadMoreBtn.parentElement.style.display = 'block';
        } else {
            loadMoreBtn.parentElement.style.display = 'none';
        }
    }

    // フィルタボタンのクリックイベント
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // アクティブ状態の切り替え
            btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // フィルター条件の保存
            if (btn.parentElement.classList.contains('type-filters')) {
                currentFilter = btn.getAttribute('data-filter');
            } else if (btn.parentElement.classList.contains('artist-filters')) {
                currentArtist = btn.getAttribute('data-artist');
            }

            // 表示のリセット
            updateWorksDisplay();
        });
    });

    // MORE VIEW ボタンのクリックイベント
    loadMoreBtn.addEventListener('click', () => {
        const allItems = Array.from(worksGrid.querySelectorAll('.work-item'));
        
        // 現在のフィルターに合致し、かつ隠れているものを探す
        const hiddenFilteredItems = allItems.filter(item => {
            const matchType = currentFilter === 'all' || item.classList.contains(currentFilter);
            const matchArtist = currentArtist === 'all' || item.classList.contains(currentArtist);
            return matchType && matchArtist && item.classList.contains('is-hidden');
        });

        // 次のLOAD_COUNT分だけ表示させる
        for (let i = 0; i < LOAD_COUNT; i++) {
            if (hiddenFilteredItems[i]) {
                hiddenFilteredItems[i].style.display = 'block';
                hiddenFilteredItems[i].classList.remove('is-hidden');
            }
        }

        // まだ隠れているものがあるかチェックしてボタンを消すか決める
        const remainingHidden = allItems.filter(item => {
            const matchType = currentFilter === 'all' || item.classList.contains(currentFilter);
            const matchArtist = currentArtist === 'all' || item.classList.contains(currentArtist);
            return matchType && matchArtist && item.classList.contains('is-hidden');
        });

        if (remainingHidden.length === 0) {
            loadMoreBtn.parentElement.style.display = 'none';
        }
    });

    // 初期実行
    updateWorksDisplay(true);
});
