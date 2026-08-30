package com.raheemspence.repository;

import com.raheemspence.model.Course;
import com.raheemspence.model.Note;
import com.raheemspence.model.User;
import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByOwnerId(Long ownerId);

    List<Note> findByCourseId(Long courseId);

    @Query("SELECT n FROM Note n JOIN CourseMembership cm ON n.course = cm.course WHERE cm.user.id = :userId ORDER BY n.updatedAt DESC")
    List<Note> findAccessibleNotesByUserId(@Param("userId") Long userId, Pageable pageable);
}
