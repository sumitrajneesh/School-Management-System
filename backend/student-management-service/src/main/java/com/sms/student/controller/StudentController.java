package com.sms.student.controller;

import com.sms.student.model.Enrollment;
import com.sms.student.model.EnrollmentStatus;
import com.sms.student.model.Student;
import com.sms.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@Tag(name = "Student Management", description = "APIs for managing student profiles and enrollments")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // --- Student CRUD Operations ---

    @Operation(summary = "Create a new student profile")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Student created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Student.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student createdStudent = studentService.createStudent(student);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all students")
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @Operation(summary = "Get a student by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Student found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Student.class))),
            @ApiResponse(responseCode = "404", description = "Student not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@Parameter(description = "ID of the student to retrieve") @PathVariable UUID id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @Operation(summary = "Update an existing student profile")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Student updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Student.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Student not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@Parameter(description = "ID of the student to update") @PathVariable UUID id,
                                                 @Valid @RequestBody Student studentDetails) {
        Student updatedStudent = studentService.updateStudent(id, studentDetails);
        return ResponseEntity.ok(updatedStudent);
    }

    @Operation(summary = "Delete a student profile")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Student deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Student not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@Parameter(description = "ID of the student to delete") @PathVariable UUID id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // --- Enrollment Operations ---

    @Operation(summary = "Enroll a student in a class")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Student enrolled successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Enrollment.class))),
            @ApiResponse(responseCode = "404", description = "Student not found"),
            @ApiResponse(responseCode = "400", description = "Student already enrolled in class")
    })
    @PostMapping("/{studentId}/enrollments")
    public ResponseEntity<Enrollment> enrollStudentInClass(
            @Parameter(description = "ID of the student to enroll") @PathVariable UUID studentId,
            @Parameter(description = "ID of the class to enroll in") @RequestParam String classId) {
        Enrollment enrollment = studentService.enrollStudentInClass(studentId, classId);
        return new ResponseEntity<>(enrollment, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all enrollments for a specific student")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Enrollments found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Enrollment.class))),
            @ApiResponse(responseCode = "404", description = "Student not found")
    })
    @GetMapping("/{studentId}/enrollments")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStudent(@Parameter(description = "ID of the student") @PathVariable UUID studentId) {
        List<Enrollment> enrollments = studentService.getEnrollmentsByStudent(studentId);
        return ResponseEntity.ok(enrollments);
    }

    @Operation(summary = "Update the status of an enrollment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Enrollment status updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Enrollment.class))),
            @ApiResponse(responseCode = "404", description = "Enrollment not found"),
            @ApiResponse(responseCode = "400", description = "Invalid status provided")
    })
    @PutMapping("/enrollments/{enrollmentId}/status")
    public ResponseEntity<Enrollment> updateEnrollmentStatus(
            @Parameter(description = "ID of the enrollment to update") @PathVariable UUID enrollmentId,
            @Parameter(description = "New status for the enrollment (e.g., ACTIVE, COMPLETED, DROPPED, PENDING)") @RequestParam EnrollmentStatus newStatus) {
        Enrollment updatedEnrollment = studentService.updateEnrollmentStatus(enrollmentId, newStatus);
        return ResponseEntity.ok(updatedEnrollment);
    }

    @Operation(summary = "Delete an enrollment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Enrollment deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Enrollment not found")
    })
    @DeleteMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<Void> deleteEnrollment(@Parameter(description = "ID of the enrollment to delete") @PathVariable UUID enrollmentId) {
        studentService.deleteEnrollment(enrollmentId);
        return ResponseEntity.noContent().build();
    }
}
