package com.gabriel.blognoticias.configs.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.models.exception.TokenExpiradoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

   @Value("${api.security.token.secret}")
  private String secret;

  public String generateToken(Usuario usuario) {
    try{
      Algorithm algorithm = Algorithm.HMAC256(secret);
      String token = JWT.create()
              .withIssuer("auth-api")
              .withSubject(usuario.getNome())
              .withExpiresAt(genExpirationDate())
              .withClaim("Teste", "testando")
              .sign(algorithm);
      return token;

    }catch(JWTCreationException ex){
      throw new RuntimeException(ex);
    }
  }

  public String validateToken(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      return JWT.require(algorithm)
              .withIssuer("auth-api")
              .build()
              .verify(token)
              .getSubject();
    }catch(JWTVerificationException ex) {
      throw new TokenExpiradoException("Sessão expirada. Realize o login novamente.");
    }
  }
  private Instant genExpirationDate() {
    return LocalDateTime.now().plusHours(1).toInstant(ZoneOffset.of("-03:00"));
  }
}

