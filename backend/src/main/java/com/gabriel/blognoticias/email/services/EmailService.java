package com.gabriel.blognoticias.email.services;

import com.gabriel.blognoticias.email.enums.StatusEmail;
import com.gabriel.blognoticias.email.models.entities.EmailModel;
import com.gabriel.blognoticias.email.repositories.EmailRepository;
import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
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

  @RabbitListener(queues = "EMAIL")
  public void enviarEmail(UsuarioDTO usuarioDTO) {
    EmailModel model = new EmailModel(usuarioDTO.getNome(), usuarioDTO.getEmail());
    model.setSendDateEmail(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(model.getEmailFrom());
      message.setTo(usuarioDTO.getEmail());
      message.setSubject(model.getTituloEmail());
      message.setText(model.getCorpoEmail());
      emailSender.send(message);
      model.setStatusEmail(StatusEmail.ENVIADO);
    } catch(MailException ex) {
      model.setStatusEmail(StatusEmail.ERRO);
    } finally {
      repository.save(model);
    }
  }
}
