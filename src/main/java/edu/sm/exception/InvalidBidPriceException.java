package edu.sm.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidBidPriceException extends RuntimeException {
    public InvalidBidPriceException(String message) {
        super(message);
    }
}