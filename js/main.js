document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. ハンバーガーメニュー
       ============================================================ */
    const menuBtn = document.getElementById('menu-btn');
    const spNav = document.getElementById('sp-nav');
    
    if (menuBtn && spNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            spNav.classList.toggle('active');
            document.body.style.overflow = spNav.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    /* ============================================================
       2. WORKS：フィルター & MORE VIEW（もっと見る）機能
       ============================================================ */
    const worksGrid = document.getElementById('works-grid');
    const loadMoreBtn = document.getElementById('load-more');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (worksGrid && loadMoreBtn) {
        const INITIAL_COUNT = 6;
        const LOAD_COUNT = 6;
        let currentFilter = 'all';
        let currentArtist = 'all';

        function updateWorksDisplay() {
            const allItems = Array.from(worksGrid.querySelectorAll('.work-item'));
            const filteredItems = allItems.filter(item => {
                const matchType = currentFilter === 'all' || item.classList.contains(currentFilter);
                const matchArtist = currentArtist === 'all' || item.classList.contains(currentArtist);
                return matchType && matchArtist;
            });

            allItems.forEach(item => {
                item.style.display = 'none';
                item.classList.add('is-hidden');
            });

            filteredItems.forEach((item, index) => {
                if (index < INITIAL_COUNT) {
                    item.style.display = 'block';
                    item.classList.remove('is-hidden');
                }
            });

            if (filteredItems.length > INITIAL_COUNT) {
                loadMoreBtn.parentElement.style.display = 'block';
            } else {
                loadMoreBtn.parentElement.style.display = 'none';
            }
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (btn.parentElement.classList.contains('type-filters')) {
                    currentFilter = btn.getAttribute('data-filter');
                } else if (btn.parentElement.classList.contains('artist-filters')) {
                    currentArtist = btn.getAttribute('data-artist');
                }
                updateWorksDisplay();
            });
        });

        loadMoreBtn.addEventListener('click', () => {
            const allItems = Array.from(worksGrid.querySelectorAll('.work-item'));
            const hiddenFilteredItems = allItems.filter(item => {
                const matchType = currentFilter === 'all' || item.classList.contains(currentFilter);
                const matchArtist = currentArtist === 'all' || item.classList.contains(currentArtist);
                return matchType && matchArtist && item.classList.contains('is-hidden');
            });

            for (let i = 0; i < LOAD_COUNT; i++) {
                if (hiddenFilteredItems[i]) {
                    hiddenFilteredItems[i].style.display = 'block';
                    hiddenFilteredItems[i].classList.remove('is-hidden');
                }
            }

            const remainingHidden = allItems.filter(item => {
                const matchType = currentFilter === 'all' || item.classList.contains(currentFilter);
                const matchArtist = currentArtist === 'all' || item.classList.contains(currentArtist);
                return matchType && matchArtist && item.classList.contains('is-hidden');
            });

            if (remainingHidden.length === 0) {
                loadMoreBtn.parentElement.style.display = 'none';
            }
        });

        updateWorksDisplay();
    }

    /* ============================================================
       3. TOPICS：JSON読み込み機能
       ============================================================ */
    const topicsList = document.querySelector('.topics-list');
    
    // index.html など、topics-list が存在する場合のみ実行
    if (topicsList) {
        fetch('./data/topics.json') // HTMLから見たパス
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                topicsList.innerHTML = '';
                
                data.forEach(item => {
                    const topicElement = item.url 
                        ? document.createElement('a') 
                        : document.createElement('div');
                    
                    if (item.url) topicElement.href = item.url;
                    topicElement.className = 'topics-item';
                    
                    topicElement.innerHTML = `
                        <div class="topics-date">${item.date}</div>
                        <div class="topics-content">${item.content}</div>
                    `;
                    
                    topicsList.appendChild(topicElement);
                });
            })
            .catch(error => {
                console.error('Error loading topics:', error);
                topicsList.innerHTML = '<p style="color:#666; font-size:0.8rem;">お知らせはありません</p>';
            });
    }
});
