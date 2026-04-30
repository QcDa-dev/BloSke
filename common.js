// common.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase設定 (GitHub Pagesデプロイ時にご自身のキーに置き換えてください)
const firebaseConfig = {
  apiKey: "AIzaSyD8rQk_RyvRovSqe7O3kFj7CKsumt1phyQ",
  authDomain: "bloske-50c88.firebaseapp.com",
  projectId: "bloske-50c88",
  storageBucket: "bloske-50c88.firebasestorage.app",
  messagingSenderId: "1034469680533",
  appId: "1:1034469680533:web:6284cc681be762658b029c",
  measurementId: "G-P56GW9LM8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// アプリのバージョン
const APP_VERSION = "1.0.0";

// --- UI初期化 ---
export const initCommonUI = () => {
    // ヘッダーの生成
    const headerHtml = `
        <div class="container mx-auto px-4 h-16 flex justify-between items-center">
            <a href="index.html" class="text-2xl font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                BloSke
            </a>
            <div class="flex items-center gap-4">
                <div id="auth-status-container" class="hidden sm:block text-sm"></div>
                <button id="menu-btn" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>
            </div>
        </div>
    `;

    // ハンバーガーメニューの生成
    const menuHtml = `
        <div id="menu-overlay"></div>
        <nav id="side-menu">
            <div class="p-4 flex justify-between items-center border-b border-slate-100">
                <span class="font-bold text-slate-800">メニュー</span>
                <button id="close-menu-btn" class="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                </button>
            </div>
            
            <a href="guide.html" target="_blank" class="menu-item">使い方ガイド</a>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdlvIr5ehyy3dInl_XTkA5F64H7yFIigL2dzFW0IoXnl8ajdw/viewform?usp=dialog" target="_blank" class="menu-item">お問い合わせ</a>
            <a href="release-notes.html" target="_blank" class="menu-item">リリースノート</a>
            
            <div class="menu-divider"></div>
            
            <a href="https://qcda-dev.github.io/HP/" target="_blank" class="menu-item font-bold">QcDa Projectとは</a>
            <a href="https://qcda-dev.github.io/HP/terms-of-service.html" target="_blank" class="menu-sub-item">利用規約</a>
            <a href="https://qcda-dev.github.io/HP/community-guidelines.html" target="_blank" class="menu-sub-item">コミュニティガイドライン</a>
            
            <div id="auth-menu-items" class="mt-4"></div>

            <div class="absolute bottom-4 left-0 w-full text-center text-xs text-slate-400">
                ver ${APP_VERSION}
            </div>
        </nav>
    `;

    // フッターの生成
    const footerHtml = `
        <div class="container mx-auto px-4">
            <p>&copy; 2026 QcDa Project. All Rights Reserved.</p>
            <div class="mt-2 space-x-4">
                <a href="https://qcda-dev.github.io/HP/terms-of-service.html" class="hover:text-white transition-colors" target="_blank">利用規約</a>
                <a href="https://qcda-dev.github.io/HP/community-guidelines.html" class="hover:text-white transition-colors" target="_blank">ガイドライン</a>
            </div>
        </div>
    `;

    // DOMに挿入
    const headerEl = document.createElement('header');
    headerEl.innerHTML = headerHtml;
    document.body.insertBefore(headerEl, document.body.firstChild);

    const menuContainer = document.createElement('div');
    menuContainer.innerHTML = menuHtml;
    document.body.appendChild(menuContainer);

    const footerEl = document.createElement('footer');
    footerEl.innerHTML = footerHtml;
    document.body.appendChild(footerEl);

    // イベントリスナー
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    const toggleMenu = () => {
        sideMenu.classList.toggle('open');
        menuOverlay.classList.toggle('show');
    };

    menuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // 認証状態の監視
    onAuthStateChanged(auth, (user) => {
        const authStatusContainer = document.getElementById('auth-status-container');
        const authMenuItems = document.getElementById('auth-menu-items');
        
        if (user) {
            authStatusContainer.innerHTML = `<span class="text-slate-600">${user.email}</span>`;
            authMenuItems.innerHTML = `
                <div class="menu-divider"></div>
                <a href="projects.html" class="menu-item text-blue-600">プロジェクト一覧</a>
                <button id="logout-btn" class="w-full text-left menu-item text-red-600">ログアウト</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', async () => {
                await signOut(auth);
                window.location.href = 'index.html';
            });
        } else {
            authStatusContainer.innerHTML = `<a href="login.html" class="btn btn-outline py-1 px-3 text-sm">ログイン</a>`;
            authMenuItems.innerHTML = `
                <div class="menu-divider"></div>
                <a href="login.html" class="menu-item text-blue-600">ログイン</a>
                <a href="register.html" class="menu-item text-blue-600">新規登録</a>
            `;
        }
    });
};

// --- Auth Guard ---
export const requireAuth = () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'login.html';
        }
    });
};

export const requireNoAuth = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = 'projects.html';
        }
    });
};

// URLパラメータ取得ユーティリティ
export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};
