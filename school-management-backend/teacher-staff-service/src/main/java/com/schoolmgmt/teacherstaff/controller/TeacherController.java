package com.schoolmgmt.teacherstaff.controller;

import com.schoolmgmt.teacherstaff.model.Teacher;
import com.schoolmgmt.teacherstaff.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@Tag(name = "Teacher Management", description = "API for managing teacher records in the school system.")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @Operation(summary = "Get all teachers", description = "Retrieves a list of all teachers currently in the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of teachers",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = Teacher.class)))),
            @ApiResponse(responseCode = "500", description = "Internal server error during teacher retrieval")
    })
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    @Operation(summary = "Get teacher by ID", description = "Retrieves a single teacher by their unique ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Teacher found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Teacher.class))),
            @ApiResponse(responseCode = "404", description = "Teacher not found with the given ID")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(
            @Parameter(description = "ID of the teacher to retrieve", required = true)
            @PathVariable Long id) {
        return teacherService.getTeacherById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new teacher", description = "Adds a new teacher record to the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Teacher successfully created",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Teacher.class))),
            @ApiResponse(responseCode = "400", description = "Invalid teacher details supplied"),
            @ApiResponse(responseCode = "409", description = "Teacher with this email already exists")
    })
    @PostMapping
    public ResponseEntity<Teacher> createTeacher(
            @Parameter(description = "Teacher object to be created", required = true)
            @RequestBody Teacher teacher) {
        Teacher createdTeacher = teacherService.createTeacher(teacher);
        return new ResponseEntity<>(createdTeacher, HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing teacher", description = "Updates the details of an existing teacher by ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Teacher successfully updated",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Teacher.class))),
            @ApiResponse(responseCode = "404", description = "Teacher not found with the given ID"),
            @ApiResponse(responseCode = "400", description = "Invalid teacher details supplied")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updateTeacher(
            @Parameter(description = "ID of the teacher to update", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated teacher object", required = true)
            @RequestBody Teacher teacherDetails) {
        return teacherService.updateTeacher(id, teacherDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a teacher", description = "Deletes a teacher record from the system by ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Teacher successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Teacher not found with the given ID")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(
            @Parameter(description = "ID of the teacher to delete", required = true)
            @PathVariable Long id) {
        if (teacherService.deleteTeacher(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}