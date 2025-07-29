<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원가입 - Auctionary</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/auth.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="/" class="logo">
                    <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
                        <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
                    </svg>
                    <span class="logo-text">Auctionary</span>
                </a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>회원가입</h1>
                        <p>새로운 계정을 만들어 경매에 참여하세요</p>
                    </div>
                    
                    <form class="auth-form" id="signupForm">
                        <div class="form-group">
                            <label for="userId">아이디</label>
                            <input type="text" id="userId" name="userId" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="name">이름</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="birthDate">생년월일</label>
                            <input type="date" id="birthDate" name="birthDate" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">이메일</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="phone">전화번호</label>
                            <input type="tel" id="phone" name="phone" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">비밀번호</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirmPassword">비밀번호 확인</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary auth-submit">회원가입</button>
                    </form>
                    
                    <div class="auth-footer">
                        <p>이미 계정이 있으신가요? <a href="/auth/login">로그인</a></p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="/js/mock-data.js"></script>
    <script src="/js/utils.js"></script>
    <script src="/js/auth.js"></script>
    <script src="/js/signup.js"></script>
</body>
</html> 