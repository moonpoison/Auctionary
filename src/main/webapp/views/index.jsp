<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auctionary - 게임처럼 즐기는 C2C 경매 플랫폼</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/auction-card.css">
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
                
                <div class="search-container">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input type="text" placeholder="어떤 상품을 찾으시나요?" class="search-input">
                </div>
                
                <nav class="nav">
                    <button class="nav-btn" id="chatBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    </button>
                    <a href="/points" class="nav-btn" id="pointsBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="20" height="12" x="2" y="6" rx="2"/>
                            <circle cx="12" cy="12" r="4"/>
                        </svg>
                        <span class="points-text">0 P</span>
                    </a>
                    <a href="/sell" class="nav-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                            <circle cx="9" cy="9" r="2"/>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                        <span>판매하기</span>
                    </a>
                    <a href="/my-page" class="nav-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span>마이페이지</span>
                    </a>
                </nav>
                
                <div class="auth-buttons">
                    <a href="/login" class="btn btn-ghost">로그인</a>
                    <a href="/signup" class="btn btn-primary">회원가입</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <div class="hero-section">
                <h1 class="hero-title">실시간 경매</h1>
                <p class="hero-subtitle">지금 바로 참여하고 특별한 아이템을 차지하세요!</p>
            </div>
            
            <div class="sort-buttons">
                <button class="sort-btn active" data-sort="closing">마감임박순</button>
                <button class="sort-btn" data-sort="popular">인기순</button>
                <button class="sort-btn" data-sort="newest">최신순</button>
                <button class="sort-btn" data-sort="highPrice">높은가격순</button>
                <button class="sort-btn" data-sort="lowPrice">낮은가격순</button>
            </div>
            
            <div class="auction-grid" id="auctionGrid">
                <!-- Auction cards will be dynamically generated here -->
            </div>
        </div>
    </main>

    <!-- Chat Modal -->
    <div class="chat-modal" id="chatModal">
        <div class="chat-modal-content">
            <div class="chat-modal-header">
                <h3>채팅</h3>
                <button class="close-btn" id="closeChatBtn">&times;</button>
            </div>
            <div class="chat-list" id="chatList">
                <!-- Chat conversations will be loaded here -->
            </div>
        </div>
    </div>

    <script src="/js/mock-data.js"></script>
    <script src="/js/utils.js"></script>
    <script src="/js/auth.js"></script>
    <script src="/js/chat.js"></script>
    <script src="/js/auction-card.js"></script>
    <script src="/js/main.js"></script>
</body>
</html> 