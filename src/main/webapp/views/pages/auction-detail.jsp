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
            
            <!-- 입찰 내역 탭 -->
            <div class="auction-tabs">
                <div class="tab-buttons">
                    <button class="tab-button active" data-tab="bids">입찰 내역</button>
                    <button class="tab-button" data-tab="details">상품 상세</button>
                    <button class="tab-button" data-tab="reviews">판매자 리뷰</button>
                </div>
                
                <div class="tab-content active" id="bidsTab">
                    <div id="bidHistory">
                        <!-- 입찰 내역이 여기에 로드됩니다 -->
                    </div>
                </div>
                
                <div class="tab-content" id="detailsTab">
                    <div class="product-details">
                        <h3>상품 상세 정보</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">카테고리</span>
                                <span class="detail-value" id="categoryValue">-</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">상태</span>
                                <span class="detail-value" id="statusValue">-</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">배송</span>
                                <span class="detail-value">무료배송</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="reviewsTab">
                    <div class="seller-reviews">
                        <h3>판매자 리뷰</h3>
                        <div class="review-list" id="reviewList">
                            <!-- 리뷰가 여기에 로드됩니다 -->
                        </div>
                    </div>
                </div>
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

    <script src="../js/mock-data.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/chat.js"></script>
    <script src="../js/auction-detail.js"></script>
</body>
</html> 