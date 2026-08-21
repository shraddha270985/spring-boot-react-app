package com.example.backend.exception;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public class ApiValidationException extends RuntimeException {
    private final Map<String, String> errors;

    public ApiValidationException(Map<String, String> errors) {
        super("Validation failed");
        this.errors = Collections.unmodifiableMap(new LinkedHashMap<>(errors));
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
