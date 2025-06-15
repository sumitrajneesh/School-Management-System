package com.sms.student.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "students")
@Data // Lombok: Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Lombok: Generates no-argument constructor
@AllArgsConstructor // Lombok: Generates constructor with all arguments
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id; // Using UUID for IDs

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;

    @NotNull(message = "Date of Birth cannot be empty")
    @PastOrPresent(message = "Date of Birth cannot be in the future")
    private LocalDate dob; // Date of Birth

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotNull(message = "Enrollment date cannot be empty")
    private LocalDateTime enrollmentDate;

    // One-to-Many relationship with Enrollment
    // orphanRemoval = true: if an enrollment is removed from the list, it's also removed from the DB
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Enrollment> enrollments; // List of enrollments for this student
}
