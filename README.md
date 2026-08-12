# thetree-plugin-mobilefrontend

the tree에서 모바일 요청을 스킨에 전달하는 MobileFrontend 플러그인입니다.

## 주요 기능

- PC·모바일 요청 구분
- 호환 스킨의 모바일 화면 전환
- Skin Composer의 데스크톱·모바일 슬롯 전환
- Composer에 포함된 스킨 설정 키 전달
- 모든 호환 스킨에서 사용하는 공통 모바일 모드 제공

## 요구 사항

- Node.js 20.19.1 이상을 사용하는 the tree
- the tree 설치 서버의 명령줄 접근 권한
- Git이 설치되어 있고 GitHub에 접속할 수 있는 서버

## 설치

the tree 설치 디렉터리에서 다음 명령을 실행합니다.

```sh
cd plugins
git clone https://github.com/WikinLab/thetree-plugin-mobilefrontend.git thetree-plugin-mobilefrontend
```

설치 후 the tree 엔진을 다시 시작하면 적용됩니다.

## 설정

기본 설정으로 바로 동작합니다.

| 요청 | 스킨에 전달되는 모드 |
| --- | --- |
| PC | `desktop` |
| 모바일 | `mobile` |

Skin Composer와 함께 사용하면 조합판에 선언된 `skin.*` 설정과 공용 `wiki.*` 설정도 각 슬롯에 전달합니다.

## 업데이트

```sh
cd plugins/thetree-plugin-mobilefrontend
git pull
```

업데이트 후 the tree 엔진을 다시 시작합니다.

## 문제 해결

- 모바일 화면 전환 확인 순서: `plugins/thetree-plugin-mobilefrontend` 설치 경로 확인 → the tree 엔진 재시작
- 설치 또는 업데이트 후에는 반드시 the tree 엔진을 다시 시작합니다.
- Composer 설정 전달을 갱신하려면 Composer에서 `npm run bootstrap`을 실행한 뒤 스킨을 다시 빌드합니다.

## 면책

이 플러그인을 사용하면서 발생하는 문제에 대해서는 책임지지 않습니다.

## 개발 도구

이 프로젝트의 개발에는 OpenAI ChatGPT가 사용되었습니다.

## 버전과 라이선스

현재 버전은 `package.json`에서 확인할 수 있습니다.

이 프로젝트는 MIT로 배포됩니다.
