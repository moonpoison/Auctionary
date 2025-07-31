package edu.sm.service;

import edu.sm.dto.Point_History;
import edu.sm.repository.PointHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

/**
 * 마이페이지용 비즈니스 로직.
 *  └ 최근 활동 / 포인트 내역
 */
@Service
@RequiredArgsConstructor
public class MyPageService {

    private final PointHistoryRepository pointHistoryRepository;

    /* ────────────────────────────── 최근 활동 ────────────────────────────── */

    /** 최근 활동 5건 */
    public List<Point_History> getRecentActivities(String userId) throws Exception {
        return pointHistoryRepository.selectAll(userId).stream()
                .sorted(Comparator.comparing(Point_History::getChangeDate).reversed())
                .limit(5)
                .toList();
    }

    /* ────────────────────────────── 포인트 내역 ───────────────────────────── */

    /**
     * 포인트 내역 페이지네이션
     *
     * @param userId 로그인 사용자
     * @param page   0 base 페이지 번호
     * @param size   페이지 사이즈
     */
    public PagingResponse<Point_History> getPointHistory(
            String userId, int page, int size) throws Exception {

        List<Point_History> all = pointHistoryRepository.selectAll(userId).stream()
                .sorted(Comparator.comparing(Point_History::getChangeDate).reversed())
                .toList();

        int totalElements = all.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int from = Math.min(page * size, totalElements);
        int to = Math.min(from + size, totalElements);

        return new PagingResponse<>(
                all.subList(from, to),
                page,
                size,
                totalPages,
                totalElements
        );
    }



    /* ────────────────────────────── 내부 DTO ────────────────────────────── */

    /** 간단한 페이지 응답 Wrapper (Point DTO는 그대로 둠) */
    public record PagingResponse<T>(
            List<T> content,
            int page,
            int size,
            int totalPages,
            long totalElements
    ) {}
}
