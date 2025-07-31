<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>상품 판매 - Auctionary</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/sell.css">
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
                    <a href="sell" class="nav-btn active">
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
            <div class="sell-container">
                <div class="sell-header">
                    <h1>상품 판매</h1>
                    <p>경매할 상품의 정보를 입력해주세요</p>
                </div>
                
                <form class="sell-form" id="sellForm">
                    <div class="form-section">
                        <h3>기본 정보</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="itemName">상품명 *</label>
                                <input type="text" id="itemName" name="name" required placeholder="상품명을 입력하세요">
                            </div>
                            <br>
                            <!-- 대분류 -->
                            <div class="form-group">
                                <label for="mainCategory">대분류 *</label>
                                <select id="mainCategory" name="mainCategory" required>
                                    <option value="">대분류를 선택하세요</option>
                                    <!-- JavaScript로 동적 삽입 -->
                                </select>
                            </div>

                            <!-- 중분류 -->
                            <div class="form-group">
                                <label for="subCategory">중분류 *</label>
                                <select id="subCategory" name="category" required>
                                    <option value="">중분류를 선택하세요</option>
                                    <!-- JavaScript로 동적 삽입 -->
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="itemDescription">상품 설명 *</label>
                            <textarea id="itemDescription" name="description" rows="4" required placeholder="상품에 대한 자세한 설명을 입력하세요"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="itemTags">태그</label>
                            <input type="text" id="itemTags" name="tags" placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 한정판, 레트로, 게임기)">
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>이미지</h3>
                        <div class="image-upload">
                            <div class="upload-area" id="uploadArea">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7,10 12,15 17,10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
                                <input type="file" id="imageUpload" accept="image/*" multiple style="display: none;">
                            </div>
                            <div class="image-preview" id="imagePreview">
                                <!-- Uploaded images will be shown here -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>경매 설정</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="startPrice">시작가 *</label>
                                <input type="number" id="startPrice" name="startPrice" min="1000" step="1000" required placeholder="시작가를 입력하세요">
                            </div>
                            <div class="form-group">
                                <label for="bidIncrement">입찰 단위 *</label>
                                <input type="number" id="bidIncrement" name="bidIncrement" min="1000" step="1000" required placeholder="입찰 단위를 입력하세요">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="endDate">경매 종료일 *</label>
                                <input type="datetime-local" id="endDate" name="endDate" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>배송 정보</h3>
                        <div class="form-group">
                            <label for="shippingMethod">배송 방법</label>
                            <select id="shippingMethod" name="shippingMethod">
                                <option value="seller">판매자 부담</option>
                                <option value="buyer">구매자 부담</option>
                                <option value="meet">직거래</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="shippingCost">배송비 (원)</label>
                            <input type="number" id="shippingCost" name="shippingCost" min="0" placeholder="배송비를 입력하세요">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-ghost" onclick="sellManager.previewItem()">미리보기</button>
                        <button type="submit" class="btn btn-primary">상품 등록</button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <!-- Preview Modal -->
    <div class="modal" id="previewModal">
        <div class="modal-content preview-modal">
            <div class="modal-header">
                <h3>상품 미리보기</h3>
                <button class="close-btn" onclick="sellManager.closePreviewModal()">&times;</button>
            </div>
            <div class="preview-content" id="previewContent">
                <!-- Preview content will be loaded here -->
            </div>
        </div>
    </div>

    <script src="../js/mock-data.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/sell.js"></script>
</body>
</html> 