<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>포인트 관리 - Auctionary</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/points.css">
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
                    <a href="points" class="nav-btn active" id="pointsBtn">
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
            <div class="points-container">
                <!-- Points Overview -->
                <div class="points-overview">
                    <div class="points-card">
                        <div class="points-header">
                            <h1>포인트 관리</h1>
                            <p>입찰과 구매에 사용되는 포인트를 관리하세요</p>
                        </div>
                        <div class="points-balance">
                            <div class="balance-info">
                                <span class="balance-label">현재 포인트</span>
                                <input type="hidden" id="serverFinalPoint" value="${finalPoint}">
                                <span class="balance-amount" id="currentPoints">${finalPoint} P</span>
                            </div>
                            <div class="balance-actions">
                                <button class="btn btn-primary" onclick="pointsManager.showChargeModal()">충전하기</button>
                                <button class="btn btn-ghost" onclick="pointsManager.showWithdrawModal()">출금하기</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Points History -->
                <div class="points-history-section">
                    <div class="section-header">
                        <h2>포인트 내역</h2>
                        <div class="filter-buttons">
                            <button class="filter-btn active" data-filter="all">전체</button>
                            <button class="filter-btn" data-filter="charge">충전</button>
                            <button class="filter-btn" data-filter="withdraw">출금</button>
                            <button class="filter-btn" data-filter="bid">입찰</button>
                            <button class="filter-btn" data-filter="purchase">구매</button>
                            <button class="filter-btn" data-filter="sale">판매</button>
                        </div>
                    </div>
                    <input type="hidden" id="serverPointHistory" value='${list}'>
                    <div class="points-history-list" id="pointsHistoryList">
                        <!-- Points history will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Charge Modal -->
    <div class="modal" id="chargeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>포인트 충전</h3>
                <button class="close-btn" onclick="pointsManager.closeChargeModal()">&times;</button>
            </div>
            <form class="modal-form" id="chargeForm">
                <div class="form-group">
                    <label for="chargeAmount">충전 금액</label>
                    <input type="number" id="chargeAmount" name="amount" min="10000" step="10000" required>
                    <small>최소 10,000원부터 충전 가능합니다.</small>
                </div>
                <div class="form-group">
                    <label for="chargeMethod">결제 방법</label>
                    <select id="chargeMethod" name="method" required>
                        <option value="">결제 방법을 선택하세요</option>
                        <option value="card">신용카드</option>
                        <option value="bank">계좌이체</option>
                        <option value="phone">휴대폰 결제</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-ghost" onclick="pointsManager.closeChargeModal()">취소</button>
                    <button type="submit" class="btn btn-primary">충전하기</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Withdraw Modal -->
    <div class="modal" id="withdrawModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>포인트 출금</h3>
                <button class="close-btn" onclick="pointsManager.closeWithdrawModal()">&times;</button>
            </div>
            <form class="modal-form" id="withdrawForm">
                <div class="form-group">
                    <label for="withdrawAmount">출금 금액</label>
                    <input type="number" id="withdrawAmount" name="amount" min="10000" step="10000" required>
                    <small>최소 10,000원부터 출금 가능합니다.</small>
                </div>
                <div class="form-group">
                    <label for="withdrawAccount">출금 계좌</label>
                    <input type="text" id="withdrawAccount" name="account" placeholder="계좌번호를 입력하세요" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-ghost" onclick="pointsManager.closeWithdrawModal()">취소</button>
                    <button type="submit" class="btn btn-primary">출금하기</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../js/mock-data.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/points.js"></script>
</body>
</html>