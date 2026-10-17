// 지번 주소로 건축HUB 건축물대장 표제부를 조회한다. 키는 Base44 secret DATA_GO_KR_KEY에서 읽는다.
import { secrets } from "base44:runtime";

// 직접 조회로 확인한 법정동 코드만 둔다(2026-10-16~17, 건축HUB 응답의 platPlc로 확인).
const CODES: Record<string, [string, string]> = {
  "서대문구 북아현동": ["11410", "11000"], "서대문구 홍제동": ["11410", "11100"], "서대문구 대현동": ["11410", "11200"], "서대문구 대신동": ["11410", "11300"],
  "서대문구 신촌동": ["11410", "11400"], "서대문구 봉원동": ["11410", "11500"], "서대문구 창천동": ["11410", "11600"], "서대문구 연희동": ["11410", "11700"],
  "마포구 창전동": ["11440", "11400"], "마포구 상수동": ["11440", "11500"], "마포구 하중동": ["11440", "11600"], "마포구 서교동": ["11440", "12000"],
  "마포구 동교동": ["11440", "12100"], "마포구 합정동": ["11440", "12200"],
};

export default async function (req: Request): Promise<Response> {
  let jibun = "";
  try { jibun = String((await req.json()).jibun_address || ""); } catch { /* empty */ }
  const m = jibun.match(/(\S+구)\s+(\S+동)\s+(\d+)(?:-(\d+))?/);
  if (!m) return Response.json({ state: "UNKNOWN", reason: "지번 주소를 읽지 못함" });
  const code = CODES[`${m[1]} ${m[2]}`];
  if (!code) return Response.json({ state: "UNSUPPORTED_AREA", reason: `${m[1]} ${m[2]}은 아직 법정동 코드를 확인하지 않은 지역` });
  const key = secrets.get("DATA_GO_KR_KEY") || "";
  if (!key) return Response.json({ state: "INFRA_ERROR", reason: "서버에 건축물대장 키가 설정되지 않음" });
  const bun = m[3].padStart(4, "0"), ji = (m[4] || "0").padStart(4, "0");
  const u = `https://apis.data.go.kr/1613000/BldRgstHubService/getBrTitleInfo?serviceKey=${key}&sigunguCd=${code[0]}&bjdongCd=${code[1]}&bun=${bun}&ji=${ji}&_type=json&numOfRows=20&pageNo=1`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(u);
      const body = await r.text();
      if (!body) continue;
      const d = JSON.parse(body);
      const head = d?.response?.header;
      if (!head || head.resultCode !== "00") continue;
      const b = d.response.body, it = b?.items?.item;
      const rows = Array.isArray(it) ? it : it ? [it] : [];
      if (!rows.length) return Response.json({ state: "ZERO", reason: "조회 결과 0건", query: { sigunguCd: code[0], bjdongCd: code[1], bun, ji } });
      const main = rows.filter((x: any) => String(x.mainAtchGbCdNm || "").startsWith("주"));
      const x = (main.length ? main : rows).sort((a: any, c: any) => Number(c.heit || 0) - Number(a.heit || 0))[0];
      return Response.json({
        state: "OK", retrieved_at: new Date().toISOString(), query: { sigunguCd: code[0], bjdongCd: code[1], bun, ji }, count: rows.length,
        record: { platPlc: x.platPlc, newPlatPlc: x.newPlatPlc, bldNm: x.bldNm, heit: x.heit, grndFlrCnt: x.grndFlrCnt, ugrndFlrCnt: x.ugrndFlrCnt,
          strctCdNm: x.strctCdNm, mainPurpsCdNm: x.mainPurpsCdNm, etcPurps: x.etcPurps, useAprDay: x.useAprDay, regstrGbCdNm: x.regstrGbCdNm },
      });
    } catch { /* retry once */ }
  }
  return Response.json({ state: "INFRA_ERROR", reason: "건축물대장 서버가 응답하지 않았거나 빈 응답" });
}
