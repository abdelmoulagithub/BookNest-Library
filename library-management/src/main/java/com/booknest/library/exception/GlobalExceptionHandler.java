package com.booknest.library.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice // Katgol l Spring: Ay error f projet, jibha hna
public class GlobalExceptionHandler {

    // ============ 1. Validation Errors - @NotBlank, @Email, @Size ============
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {

        // Jib ga3 errors
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", 400);
        body.put("error", "Validation Failed");
        body.put("messages", errors); // ["email: must be valid", "password: min 6 chars"]
        body.put("path", ex.getObjectName());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // ============ 2. Business Logic - throw new RuntimeException ============
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", 400);
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());
        body.put("path", "Check request body");

        // Ila message kaygol "not found" → 404 machi 400
        if (ex.getMessage().toLowerCase().contains("not found")) {
            body.put("status", 404);
            body.put("error", "Not Found");
            return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
        }

        // Ila message kaygol "credentials" wla "unauthorized" → 401
        if (ex.getMessage().toLowerCase().contains("credentials") ||
                ex.getMessage().toLowerCase().contains("incorrect") ||
                ex.getMessage().toLowerCase().contains("unauthorized")) {
            body.put("status", 401);
            body.put("error", "Unauthorized");
            return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
        }

        // Ila "already exists" → 409 Conflict
        if (ex.getMessage().toLowerCase().contains("already exists")) {
            body.put("status", 409);
            body.put("error", "Conflict");
            return new ResponseEntity<>(body, HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // ============ 3. General Exception - Ay haja akhra ============
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", 500);
        body.put("error", "Internal Server Error");
        body.put("message", "Something went wrong: " + ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}