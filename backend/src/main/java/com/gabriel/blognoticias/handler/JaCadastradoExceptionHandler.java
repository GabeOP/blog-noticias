package com.gabriel.blognoticias.handler;

import com.gabriel.blognoticias.models.dto.ErrorDTO;
import com.gabriel.blognoticias.models.exception.JaCadastradoException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class JaCadastradoExceptionHandler {

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ResponseBody
  @ExceptionHandler(JaCadastradoException.class)
  public ErrorDTO handler(JaCadastradoException ex) {
    return new ErrorDTO("Usuário já cadastrado no sistema.");
  }
}
