package com.raheemspence.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCourseRequest {

    @NotBlank(message = "Class name cannot be empty")
    private String courseName;

    @NotBlank(message = "School cannot be empty")
    private String school;

}
