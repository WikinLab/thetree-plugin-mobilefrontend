# thetree-plugin-mobilefrontend

the tree에서 MediaWiki의 MobileFrontend 역할에 대응하는 범용 백엔드 `skinData` 플러그인입니다.

엔진이 판정한 `req.isMobile` 값을 스킨 이름과 무관하게 `page.data.thetreeMobileFrontend`에 전달합니다. 플러그인은 스킨을 선택하거나 화면과 본문을 변경하지 않습니다. 독립 스킨은 이 신호로 MobileFrontend 기능 프로필을 선택할 수 있고, 조합 스킨은 데스크톱·모바일 슬롯을 선택할 수 있습니다.

```sh
cd /path/to/thetree/plugins
git clone https://github.com/WikinLab/thetree-plugin-mobilefrontend.git thetree-plugin-mobilefrontend
```

저장소 전체가 `plugins/thetree-plugin-mobilefrontend/`에 있어야 합니다. 설치나 업데이트 뒤에는 the tree 엔진을 다시 시작합니다. npm 설치나 프런트엔드 빌드는 필요하지 않습니다.

전달 형식은 `thetree-mobilefrontend/v1`입니다.

```json
{
  "schema": "thetree-mobilefrontend/v1",
  "mode": "mobile"
}
```

플러그인이 없으면 이 데이터 자체가 없습니다. 설치된 경우 데스크톱 요청에는 `desktop`, 모바일 요청에는 `mobile`이 전달됩니다.
