package com.gabriel.blognoticias.configs.connections;

import jakarta.annotation.PostConstruct;
import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQConnection {
  private static final String NOME_EXCHANGE = "amq.direct";
  private AmqpAdmin amqpAdmin;

  public RabbitMQConnection(AmqpAdmin amqpAdmin) {
    this.amqpAdmin = amqpAdmin;
  }
  private Queue fila(String nomeFila) {
    return new Queue(nomeFila, true, false, false);
  }

  private DirectExchange trocaDireta() {
    return new DirectExchange(NOME_EXCHANGE);
  }

  private Binding relacionamento(Queue fila, DirectExchange troca) {
    return new Binding(fila.getName(), Binding.DestinationType.QUEUE, troca.getName(), fila.getName(), null);
  }

  @PostConstruct
  private void adiciona() {
    Queue filaEmail = this.fila("EMAIL");

    DirectExchange troca = this.trocaDireta();

    Binding ligacao = this.relacionamento(filaEmail, troca);

    this.amqpAdmin.declareQueue(filaEmail);
    this.amqpAdmin.declareExchange(troca);
    this.amqpAdmin.declareBinding(ligacao);
  }
}
