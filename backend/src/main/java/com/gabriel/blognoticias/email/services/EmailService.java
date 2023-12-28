package com.gabriel.blognoticias.email.services;

import com.gabriel.blognoticias.email.enums.StatusEmail;
import com.gabriel.blognoticias.email.models.entities.EmailModel;
import com.gabriel.blognoticias.email.repositories.EmailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class EmailService {

  @Autowired
  private EmailRepository repository;

  @Autowired
  private JavaMailSender emailSender;

  public EmailModel enviarEmail(String nomeUsuario, String emailUsuario) {
    EmailModel model = new EmailModel(nomeUsuario, emailUsuario);
    model.setSendDateEmail(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(model.getEmailFrom());
      message.setTo(emailUsuario);
      message.setSubject(model.getTituloEmail());
      message.setText(model.getCorpoEmail());
      emailSender.send(message);

      model.setStatusEmail(StatusEmail.ENVIADO);
    } catch(MailException ex) {
      model.setStatusEmail(StatusEmail.ERRO);
    } finally {
      return repository.save(model);
    }
  }
}
