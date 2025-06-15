package com.sms.student.service;

import com.sms.student.exception.ResourceNotFoundException;
import com.sms.student.model.Enrollment;
import com.sms.student.model.EnrollmentStatus;
import com.sms.student.model.Student;
import com.sms.student.repository.EnrollmentRepository;
import com.sms.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // --- Student Management ---
    @Override
    @Transactional
    public Student createStudent(Student student) {
        // Ensure enrollmentDate is set if not provided by client
        if (student.getEnrollmentDate() == null) {
            student.setEnrollmentDate(LocalDateTime.now());
        }
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Override
    @Transactional
    public Student updateStudent(UUID id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setDob(studentDetails.getDob());
        student.setAddress(studentDetails.getAddress());
        // enrollmentDate should generally not be updated this way, maybe in a separate method if needed.
        // student.setEnrollmentDate(studentDetails.getEnrollmentDate());

        return studentRepository.save(student);
    }

    @Override
    @Transactional
    public void deleteStudent(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    // --- Enrollment Management ---
    @Override
    @Transactional
    public Enrollment enrollStudentInClass(UUID studentId, String classId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Check if student is already enrolled in this class
        if (enrollmentRepository.findByStudentIdAndClassId(studentId, classId).isPresent()) {
            throw new RuntimeException("Student is already enrolled in class: " + classId);
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setClassId(classId);
        enrollment.setEnrollmentDate(LocalDateTime.now());
        enrollment.setStatus(EnrollmentStatus.ACTIVE);

        return enrollmentRepository.save(enrollment);
    }

    @Override
    public List<Enrollment> getEnrollmentsByStudent(UUID studentId) {
        // Ensure student exists before fetching enrollments
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return enrollmentRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional
    public Enrollment updateEnrollmentStatus(UUID enrollmentId, EnrollmentStatus newStatus) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        enrollment.setStatus(newStatus);
        if (newStatus == EnrollmentStatus.COMPLETED) {
            enrollment.setCompletionDate(LocalDateTime.now());
        } else {
            enrollment.setCompletionDate(null); // Clear if status changes from COMPLETED
        }
        return enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional
    public void deleteEnrollment(UUID enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
        enrollmentRepository.delete(enrollment);
    }
}
