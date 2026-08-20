package edu.cit.menardo.activity1.repository;

import edu.cit.menardo.activity1.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}