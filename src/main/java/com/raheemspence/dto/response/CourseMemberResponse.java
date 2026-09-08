package com.raheemspence.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class CourseMemberResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private Instant joinedAt;

    public CourseMemberResponse(Long id, String firstName, String lastName, Instant joinedAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.joinedAt = joinedAt;
    }
}

