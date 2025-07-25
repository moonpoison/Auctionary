<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>마이페이지 - Auctionary</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/my-page.css">
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
                    <a href="points" class="nav-btn" id="pointsBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="20" height="12" x="2" y="6" rx="2"/>
                            <circle cx="12" cy="12" r="4"/>
                        </svg>
                        <span class="points-text">0 P</span>
                    </a>
                    <a href="sell" class="nav-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                            <circle cx="9" cy="9" r="2"/>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                        <span>판매하기</span>
                    </a>
                    <a href="my-page" class="nav-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span>마이페이지</span>
                    </a>
                </nav>
                
                <div class="auth-buttons">
                    <button class="btn btn-ghost" onclick="authManager.logout()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16,17 21,12 16,7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>로그아웃</span>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <div class="my-page-container">
                <!-- User Profile Section -->
                <div class="profile-section">
                    <div class="profile-card">
                        <div class="profile-header">
                            <img src="../images/placeholder.svg" alt="프로필" class="profile-avatar">
                            <div class="profile-info">
                                <h2 id="userName">사용자</h2>
                                <p id="userEmail">user@example.com</p>
                                <div class="profile-stats">
                                    <div class="stat">
                                        <span class="stat-value" id="userPoints">0</span>
                                        <span class="stat-label">포인트</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-value" id="wishlistCount">0</span>
                                        <span class="stat-label">찜한 상품</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="tabs-container">
                    <div class="tabs">
                        <button class="tab-btn active" data-tab="overview">개요</button>
                        <button class="tab-btn" data-tab="bidding">입찰 내역</button>
                        <button class="tab-btn" data-tab="selling">판매 내역</button>
                        <button class="tab-btn" data-tab="purchased">구매 내역</button>
                        <button class="tab-btn" data-tab="wishlist">찜한 상품</button>
                        <button class="tab-btn" data-tab="reviews">리뷰</button>
                    </div>
                </div>

                <!-- Tab Content -->
                <div class="tab-content">
                    <!-- Overview Tab -->
                    <div class="tab-pane active" id="overview">
                        <div class="overview-grid">
                            <div class="overview-card">
                                <h3>최근 활동</h3>
                                <div class="activity-list" id="recentActivity">
                                    <!-- Activity items will be loaded here -->
                                </div>
                            </div>
                            <div class="overview-card">
                                <h3>포인트 내역</h3>
                                <div class="points-history" id="pointsHistory">
                                    <!-- Points history will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bidding Tab -->
                    <div class="tab-pane" id="bidding">
                        <div class="bidding-list" id="biddingList">
                            <!-- Bidding items will be loaded here -->
                        </div>
                    </div>

                    <!-- Selling Tab -->
                    <div class="tab-pane" id="selling">
                        <div class="selling-list" id="sellingList">
                            <!-- Selling items will be loaded here -->
                        </div>
                    </div>

                    <!-- Purchased Tab -->
                    <div class="tab-pane" id="purchased">
                        <div class="purchased-list" id="purchasedList">
                            <!-- Purchased items will be loaded here -->
                        </div>
                    </div>

                    <!-- Wishlist Tab -->
                    <div class="tab-pane" id="wishlist">
                        <div class="wishlist-grid" id="wishlistGrid">
                            <!-- Wishlist items will be loaded here -->
                        </div>
                    </div>

                    <!-- Reviews Tab -->
                    <div class="tab-pane" id="reviews">
                        <div class="reviews-list" id="reviewsList">
                            <!-- Reviews will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="../js/mock-data.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/auction-card.js"></script>
    <script src="../js/my-page.js"></script>
</body>
</html> 