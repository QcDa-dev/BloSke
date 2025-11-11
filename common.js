/* BloSke (ブロスケ) 共通スクリプト */

/* * Firebase SDK (firebase-app-compat.js, firebase-auth-compat.js) は
 * このスクリプトを使用する全てのHTMLファイルの <head> 内で
 * 先に読み込まれている必要があります。
*/

// --- 定数 ---
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxN0czK9zQ2uNLr-Avho6BCP8uci2yBedOeMqlvoqT5bPYlhQb38m4Wt3W1f6e5voyS/exec';

// --- Firebase 設定 (お客様のキー) ---
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
        
        // ポップアップの持続性をセッションのみにし、COOPポリシーによるエラーを回避
        firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.NONE); 
        
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
                <!-- ログアウト機能 -->
                <div class="menu-divider"></div>
                <ul>
                    <li><a href="#" id="common-logout-btn"><i class="fa-solid fa-right-from-bracket fa-fw"></i> ログアウト</a></li>
                </ul>
            </nav>
            <div class="menu-version">ver 1.0.0</div>
        </div>
    `;
    document.body.appendChild(menuContainer);

    // --- ハンバーガーメニューのイベントリスナー設定 ---
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

    // ログアウトボタンのイベントリスナー
    const logoutBtn = document.getElementById('common-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('ログアウトしますか？')) {
                logout();
            }
        });
    }
}

// --- モーダル表示 ---
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

// --- モーダル非表示 ---
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// --- モーダルクローズ設定 (オーバーレイ/キャンセルボタン) ---
function setupModalClose(modalId, cancelSelector) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // オーバーレイ
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modalId);
        }
    });
    // キャンセルボタン
    const cancelBtn = modal.querySelector(cancelSelector);
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            hideModal(modalId);
        });
    }
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
      // ★★★ 修正 (問題1, 2): cache と Content-Type ヘッダーを削除 ★★★
      // ブラウザに「シンプルリクエスト」として扱わせ、CORSプリフライトを回避する
      // cache: 'no-cache', // 削除
      // headers: { // 削除
      //   'Content-Type': 'text/plain;charset=utf-8', 
      // },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      // GAS側でsuccess: falseが返された場合
      throw new Error(result.message || '不明なサーバーエラーが発生しました。');
    }

  } catch (error) {
    console.error('API呼び出しに失敗しました:', action, error);
    alert(`エラー: ${error.message}`);
    throw error; // 呼び出し元でキャッチできるように再スロー
  
  } finally {
    // ローディングインジケーターを非表示 (仮)
    showLoadingSpinner(false);
  }
}

// --- ローディングスピナー (仮) ---
// TODO: より良いUIに置き換える
function showLoadingSpinner(show) {
    if (show) {
        console.log("... (Loading) ...");
    } else {
        console.log("... (Done) ...");
    }
}

// --- 認証セッション管理 (localStorage) ---
const USER_SESSION_KEY = 'bloske_user_session';

function saveUserSession(userData) {
    if (!userData || !userData.username) {
        console.error('保存するユーザー情報が不正です。');
        return;
    }
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
}

function getUserSession() {
    const sessionData = localStorage.getItem(USER_SESSION_KEY);
    try {
        return JSON.parse(sessionData);
    } catch (e) {
        return null;
    }
}

function logout() {
    localStorage.removeItem(USER_SESSION_KEY);
    // Googleログインしている場合はFirebaseからもログアウト
    if (firebaseAuth && firebaseAuth.currentUser) {
        firebaseAuth.signOut().catch(e => console.error('Firebase ログアウト失敗:', e));
    }
    alert('ログアウトしました。');
    window.location.href = 'index.html'; // メイン画面に戻る
}

// --- 認証ガード ---
// (ページ読み込み時に実行し、未認証ならログイン画面へ)
function authGuard() {
    const user = getUserSession();
    if (!user) {
        alert('ログインが必要です。ログイン画面に移動します。');
        // 保存（save）ボタンから来た場合の状態を保持
        if (window.location.pathname.includes('edit.html')) {
             sessionStorage.setItem('login_redirect_reason', 'save');
        }
        window.location.href = `login.html`;
    }
}
