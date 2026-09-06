package com.raheemspence.repository;

import com.raheemspence.model.Course;
import com.raheemspence.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByJoinCode(String joinCode);

    List<Course> findByCreatorId(Long creatorId);

    Boolean existsByJoinCode(String joinCode);
}
