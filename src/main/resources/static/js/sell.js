class SellManager {
    constructor() {
        this.uploadedImages = [];
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.setDefaultDateTime();
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
        this.setupCategorySelectors();
    }

    // Setup category selectors
    setupCategorySelectors() {
        const mainCategorySelect = document.getElementById('mainCategory');
        const subCategorySelect = document.getElementById('subCategory');

        // Populate main categories
        const mainCategories = CATEGORY_LIST.filter(c => c.parentId === null);
        mainCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            mainCategorySelect.appendChild(option);
        });

        // Handle main category change
        mainCategorySelect.addEventListener('change', () => {
            const selectedMainCategoryId = parseInt(mainCategorySelect.value);
            
            // Clear sub-category options
            subCategorySelect.innerHTML = '<option value="">중분류를 선택하세요</option>';

            if (selectedMainCategoryId) {
                const subCategories = CATEGORY_LIST.filter(c => c.parentId === selectedMainCategoryId);
                subCategories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id; // Use ID for the value
                    option.textContent = category.name;
                    subCategorySelect.appendChild(option);
                });
                subCategorySelect.disabled = false;
            } else {
                subCategorySelect.disabled = true;
            }
        });

        // Initial state
        subCategorySelect.disabled = true;
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
    
    // Handle file selection
    handleFileSelection(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedImages.push({
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        name: file.name
                    });
                    this.updateImagePreview();
                };
                reader.readAsDataURL(file);
            }
        });
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
        const endTime = document.getElementById('endTime');
        
        if (endDate) {
            const dateString = tomorrow.toISOString().slice(0, 16);
            endDate.value = dateString;
        }
        
        if (endTime) {
            endTime.value = '23:59';
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

        const categoryName = CATEGORY_LIST.find(c => c.id === parseInt(data.category))?.name || data.category;
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
                            <span class="value">${categoryName}</span>
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
    async handleFormSubmission(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = this.getFormData(formData);

        if (!this.validatePreviewData(data)) {
            return;
        }

        if (this.uploadedImages.length === 0) {
            alert('최소 1개의 이미지를 업로드해주세요.');
            return;
        }

        try {
            // 1. Upload image
            const imageFormData = new FormData();
            // Convert data URL to blob for upload
            const imageFile = await (await fetch(this.uploadedImages[0].src)).blob();
            imageFormData.append('image', imageFile, this.uploadedImages[0].name);

            const uploadResponse = await fetch("/api/products/upload-image", {
                method: "POST",
                body: imageFormData
            });

            if (!uploadResponse.ok) {
                throw new Error('이미지 업로드에 실패했습니다.');
            }

            const imagePath = await uploadResponse.text();

            // 2. Create auction item with the returned image path
            const newItem = this.createAuctionItem(data, imagePath);

            // 3. Register the product
            await registerProduct(newItem);

        } catch (error) {
            console.error("상품 등록 중 오류 발생:", error);
            alert(error.message || "상품 등록에 실패했습니다.");
        }
    }

    // Create auction item
    createAuctionItem(data, imagePath) {
        const endDate = new Date(data.endDate);
        const user = authManager.getUser();

        return {
            productName: data.name,
            description: data.description,
            imagePath: imagePath, // Set the image path from the server response
            categoryId: data.category,
            auctionStartDate: new Date().toISOString(),
            auctionEndDate: endDate.toISOString(),
            startingPrice: parseInt(data.startPrice),
            bidUnit: parseInt(data.bidIncrement),
            registerUserId: user ? user.userId : null,
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
}

// Initialize sell manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sellManager = new SellManager();
});

async function registerProduct(product) {
    const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    if (response.ok) {
        alert("상품이 등록되었습니다");
        window.location.href = '../index';
    } else {
        alert("상품 등록에 실패했습니다.");
    }
}