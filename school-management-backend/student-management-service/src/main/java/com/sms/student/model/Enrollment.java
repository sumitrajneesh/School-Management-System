package com.sms.student.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    // Many-to-One relationship with Student
    @ManyToOne(fetch = FetchType.LAZY) // Lazy fetch to avoid loading student info unnecessarily
    @JoinColumn(name = "student_id", nullable = false) // Foreign key column
    @NotNull(message = "Student cannot be null")
    private Student student;

    @NotBlank(message = "Class ID cannot be empty")
    private String classId; // This would typically be a foreign key to a 'Class' entity/service

    @NotNull(message = "Enrollment date cannot be empty")
    private LocalDateTime enrollmentDate;

    @Enumerated(EnumType.STRING) // Store enum as String in DB
    @NotNull(message = "Enrollment status cannot be empty")
    private EnrollmentStatus status;

    private LocalDateTime completionDate; // Optional: when enrollment was completed
}
