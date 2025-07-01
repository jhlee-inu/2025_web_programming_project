# 🎮 GameFinder

게임 정보를 빠르게 검색하고, 상세 정보 및 즐겨찾기와 리뷰를 확인할 수 있는 웹 애플리케이션입니다.  
**Docker 기반 Nginx 프록시**, **Vercel 서버리스 API**, **React 프론트엔드**로 구성되어 있습니다.
**CI는 github/workflows/.yml 파일로 자동화**
---

## 프로젝트 구조

project/

├── frontend/ # React vite 기반 프론트엔드

├── proxy/ # Nginx 리버스 프록시 설정

├── serverless/ # Vercel 서버리스 API 함수들

├── docker-compose.yml

└── .gitignore

---

## 주요 기능

- RAWG API 기반 게임 검색
- 상세 정보 확인 (플랫폼, 장르, 출시일 등)
- 게임 즐겨찾기 및 리뷰 로컬 저장
- Docker 기반 프록시 서버
- Vercel 서버리스 함수 호출
- 추가 기능 다크모드,검색 오류제어, 상세정보가 없을때의 오류제어
