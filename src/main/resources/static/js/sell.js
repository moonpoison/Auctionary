// Sell Page Logic
const CATEGORY_LIST = [
    { id: 1, name: "전자제품", parentId: null },
    { id: 2, name: "패션의류", parentId: null },
    { id: 3, name: "도서/음반", parentId: null },
    { id: 4, name: "가구/인테리어", parentId: null },
    { id: 5, name: "노트북/PC", parentId: 1 },
    { id: 6, name: "휴대폰", parentId: 1 },
    { id: 7, name: "남성 의류", parentId: 2 },
    { id: 8, name: "여성 의류", parentId: 2 },
    { id: 9, name: "소설", parentId: 3 },
    { id: 10, name: "로맨스", parentId: 3 },
    { id: 11, name: "침대", parentId: 4 },
    { id: 12, name: "소파", parentId: 4 }
];

class SellManager {
    constructor() {
        this.uploadedImages = [];
        this.init();
    }
    
    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.setDefaultDateTime();
        this.initCategoryDropdowns(); // 추가
    }
    
    // Check if user is logged in
    checkAuth() {
        if (!authManager.isLoggedIn()) {
            window.location.href = 'login';
            return;
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Form submission
        const sellForm = document.getElementById('sellForm');
        if (sellForm) {
            sellForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e);
            });
        }
        
        // Image upload
        this.setupImageUpload();
    }
    
    // Setup image upload functionality
    setupImageUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const imageUpload = document.getElementById('imageUpload');
        
        if (uploadArea && imageUpload) {
            // Click to upload
            uploadArea.addEventListener('click', () => {
                imageUpload.click();
            });
            
            // File selection
            imageUpload.addEventListener('change', (e) => {
                this.handleFileSelection(e.target.files);
            });
            
            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                this.handleFileSelection(e.dataTransfer.files);
            });
        }
    }

    // 이미지 파일을 서버에 업로드하고 저장된 파일명을 반환
    async uploadImageToServer(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
                credentials: 'include' // ✅ 꼭 필요!
            });

            if (response.ok) {
                const filename = await response.text();
                console.log('✅ 이미지 서버 업로드 성공:', filename);
                return filename;
            } else {
                const errorText = await response.text();
                console.error('❌ 이미지 업로드 실패:', errorText);
                alert('이미지 업로드 실패: ' + errorText);
                return null;
            }
        } catch (error) {
            console.error('❌ 이미지 업로드 중 오류:', error);
            alert('네트워크 오류로 이미지 업로드에 실패했습니다.');
            return null;
        }
    }


    // Handle file selection
    // 파일 선택 시 이미지 미리보기 및 서버 업로드
    async handleFileSelection(files) {
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = async (e) => {
                    // 이미지 서버 업로드
                    const uploadedFilename = await this.uploadImageToServer(file);
                    if (!uploadedFilename) return;

                    // 업로드된 서버 이미지 정보를 저장
                    this.uploadedImages.push({
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        name: uploadedFilename  // 서버 파일명 저장
                    });

                    this.updateImagePreview();
                };

                reader.readAsDataURL(file);
            }
        }
    }


    // Update image preview
    updateImagePreview() {
        const imagePreview = document.getElementById('imagePreview');
        if (!imagePreview) return;
        
        if (this.uploadedImages.length === 0) {
            imagePreview.innerHTML = '';
            return;
        }
        
        imagePreview.innerHTML = this.uploadedImages.map(image => `
            <div class="preview-image">
                <img src="${image.src}" alt="${image.name}">
                <button class="remove-btn" onclick="sellManager.removeImage('${image.id}')">&times;</button>
            </div>
        `).join('');
    }
    
    // Remove image
    removeImage(imageId) {
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
        this.updateImagePreview();
    }
    
    // Set default date and time
    setDefaultDateTime() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        const endDate = document.getElementById('endDate');
        
        if (endDate) {
            const dateString = tomorrow.toISOString().slice(0, 16);
            endDate.value = dateString;
        }
    }
    
    // Preview item
    previewItem() {
        const formData = new FormData(document.getElementById('sellForm'));
        const previewData = this.getFormData(formData);
        
        if (!this.validatePreviewData(previewData)) {
            return;
        }
        
        this.showPreviewModal(previewData);
    }
    
    // Get form data
    getFormData(formData) {
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }
    
    // Validate preview data
    validatePreviewData(data) {
        if (!data.name || !data.category || !data.description || !data.startPrice || !data.bidIncrement || !data.endDate) {
            alert('필수 항목을 모두 입력해주세요.');
            return false;
        }
        
        if (parseInt(data.startPrice) < 1000) {
            alert('시작가는 최소 1,000원 이상이어야 합니다.');
            return false;
        }
        
        if (parseInt(data.bidIncrement) < 1000) {
            alert('입찰 단위는 최소 1,000원 이상이어야 합니다.');
            return false;
        }
        
        const endDate = new Date(data.endDate);
        const now = new Date();
        if (endDate <= now) {
            alert('경매 종료일은 현재 시간보다 이후여야 합니다.');
            return false;
        }
        
        return true;
    }
    
    // Show preview modal
    showPreviewModal(data) {
        const modal = document.getElementById('previewModal');
        const previewContent = document.getElementById('previewContent');
        
        if (!modal || !previewContent) return;
        
        const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        const endDate = new Date(data.endDate);
        
        previewContent.innerHTML = `
            <div class="preview-item">
                <div class="preview-item-image">
                    ${this.uploadedImages.length > 0 ? 
                        `<img src="${this.uploadedImages[0].src}" alt="${data.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                        '이미지 없음'
                    }
                </div>
                <div class="preview-item-content">
                    <div class="preview-item-title">${data.name}</div>
                    <div class="preview-item-description">${data.description}</div>
                    <div class="preview-item-details">
                        <div class="preview-item-detail">
                            <span class="label">카테고리</span>
                            <span class="value">${data.category}</span>
                        </div>
                        <div class="preview-item-detail">
                            <span class="label">시작가</span>
                            <span class="value">${formatPrice(parseInt(data.startPrice))}</span>
                        </div>
                        <div class="preview-item-detail">
                            <span class="label">입찰 단위</span>
                            <span class="value">${formatPrice(parseInt(data.bidIncrement))}</span>
                        </div>
                        ${data.buyNowPrice ? `
                        <div class="preview-item-detail">
                            <span class="label">즉시구매가</span>
                            <span class="value">${formatPrice(parseInt(data.buyNowPrice))}</span>
                        </div>
                        ` : ''}
                        <div class="preview-item-detail">
                            <span class="label">경매 종료</span>
                            <span class="value">${endDate.toLocaleString('ko-KR')}</span>
                        </div>
                        <div class="preview-item-detail">
                            <span class="label">배송 방법</span>
                            <span class="value">${this.getShippingMethodLabel(data.shippingMethod)}</span>
                        </div>
                        ${data.shippingCost ? `
                        <div class="preview-item-detail">
                            <span class="label">배송비</span>
                            <span class="value">${formatPrice(parseInt(data.shippingCost))}</span>
                        </div>
                        ` : ''}
                        ${tags.length > 0 ? `
                        <div class="preview-item-detail">
                            <span class="label">태그</span>
                            <span class="value">${tags.join(', ')}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
    }
    
    // Close preview modal
    closePreviewModal() {
        const modal = document.getElementById('previewModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
    
    // Handle form submission
    handleFormSubmission(e) {
        const formData = new FormData(e.target);
        const data = this.getFormData(formData);

        if (!this.validatePreviewData(data)) {
            return;
        }

        if (this.uploadedImages.length === 0) {
            alert('최소 1개의 이미지를 업로드해주세요.');
            return;
        }

        const newItem = this.createAuctionItem(data);

        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('상품이 성공적으로 등록되었습니다!');
            window.location.href = '../index';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('상품 등록에 실패했습니다.');
        });
    }

    // Create auction item
    createAuctionItem(data) {
        const user = authManager.getUser();
        const auctionEndDate = data.endDate ? new Date(data.endDate) : null;

        return {
            userId: user.id,
            productName: data.name,
            description: data.description,
            imagePath: this.uploadedImages.length > 0 ? this.uploadedImages[0].name : null,
            categoryId: parseInt(data.category),
            auctionStartDate: new Date(),
            auctionEndDate: auctionEndDate,
            startingPrice: parseInt(data.startPrice),
            bidUnit: parseInt(data.bidIncrement),
            transactionStatus: 'AUCTIONING'
        };
    }
    
    // Get shipping method label
    getShippingMethodLabel(method) {
        switch (method) {
            case 'seller':
                return '판매자 부담';
            case 'buyer':
                return '구매자 부담';
            case 'meet':
                return '직거래';
            default:
                return '미정';
        }
    }

    initCategoryDropdowns() {
        const mainSelect = document.getElementById('mainCategory');
        const subSelect = document.getElementById('subCategory');

        // 대분류만 먼저 필터링
        const mainCategories = CATEGORY_LIST.filter(cat => cat.parentId === null);
        mainCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            mainSelect.appendChild(option);
        });

        // 대분류 선택 시 중분류 동적 변경
        mainSelect.addEventListener('change', () => {
            const selectedMainId = parseInt(mainSelect.value);
            subSelect.innerHTML = `<option value="">중분류를 선택하세요</option>`; // 초기화

            const subCategories = CATEGORY_LIST.filter(cat => cat.parentId === selectedMainId);
            subCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                subSelect.appendChild(option);
            });
        });
    }
}

// Initialize sell manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sellManager = new SellManager();
}); 