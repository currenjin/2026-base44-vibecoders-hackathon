// 피터팬 공개 매물 페이지에서 광고 항목을 읽는다. peterpanz.com/house/<숫자>만 받는다.
const LABELS = ["주실기준/방향", "해당층/전체층", "전용/공급면적", "사용승인일", "위반건축물 여부", "건축물용도", "주차", "관리비", "건물형태"];

function decode(s: string) {
  return s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\\//g, "/");
}

export default async function (req: Request): Promise<Response> {
  let url = "";
  try { url = String((await req.json()).url || "").trim(); } catch { /* empty */ }
  const m = url.match(/^https?:\/\/(www\.)?peterpanz\.com\/house\/(\d{5,10})(?:[/?#].*)?$/);
  if (!m) return Response.json({ state: "UNSUPPORTED", message: "현재 피터팬 매물만 지원" });
  const id = m[2];
  const t0 = Date.now();
  let html = "";
  for (let attempt = 0; attempt < 2 && !html; attempt++) {
    try {
      const r = await fetch(`https://www.peterpanz.com/house/${id}`, { headers: { "User-Agent": "Mozilla/5.0 (Prelook demo)" } });
      if (r.ok) html = await r.text();
    } catch { /* retry once */ }
  }
  if (!html) return Response.json({ state: "INFRA_ERROR", message: "매물 페이지를 읽지 못함", id });
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "\n").replace(/<style[\s\S]*?<\/style>/g, "\n").replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const fields: Record<string, string | null> = {};
  for (const lab of LABELS) {
    const k = lines.indexOf(lab);
    const n = lab === "관리비" ? 2 : 1;
    fields[lab] = k >= 0 && k + 1 < lines.length ? lines.slice(k + 1, k + 1 + n).filter((x) => !LABELS.includes(x)).join(" ").replace(/m\s*$/, "m²").slice(0, 120) : null;
  }
  const pick = (re: RegExp) => { const x = html.match(re); return x ? decode(x[1]) : null; };
  const road = pick(/"road_address"\s*:\s*"([^"]*)"/);
  const jibun = pick(/"jibun_address"\s*:\s*"([^"]*)"/);
  const lat = pick(/"latitude"\s*:\s*"?([\d.]+)"?/);
  const lon = pick(/"longitude"\s*:\s*"?([\d.]+)"?/);
  const title = pick(/<title>([^<]*)<\/title>/);
  const area = (fields["전용/공급면적"] || "").match(/([\d.]+)\s*m/);
  const fl = (fields["해당층/전체층"] || "").match(/([^\s/]+)\s*\/\s*(\d+)층/);
  return Response.json({
    state: "OK", id, source: `https://www.peterpanz.com/house/${id}`, retrieved_at: new Date().toISOString(), ms: Date.now() - t0,
    title, road_address: road, jibun_address: jibun, latitude: lat ? Number(lat) : null, longitude: lon ? Number(lon) : null,
    exclusive_area_m2: area ? Number(area[1]) : null, floor_text: fl ? fl[1] : null, total_floors: fl ? Number(fl[2]) : null, fields,
  });
}
