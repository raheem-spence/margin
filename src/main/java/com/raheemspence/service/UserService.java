package com.raheemspence.service;

import com.raheemspence.dto.response.UserResponse;
import com.raheemspence.model.User;
import com.raheemspence.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService (UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get Current User Logic
    public UserResponse getCurrentUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String email = user.getEmail();

        UserResponse userResponse = new UserResponse();
        userResponse.setFirstName(firstName);
        userResponse.setLastName(lastName);
        userResponse.setEmail(email);
        userResponse.setId(user.getId());

        return userResponse;
    }
}
