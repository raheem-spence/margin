package com.raheemspence.repository;

import com.raheemspence.model.CourseMembership;
import com.raheemspence.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CourseMembershipRepository extends JpaRepository<CourseMembership, Long> {

    /*
        This means check if a row exists in the CourseMembership table where BOTH conditions are true

        Spring Data JPA is built on Derived Query Methods meaning method name = query definition.
        It only works for a strict grammar: [action]By[field][operator][field]

        In other words, derived query methods ae methods where Spring automatically builds the SQL query from the
        method name. So Spring reads the name, understands intent, then generates the SQL automatically. Remember,
        it only works for strict grammar like above.

        Internally, it works by first reading the name then splitting it into keywords (exists, by, userId, courseId),
        next it matches those keywords to entity fields, and lastly it generates the SQL behind the scenes
     */
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    List<CourseMembership> findByUserId(Long userId);

    long countByCourseId(Long courseId);

}
