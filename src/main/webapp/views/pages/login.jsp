<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인 - Auctionary</title>
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
                        <h1>로그인</h1>
                        <p>계정에 로그인하여 경매에 참여하세요</p>
                    </div>
                    
                    <form class="auth-form" id="loginForm">
                        <div class="form-group">
                            <label for="userId">아이디</label>
                            <input type="text" id="userId" name="userId" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">비밀번호</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary auth-submit">로그인</button>
                    </form>
                    
                    <div class="auth-footer">
                        <p>계정이 없으신가요? <a href="/auth/signup">회원가입</a></p>
                    </div>
                    
                    <div class="demo-accounts">
                        <h3>데모 계정</h3>
                        <div class="demo-account-list">
                            <button class="demo-account-btn" onclick="loginWithDemo('hero')">
                                AuctionHero (8,400,000P)
                            </button>
                            <button class="demo-account-btn" onclick="loginWithDemo('vtech')">
                                V-Tech (5,000,000P)
                            </button>
                            <button class="demo-account-btn" onclick="loginWithDemo('timemaster')">
                                TimeMaster (20,000,000P)
                            </button>
                            <button class="demo-account-btn" onclick="loginWithDemo('collector')">
                                Collector (8,000,000P)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="/js/mock-data.js"></script>
    <script src="/js/utils.js"></script>
    <script src="/js/auth.js"></script>
    <script src="/js/login.js"></script>
</body>
</html> 