package com.schoolmgmt.teacherstaff.model;

import jakarta.persistence.*;
import lombok.Data; // From Lombok for getters/setters/toString/equals/hashCode
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "teachers")
@Data // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Generates no-arg constructor
@AllArgsConstructor // Generates constructor with all fields
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String subject;

    private LocalDate dateOfJoining;

    @Column(nullable = false)
    private boolean active = true; // Default to active
}
