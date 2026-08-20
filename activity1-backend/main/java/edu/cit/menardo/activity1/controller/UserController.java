package edu.cit.menardo.activity1.controller;

import edu.cit.menardo.activity1.model.User;
import edu.cit.menardo.activity1.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Email already exists");
        }

        userRepository.save(user);

        return ResponseEntity.ok("Registration successful");
    }


    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {

            User foundUser = existingUser.get();

            if (foundUser.getPassword()
                    .equals(user.getPassword())) {

                return ResponseEntity.ok("Login successful");
            }
        }

        return ResponseEntity
                .status(401)
                .body("Invalid email or password");
    }
}