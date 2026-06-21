import express from "express";
import cors from "cors";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY || "";
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET || "";
const ADMIN_KEY = process.env.KAKAO_ADMIN_KEY || "";
const CHANNEL_UUID = process.env.CHANNEL_UUID || "";
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || "/webhook/kakao";
const HERMES_WEBHOOK = process.env.HERMES_WEBHOOK || "";

function sign(body) {
  if (!KAKAO_REST_API_KEY) {
    return "";
  }
  return crypto.createHmac("sha256", KAKAO_REST_API_KEY).update(JSON.stringify(body)).digest("base64");
}

function sendReply(recipient, text) {
  if (!ADMIN_KEY || !CHANNEL_UUID) {
    console.log("[SIMULATE REPLY]", recipient, text.slice(0, 120));
    return Promise.resolve();
  }

  const message = {
    uuid: recipient,
    message: { text },
  };

  return axios.post(
    `${CHANNEL_UUID}/messages`,
    message,
    {
      headers: {
        Authorization: `Bearer ${ADMIN_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
}

function classifyMessage(text) {
  const lower = text.toLowerCase();
  if (lower.includes("주문") || lower.includes("배송") || lower.includes("환불")) {
    return "commerce";
  }
  if (lower.includes("정산") || lower.includes("매출") || lower.includes("비용")) {
    return "finance";
  }
  if (lower.includes("문의") || lower.includes("답변") || lower.includes("응대")) {
    return "support";
  }
  return "general";
}

function getRoutingHint(classification) {
  const routes = {
    commerce: "Commerce AI + 상품/주문/배송/리뷰 분석 + 응대 초안 생성",
    finance: "Finance AI + 정산·매출·광고비 분석",
    support: "Support AI + 고객 문의 분류 + 응답 초안",
    general: "Operation AI + 일반 업무 처리",
  };

  return routes[classification] || routes.general || "";
}

async function buildReply(userKey, text, classification) {
  const routingHint = getRoutingHint(classification);

  if (!HERMES_WEBHOOK) {
    return `[iMacAi 봇] 받은 메시지: ${text.slice(0, 100)}\n분류: ${classification}\n적용 루트: ${routingHint}\nHermes Agent 엔드포인트가 연결되지 않아 기본 응답만 전송합니다.`;
  }

  const payload = {
    source: "kakao_channel",
    user_key: userKey,
    classification,
    text,
  };

  try {
    const res = await axios.post(
      HERMES_WEBHOOK,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...(KAKAO_REST_API_KEY ? { "X-Kakao-Key": KAKAO_REST_API_KEY } : {}),
          ...(sign(payload) ? { "X-Kakao-Signature": sign(payload) } : {}),
        },
        timeout: 8000,
      }
    );

    const data = res.data || {};
    const reply = data.reply || data.text || "[Hermes] 처리 완료";
    const lines = [
      "[iMacAi 봇]",
      text.slice(0, 100),
      "",
      `분류: ${classification}`,
      `적용 루트: ${routingHint}`,
      "",
      reply,
    ];

    return lines.join("\n");
  } catch (err) {
    console.error("[hermes forward failed]", err?.message || err);
    const fallback = `[iMacAi 봇] 받은 메시지: ${text.slice(0, 100)}\n분류: ${classification}\nHermes Agent와 연결할 수 없어 기본 안내만 전송합니다.`;
    return fallback;
  }
}

function handleSimpleReply(userKey, text) {
  const classification = classifyMessage(text);

  if (!KAKAO_REST_API_KEY || !ADMIN_KEY || !CHANNEL_UUID) {
    const replyText = `[시뮬레이션 봇] '${text}'를 받았어요.\n아직 카카오 채널 키가 연결되지 않아서 실제 전송은 되지 않습니다.\n분류: ${classification}`;
    return sendReply(userKey, replyText).then(() => replyText);
  }

  return buildReply(userKey, text, classification).then((replyText) => sendReply(userKey, replyText));
}

function respondWithStatus(req, res, body) {
  res.status(200).json({ code: 0, message: "ok" });
}

app.post(WEBHOOK_PATH, async (req, res) => {
  console.log("[webhook received]");
  try {
    const body = req.body || {};
    console.log(JSON.stringify(body).slice(0, 200));

    const userKey = body.user_key || body.sender_id || body.uuid || "unknown";
    const message = body.message?.text || "안녕하세요!";

    await handleSimpleReply(userKey, message);
    respondWithStatus(req, res, body);
  } catch (e) {
    console.error("[webhook error]", e);
    res.status(200).json({ code: 0, message: "error-but-ok" });
  }
});

app.get("/health", (req, res) =>
  res.status(200).json({
    status: "ok",
    mode: !KAKAO_REST_API_KEY || !ADMIN_KEY || !CHANNEL_UUID ? "simulation" : "live",
    hasHermes: !!HERMES_WEBHOOK,
  })
);

app.get("/", (req, res) => res.send("iMacAi Kakao bot running"));

app.listen(PORT, () => {
  console.log(`카카오톡 봇 서버 실행: http://localhost:${PORT}`);
  console.log(`웹훅 경로: http://localhost:${PORT}${WEBHOOK_PATH}`);
  console.log(`채널 연동 준비 상태: ${!KAKAO_REST_API_KEY || !ADMIN_KEY || !CHANNEL_UUID ? "시뮬레이션 모드" : "실제 연동 가능"}`);
  if (!HERMES_WEBHOOK) {
    console.log("HERMES_WEBHOOK이 설정되지 않아 Hermes 연동이 비활성입니다.");
  }
});
