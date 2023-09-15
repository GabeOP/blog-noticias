package com.gabriel.blognoticias.models.exception;

public class CampoNaoPreenchidoException extends RuntimeException{

  public CampoNaoPreenchidoException(String msg) {
    super(msg);
  }
}
