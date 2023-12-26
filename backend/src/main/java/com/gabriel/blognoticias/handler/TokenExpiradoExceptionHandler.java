package com.gabriel.blognoticias.handler;

import com.gabriel.blognoticias.models.dto.ErrorDTO;
import com.gabriel.blognoticias.models.exception.TokenExpiradoException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class TokenExpiradoExceptionHandler {

  @ResponseStatus(HttpStatus.FORBIDDEN)
  @ResponseBody
  @ExceptionHandler(TokenExpiradoException.class)
  public ErrorDTO handler(TokenExpiradoException ex) {
    return new ErrorDTO(ex.getMessage());
  }
}
