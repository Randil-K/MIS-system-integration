package com.logistics.backend.exception;

public class InvalidShipmentStatusException extends RuntimeException {
    public InvalidShipmentStatusException(String message) {
        super(message);
    }
}
