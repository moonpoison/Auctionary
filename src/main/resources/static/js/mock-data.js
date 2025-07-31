// Mock Data
const now = new Date();

const MOCK_USERS = [
  {
    id: "user-me",
    name: "AuctionHero",
    email: "hero@auctionary.com",
    phone: "010-1234-5678",
    points: 8400000,
    avatar: "images/placeholder.svg",
    wishlist: ["item-789"],
    reviews: [
      {
        reviewerId: "user-4",
        reviewerName: "Collector",
        rating: 5,
        comment: "포장이 꼼꼼하고 상품 상태가 최상입니다! 믿고 거래할 수 있는 판매자입니다.",
        itemTitle: "레트로 게임기 '슈퍼 패미컴' 신품급",
        createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "user-2",
    name: "V-Tech",
    email: "vtech@auctionary.com",
    phone: "010-8765-4321",
    points: 5000000,
    wishlist: [],
    reviews: [
      {
        reviewerId: "user-3",
        reviewerName: "TimeMaster",
        rating: 5,
        comment: "배송이 정말 빠르네요. 제품도 설명과 똑같습니다.",
        itemTitle: "고성능 게이밍 마우스",
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        reviewerId: "user-4",
        reviewerName: "Collector",
        rating: 4,
        comment: "약간의 스크래치가 있었지만 사용에는 문제 없습니다.",
        itemTitle: "기계식 키보드",
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "user-3",
    name: "TimeMaster",
    email: "timemaster@auctionary.com",
    phone: "010-1111-2222",
    points: 20000000,
    wishlist: ["item-123"],
    reviews: [],
  },
  {
    id: "user-4",
    name: "Collector",
    email: "collector@auctionary.com",
    phone: "010-3333-4444",
    points: 8000000,
    wishlist: ["item-123", "item-456"],
    reviews: [],
  },
];

const MOCK_AUCTION_ITEMS = [
  {
    id: "item-123",
    name: "한정판 '사이버펑크 2077' 커스텀 그래픽카드",
    description:
      "최고 사양으로 커스텀된 한정판 그래픽카드입니다. RGB 조명이 화려하며, 원본 박스를 포함한 풀세트입니다.",
    images: ["images/placeholder.svg"],
    tags: ["그래픽카드", "한정판", "PC부품"],
    sellerId: "user-2",
    seller: { name: "V-Tech", avatar: "images/placeholder.svg", rating: 4.5, reviews: 2 },
    category: "디지털 기기",
    endDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    startPrice: 1500000,
    buyNowPrice: 3500000,
    bidIncrement: 50000,
    bids: [
      { userId: "user-me", bidder: "AuctionHero", amount: 1600000, time: new Date(now.getTime() - 3 * 60 * 60 * 1000) },
      { userId: "user-3", bidder: "TimeMaster", amount: 1550000, time: new Date(now.getTime() - 5 * 60 * 60 * 1000) },
    ],
    status: "active",
    wishlistedCount: 23,
  },
  {
    id: "item-456",
    name: "레트로 게임기 '슈퍼 패미컴' 신품급",
    description: "박스만 개봉한 신품급 슈퍼 패미컴입니다. 레트로 게임을 좋아하시는 분께 최고의 선물입니다.",
    images: ["images/placeholder.svg"],
    tags: ["레트로", "게임기", "닌텐도"],
    sellerId: "user-me",
    seller: { name: "AuctionHero", avatar: "images/placeholder.svg", rating: 5.0, reviews: 1 },
    category: "한정판 굿즈",
    endDate: new Date(now.getTime() - 1 * 60 * 60 * 1000), // Ended 1 hour ago
    startPrice: 200000,
    bidIncrement: 10000,
    bids: [
      { userId: "user-4", bidder: "Collector", amount: 250000, time: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
    ],
    status: "sold",
    winnerId: "user-4",
    wishlistedCount: 45,
  },
  {
    id: "item-789",
    name: "친필 사인 '해리포터' 초판본 전집",
    description: "J.K. 롤링의 친필 사인이 포함된 초판본 전집입니다. 소장 가치가 매우 높습니다.",
    images: ["images/placeholder.svg"],
    tags: ["해리포터", "초판본", "사인본"],
    sellerId: "user-me",
    seller: { name: "AuctionHero", avatar: "images/placeholder.svg", rating: 5.0, reviews: 1 },
    category: "책",
    endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    startPrice: 5000000,
    buyNowPrice: 10000000,
    bidIncrement: 200000,
    bids: [],
    status: "active",
    wishlistedCount: 12,
  },
  {
    id: "item-101",
    name: "빈티지 '롤렉스 서브마리너' 시계",
    description: "1980년대 빈티지 롤렉스 서브마리너입니다. 전문가의 감정을 받았으며, 상태 최상입니다.",
    images: ["images/placeholder.svg"],
    tags: ["롤렉스", "시계", "명품"],
    sellerId: "user-3",
    seller: { name: "TimeMaster", avatar: "images/placeholder.svg", rating: 0, reviews: 0 },
    category: "명품",
    endDate: new Date(now.getTime() - 10 * 60 * 1000), // Ended 10 mins ago
    startPrice: 8000000,
    bidIncrement: 100000,
    bids: [
      {
        userId: "user-me",
        bidder: "AuctionHero",
        amount: 8600000,
        time: new Date(now.getTime() - 15 * 60 * 60 * 1000),
      },
      { userId: "user-4", bidder: "Collector", amount: 8500000, time: new Date(now.getTime() - 20 * 60 * 60 * 1000) },
    ],
    status: "sold",
    winnerId: "user-me",
    wishlistedCount: 88,
  },
];

const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    itemId: "item-101",
    itemName: "빈티지 '롤렉스 서브마리너' 시계",
    itemImage: "images/placeholder.svg",
    participants: [
      { id: "user-me", name: "AuctionHero" },
      { id: "user-3", name: "TimeMaster" },
    ],
    messages: [
      {
        senderId: "user-me",
        text: "안녕하세요, 낙찰자입니다. 배송은 언제쯤 시작될까요?",
        timestamp: new Date(now.getTime() - 9 * 60 * 1000),
      },
      {
        senderId: "user-3",
        text: "네, 안녕하세요! 오늘 바로 포장해서 내일 오전에 발송해 드리겠습니다.",
        timestamp: new Date(now.getTime() - 8 * 60 * 1000),
      },
    ],
  },
  {
    id: "conv-2",
    itemId: "item-456",
    itemName: "레트로 게임기 '슈퍼 패미컴' 신품급",
    itemImage: "images/placeholder.svg",
    participants: [
      { id: "user-me", name: "AuctionHero" },
      { id: "user-4", name: "Collector" },
    ],
    messages: [
      {
        senderId: "user-4",
        text: "상품 잘 받았습니다. 감사합니다!",
        timestamp: new Date(now.getTime() - 30 * 60 * 1000),
      },
    ],
  },
]; 