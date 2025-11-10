/* BloSke (ブロスケ) 共通スクリプト */

/**
 * 共通UI（ヘッダー、フッター、ハンバーガーメニュー）を初期化します。
 * @param {string} appName - ヘッダーに表示するアプリ名。
 * @param {string} contactUrl - お問い合わせページのURL。
 */
function initCommonUI(appName = 'BloSke', contactUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSefD80Xc29vUb9uEsRtKbiihTnwYDmVKRhIIMkV3L8jMCRMBQ/viewform?usp=dialog') {
    // --- Font Awesome (アイコン用) ---
    // 開発を容易にするため、Font Awesomeを動的に読み込みます。
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(faLink);
    }

    // --- ヘッダーの挿入 ---
    const header = document.createElement('header');
    header.innerHTML = `
        <a href="index.html" class="app-title">${appName}</a>
        <div id="hamburger-icon">
            <div></div>
            <div></div>
            <div></div>
        </div>
    `;
    document.body.prepend(header);

    // --- フッターの挿入 ---
    const footer = document.createElement('footer');
    footer.innerHTML = `&copy; 2025 QcDa Project. All Rights Reserved.`;
    document.body.appendChild(footer);

    // --- ハンバーガーメニューの挿入 ---
    const menuContainer = document.createElement('div');
    menuContainer.innerHTML = `
        <div id="menu-overlay"></div>
        <div id="side-menu">
            <nav>
                <ul>
                    <li><a href="guide.html" target="_blank"><i class="fa-solid fa-book-open fa-fw"></i> 使い方ガイド</a></li>
                    <li><a href="${contactUrl}" target="_blank"><i class="fa-solid fa-envelope fa-fw"></i> お問い合わせ</a></li>
                    <li><a href="release-notes.html" target="_blank"><i class="fa-solid fa-bullhorn fa-fw"></i> リリースノート</a></li>
                </ul>
                <div class="menu-divider"></div>
                <ul>
                    <li><a href="https://qcda-dev.github.io/HP/" target="_blank"><i class="fa-solid fa-house fa-fw"></i> QcDa Projectとは</a></li>
                    <li><a href="https://qcda-dev.github.io/HP/terms-of-service.html" target="_blank" class="menu-sub-link">利用規約</a></li>
                    <li><a href="https://qcda-dev.github.io/HP/community-guidelines.html" target="_blank" class="menu-sub-link">コミュニティガイドライン</a></li>
                </ul>
            </nav>
            <div class="menu-version">ver 1.0.0</div>
        </div>
    `;
    document.body.appendChild(menuContainer);

    // --- メニューのイベントリスナー設定 ---
    const menuIcon = document.getElementById('hamburger-icon');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    const toggleMenu = () => {
        menuIcon.classList.toggle('open');
        sideMenu.classList.toggle('open');
        menuOverlay.classList.toggle('open');
    };

    menuIcon.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);
}

/**
 * モーダルウィンドウを表示します。
 * @param {string} modalId - 表示するモーダルのID。
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * モーダルウィンドウを非表示にします。
 * @param {string} modalId - 非表示にするモーダルのID。
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * モーダルの閉じるボタンやオーバーレイにイベントリスナーを設定します。
 * @param {string} modalId - 対象のモーダルのID。
 * @param {string[]} closeTriggerIds - モーダルを閉じるトリガーとなる要素のID配列 (例: ['cancel-btn', 'close-icon'])。
 */
function setupModalClose(modalId, closeTriggerIds = []) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // オーバーレイクリックで閉じる
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal(modalId);
        }
    });

    // トリガーIDクリックで閉じる
    closeTriggerIds.forEach(id => {
        const trigger = document.getElementById(id);
        if (trigger) {
            trigger.addEventListener('click', () => {
                hideModal(modalId);
            });
        }
    });
}
