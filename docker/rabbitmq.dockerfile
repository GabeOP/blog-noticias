FROM rabbitmq:3.9

EXPOSE 5672

EXPOSE 15672

CMD ["rabbitmq-server"]
