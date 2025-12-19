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
document.addEventListener('DOMContentLoaded', () => {
    const typeBtns = document.querySelectorAll('.type-filters .filter-btn');
    const artistBtns = document.querySelectorAll('.artist-filters .filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    const loadMoreBtn = document.getElementById('load-more');
    const displayCount = 5; // 最初に出す数

    function updateWorks(isLoadMore = false) {
        const activeType = document.querySelector('.type-filters .filter-btn.active').getAttribute('data-filter');
        const activeArtist = document.querySelector('.artist-filters .filter-btn.active').getAttribute('data-artist');

        let visibleCount = 0;
        let currentShowCount = 0;

        // すでに表示されているアイテム数をカウント（「もっと見る」用）
        const alreadyShown = isLoadMore ? document.querySelectorAll('.work-item:not(.is-hidden)').length : 0;
        const targetLimit = alreadyShown + displayCount;

        workItems.forEach(item => {
            const matchType = (activeType === 'all' || item.classList.contains(activeType));
            const matchArtist = (activeArtist === 'all' || item.classList.contains(activeArtist));

            if (matchType && matchArtist) {
                if (!isLoadMore) {
                    // フィルター切り替え時は一旦全部隠してから先頭5件出す
                    item.classList.add('is-hidden');
                    if (visibleCount < displayCount) {
                        item.classList.remove('is-hidden');
                    }
                } else {
                    // 「もっと見る」時は、隠れているものを追加で5件出す
                    if (item.classList.contains('is-hidden') && currentShowCount < displayCount) {
                        item.classList.remove('is-hidden');
                        item.style.animation = 'fadeInUp 0.6s ease forwards';
                        currentShowCount++;
                    }
                }
                visibleCount++;
            } else {
                item.classList.add('is-hidden');
            }
        });

        // ボタンの表示判定（条件に合う全件 > 現在表示されている件数 なら表示）
        const nowVisible = document.querySelectorAll('.work-item:not(.is-hidden)').length;
        if (visibleCount > nowVisible) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    // イベント登録
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateWorks(false);
        });
    });

    artistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            artistBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateWorks(false);
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => updateWorks(true));
    }

    // 初回実行
    updateWorks(false);
});
