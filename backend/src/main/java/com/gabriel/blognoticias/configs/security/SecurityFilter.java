package com.gabriel.blognoticias.configs.security;

import com.gabriel.blognoticias.models.exception.TokenExpiradoException;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

  @Autowired
  TokenService tokenService;

  @Autowired
  UsuarioRepository repository;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

    try{
      var token = this.recoverToken(request);

    if(token != null) {
      var login = tokenService.validateToken(token);
      UserDetails user = repository.findByNome(login);

      var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }
    filterChain.doFilter(request, response);
    }catch(TokenExpiradoException ex) {
      response.setStatus(403);
    }
  }

  private String recoverToken(HttpServletRequest request) {
    var authHeader = request.getHeader("Authorization");
    if(authHeader == null) return null;
    return authHeader.replace("Bearer ", "");
  }
}
