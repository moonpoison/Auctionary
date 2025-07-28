<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>상품 상세 - Auctionary</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/auction-detail.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="../index" class="logo">
                    <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
                        <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
                    </svg>
                    <span class="logo-text">Auctionary</span>
                </a>
                
                <nav class="nav">
                    <a href="../index" class="nav-link">홈</a>
                    <a href="sell" class="nav-link">판매하기</a>
                    <a href="points" class="nav-link">포인트</a>
                    <a href="my-page" class="nav-link">마이페이지</a>
                </nav>
                
                <div class="auth-buttons">
                    <a href="login" class="btn btn-ghost">로그인</a>
                    <a href="signup" class="btn btn-primary">회원가입</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <div id="auctionDetail">
                <!-- Auction detail content will be dynamically generated here -->
                <div style="text-align: center; padding: 3rem 1rem;">
                    <h2>상품 정보를 불러오는 중...</h2>
                </div>
            </div>
        </div>
    </main>

    <script src="../js/mock-data.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/auction-detail.js"></script>
</body>
</html> 