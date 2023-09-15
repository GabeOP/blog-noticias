package com.gabriel.blognoticias.models.dto;

public class ErrorDTO {
  private String msg;

  public ErrorDTO(String msg) {
    this.msg = msg;
  }

  public String getMsg() {
    return msg;
  }

  public void setMsg(String msg) {
    this.msg = msg;
  }
}
