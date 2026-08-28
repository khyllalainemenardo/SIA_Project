package edu.cit.menardo.activity1.controller;

import edu.cit.menardo.activity1.JwtUtil;
import edu.cit.menardo.activity1.model.User;
import edu.cit.menardo.activity1.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            User foundUser = existingUser.get();

            if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                String token = jwtUtil.generateToken(foundUser.getEmail());
                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "username", foundUser.getUsername(),
                        "email", foundUser.getEmail()
                ));
            }
        }

        return ResponseEntity.status(401)
                .body(Map.of("message", "Invalid email or password"));
    }
}