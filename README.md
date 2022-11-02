⚠진행중인 프로젝트입니다.

# SNS-Service
## 서버 구조도
추가 예정

## 프로젝트 목표
- 요구사항에 적합한 SNS 기능을 구현하는 것이 목표입니다.
- 지속적인 기능 추가 및 개선을 통해 더 고도화된 서비스를 제공하는 것이 목표입니다.
- 향후 TypeScript/Nest를 적용하여 타입 안정화하는 것이 목표입니다.
- 향후 배포 및 CI/CD 적용으로 지속적인 서비스 제공을 목표로 합니다.

## 주요 기능
- **회원가입, 로그인, 회원 수정, 탈퇴 기능을 제공합니다.**

  - **JWT를 통한 회원 인증 기능**을 제공합니다.

  - 회원가입, 이메일 변경 시 **이메일 인증 기능**을 제공합니다.

  - **임시 비밀번호 발급 기능**을 제공합니다.
<br>

- **게시글 생성, 조회, 전체조회, 수정, 삭제 기능을 제공합니다.**
  - 게시글에 대한 **좋아요와 조회수 기능**을 제공합니다.
    - 게시글에 **좋아요를 누른 유저 목록을 조회**할 수 있습니다.

  - 게시글 전체 조회 시 **검색, 정렬, 페이지네이션 기능**을 제공합니다.
    - 검색: 제목, 태그 기준으로 키워드에 적합한 데이터를 필터링할 수 있습니다.
    - 정렬: 작성일, 좋아요 수, 조회수에 따라 오름차순, 내림차순 정렬이 가능합니다.
    - 페이지 당 10, 30, 50, 70건의 페이지네이션을 제공합니다. 
  
  - openAPI를 적용하여 **날씨데이터, 언어감지, 번역 기능**을 제공합니다.

## ISSUE 해결 과정

[nodemailer를 사용한 이메일 인증 구현 과정]()

[findOrCreate 쿼리를 이용한 게시글 생성 API 코드 개선]()

[JWT 사용 시 토큰 탈취에 대한 문제]()

[Redis multi를 적용하여 응답 속도 개선](https://k2eo.tistory.com/23)

## ERD
![image](https://user-images.githubusercontent.com/80232260/199373748-4fd1317f-05c6-4bd4-b727-563de49a1fe9.png)

## API 문서
추가 예정

## 컨벤션
[여기]()를 참고하세요.

## 기술 스택
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-FCC624?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/Sequelize-007396?style=for-the-badge&logo=Sequelize&logoColor=white">
<img src="https://img.shields.io/badge/Swagger-61DAFB?style=for-the-badge&logo=Swagger&logoColor=white">
