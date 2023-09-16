package com.gabriel.blognoticias.handler;

import com.gabriel.blognoticias.models.dto.ErrorDTO;
import com.gabriel.blognoticias.models.exception.CampoNaoPreenchidoException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class CampoNaoPreenchidoExceptionHandler {

  @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
  @ResponseBody
  @ExceptionHandler(CampoNaoPreenchidoException.class)
  public ErrorDTO handler(CampoNaoPreenchidoException ex) {
    return new ErrorDTO("Preencha todos os campos.");
  }
}
