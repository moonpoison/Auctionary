
package edu.sm.service;

import edu.sm.dto.Point_History;
import edu.sm.dto.Point_Transaction;
import edu.sm.dto.User;
import edu.sm.repository.PointHistoryRepository;
import edu.sm.repository.PointTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointTransactionService {
    final PointTransactionRepository pointTransactionRepository;
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
}
