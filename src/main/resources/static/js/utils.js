// Utility Functions

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
    { id: 10, name: "침대/소파", parentId: 4 }
];

function getCategoryNameById(categoryId) {
    const category = CATEGORY_LIST.find(cat => cat.id === parseInt(categoryId, 10));
    return category ? category.name : '기타';
}

// Format time remaining for auction
function formatTimeRemaining(auctionEndDateStr) {
    const endDate = new Date(auctionEndDateStr);
    const now = new Date();
    const timeLeft = endDate.getTime() - now.getTime();
    
    if (timeLeft <= 0) {
        return { isOver: true, text: "경매 종료" };
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    if (days > 0) {
        return { isOver: false, text: `${days}일 남음`, days, hours, minutes, seconds };
    } else if (hours > 0) {
        return { isOver: false, text: `${hours}시간 남음`, days, hours, minutes, seconds };
    } else {
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');
        return { isOver: false, text: `${minutesStr}:${secondsStr}`, days, hours, minutes, seconds };
    }
}

// Format price with Korean currency
function formatPrice(price) {
    return price.toLocaleString() + '원';
}

// Get current price of auction item
function getCurrentPrice(item) {
    return Math.max(item.startingPrice, item.highestBid || 0);
}

// Check if user has wishlisted an item (will be removed or adapted later if wishlist is implemented differently)
function isWishlisted(user, itemId) {
    return user && user.wishlist && user.wishlist.includes(itemId);
}

// Toggle wishlist for an item (will be removed or adapted later)
function toggleWishlist(user, itemId) {
    if (!user) {
        alert("로그인이 필요합니다.");
        return false;
    }
    
    if (!user.wishlist) {
        user.wishlist = [];
    }
    
    const index = user.wishlist.indexOf(itemId);
    if (index > -1) {
        user.wishlist.splice(index, 1);
        return false; // removed from wishlist
    } else {
        user.wishlist.push(itemId);
        return true; // added to wishlist
    }
}

// Sort auction items
function sortAuctionItems(items, sortType) {
    // Filter by transactionStatus. Assuming "selling" is the active status.
    // const activeItems = items.filter(item => item.transactionStatus === "selling"); // Temporarily removed for debugging
    const activeItems = items; // Use all items for now
    
    switch (sortType) {
        case "closing":
            // Sort by auctionEndDate
            return [...activeItems].sort((a, b) => new Date(a.auctionEndDate).getTime() - new Date(b.auctionEndDate).getTime());
        // "popular" sort removed as wishlistedCount is not in Product DTO
        case "newest":
            // Sort by auctionStartDate (assuming it represents creation date)
            return [...activeItems].sort((a, b) => new Date(b.auctionStartDate).getTime() - new Date(a.auctionStartDate).getTime());
        case "highPrice":
            // Sort by startingPrice
            return [...activeItems].sort((a, b) => b.startingPrice - a.startingPrice);
        case "lowPrice":
            // Sort by startingPrice
            return [...activeItems].sort((a, b) => a.startingPrice - b.startingPrice);
        default:
            return activeItems;
    }
}

// Create countdown timer (will be updated in auction-card.js)
function createCountdownTimer(element, endDate, onUpdate) {
    function updateTimer() {
        const timeLeft = formatTimeRemaining(endDate);
        element.textContent = timeLeft.text;
        
        if (timeLeft.isOver) {
            element.classList.add('urgent');
        } else if (timeLeft.days === 0 && timeLeft.hours < 1) {
            element.classList.add('urgent');
        } else {
            element.classList.remove('urgent');
        }
        
        if (onUpdate) {
            onUpdate(timeLeft);
        }
        
        if (!timeLeft.isOver) {
            setTimeout(updateTimer, 1000);
        }
    }
    
    updateTimer();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage utilities
const Storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
}; 