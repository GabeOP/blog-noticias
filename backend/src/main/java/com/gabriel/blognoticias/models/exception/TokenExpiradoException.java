package com.gabriel.blognoticias.models.exception;

public class TokenExpiradoException extends RuntimeException{
  public TokenExpiradoException(String msg) {
    super(msg);
  }
}
