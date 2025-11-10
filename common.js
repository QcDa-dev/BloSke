/* BloSke (ブロスケ) 共通スクリプト */

// --- Firebase SDK のインポート ---
// (使用するHTMLファイル側で <script type="module"> としてインポートする必要があります)
// (ただし、今回は script タグ直書きのため、グローバル関数として定義します)

// Firebase SDK (CDN)
// (各HTMLファイルで読み込む必要があります。ここでは common.js からの動的ロードは行いません)
/*
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js"></script>
*/

// --- 定数 ---
// 仕様書 4. APIエンドポイント
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxN0czK9zQ2uNLr-Avho6BCP8uci2yBedOeMqlvoqT5bPYlhQb38m4Wt3W1f6e5voyS/exec';

// TODO: Firebase プロジェクトの設定に置き換えてください
const firebaseConfig = {
  apiKey: "AIzaSyD8rQk_RyvRovSqe7O3kFj7CKsumt1phyQ",
  authDomain: "bloske-50c88.firebaseapp.com",
  projectId: "bloske-50c88",
  storageBucket: "bloske-50c88.firebasestorage.app",
  messagingSenderId: "1034469680533",
  appId: "1:1034469680533:web:6284cc681be762658b029c"
};

// --- Firebase 初期化 (グローバル変数) ---
let firebaseApp;
let firebaseAuth;
let googleProvider;

try {
    if (typeof firebase !== 'undefined' && typeof firebase.initializeApp === 'function') {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
        googleProvider = new firebase.auth.GoogleAuthProvider();
    } else {
        console.warn('Firebase SDKが読み込まれていないため、Google認証は使用できません。');
    }
} catch (e) {
    console.error('Firebaseの初期化に失敗しました。設定情報を確認してください。', e);
}


/**
 * 共通UI（ヘッダー、フッター、ハンバーガーメニュー）を初期化します。
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

/**
 * GAS API 呼び出しラッパー
 * @param {string} action - GAS側で定義したアクション名
 * @param {object} payload - 送信するデータ
 * @returns {Promise<object>} - GASからのレスポンスデータ (data プロパティ)
 */
async function callGasApi(action, payload) {
  // ローディングインジケーターを表示 (仮)
  showLoadingSpinner(true); 

  try {
    const response = await fetch(GAS_API_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
      redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      return result.data; // 成功時は data プロパティを返す
    } else {
      // GAS側でエラーが捕捉された場合
      throw new Error(result.message || '不明なサーバーエラーが発生しました。');
    }
  } catch (error) {
    console.error('API呼び出しに失敗しました:', action, error);
    // ユーザーにエラーを通知
    alert(`エラーが発生しました: ${error.message}`);
    throw error; // 呼び出し元でさらに処理できるようにエラーを再スロー
  } finally {
    // ローディングインジケーターを非表示 (仮)
    showLoadingSpinner(false);
  }
}

/**
 * 簡易ローディングスピナーの表示/非表示
 * (より堅牢な実装に置き換え推奨)
 * @param {boolean} show - 表示するかどうか
 */
function showLoadingSpinner(show) {
    let spinner = document.getElementById('global-spinner');
    if (show) {
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'global-spinner';
            spinner.style.position = 'fixed';
            spinner.style.top = '50%';
            spinner.style.left = '50%';
            spinner.style.transform = 'translate(-50%, -50%)';
            spinner.style.border = '5px solid #f3f3f3';
            spinner.style.borderTop = '5px solid var(--main-color)';
            spinner.style.borderRadius = '50%';
            spinner.style.width = '40px';
            spinner.style.height = '40px';
            spinner.style.animation = 'spin 1s linear infinite';
            spinner.style.zIndex = '9999';
            document.body.appendChild(spinner);
            
            // スピナー用のアニメーション定義
            if (!document.getElementById('spinner-style')) {
                const style = document.createElement('style');
                style.id = 'spinner-style';
                style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }
        }
        spinner.style.display = 'block';
    } else {
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
}

/**
 * ユーザー情報をセッションストレージに保存
 * @param {object} user - { username, email }
 */
function saveUserSession(user) {
    try {
        sessionStorage.setItem('bloSkeUser', JSON.stringify(user));
    } catch (e) {
        console.error('セッションストレージへの保存に失敗しました。', e);
    }
}

/**
 * セッションストレージからユーザー情報を取得
 * @returns {object | null} - ユーザー情報またはnull
 */
function getUserSession() {
    try {
        const user = sessionStorage.getItem('bloSkeUser');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error('セッションストレージからの取得に失敗しました。', e);
        return null;
    }
}

/**
 * ログアウト処理
 */
function logout() {
    try {
        sessionStorage.removeItem('bloSkeUser');
        if (firebaseAuth) {
            firebaseAuth.signOut();
        }
    } catch (e) {
        console.error('ログアウト処理に失敗しました。', e);
    }
    window.location.href = 'login.html';
}

/**
 * 認証が必要なページかチェック
 * @param {boolean} redirectToLogin - 未認証時にlogin.htmlにリダイレクトするか
 */
function authGuard(redirectToLogin = true) {
    const user = getUserSession();
    if (!user) {
        if (redirectToLogin) {
            alert('ログインが必要です。');
            window.location.href = 'login.html';
        }
        return null;
    }
    return user;
}
