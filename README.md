[//]: # (<a href="https://club-project-one.vercel.app/" target="_blank">)

[//]: # (<img src="https://github.com/user-attachments/assets/daa622b9-7c69-4786-8db3-4996b7f140be" alt="배너" width="100%"/>)

[//]: # (</a>)
[//]: # ()
[//]: # (<br/>)

[//]: # (<br/>)
[//]: # ()
[//]: # (# 0. Getting Started &#40;시작하기&#41;)

[//]: # (```bash)

[//]: # ($ npm start)

[//]: # (```)

[//]: # ([서비스 링크]&#40;https://club-project-one.vercel.app/&#41;)

[//]: # ()
[//]: # (<br/>)

[//]: # (<br/>)

# 1. Project Overview (프로젝트 개요)1
- 프로젝트 이름: Auctionary
- 프로젝트 설명: 사용자 참여형 경매 플랫폼


# 2. Team Members (팀원 및 팀 소개)
|                                          정영진                                           |                                          김도연                                           |                                          정승민                                           |                                           김선우                                           |
|:--------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------:|
| <img src="https://avatars.githubusercontent.com/u/70675330?v=4" alt="정영진" width="150"> | <img src="https://avatars.githubusercontent.com/u/27461288?v=4" alt="김도연" width="150"> | <img src="https://avatars.githubusercontent.com/u/86943734?v=4" alt="정승민" width="150"> | <img src="https://avatars.githubusercontent.com/u/153818862?v=4" alt="김선우" width="150"> |
|                                           PL                                           |                                                                                        |                                                                                        |                                                                                         |
|                        [GitHub](https://github.com/moonpoison)                         |                       [GitHub](https://github.com/YnexKimdoyeon)                       |                        [GitHub](https://github.com/Dotori0309)                         |                          [GitHub](https://github.com/kswoo02)                           |

<br/>
<br/>

# 3. 🚀 기능

### 메인 기능
- **실시간 경매 목록**: 다양한 상품들의 경매 현황을 확인할 수 있습니다
- **정렬 기능**: 마감임박순, 인기순, 최신순, 가격순으로 정렬 가능
- **검색 기능**: 상품명, 설명, 태그로 검색 가능
- **찜하기**: 관심 상품을 찜 목록에 추가/제거

### 사용자 기능
- **회원가입/로그인**: 새로운 계정 생성 및 로그인
- **마이페이지**: 개요, 입찰 내역, 판매 내역, 구매 내역, 찜한 상품, 리뷰 관리
- **포인트 시스템**: 입찰, 구매, 판매에 사용되는 포인트 관리

<br/>
<br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)
| 정영진 | <img src="https://avatars.githubusercontent.com/u/70675330?v=4" alt="정영진" width="100">  | <ul></ul>     |
|-----|-----------------------------------------------------------------------------------------|-----------------|
| 김도연 | <img src="https://avatars.githubusercontent.com/u/27461288?v=4" alt="김도연" width="100">  | <ul></ul> |
| 정승민 | <img src="https://avatars.githubusercontent.com/u/86943734?v=4" alt="정승민" width="100">  |<ul></ul>  |
| 김선우 | <img src="https://avatars.githubusercontent.com/u/153818862?v=4" alt="김선우" width="100"> | <ul></ul>    |

<br/>
<br/>

# 5. Technology Stack (기술 스택)
## 5.1 Language
| HTML5    |<img src="https://github.com/user-attachments/assets/2e122e74-a28b-4ce7-aff6-382959216d31" alt="HTML5" width="100">|
|-----------------|-----------------|
| CSS3    |   <img src="https://github.com/user-attachments/assets/c531b03d-55a3-40bf-9195-9ff8c4688f13" alt="CSS3" width="100">|
| Javascript    |  <img src="https://github.com/user-attachments/assets/4a7d7074-8c71-48b4-8652-7431477669d1" alt="Javascript" width="100"> | 

<br/>

## 5.2 Frotend
|  |  |  |
|-----------------|-----------------|-----------------|
||| |

<br/>

## 5.3 Backend
|  |  |  |
|-----------------|-----------------|-----------------|
| ||  |

<br/>

## 5.4 Cooperation
| Git    |  <img src="https://github.com/user-attachments/assets/483abc38-ed4d-487c-b43a-3963b33430e6" alt="git" width="100">    |
|-----------------|-----------------|
| Notion    |  <img src="https://github.com/user-attachments/assets/34141eb9-deca-416a-a83f-ff9543cc2f9a" alt="Notion" width="100">    |

<br/>

# 6. 📁 프로젝트 구조

```
vanilla-auctionary/
├── index.html              # 메인 페이지
├── css/
│   ├── style.css          # 메인 스타일
│   ├── header.css         # 헤더 스타일
│   ├── auction-card.css   # 경매 카드 스타일
│   ├── auth.css           # 인증 페이지 스타일
│   └── my-page.css        # 마이페이지 스타일
├── js/
│   ├── mock-data.js       # 모의 데이터
│   ├── utils.js           # 유틸리티 함수
│   ├── auth.js            # 인증 관리
│   ├── auction-card.js    # 경매 카드 컴포넌트
│   ├── main.js            # 메인 애플리케이션 로직
│   ├── login.js           # 로그인 페이지 로직
│   ├── signup.js          # 회원가입 페이지 로직
│   └── my-page.js         # 마이페이지 로직
├── pages/
│   ├── login.html         # 로그인 페이지
│   ├── signup.html        # 회원가입 페이지
│   └── my-page.html       # 마이페이지
└── images/
    └── placeholder.svg    # 플레이스홀더 이미지
```

<br/>
<br/>

# 7. Development Workflow (개발 워크플로우)
## 브랜치 전략 (Branch Strategy)
우리의 브랜치 전략은 Git Flow를 기반으로 하며, 다음과 같은 브랜치를 사용합니다.

- Main Branch
  - 배포 가능한 상태의 코드를 유지합니다.
  - 모든 배포는 이 브랜치에서 이루어집니다.
  
- {name} Branch
  - 팀원 각자의 개발 브랜치입니다.
  - 모든 기능 개발은 이 브랜치에서 이루어집니다.

<br/>
<br/>

[//]: # (# 8. Coding Convention)

[//]: # (## 문장 종료)

[//]: # (```)

[//]: # (// 세미콜론&#40;;&#41;)

[//]: # (console.log&#40;"Hello World!"&#41;;)

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # ()
[//]: # ()
[//]: # (## 명명 규칙)

[//]: # (* 상수 : 영문 대문자 + 스네이크 케이스)

[//]: # (```)

[//]: # (const NAME_ROLE;)

[//]: # (```)

[//]: # (* 변수 & 함수 : 카멜케이스)

[//]: # (```)

[//]: # (// state)

[//]: # (const [isLoading, setIsLoading] = useState&#40;false&#41;;)

[//]: # (const [isLoggedIn, setIsLoggedIn] = useState&#40;false&#41;;)

[//]: # (const [errorMessage, setErrorMessage] = useState&#40;''&#41;;)

[//]: # (const [currentUser, setCurrentUser] = useState&#40;null&#41;;)

[//]: # ()
[//]: # (// 배열 - 복수형 이름 사용)

[//]: # (const datas = [];)

[//]: # ()
[//]: # (// 정규표현식: 'r'로 시작)

[//]: # (const = rName = /.*/;)

[//]: # ()
[//]: # (// 이벤트 핸들러: 'on'으로 시작)

[//]: # (const onClick = &#40;&#41; => {};)

[//]: # (const onChange = &#40;&#41; => {};)

[//]: # ()
[//]: # (// 반환 값이 불린인 경우: 'is'로 시작)

[//]: # (const isLoading = false;)

[//]: # ()
[//]: # (// Fetch함수: method&#40;get, post, put, del&#41;로 시작)

[//]: # (const getEnginList = &#40;&#41; => {...})

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # ()
[//]: # (## 블록 구문)

[//]: # (```)

[//]: # (// 한 줄짜리 블록일 경우라도 {}를 생략하지 않고, 명확히 줄 바꿈 하여 사용한다)

[//]: # (// good)

[//]: # (if&#40;true&#41;{)

[//]: # (  return 'hello')

[//]: # (})

[//]: # ()
[//]: # (// bad)

[//]: # (if&#40;true&#41; return 'hello')

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # ()
[//]: # (## 함수)

[//]: # (```)

[//]: # (함수는 함수 표현식을 사용하며, 화살표 함수를 사용한다.)

[//]: # (// Good)

[//]: # (const fnName = &#40;&#41; => {};)

[//]: # ()
[//]: # (// Bad)

[//]: # (function fnName&#40;&#41; {};)

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # ()
[//]: # (## 태그 네이밍)

[//]: # (Styled-component태그 생성 시 아래 네이밍 규칙을 준수하여 의미 전달을 명확하게 한다.<br/>)

[//]: # (태그명이 길어지더라도 의미 전달의 명확성에 목적을 두어 작성한다.<br/>)

[//]: # (전체 영역: Container<br/>)

[//]: # (영역의 묶음: {Name}Area<br/>)

[//]: # (의미없는 태그: <><br/>)

[//]: # (```)

[//]: # (<Container>)

[//]: # (  <ContentsArea>)

[//]: # (    <Contents>...</Contents>)

[//]: # (    <Contents>...</Contents>)

[//]: # (  </ContentsArea>)

[//]: # (</Container>)

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # ()
[//]: # (## 폴더 네이밍)

[//]: # (카멜 케이스를 기본으로 하며, 컴포넌트 폴더일 경우에만 파스칼 케이스로 사용한다.)

[//]: # (```)

[//]: # (// 카멜 케이스)

[//]: # (camelCase)

[//]: # (// 파스칼 케이스)

[//]: # (PascalCase)

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # ()
[//]: # (## 파일 네이밍)

[//]: # (```)

[//]: # (컴포넌트일 경우만 .jsx 확장자를 사용한다. &#40;그 외에는 .js&#41;)

[//]: # (customHook을 사용하는 경우 : use + 함수명)

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # (<br/>)

[//]: # ()
[//]: # (# 9. 커밋 컨벤션)

[//]: # (## 기본 구조)

[//]: # (```)

[//]: # (type : subject)

[//]: # ()
[//]: # (body )

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # ()
[//]: # (## type 종류)

[//]: # (```)

[//]: # (feat : 새로운 기능 추가)

[//]: # (fix : 버그 수정)

[//]: # (docs : 문서 수정)

[//]: # (style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우)

[//]: # (refactor : 코드 리펙토링)

[//]: # (test : 테스트 코드, 리펙토링 테스트 코드 추가)

[//]: # (chore : 빌드 업무 수정, 패키지 매니저 수정)

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # ()
[//]: # (## 커밋 이모지)

[//]: # (```)

[//]: # (== 코드 관련)

[//]: # (📝	코드 작성)

[//]: # (🔥	코드 제거)

[//]: # (🔨	코드 리팩토링)

[//]: # (💄	UI / style 변경)

[//]: # ()
[//]: # (== 문서&파일)

[//]: # (📰	새 파일 생성)

[//]: # (🔥	파일 제거)

[//]: # (📚	문서 작성)

[//]: # ()
[//]: # (== 버그)

[//]: # (🐛	버그 리포트)

[//]: # (🚑	버그를 고칠 때)

[//]: # ()
[//]: # (== 기타)

[//]: # (🐎	성능 향상)

[//]: # (✨	새로운 기능 구현)

[//]: # (💡	새로운 아이디어)

[//]: # (🚀	배포)

[//]: # (```)

[//]: # ()
[//]: # (<br/>)

[//]: # ()
[//]: # (## 커밋 예시)

[//]: # (```)

[//]: # (== ex1)

[//]: # (✨Feat: "회원 가입 기능 구현")

[//]: # ()
[//]: # (SMS, 이메일 중복확인 API 개발)

[//]: # ()
[//]: # (== ex2)

[//]: # (📚chore: styled-components 라이브러리 설치)

[//]: # ()
[//]: # (UI개발을 위한 라이브러리 styled-components 설치)

[//]: # (```)

[//]: # (<br/>)

[//]: # (<br/>)

[//]: # ()
[//]: # (# 10. 컨벤션 수행 결과)

[//]: # (<img width="100%" alt="코드 컨벤션" src="https://github.com/user-attachments/assets/0dc218c0-369f-45d2-8c6d-cdedc81169b4">)

[//]: # (<img width="100%" alt="깃플로우" src="https://github.com/user-attachments/assets/2a4d1332-acc2-4292-9815-d122f5aea77c">)
