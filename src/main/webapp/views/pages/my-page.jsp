<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%-- JSTL(c, fmt) 태그 라이브러리를 사용하기 위한 선언문 --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>마이페이지 - Auctionary</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/my-page.css">
    <link rel="stylesheet" href="../css/auction-card.css">
</head>
<body>
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

<main class="main">
    <div class="container">
        <div class="my-page-container">
            <div class="profile-section">
                <div class="profile-card">
                    <div class="profile-header">
                        <img src="../images/placeholder.svg" alt="프로필" class="profile-avatar">
                        <div class="profile-info">
                            <h2 id="userName">${userProfile.name}</h2>
                            <p id="userEmail">${userProfile.email}</p>
                            <div class="profile-stats">
                                <div class="stat">
                                    <span class="stat-value" id="userPoints">...</span>
                                    <span class="stat-label">포인트</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value" id="wishlistCount">...</span>
                                    <span class="stat-label">찜한 상품</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            <div class="tab-content">
                <div class="tab-pane active" id="overview">
                    <div class="overview-grid">
                        <div class="overview-card">
                            <h3>최근 활동</h3>
                            <div class="activity-list" id="recentActivity">
                                <c:choose>
                                    <c:when test="${not empty recentActivities}">
                                        <c:forEach var="activity" items="${recentActivities}">
                                            <div class="activity-item">
                                                <div class="activity-icon">💰</div>
                                                <div class="activity-content">
                                                    <div class="activity-title">${activity.productName} 입찰</div>
                                                    <div class="activity-time">
                                                        <fmt:formatNumber value="${activity.bidPrice}" pattern="#,###" />원
                                                        • <fmt:formatDate value="${activity.bidDate}" pattern="yyyy-MM-dd HH:mm"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </c:forEach>
                                    </c:when>
                                    <c:otherwise>
                                        <p style="text-align: center; color: #6b7280;">최근 활동이 없습니다.</p>
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </div>
                        <div class="overview-card">
                            <h3>포인트 내역</h3>
                            <div class="points-history" id="pointsHistory">
                                <c:choose>
                                    <c:when test="${not empty pointHistory}">
                                        <c:forEach var="history" items="${pointHistory}">
                                            <div class="points-item">
                                                <div class="points-info">
                                                    <div class="points-description">${history.note}</div>
                                                    <div class="points-date"><fmt:formatDate value="${history.changeDate}" pattern="yyyy-MM-dd HH:mm"/></div>
                                                </div>
                                                <div class="points-amount ${history.pointChange > 0 ? 'positive' : 'negative'}">
                                                    <c:if test="${history.pointChange > 0}">+</c:if>
                                                    <fmt:formatNumber value="${history.pointChange}" pattern="#,###" />원
                                                </div>
                                            </div>
                                        </c:forEach>
                                    </c:when>
                                    <c:otherwise>
                                        <p style="text-align: center; color: #6b7280;">포인트 내역이 없습니다.</p>
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-pane" id="bidding">
                    <div class="bidding-list" id="biddingList">
                        <c:choose>
                            <c:when test="${not empty biddingList}">
                                <c:forEach var="product" items="${biddingList}">
                                    <div class="list-item">
                                        <img src="../images/${product.imagePath}" alt="${product.productName}" class="list-item-image">
                                        <div class="list-item-content">
                                            <div class="list-item-title">${product.productName}</div>
                                            <div class="list-item-price">
                                                시작가: <fmt:formatNumber value="${product.startingPrice}" pattern="#,###" />원
                                            </div>
                                            <span class="list-item-status ${product.transactionStatus == 'AUCTIONING' ? 'active' : (product.transactionStatus == 'SOLD' ? 'sold' : 'ended')}">
                                                    ${product.transactionStatus == 'AUCTIONING' ? '진행중' : (product.transactionStatus == 'SOLD' ? '판매완료' : '종료')}
                                            </span>
                                        </div>
                                    </div>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                <p style="text-align: center; color: #6b7280;">입찰 내역이 없습니다.</p>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <div class="tab-pane" id="selling">
                    <div class="selling-list" id="sellingList">
                        <c:choose>
                            <c:when test="${not empty sellingList}">
                                <c:forEach var="product" items="${sellingList}">
                                    <div class="list-item">
                                        <img src="../images/${product.imagePath}" alt="${product.productName}" class="list-item-image">
                                        <div class="list-item-content">
                                            <div class="list-item-title">${product.productName}</div>
                                            <div class="list-item-price">
                                                시작가: <fmt:formatNumber value="${product.startingPrice}" pattern="#,###" />원
                                            </div>
                                            <span class="list-item-status ${product.transactionStatus == 'AUCTIONING' ? 'active' : (product.transactionStatus == 'SOLD' ? 'sold' : 'ended')}">
                                                    ${product.transactionStatus == 'AUCTIONING' ? '진행중' : (product.transactionStatus == 'SOLD' ? '판매완료' : '종료')}
                                            </span>
                                        </div>
                                    </div>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                <p style="text-align: center; color: #6b7280;">판매 내역이 없습니다.</p>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <div class="tab-pane" id="purchased">
                    <div class="purchased-list" id="purchasedList">
                        <c:choose>
                            <c:when test="${not empty purchasedList}">
                                <c:forEach var="product" items="${purchasedList}">
                                    <div class="list-item">
                                        <img src="../images/${product.imagePath}" alt="${product.productName}" class="list-item-image">
                                        <div class="list-item-content">
                                            <div class="list-item-title">${product.productName}</div>
                                            <div class="list-item-price">
                                                구매가: <fmt:formatNumber value="${product.startingPrice}" pattern="#,###" />원 <%-- TODO: 실제 구매가 표시 필요 --%>
                                            </div>
                                            <span class="list-item-status sold">구매완료</span>
                                        </div>
                                    </div>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                <p style="text-align: center; color: #6b7280;">구매 내역이 없습니다.</p>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <div class="tab-pane" id="wishlist">
                    <div class="wishlist-grid" id="wishlistGrid">
                        <c:choose>
                            <c:when test="${not empty wishlist}">
                                <c:forEach var="product" items="${wishlist}">
                                    <div class="auction-card">
                                        <a href="pages/auction/${product.productId}" class="auction-card-link">
                                            <div class="auction-card-image">
                                                <img src="../images/${product.imagePath}" alt="${product.productName}" loading="lazy">
                                            </div>
                                            <div class="auction-card-content">
                                                <h3 class="auction-card-title">${product.productName}</h3>
                                            </div>
                                            <div class="auction-card-footer">
                                                <div class="auction-card-price">
                                                    <p class="auction-card-price-label">시작가</p>
                                                    <p class="auction-card-price-value"><fmt:formatNumber value="${product.startingPrice}" pattern="#,###" />원</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                <p style="text-align: center; color: #6b7280; width: 100%;">찜한 상품이 없습니다.</p>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <div class="tab-pane" id="reviews">
                    <div class="reviews-list" id="reviewsList">
                        <c:choose>
                            <c:when test="${not empty reviews}">
                                <c:forEach var="review" items="${reviews}">
                                    <div class="review-item">
                                        <div class="review-header">
                                            <div class="reviewer-name">${reviewerNames[review.reviewerId]}</div>
                                            <div class="review-rating">
                                                <c:forEach begin="1" end="${review.rating}">★</c:forEach>
                                                <c:forEach begin="${review.rating + 1}" end="5">☆</c:forEach>
                                            </div>
                                        </div>
                                        <div class="review-comment">${review.content}</div>
                                        <div class="review-date"><fmt:formatDate value="${review.reviewDate}" pattern="yyyy-MM-dd HH:mm"/></div>
                                    </div>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                <p style="text-align: center; color: #6b7280;">받은 리뷰가 없습니다.</p>
                            </c:otherwise>
                        </c:choose>
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