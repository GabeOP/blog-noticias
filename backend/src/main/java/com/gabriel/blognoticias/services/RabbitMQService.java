package com.gabriel.blognoticias.services;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQService {

  @Autowired
  private RabbitTemplate rabbitTemplate;

  public void enviaMensagem(String nomeFila, Object mensagem) {
    this.rabbitTemplate.convertAndSend(nomeFila, mensagem);
  }
}
