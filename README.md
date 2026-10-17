# Prelook

Vibe Coders Jam Session: feat. Base44 + Hongik University (2026-10-17) **1등 수상작**. 피터팬 매물 링크 하나로 집보기 전 리포트를 보여 준다.

- 행사: https://luma.com/base44hongdae
- 참가자: **118명**. 행사 종료 시 공식 Luma 참석자 표시와 참가자의 최종 확인을 기준으로 기록했다. 별도 현장 체크인 집계 자료는 확보하지 않았다.
- 결과: 대표 프로젝트로 선정되어 최종 발표 후 1등. 참가자 확인에 따른 기록이며 세부 상명·득표수·공식 결과 페이지는 확인하지 않았다.
- 앱: ~~https://prelook-4f889e57.base44.app~~ (link expired: the Base44 demo app is no longer maintained after the event)
- 저장소: https://github.com/currenjin/2026-base44-vibecoders-hackathon

## 무엇을 보여 주나

- 매물 광고와 건축물대장 표제부를 나란히 비교한다.
- 두 시연 매물은 주변 3D, 여름·겨울 햇빛 시간표와 창 앞 거리를 계산한다.
- 주변 시설의 지정 지도 지점까지 직선거리와 방문 체크리스트를 보여 준다.
- 다른 피터팬 링크는 실시간 광고 읽기와 표제부 조회 경로를 제공한다. 모든 지역·매물의 성공이나 수치 정확성을 보장하지 않는다.

시연 링크:
- ~~https://prelook-4f889e57.base44.app/app.html?l=19929211~~
- ~~https://prelook-4f889e57.base44.app/app.html?l=19921381~~

## 계산과 확인 범위

시연 매물 2건의 계산 입력은 독립 기준 `prelook-demo-criteria-v2`의 고정 assumption_models에서 가져왔다. 창 위치와 균등층고, 평지 등을 가정한 시뮬레이션이며 실제 창 위치·실내 채광·실측 일조가 아니다. 실제 호를 특정하지 못하면 공식 해당 호 전용면적은 확인 불가로 둔다. 안전·적법성·일조권을 판정하지 않는다.

2026-10-17 독립 검증 당시 `3a57952`에서 SUN·FRONT 수치는 기준과 일치했지만, 필수 UI와 실패 복구 문제로 전체 판정은 PRODUCT FAIL이었다. 이후 `2387f70` 등의 수정이 반영되었으나 이 README 정리에서는 재검증하지 않았다. 수상 결과를 제품 전체 검증 PASS로 간주하지 않는다. 초기 UI·미리방 관련 과거 파일과 커밋은 이력이다.

## 데이터와 에셋 출처

- 외곽선과 지도 지점: © OpenStreetMap contributors, ODbL. https://www.openstreetmap.org/copyright
- 건물 높이·층수·공식 용도: 건축HUB 건축물대장 조회 고정본. 일부는 공개 층수×3m 가정이며 높이 미상 건물은 별도로 취급한다. https://www.data.go.kr/data/15134735/openapi.do
- 매물 광고: 피터팬 공개 매물 페이지. 광고 표기를 공식 대장 확인값과 구분한다. 매물 사진과 판매자 연락처는 이 저장소의 재배포 대상이 아니다.
- `public/hero-report.jpg`: 앱의 3D/UI 화면. 실제 매물 실내 사진이 아니다.

저장소 공개는 데이터·의존성·외부 에셋 전체에 새로운 라이선스를 부여하는 행위가 아니다. 코드의 별도 LICENSE는 아직 선택하지 않았고, 데이터·라이브러리 재사용 시 각 원출처의 이용 조건을 확인해야 한다.

## 환경과 배포

건축물대장 자격증명은 Base44 서버 secret `DATA_GO_KR_KEY`로 주입한다. 키 값을 코드·클라이언트 환경 변수·로그·커밋에 넣지 않는다. `.env*`와 Base44 계정 연결 파일은 Git에서 제외한다. 배포에는 자신의 Base44 계정과 설정이 필요하다.

```sh
npm install
npx base44 build && npx base44 deploy -y --no-build
```

이 저장소는 행사 프로토타입이다. 공개 이전에 현재 및 과거 파일의 비밀값 패턴 검사와 UI 이미지 점검을 수행했지만 완전한 보안 감사나 데이터 재배포 권리의 법률 검토를 뜻하지 않는다.
