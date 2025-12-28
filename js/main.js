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
            // メニューが開いているときは背面スクロールを禁止
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
        const INITIAL_COUNT = 6; // 最初に見せる数
        const LOAD_COUNT = 6;    // MORE VIEWで追加する数

        let currentFilter = 'all';
        let currentArtist = 'all';

        // 表示を更新するメイン関数
        function updateWorksDisplay() {
            const allItems = Array.from(worksGrid.querySelectorAll('.work-item'));
            
            // 1. 現在のフィルター（TYPE & ARTIST）に合致するものを抽出
            const filteredItems = allItems.filter(item => {
                const matchType = currentFilter === 'all' || item.classList.contains(currentFilter);
                const matchArtist = currentArtist === 'all' || item.classList.contains(currentArtist);
                return matchType && matchArtist;
            });

            // 2. 一旦すべて非表示にして「隠し状態(is-hidden)」にする
            allItems.forEach(item => {
                item.style.display = 'none';
                item.classList.add('is-hidden');
            });

            // 3. フィルター後のアイテムのうち、最初の「表示枠」分だけ表示させる
            filteredItems.forEach((item, index) => {
                if (index < INITIAL_COUNT) {
                    item.style.display = 'block';
                    item.classList.remove('is-hidden');
                }
            });

            // 4. MORE VIEW ボタンの表示制御
            // フィルター後の数が初期表示数より多ければボタンを出す
            if (filteredItems.length > INITIAL_COUNT) {
                loadMoreBtn.parentElement.style.display = 'block';
            } else {
                loadMoreBtn.parentElement.style.display = 'none';
            }
        }

        // フィルタボタンのクリックイベント
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // ボタンの見た目の切り替え（アクティブ化）
                btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 選択されたフィルター条件を保存
                if (btn.parentElement.classList.contains('type-filters')) {
                    currentFilter = btn.getAttribute('data-filter');
                } else if (btn.parentElement.classList.contains('artist-filters')) {
                    currentArtist = btn.getAttribute('data-artist');
                }

                // 表示をリセットして再計算
                updateWorksDisplay();
            });
        });

        // MORE VIEW ボタンのクリックイベント
        loadMoreBtn.addEventListener('click', () => {
            const allItems = Array.from(worksGrid.querySelectorAll('.work-item'));
            
            // 現在のフィルターに合致し、かつ「隠れている」ものを探す
            const hiddenFilteredItems = allItems.filter(item => {
                const matchType = currentFilter === 'all' || item.classList.contains(currentFilter);
                const matchArtist = currentArtist === 'all' || item.classList.contains(currentArtist);
                return matchType && matchArtist && item.classList.contains('is-hidden');
            });

            // 次の LOAD_COUNT 分だけ表示させる
            for (let i = 0; i < LOAD_COUNT; i++) {
                if (hiddenFilteredItems[i]) {
                    hiddenFilteredItems[i].style.display = 'block';
                    hiddenFilteredItems[i].classList.remove('is-hidden');
                }
            }

            // まだ隠れているものがあるか最終チェックして、なければボタンを消す
            const remainingHidden = allItems.filter(item => {
                const matchType = currentFilter === 'all' || item.classList.contains(currentFilter);
                const matchArtist = currentArtist === 'all' || item.classList.contains(currentArtist);
                return matchType && matchArtist && item.classList.contains('is-hidden');
            });

            if (remainingHidden.length === 0) {
                loadMoreBtn.parentElement.style.display = 'none';
            }
        });

        // ページ読み込み時に一回実行
        updateWorksDisplay();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const topicsList = document.querySelector('.topics-list');
    
    // JSONファイルを読み込む
    fetch('topics.json')
        .then(response => response.json())
        .then(data => {
            // HTMLの中身を一度空にする
            topicsList.innerHTML = '';
            
            // データを1つずつHTMLに変換して追加
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
        .catch(error => console.error('Error loading topics:', error));
});
