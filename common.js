// Firebase SDK (v11 Modular) インポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail, updateProfile, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Firebase Configuration ---
// ※ 既存の BloSke Firebaseプロジェクト設定を流用
const firebaseConfig = {
  apiKey: "AIzaSyD8rQk_RyvRovSqe7O3kFj7CKsumt1phyQ",
  authDomain: "bloske-50c88.firebaseapp.com",
  projectId: "bloske-50c88",
  storageBucket: "bloske-50c88.firebasestorage.app",
  messagingSenderId: "1034469680533",
  appId: "1:1034469680533:web:6284cc681be762658b029c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// アプリの固有ID (Firestoreのパス用)
const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'bloske';

// 認証初期化 (環境互換用)
const initAuthFallback = async () => {
    try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else if (typeof __initial_auth_token !== 'undefined') {
            await signInAnonymously(auth);
        }
    } catch (e) {
        console.warn("Auth fallback init warning", e);
    }
};
initAuthFallback();

// --- ローディングインジケーター ---
let loadingCount = 0;
export function showLoading() {
    loadingCount++;
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

export function hideLoading() {
    loadingCount--;
    if (loadingCount <= 0) {
        loadingCount = 0;
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }
}

// --- 共通UIの初期化 ---
export function initCommonUI(appName = 'BloSke') {
    // Tailwind + FontAwesome CDN の追加 (念のため)
    if (!document.querySelector('script[src*="tailwindcss"]')) {
        const tw = document.createElement('script');
        tw.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tw);
    }
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(faLink);
    }

    // ヘッダー、メニュー、フッター、ローダーのHTMLを構築
    const uiHtml = `
        <header class="bg-white border-b border-gray-200 h-16 fixed top-0 w-full z-40 flex justify-between items-center px-6 shadow-sm">
            <a href="index.html" class="text-2xl font-bold text-blue-600 tracking-tight">${appName}</a>
            <div class="flex items-center gap-4">
                <span id="header-user-name" class="text-sm text-gray-600 hidden font-medium"></span>
                <button id="hamburger-btn" class="text-gray-600 hover:text-blue-600 focus:outline-none transition-colors p-2">
                    <i class="fa-solid fa-bars fa-xl"></i>
                </button>
            </div>
        </header>
        
        <div id="menu-overlay" class="fixed inset-0 bg-black bg-opacity-40 z-40 hidden transition-opacity duration-300 opacity-0"></div>
        
        <nav id="side-menu" class="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform translate-x-full transition-transform duration-300 flex flex-col">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <span class="text-xl font-bold text-gray-800">Menu</span>
                <button id="close-menu-btn" class="text-gray-500 hover:text-red-500 transition-colors p-2"><i class="fa-solid fa-times fa-xl"></i></button>
            </div>
            <div class="p-6 flex-grow flex flex-col gap-5 overflow-y-auto">
                <a href="guide.html" target="_blank" class="text-gray-700 hover:text-blue-600 flex items-center gap-4 text-lg font-medium transition-colors"><i class="fa-solid fa-book-open w-6 text-center text-blue-500"></i> 使い方ガイド</a>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdlvIr5ehyy3dInl_XTkA5F64H7yFIigL2dzFW0IoXnl8ajdw/viewform?usp=dialog" target="_blank" class="text-gray-700 hover:text-blue-600 flex items-center gap-4 text-lg font-medium transition-colors"><i class="fa-solid fa-envelope w-6 text-center text-blue-500"></i> お問い合わせ</a>
                <a href="release-notes.html" target="_blank" class="text-gray-700 hover:text-blue-600 flex items-center gap-4 text-lg font-medium transition-colors"><i class="fa-solid fa-bullhorn w-6 text-center text-blue-500"></i> リリースノート</a>
                
                <div class="h-px bg-gray-200 my-2"></div>
                
                <a href="https://qcda-dev.github.io/HP/" target="_blank" class="text-gray-700 hover:text-blue-600 flex items-center gap-4 text-lg font-medium transition-colors"><i class="fa-solid fa-house w-6 text-center text-blue-500"></i> QcDa Projectとは</a>
                <div class="flex flex-col gap-3 pl-10 mt-1">
                    <a href="https://qcda-dev.github.io/HP/terms-of-service.html" target="_blank" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">利用規約</a>
                    <a href="https://qcda-dev.github.io/HP/community-guidelines.html" target="_blank" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">コミュニティガイドライン</a>
                </div>
                
                <div class="h-px bg-gray-200 my-2"></div>
                
                <button id="menu-logout-btn" class="text-left text-red-500 hover:text-red-600 flex items-center gap-4 text-lg font-medium hidden transition-colors w-full"><i class="fa-solid fa-right-from-bracket w-6 text-center"></i> ログアウト</button>
                <a href="login.html" id="menu-login-btn" class="text-left text-blue-500 hover:text-blue-600 flex items-center gap-4 text-lg font-medium transition-colors"><i class="fa-solid fa-right-to-bracket w-6 text-center"></i> ログイン</a>
            </div>
            <div class="p-4 bg-gray-50 text-right text-gray-400 text-xs font-medium border-t border-gray-100">
                ver 2.0.0
            </div>
        </nav>
        
        <footer class="bg-gray-800 text-gray-300 text-center py-4 text-sm fixed bottom-0 w-full z-30 shadow-inner">
            &copy; 2026 QcDa Project. All Rights Reserved.
        </footer>
        
        <!-- Global Loading Overlay -->
        <div id="global-loader" class="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-[9999] hidden flex flex-col justify-center items-center">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p class="mt-4 text-blue-600 font-bold tracking-wider">Loading...</p>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', uiHtml);

    // ハンバーガーメニューの開閉ロジック
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    const toggleMenu = () => {
        const isClosed = sideMenu.classList.contains('translate-x-full');
        if (isClosed) {
            menuOverlay.classList.remove('hidden');
            // setTimeout to allow display:block to apply before changing opacity
            setTimeout(() => {
                menuOverlay.classList.remove('opacity-0');
                sideMenu.classList.remove('translate-x-full');
            }, 10);
        } else {
            menuOverlay.classList.add('opacity-0');
            sideMenu.classList.add('translate-x-full');
            setTimeout(() => {
                menuOverlay.classList.add('hidden');
            }, 300);
        }
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // Auth状態の監視
    onAuthStateChanged(auth, (user) => {
        const logoutBtn = document.getElementById('menu-logout-btn');
        const loginBtn = document.getElementById('menu-login-btn');
        const headerUserName = document.getElementById('header-user-name');
        
        if (user) {
            if(logoutBtn) logoutBtn.classList.remove('hidden');
            if(loginBtn) loginBtn.classList.add('hidden');
            if(headerUserName) {
                headerUserName.textContent = user.displayName || user.email;
                headerUserName.classList.remove('hidden');
            }
        } else {
            if(logoutBtn) logoutBtn.classList.add('hidden');
            if(loginBtn) loginBtn.classList.remove('hidden');
            if(headerUserName) headerUserName.classList.add('hidden');
        }
    });

    // ログアウト処理
    const logoutBtn = document.getElementById('menu-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (confirm('ログアウトしますか？')) {
                showLoading();
                try {
                    await signOut(auth);
                    alert('ログアウトしました。');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("Logout Error:", error);
                    alert("ログアウトに失敗しました。");
                } finally {
                    hideLoading();
                }
            }
        });
    }
}

// 認証ガード (ログインしていない場合は login.html へリダイレクト)
export function requireAuth(redirectReason = null) {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            if (user) {
                resolve(user);
            } else {
                alert('ログインが必要です。ログイン画面へ移動します。');
                if (redirectReason) {
                    sessionStorage.setItem('login_redirect_reason', redirectReason);
                }
                window.location.href = 'login.html';
                reject('Not authenticated');
            }
        });
    });
}

// モジュールのエクスポート
export { auth, db, googleProvider, APP_ID, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, sendPasswordResetEmail, updateProfile, onAuthStateChanged, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, onSnapshot };
