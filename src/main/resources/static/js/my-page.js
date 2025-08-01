/**
 * my-page.js  (최신 통합본)
 *  - 탭 UI
 *  - 개요 : 최근 활동 + 포인트 내역(페이지네이션)
 *  - 입찰 / 판매 / 구매 / 찜 / 리뷰
 *  - fetch URL : /api/my-page/*
 */

document.addEventListener('DOMContentLoaded', () => new MyPage());

/* ───────────── 전역 util ───────────── */
const $ = (sel) => document.querySelector(sel);
function formatPrice(n) { return Number(n).toLocaleString('ko-KR'); }

/* ───────────── MyPage 클래스 ───────────── */
class MyPage {
    constructor() {
        this.currentTab = 'overview';
        this.pointsPage = 0;
        this.init();
    }

    /* ---------- 초기화 ---------- */
    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadUserProfile();
        this.loadTabContent();
    }

    checkAuth() {
        if (!authManager.isLoggedIn()) window.location.href = 'login';
    }
    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn =>
            btn.addEventListener('click', e =>
                this.switchTab(e.target.dataset.tab)));
    }
    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-btn')
            .forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        document.querySelectorAll('.tab-pane')
            .forEach(p => p.classList.toggle('active', p.id === tab));
        this.loadTabContent();
    }
    loadUserProfile() {
        const u = authManager.getUser?.();
        if (u) {
            $('#userName').textContent  = u.name;
            $('#userEmail').textContent = u.email;
        }

        fetch('/api/my-page/point-history?page=0&size=1')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(d => {
                const latest = d.content?.[0]?.finalPoint ?? u?.points ?? 0;
                $('#userPoints').textContent = formatPrice(latest);

                /* ★ 헤더 숫자 동기화 : "1,000 P" 패턴을 가진 a/span 자동 탐색 */
                const newText = formatPrice(latest) + ' P';
                // util‑links 영역이나 nav 안의 모든 a/span을 대상으로
                document.querySelectorAll('header a, header span').forEach(el => {
                    const txt = el.textContent.trim();
                    if (/^[\d,]+\s?P$/.test(txt)) {
                        // 숫자+P 형태인 첫 번째 요소를 찾아 교체
                        el.textContent = newText;
                    }
                });
            })
            .catch(() => console.warn('point fetch fail'));

        fetch('/api/my-page/wishlist')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(rows => $('#wishlistCount').textContent = rows.length)
            .catch(() => console.warn('wishlist fetch fail'));
    }

    /* ---------- 탭 로딩 ---------- */
    loadTabContent() {
        switch (this.currentTab) {
            case 'overview':  this.loadOverview();  break;
            case 'bidding':   this.loadBidding();   break;
            case 'selling':   this.loadSelling();   break;
            case 'purchased': this.loadPurchased(); break;
            case 'wishlist':  this.loadWishlist();  break;
            case 'reviews':   this.loadReviews();   break;
        }
    }

    /* ====== 개요 ====== */
    loadOverview() {
        this.loadRecentActivity();
        this.loadPointsHistory(0);
    }

    /* 최근 활동 */
    loadRecentActivity() {
        const box = $('#recentActivity');
        if (!box) return;
        fetch('/api/my-page/recent-activities')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(items => {
                box.innerHTML = items.length
                    ? items.map(it => {
                        const sign   = it.pointChange > 0 ? '+' : '';
                        const amount = sign + formatPrice(it.pointChange);
                        const time   = this.formatTime(new Date(it.changeDate));
                        return `
                          <div class="activity-item">
                              <div class="activity-icon">💰</div>
                              <div class="activity-content">
                                  <div class="activity-title">${it.note}</div>
                                  <div class="activity-time">${amount} • ${time}</div>
                              </div>
                          </div>`;
                    }).join('')
                    : '<p style="text-align:center;color:#6b7280;">최근 활동이 없습니다.</p>';
            })
            .catch(() => box.innerHTML =
                '<p class="error">데이터를 불러오지 못했습니다.</p>');
    }

    /* 포인트 내역 + 페이지네이션 */
    loadPointsHistory(page = 0) {
        this.pointsPage = page;
        const list  = $('#pointsHistory');
        const pager = $('#pointsPager');
        if (!list) return;

        fetch(`/api/my-page/point-history?page=${page}&size=10`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(d => {
                list.innerHTML = d.content.length
                    ? d.content.map(it => {
                        const sign = it.pointChange > 0 ? '+' : '';
                        return `
                          <div class="points-item">
                              <div class="points-info">
                                  <div class="points-description">${it.note}</div>
                                  <div class="points-date">${this.formatTime(new Date(it.changeDate))}</div>
                              </div>
                              <div class="points-amount ${it.pointChange>0?'positive':'negative'}">
                                  ${sign}${formatPrice(it.pointChange)} P
                              </div>
                          </div>`;
                    }).join('')
                    : '<p style="text-align:center;color:#6b7280;">포인트 내역이 없습니다.</p>';

                if (pager) {
                    pager.innerHTML = this.renderPager(d.page, d.totalPages);
                    pager.querySelectorAll('[data-page]').forEach(btn =>
                        btn.addEventListener('click', () =>
                            this.loadPointsHistory(Number(btn.dataset.page))));
                }
            })
            .catch(() => {
                list.innerHTML = '<p class="error">불러오기 실패</p>';
                if (pager) pager.innerHTML = '';
            });
    }
    renderPager(cur, total) {
        if (total <= 1) return '';
        const prev = cur - 1, next = cur + 1;
        return `
          <button ${prev<0 ? 'disabled':''} data-page="${prev}">이전</button>
          <span>${cur+1} / ${total}</span>
          <button ${next>=total?'disabled':''} data-page="${next}">다음</button>`;
    }

    /* ====== 입찰 내역 ====== */
    loadBidding() {
        const list = $('#biddingList');
        if (!list) return;
        fetch('/api/my-page/bid-history')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(rows => {
                if (rows.length === 0) {
                    list.innerHTML = '<p style="text-align:center;color:#6b7280;">입찰 내역이 없습니다.</p>';
                    return;
                }
                list.innerHTML = rows.map(it => {
                    const price = formatPrice(it.highestBid);
                    const cls   = it.transactionStatus === 'active'
                        ? 'active'
                        : (it.isWinner ? 'sold' : 'ended');
                    const txt   = it.transactionStatus === 'active'
                        ? '진행중'
                        : (it.isWinner ? '낙찰' : '낙찰실패');
                    return `
                      <div class="list-item">
                          <img src="${it.imagePath}" alt="${it.productName}" class="list-item-image">
                          <div class="list-item-content">
                              <div class="list-item-title">${it.productName}</div>
                              <div class="list-item-price">${price}</div>
                              <span class="list-item-status ${cls}">${txt}</span>
                          </div>
                      </div>`;
                }).join('');
            })
            .catch(() => list.innerHTML =
                '<p class="error">데이터를 불러오지 못했습니다.</p>');
    }

    /* ====== 판매 내역 ====== */
    loadSelling() {
        const list = $('#sellingList');
        if (!list) return;
        fetch('/api/my-page/selling-history')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(rows => {
                if (rows.length === 0) {
                    list.innerHTML = '<p style="text-align:center;color:#6b7280;">판매 내역이 없습니다.</p>';
                    return;
                }
                list.innerHTML = rows.map(it => {
                    const price = formatPrice(it.highestPrice);
                    console.log(it.productName+it.transactionStatus);
                    const cls   = it.transactionStatus === 'AUCTIONING'
                        ? 'active'
                        : (it.transactionStatus === 'SOLD' ? 'sold' : 'ended');
                    const txt   = it.transactionStatus === 'AUCTIONING'
                        ? '진행중'
                        : (it.transactionStatus === 'SOLD' ? '판매완료' : '종료');
                    return `
                      <div class="list-item">
                          <img src="${it.imagePath}" alt="${it.productName}" class="list-item-image">
                          <div class="list-item-content">
                              <div class="list-item-title">${it.productName}</div>
                              <div class="list-item-price">${price}</div>
                              <span class="list-item-status ${cls}">${txt}</span>
                          </div>
                      </div>`;
                }).join('');
            })
            .catch(() => list.innerHTML =
                '<p class="error">데이터를 불러오지 못했습니다.</p>');
    }

    /* ====== 구매 / 찜 / 리뷰 (기존 로직 유지) ====== */
    loadPurchased() {
        const list = document.getElementById('purchasedList');
        if (!list) return;

        fetch('/api/my-page/purchased-history')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(rows => {
                if (!rows.length) {
                    list.innerHTML =
                        '<p style="text-align:center;color:#6b7280;">구매 내역이 없습니다.</p>';
                    return;
                }

                list.innerHTML = rows.map(it => `
              <div class="list-item">
                  <img src="${it.imagePath}" alt="${it.productName}" class="list-item-image">
                  <div class="list-item-content">
                      <div class="list-item-title">${it.productName}</div>
                      <div class="list-item-price">${formatPrice(it.finalPrice)}</div>
                      <span class="list-item-status sold">구매완료</span>
                  </div>
              </div>
            `).join('');
            })
            .catch(() => {
                list.innerHTML = '<p class="error">데이터를 불러오지 못했습니다.</p>';
            });
    }
    /* ====== 찜한 상품 ====== */
    /* ====== 찜한 상품 ====== */
    loadWishlist() {
        const list = document.getElementById('wishlistList') || document.getElementById('wishlistGrid');
        if (!list) return;

        fetch('/api/my-page/wishlist')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(rows => {
                if (!rows.length) {
                    list.innerHTML =
                        '<p style="text-align:center;color:#6b7280;">찜한 상품이 없습니다.</p>';
                    return;
                }

                list.innerHTML = rows.map(it => {
                    const active = it.transactionStatus === 'AUCTIONING';
                    const cls = active ? 'active' : 'ended';
                    const txt = active ? '경매중' : '종료';

                    return `
                  <div class="list-item" style="display:flex;width:100%;align-items:center;">
                      <img src="${it.imagePath}"
                           alt="${it.productName}"
                           class="list-item-image"
                           onerror="this.onerror=null;this.src='/img/noimage.png';">
                      <div class="list-item-content">
                          <div class="list-item-title">${it.productName}</div>
                          <div class="list-item-price">${formatPrice(it.startingPrice)}</div>
                          <span class="list-item-status ${cls}">${txt}</span>
                      </div>
                  </div>`;
                }).join('');
            })
            .catch(() => {
                list.innerHTML = '<p class="error">데이터를 불러오지 못했습니다.</p>';
            });
    }
    /* ====== 리뷰 ====== */
    loadReviews() {
        const list = document.getElementById('reviewsList');
        if (!list) return;

        fetch('/api/my-page/reviews')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(rows => {
                if (!rows.length) {
                    list.innerHTML =
                        '<p style="text-align:center;color:#6b7280;">받은 리뷰가 없습니다.</p>';
                    return;
                }

                list.innerHTML = rows.map(it => {
                    const stars = '★'.repeat(it.rating) + '☆'.repeat(5 - it.rating);
                    return `
                  <div class="review-item">
                      <div class="review-header">
                          <div class="reviewer-name">${it.reviewerName} 님</div>
                          <div class="review-rating">${stars}</div>
                      </div>
                      <!-- 상품명 요소를 제거했습니다 -->
                      <div class="review-comment">${it.content}</div>
                      <div class="review-date">${this.formatTime(new Date(it.reviewDate))}</div>
                  </div>`;
                }).join('');
            })
            .catch(() => {
                list.innerHTML = '<p class="error">데이터를 불러오지 못했습니다.</p>';
            });
    }

    /* ---------- 공통 시간 포맷 ---------- */
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const m = 60*1e3, h = 60*m, d = 24*h;
        if (diff < h)  return Math.floor(diff/m)+'분 전';
        if (diff < d)  return Math.floor(diff/h)+'시간 전';
        if (diff < 7*d) return Math.floor(diff/d)+'일 전';
        return date.toLocaleDateString('ko-KR');
    }
}
