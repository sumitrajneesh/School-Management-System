package com.sms.student.service;

import com.sms.student.model.Enrollment;
import com.sms.student.model.EnrollmentStatus;
import com.sms.student.model.Student;

import java.util.List;
import java.util.UUID;

public interface StudentService {
    // Student Management
    Student createStudent(Student student);
    List<Student> getAllStudents();
    Student getStudentById(UUID id);
    Student updateStudent(UUID id, Student studentDetails);
    void deleteStudent(UUID id);

    // Enrollment Management
    Enrollment enrollStudentInClass(UUID studentId, String classId);
    List<Enrollment> getEnrollmentsByStudent(UUID studentId);
    Enrollment updateEnrollmentStatus(UUID enrollmentId, EnrollmentStatus newStatus);
    void deleteEnrollment(UUID enrollmentId);
}