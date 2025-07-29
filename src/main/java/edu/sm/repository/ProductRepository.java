
package edu.sm.repository;

import edu.sm.dto.Product;
import edu.sm.frame.SmRepository;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface ProductRepository extends SmRepository<Product, Integer> {
}
