package edu.sm.repository;

import edu.sm.dto.Point_History;
import edu.sm.dto.Point_Transaction;
import edu.sm.dto.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PointTransactionRepository {

    void insert(Point_Transaction pointTransaction) throws Exception;

    void delete(Point_Transaction pointTransaction) throws Exception;

    List<Point_Transaction> selectAll(String userId) throws Exception;

    Point_Transaction select(String userId) throws Exception;
}
