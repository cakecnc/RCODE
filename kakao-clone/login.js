const PLACEHOLDER_APP_KEY = "your_rest_api_key_here";
const APP_KEY = PLACEHOLDER_APP_KEY;
const DEMO_ACCOUNTS = [
  { email: "demo@example.com", password: "demo1234", name: "데모 사용자" },
];

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const kakaoLoginBtn = document.getElementById("kakaoLoginBtn");
const statusEl = document.getElementById("loginStatus");

function setLoginStatus(message) {
  if (!statusEl) return;
  statusEl.textContent = message || "";
}

function isLoggedIn() {
  try {
    const raw = localStorage.getItem("chat_session");
    return !!raw;
  } catch {
    return false;
  }
}

function setSession(user) {
  const session = {
    user: {
      email: user.email,
      name: user.nickname || user.name || "사용자",
      profile_image_url: user.profile_image_url || null,
      method: user.method || "kakao",
    },
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
  };
  localStorage.setItem("chat_session", JSON.stringify(session));
}

function redirectToApp() {
  window.location.replace("index.html");
}

async function requestKakaoLoginUrl() {
  try {
    const base =
      PLACEHOLDER_APP_KEY === APP_KEY && !APP_KEY
        ? ""
        : window.location.origin.replace(/:\d+$/, `:3001`);
    const res = await fetch(`${base}/auth/kakao/url`, { method: "GET" });
    if (!res.ok) throw new Error("카카오 로그인 URL 요청 실패");
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
  } catch {
    setLoginStatus("백엔드 서버와 연결할 수 없습니다. 데모 모드로 로그인합니다.");
    setTimeout(() => {
      setSession({ ...DEMO_ACCOUNTS[0], method: "demo" });
      redirectToApp();
    }, 900);
  }
}

function renderKakaoButton() {
  if (!kakaoLoginBtn) return;
  kakaoLoginBtn.addEventListener("click", () => {
    if (APP_KEY && APP_KEY !== PLACEHOLDER_APP_KEY) {
      setLoginStatus("카카오 로그인으로 이동합니다...");
      requestKakaoLoginUrl();
      return;
    }
    setLoginStatus("백엔드 서버와 연결할 수 없습니다. 데모 모드로 로그인합니다.");
    setTimeout(() => {
      setSession({ ...DEMO_ACCOUNTS[0], method: "demo" });
      redirectToApp();
    }, 900);
  });
}

function handleKakaoCallback() {
  const params = new URLSearchParams(window.location.search);
  const userParam = params.get("user");
  if (userParam) {
    try {
      const user = JSON.parse(userParam);
      setSession({ ...user, method: "kakao" });
      window.history.replaceState({}, document.title, "login.html");
      redirectToApp();
    } catch {
      setLoginStatus("로그인 정보를 처리할 수 없습니다.");
    }
  }
}

function init() {
  if (isLoggedIn()) {
    redirectToApp();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const account = DEMO_ACCOUNTS.find((a) => a.email === email && a.password === password);
  if (!account) {
    setLoginStatus("이메일 또는 비밀번호가 올바르지 않습니다.");
    return;
  }
  setSession({ ...account, method: "demo" });
  redirectToApp();
});

renderKakaoButton();
handleKakaoCallback();
init();
