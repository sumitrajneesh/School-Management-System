package com.schoolmgmt.teacherstaff.repository;


import com.schoolmgmt.teacherstaff.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    // Spring Data JPA provides CRUD methods automatically.
    // You can add custom query methods here if needed, e.g.:
    Optional<Teacher> findByEmail(String email);
    List<Teacher> findBySubject(String subject);
}
