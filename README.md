# thetree-plugin-vector

`thetree-skin-vector`가 엔진상 하나의 `vector` 스킨을 유지하면서 데스크톱 Vector와 모바일 Minerva를 선택할 수 있도록 기기 정보를 주입하는 the tree 백엔드 플러그인입니다.

엔진의 `req.isMobile`만 사용하고 `skinData`의 `page.data`에 공개 판별값을 주입합니다. 쿠키, 로컬 저장소, 사용자 설정을 만들지 않습니다. `vector`가 아닌 독립 `minerva` 스킨 요청도 수정하지 않습니다. 프론트엔드 플러그인은 필요하지 않습니다.

## 설치

```bash
cd /path/to/thetree/plugins
git clone https://github.com/WikinLab/thetree-plugin-vector.git thetree-plugin-vector
```

저장소 전체가 `plugins/thetree-plugin-vector/`에 위치해야 합니다. 설치나 업데이트 뒤에는 the tree 엔진을 다시 시작합니다. npm 설치나 프론트엔드 빌드는 필요하지 않습니다.

## 검사

```bash
npm test
```

MIT License로 배포됩니다.
