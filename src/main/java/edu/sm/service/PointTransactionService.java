package edu.sm.service;

import edu.sm.dto.Point_History;
import edu.sm.dto.Point_Transaction;
import edu.sm.dto.User;
import edu.sm.repository.PointHistoryRepository;
import edu.sm.repository.PointTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointTransactionService {
    final PointTransactionRepository pointTransactionRepository;
    final PointHistoryRepository pointHistoryRepository;
    
    public void insert(Point_Transaction pointTransaction) throws Exception{
        pointTransactionRepository.insert(pointTransaction);
    }

    public void delete(Point_Transaction pointTransaction) throws Exception{
        pointTransactionRepository.delete(pointTransaction);
    }

    public List<Point_Transaction> selectAll(String userId) throws Exception{
        List<Point_Transaction> list = pointTransactionRepository.selectAll(userId);
        return list;
    }

    public Point_Transaction select(String userId) throws Exception{
        Point_Transaction point = pointTransactionRepository.select(userId);
        return point;
    }
    
    public int getUserPoints(String userId) {
        try {
            Point_History latestHistory = pointHistoryRepository.getLatestPointHistory(userId);
            return latestHistory != null ? latestHistory.getFinalPoint() : 0;
        } catch (Exception e) {
            return 0;
        }
    }
    
    public void deductPoints(String userId, int amount, String note) {
        try {
            int currentPoints = getUserPoints(userId);
            int newPoints = currentPoints - amount;
            
            if (newPoints < 0) {
                throw new RuntimeException("포인트가 부족합니다.");
            }
            
            Point_History history = new Point_History();
            history.setUserId(userId);
            history.setActionType("BID");
            history.setPointChange(-amount);
            history.setFinalPoint(newPoints);
            history.setChangeDate(LocalDateTime.now());
            history.setNote(note);
            
            pointHistoryRepository.insert(history);
        } catch (Exception e) {
            throw new RuntimeException("포인트 차감 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}