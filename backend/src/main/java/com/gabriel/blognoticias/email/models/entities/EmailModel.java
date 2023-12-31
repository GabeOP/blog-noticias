package com.gabriel.blognoticias.email.models.entities;

import com.gabriel.blognoticias.email.enums.StatusEmail;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class EmailModel implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private UUID emailId;
  private String emailFrom;
  private String emailTo;
  private String tituloEmail;
  @Column(columnDefinition = "TEXT")
  private String corpoEmail;
  private StatusEmail statusEmail;
  private LocalDateTime sendDateEmail;

  public EmailModel() {}

  public EmailModel(String nomeUsuario, String emailUsuario) {
    this.emailFrom = "blog-noticias@teste.com";
    this.emailTo = emailUsuario;
    this.tituloEmail = "[PROJETO BLOG] Obrigado por se cadastrar!";
    this.corpoEmail = String.format("Olá, %s! \n\nMuito obrigado por se cadastrar. Este blog é um projeto pessoal" +
            " onde procurei desenvolver minhas habilidades em diversas tecnologias. Detalhei de forma bem clara no README que está " +
            "no repositório do projeto. \n\nCaso queira visitá-lo, visite o seguinte link onde também tem o meu LinkedIn " +
            "e o download do PDF do meu currículo: https://linktr.ee/GabeOP. \n\nNovamente, agradeço pelo cadastro e " +
            "fique à vontade para me mandar mensagem em qualquer rede. 🙋‍♂️", nomeUsuario);
    ;
  }

  public UUID getEmailId() {
    return emailId;
  }

  public void setEmailId(UUID emailId) {
    this.emailId = emailId;
  }

  public String getEmailFrom() {
    return emailFrom;
  }

  public void setEmailFrom(String emailFrom) {
    this.emailFrom = emailFrom;
  }

  public String getEmailTo() {
    return emailTo;
  }

  public void setEmailTo(String emailTo) {
    this.emailTo = emailTo;
  }

  public String getTituloEmail() {
    return tituloEmail;
  }

  public void setTituloEmail(String tituloEmail) {
    this.tituloEmail = tituloEmail;
  }

  public String getCorpoEmail() {
    return corpoEmail;
  }

  public void setCorpoEmail(String corpoEmail) {
    this.corpoEmail = corpoEmail;
  }

  public StatusEmail getStatusEmail() {
    return statusEmail;
  }

  public void setStatusEmail(StatusEmail statusEmail) {
    this.statusEmail = statusEmail;
  }

  public LocalDateTime getSendDateEmail() {
    return sendDateEmail;
  }

  public void setSendDateEmail(LocalDateTime sendDateEmail) {
    this.sendDateEmail = sendDateEmail;
  }
}
