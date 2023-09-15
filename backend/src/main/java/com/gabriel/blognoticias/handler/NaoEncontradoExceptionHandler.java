package com.gabriel.blognoticias.handler;

import com.gabriel.blognoticias.models.dto.ErrorDTO;
import com.gabriel.blognoticias.models.exception.NaoEncontradoException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class NaoEncontradoExceptionHandler {

  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ResponseBody
  @ExceptionHandler(NaoEncontradoException.class)
  public ErrorDTO handler(NaoEncontradoException ex) {
    return new ErrorDTO(ex.getMessage());
  }
}
