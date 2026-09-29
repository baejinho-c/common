/* ============================================================
 * 지하철 AR MVP
 *  - 카메라(getUserMedia) 위에 canvas 오버레이
 *  - DeviceOrientation(나침반)으로 방위각 추적
 *  - GPS로 가까운 역 탐색 → 실시간 도착정보 조회(프록시 경유)
 *  - 열차 위치는 "도착까지 남은 초"를 인접 역 좌표 사이에 보간해 추정
 *  - API 키/프록시 없으면 데모 열차로 동작
 * ============================================================ */

// ---- 역 좌표 미니 DB (MVP: 2호선 강남 인근. 확장 시 전체 역 JSON으로 교체) ----
const STATIONS = [
  { name: "강남",   lat: 37.49808, lng: 127.02761, line: "2호선", prev: "역삼", next: "교대" },
  { name: "역삼",   lat: 37.50064, lng: 127.03642, line: "2호선", prev: "선릉", next: "강남" },
  { name: "선릉",   lat: 37.50438, lng: 127.04905, line: "2호선", prev: "삼성", next: "역삼" },
  { name: "삼성",   lat: 37.50886, lng: 127.06316, line: "2호선", prev: "종합운동장", next: "선릉" },
  { name: "교대",   lat: 37.49340, lng: 127.01397, line: "2호선", prev: "강남", next: "서초" },
  { name: "서초",   lat: 37.49189, lng: 127.00764, line: "2호선", prev: "교대", next: "방배" },
];

const LINE_COLOR = { "1호선": "#0052A4", "2호선": "#00A84D", "3호선": "#EF7C1C",
  "4호선": "#00A5DE", "5호선": "#996CAC", "6호선": "#CD7C2F", "7호선": "#747F00",
  "8호선": "#E6186C", "9호선": "#BDB092" };

// ---- 상태 ----
let heading = 0;            // 폰이 향하는 방위각 (0=북)
let userPos = null;         // { lat, lng }
let nearest = null;         // 가장 가까운 역
let trains = [];            // { bearing, distM, label, line, etaSec }
let demoMode = false;

const video = document.getElementById("camera");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
addEventListener("resize", resize);
resize();

// ---- 지오 유틸 ----
function toRad(d) { return d * Math.PI / 180; }
function haversineM(a, b) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function bearingDeg(a, b) {
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
  const x = Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
            Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
function lerpCoord(a, b, t) {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

function hexToRgb(hex) {
  const v = String(hex || "").replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return { r: 47, g: 174, b: 114 };
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

// ---- 시작 ----
document.getElementById("start-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("start-status");
  if (statusEl) statusEl.textContent = "";
  try {
    if (!window.isSecureContext) {
      throw new Error("카메라는 HTTPS 환경에서만 동작합니다");
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("이 브라우저는 카메라 API를 지원하지 않습니다");
    }

    // iOS는 사용자 제스처 안에서 방향센서 권한 요청 필요
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function") {
      const p = await DeviceOrientationEvent.requestPermission();
      if (p !== "granted") throw new Error("방향 센서 권한이 거부되었습니다");
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, audio: false
    });
    video.srcObject = stream;

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("hud").style.display = "flex";

    listenOrientation();
    watchLocation();
    requestAnimationFrame(render);
  } catch (e) {
    const msg = "시작 실패: " + (e && e.message ? e.message : "알 수 없는 오류");
    toast(msg);
    if (statusEl) statusEl.textContent = msg;
  }
});

// ---- 나침반 ----
function listenOrientation() {
  const handler = (ev) => {
    if (typeof ev.webkitCompassHeading === "number") {
      heading = ev.webkitCompassHeading;                 // iOS: 진북 기준
    } else if (ev.absolute && ev.alpha != null) {
      heading = (360 - ev.alpha) % 360;                  // Android absolute
    } else if (ev.alpha != null) {
      heading = (360 - ev.alpha) % 360;                  // fallback (상대값일 수 있음)
    }
    document.getElementById("compass-val").textContent = Math.round(heading) + "°";
  };
  addEventListener("deviceorientationabsolute", handler, true);
  addEventListener("deviceorientation", handler, true);
}

// ---- 위치 → 가까운 역 → 열차 갱신 ----
function watchLocation() {
  if (!navigator.geolocation) { enterDemo("이 브라우저는 위치를 지원하지 않아요"); return; }
  navigator.geolocation.watchPosition(
    (pos) => {
      userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      let best = null, bestD = Infinity;
      for (const s of STATIONS) {
        const d = haversineM(userPos, s);
        if (d < bestD) { bestD = d; best = s; }
      }
      // 역 DB 반경 3km 밖이면 데모 모드로
      if (bestD > 3000) { enterDemo("주변 역 데이터가 없어 데모 열차를 표시합니다"); return; }
      if (!nearest || nearest.name !== best.name) {
        nearest = best;
        document.getElementById("hud-station").textContent =
          `${best.line} ${best.name}역 (${Math.round(bestD)}m)`;
        fetchTrains();
        setInterval(fetchTrains, 15000); // 15초 주기 갱신 (일 1,000건 한도 고려)
      }
    },
    () => enterDemo("위치 권한이 없어 데모 열차를 표시합니다"),
    { enableHighAccuracy: true }
  );
}

function enterDemo(msg) {
  if (demoMode) return;
  demoMode = true;
  toast(msg);
  document.getElementById("hud-station").textContent = "데모 모드";
  // 가상 열차 3대: 방위각이 천천히 변하며 도는 시뮬레이션
  let t = 0;
  setInterval(() => {
    t += 1;
    trains = [
      { bearing: (t * 2) % 360,        distM: 220, label: "2호선 · 강남행",  line: "2호선", etaSec: 90 - (t % 90) },
      { bearing: (120 + t * 1.4) % 360, distM: 480, label: "9호선 · 급행",    line: "9호선", etaSec: 200 - (t % 200) },
      { bearing: (240 + t * 0.8) % 360, distM: 900, label: "3호선 · 대화행",  line: "3호선", etaSec: 340 - (t % 340) },
    ];
  }, 100);
}

