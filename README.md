# Prelook

Vibe Coders Jam Session (Base44 × 홍익대, 2026-10-17) 출품작. 피터팬 매물 링크 하나로 집보기 전 리포트(광고와 건축물대장 대조, 3D 햇빛 시간표, 창 앞 거리, 주변 시설, 방문 체크리스트)를 보여 준다.

- 앱: https://prelook-4f889e57.base44.app (`/app.html?l=19929211`, `?l=19921381`)
- 시연 매물 2건의 계산 입력은 kit criteria v2(`demo-prelook-v1.json` assumption_models)를 그대로 쓴다. 가정 기반 시뮬레이션이며 실측이 아니다.
- 3D: © OpenStreetMap contributors (ODbL). 높이: 건축물대장(건축HUB) 고정본, OSM 표기, 층수×3m 가정.

## 배포

```
npm install
npx base44 build && npx base44 deploy -y --no-build
```
