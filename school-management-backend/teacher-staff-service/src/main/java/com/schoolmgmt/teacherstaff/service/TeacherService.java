package com.schoolmgmt.teacherstaff.service;


import com.schoolmgmt.teacherstaff.model.Teacher;
import com.schoolmgmt.teacherstaff.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Transactional(readOnly = true)
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Teacher> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }

    @Transactional
    public Teacher createTeacher(Teacher teacher) {
        // You might add validation here, e.g., check if email already exists
        return teacherRepository.save(teacher);
    }

    @Transactional
    public Optional<Teacher> updateTeacher(Long id, Teacher teacherDetails) {
        return teacherRepository.findById(id).map(teacher -> {
            teacher.setFirstName(teacherDetails.getFirstName());
            teacher.setLastName(teacherDetails.getLastName());
            teacher.setEmail(teacherDetails.getEmail());
            teacher.setSubject(teacherDetails.getSubject());
            teacher.setDateOfJoining(teacherDetails.getDateOfJoining());
            teacher.setActive(teacherDetails.isActive());
            return teacherRepository.save(teacher);
        });
    }

    @Transactional
    public boolean deleteTeacher(Long id) {
        if (teacherRepository.existsById(id)) {
            teacherRepository.deleteById(id);
            return true;
        }
        return false;
    }
}