// ---- 실시간 도착정보 → 열차 위치 추정 ----
async function fetchTrains() {
  if (!nearest || demoMode) return;
  try {
    const res = await fetch(`/api/subway?station=${encodeURIComponent(nearest.name)}`);
    if (!res.ok) throw new Error("proxy error");
    const data = await res.json();
    const list = data.realtimeArrivalList ?? [];

    trains = list.slice(0, 6).map((t) => {
      // barvlDt: 도착까지 남은 초. recptnDt와 현재시각 차이만큼 보정 (공식 문서 권고)
      const generated = new Date(t.recptnDt.replace(" ", "T")).getTime();
      const lagSec = Math.max(0, (Date.now() - generated) / 1000);
      const etaSec = Math.max(0, parseInt(t.barvlDt || "0", 10) - lagSec);

      // 이전 역 → 현재 역 사이를 ETA 비율로 보간해 열차 좌표 추정
      // (평균 역간 주행 약 120초 가정 — 정밀 위치가 아니라 "방향감" 목적)
      const fromName = t.updnLine === "상행" || t.updnLine === "내선" ? nearest.next : nearest.prev;
      const from = STATIONS.find((s) => s.name === fromName) ?? nearest;
      const progress = 1 - Math.min(1, etaSec / 120);
      const trainPos = lerpCoord(from, nearest, progress);

      return {
        bearing: bearingDeg(userPos, trainPos),
        distM: haversineM(userPos, trainPos),
        label: `${t.trainLineNm ?? t.bstatnNm + "행"}`,
        line: nearest.line,
        etaSec,
      };
    });
  } catch {
    enterDemo("실시간 API 연결 실패 — 데모 열차를 표시합니다");
  }
}

// ---- 렌더링: 방위각 차이를 화면 x좌표로 투영 ----
const H_FOV = 62; // 일반 폰 후면 카메라 수평 화각(도)

function render() {
  const w = innerWidth, h = innerHeight;
  ctx.clearRect(0, 0, w, h);

  for (const tr of trains) {
    let diff = ((tr.bearing - heading + 540) % 360) - 180; // -180~180
    const half = H_FOV / 2;

    if (Math.abs(diff) <= half) {
      const x = w / 2 + (diff / half) * (w / 2) * 0.92;
      // 멀수록 화면 아래(지평선 아래 = 지하 느낌) + 작게
      const depth = Math.min(1, tr.distM / 1200);
      const y = h * (0.62 + depth * 0.22);
      drawTrain(x, y, tr, 1 - depth * 0.55);
    } else {
      // 화각 밖: 가장자리 화살표 힌트
      const edgeX = diff < 0 ? 26 : w - 26;
      drawEdgeHint(edgeX, h * 0.5, diff < 0 ? "◀" : "▶", tr);
    }
  }
  requestAnimationFrame(render);
}

function drawTrain(x, y, tr, scale) {
  const color = LINE_COLOR[tr.line] ?? "#2fae72";
  const s = 30 * scale;
  const depth = Math.min(1, tr.distM / 1200);
  const etaWeight = Math.min(1, (tr.etaSec ?? 120) / 180);
  const alphaBody = 0.85 - depth * 0.35 + etaWeight * 0.12;
  const alphaPulse = 0.5 - depth * 0.2;

  // 지면 파동 (지하에서 올라오는 진동 느낌)
  const pulse = (Date.now() % 1600) / 1600;
  ctx.beginPath();
  ctx.ellipse(x, y + s * 0.9, s * (1 + pulse * 1.6), s * 0.32 * (1 + pulse * 1.6), 0, 0, Math.PI * 2);
  ctx.strokeStyle = rgba(color, alphaPulse * (1 - pulse));
  ctx.lineWidth = 2;
  ctx.stroke();

  // 열차 몸체 (단순 캡슐)
  ctx.fillStyle = rgba(color, alphaBody);
  roundRect(x - s, y - s * 0.45, s * 2, s * 0.9, s * 0.45);
  ctx.fill();
  // 창문
  ctx.fillStyle = "#ffffffcc";
  for (let i = -1; i <= 1; i++) {
    roundRect(x + i * s * 0.55 - s * 0.16, y - s * 0.18, s * 0.32, s * 0.3, 3 * scale);
    ctx.fill();
  }

  // 라벨
  ctx.font = `600 ${Math.max(11, 13 * scale)}px -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#000"; ctx.shadowBlur = 6;
  ctx.fillText(tr.label, x, y - s * 0.85);
  ctx.font = `${Math.max(10, 11 * scale)}px -apple-system, sans-serif`;
  ctx.fillStyle = "#cfeede";
  const eta = tr.etaSec > 60 ? `${Math.round(tr.etaSec / 60)}분` : `${Math.round(tr.etaSec)}초`;
  ctx.fillText(`${Math.round(tr.distM)}m · 도착 ${eta}`, x, y + s * 1.5);
  ctx.shadowBlur = 0;
}

function drawEdgeHint(x, y, arrow, tr) {
  const color = LINE_COLOR[tr.line] ?? "#2fae72";
  ctx.font = "700 18px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = rgba(color, 0.78);
  ctx.shadowColor = "#000"; ctx.shadowBlur = 5;
  ctx.fillText(arrow, x, y);
  ctx.shadowBlur = 0;
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.style.display = "none"), 3500);
}
