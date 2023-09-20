package com.gabriel.blognoticias.enums;

public enum Cargo {
  COMUM, ADM;

  private String cargo;

  Cargo() {}

  Cargo(String cargo) {
    this.cargo = cargo;
  }

  public String getCargo() {
    return cargo;
  }
}
