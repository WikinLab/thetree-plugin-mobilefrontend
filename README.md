# thetree-plugin-mobilefrontend

the tree에서 MediaWiki의 MobileFrontend 역할을 담당하는 백엔드 `skinData` 플러그인입니다.

엔진이 판정한 `req.isMobile` 값을 `page.data.thetreeMobileFrontend`에 전달합니다. `vector` 스킨은 모바일 모드에서 Minerva 변형을 선택하고, 독립 `minerva` 스킨은 모바일 모드에서 검색 화면·접이식 문단·모바일 기능 프로필을 활성화합니다. 쿠키나 로컬 저장소를 사용하지 않습니다.

```sh
cd /path/to/thetree/plugins
git clone https://github.com/WikinLab/thetree-plugin-mobilefrontend.git thetree-plugin-mobilefrontend
```

저장소 전체가 `plugins/thetree-plugin-mobilefrontend/`에 있어야 합니다. 설치나 업데이트 뒤에는 the tree 엔진을 다시 시작합니다. npm 설치나 프론트엔드 빌드는 필요하지 않습니다.

플러그인이 없거나 데스크톱 요청이면 독립 Minerva는 MobileFrontend가 없는 기본 Minerva로 동작합니다.
