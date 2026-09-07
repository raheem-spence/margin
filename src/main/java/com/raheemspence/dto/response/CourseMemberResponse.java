package com.raheemspence.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class CourseMemberResponse {
    private String firstName;
    private String lastName;
    private Instant joinedAt;
}
