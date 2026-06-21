import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY || "";
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3001/auth/kakao/callback";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
    credentials: true,
  })
);
app.use(express.json());

app.get("/auth/kakao/url", (req, res) => {
  if (!KAKAO_REST_API_KEY) {
    return res.status(400).json({ error: "KAKAO_REST_API_KEY가 설정되지 않았습니다." });
  }
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile_nickname,profile_image,account_email`;
  res.json({ url: kakaoAuthUrl });
});

app.get("/auth/kakao/callback", async (req, res) => {
  const code = req.query.code?.toString();
  if (!code) {
    return res.status(400).json({ error: "인가 코드가 없습니다." });
  }

  try {
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_REST_API_KEY,
        ...(KAKAO_CLIENT_SECRET ? { client_secret: KAKAO_CLIENT_SECRET } : {}),
        code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      }
    );

    const access_token = tokenResponse.data.access_token;

    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const kakaoAccount = userResponse.data.kakao_account || {};
    const profile = kakaoAccount.profile || {};

    const user = {
      id: userResponse.data.id,
      email: kakaoAccount.email || null,
      nickname: profile.nickname || "사용자",
      profile_image_url: profile.profile_image_url || null,
      access_token,
    };

    const replaces = {
      "your_rest_api_key_here": KAKAO_REST_API_KEY,
      "http://localhost:3001/auth/kakao/callback": REDIRECT_URI,
    };

    res.redirect(302, `/login-complete.html?user=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    console.error(error?.response?.data || error);
    res.status(500).json({ error: "카카오 로그인 처리 중 오류가 발생했습니다." });
  }
});

app.get("/auth/kakao/userinfo", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "인증 토큰이 필요합니다." });
  }
  const access_token = authHeader.split(" ")[1];

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    res.json(userResponse.data);
  } catch {
    res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
});

app.listen(PORT, () => {
  console.log(`카카오 클론 서버 실행: http://localhost:${PORT}`);
});
