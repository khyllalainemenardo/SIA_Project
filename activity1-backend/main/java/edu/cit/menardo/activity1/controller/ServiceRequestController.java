package edu.cit.menardo.activity1.controller;

import edu.cit.menardo.activity1.model.ServiceRequest;
import edu.cit.menardo.activity1.repository.ServiceRequestRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceRequestController {

    private final ServiceRequestRepository repository;

    public ServiceRequestController(ServiceRequestRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestBody ServiceRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        request.setId(null);
        request.setCreatedBy(username);
        request.setDateCreated(LocalDateTime.now());

        ServiceRequest saved = repository.save(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<?> getRequests(
            Authentication authentication) {

        String username = authentication.getName();

        List<ServiceRequest> requests =
                repository.findByCreatedBy(username);

        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequest(
            @PathVariable Long id,
            Authentication authentication) {

        String username = authentication.getName();

        ServiceRequest request =
                repository.findByIdAndCreatedBy(id, username)
                        .orElse(null);

        if (request == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You cannot access this request.");
        }

        return ResponseEntity.ok(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequest(
            @PathVariable Long id,
            @RequestBody ServiceRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        ServiceRequest existing =
                repository.findByIdAndCreatedBy(id, username)
                        .orElse(null);

        if (existing == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You cannot update this request.");
        }

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setCategory(request.getCategory());

        ServiceRequest updated =
                repository.save(existing);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(
            @PathVariable Long id,
            Authentication authentication) {

        String username = authentication.getName();

        ServiceRequest request =
                repository.findByIdAndCreatedBy(id, username)
                        .orElse(null);

        if (request == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You cannot delete this request.");
        }

        repository.delete(request);

        return ResponseEntity.ok(
                "Request deleted successfully."
        );
    }
}