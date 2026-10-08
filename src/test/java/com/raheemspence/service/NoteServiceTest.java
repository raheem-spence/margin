package com.raheemspence.service;

import com.raheemspence.dto.request.NoteRequest;
import com.raheemspence.dto.response.NoteResponse;
import com.raheemspence.model.Course;
import com.raheemspence.model.Note;
import com.raheemspence.model.User;
import com.raheemspence.repository.CourseMembershipRepository;
import com.raheemspence.repository.CourseRepository;
import com.raheemspence.repository.NoteRepository;
import com.raheemspence.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;


import java.time.Instant;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;


@ExtendWith(MockitoExtension.class)
class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CourseMembershipRepository courseMembershipRepository;

    @InjectMocks
    private NoteService noteService;

    @Test
    void createNoteValidRequestReturnsNoteResponse() {
        // 1. Arrange
        Long userId = 1L;
        Long courseId = 1L;

        User user = new User();
        user.setId(userId);
        user.setFirstName("John");
        user.setLastName("Doe");

        Course course = new Course();
        course.setId(courseId);
        course.setName("Physics");

        String title = "Physics Notes";
        String content = "Chapter 1...";

        NoteRequest noteRequest = new NoteRequest();
        noteRequest.setTitle(title);
        noteRequest.setContent(content);

        Note note = new Note();
        Instant now = Instant.now();

        Long id = 1L;

        note.setId(id);
        note.setTitle(title);
        note.setContent(content);
        note.setOwner(user);
        note.setCourse(course);
        note.setCreatedAt(now);
        note.setUpdatedAt(now);

        when(courseMembershipRepository.existsByUserIdAndCourseId(userId, courseId)).thenReturn(true);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));

        when(noteRepository.save(any(Note.class))).thenReturn(note);

        // 2. Act
        NoteResponse noteResponse = noteService.createNote(userId, courseId, noteRequest);

        // 3. Assert
        assertNotNull(noteResponse);
        assertEquals(title, noteResponse.getTitle());
        assertEquals(content, noteResponse.getContent());
        assertEquals(userId, noteResponse.getOwnerId());
        assertEquals(user.getFirstName(), noteResponse.getOwnerFirstName());
        assertEquals(user.getLastName(), noteResponse.getOwnerLastName());
        assertEquals(courseId, noteResponse.getCourseId());
        assertEquals(course.getName(), noteResponse.getCourseName());
        assertNotNull(noteResponse.getCreatedAt());
        assertNotNull(noteResponse.getUpdatedAt());
    }

    @Test
    void createNoteUserNotMemberThrowsForbidden() {
        // 1. Arrange
        Long userId = 1L;
        Long courseId = 1L;

        NoteRequest noteRequest = new NoteRequest();
        noteRequest.setTitle("Comida");
        noteRequest.setContent("tacos");

        when(courseMembershipRepository.existsByUserIdAndCourseId(userId, courseId)).thenReturn(false);

        // 2/3. Act/Assert
         ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> {
                    noteService.createNote(userId, courseId, noteRequest);
                });

         assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void createNoteUserDoesNotExistThrowsNotFound() {
        // 1. Arrange
        Long userId = 1L;
        Long courseId = 1L;

        NoteRequest noteRequest = new NoteRequest();
        noteRequest.setTitle("Hola");
        noteRequest.setContent("Como estas?");

        when(courseMembershipRepository.existsByUserIdAndCourseId(userId, courseId)).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // 2. Act
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> {
                    noteService.createNote(userId, courseId, noteRequest);
                });

        // 3. Assert
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());

    }

    @Test
    void createNoteCourseDoesNotExistThrowsNotFound() {
        // 1. Arrange
        Long userId = 1L;
        Long courseId = 1L;

        User user = new User();
        user.setId(userId);
        user.setFirstName("Jane");
        user.setLastName("Doe");

        NoteRequest noteRequest = new NoteRequest();
        noteRequest.setTitle("Im tired");
        noteRequest.setContent("go to sleep then");

        when(courseMembershipRepository.existsByUserIdAndCourseId(userId, courseId)).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        // 2. Act
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> {
                    noteService.createNote(userId, courseId, noteRequest);
                });

        // 3. Assert
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }
}