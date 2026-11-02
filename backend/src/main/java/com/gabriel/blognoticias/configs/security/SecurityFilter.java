package com.gabriel.blognoticias.configs.security;

import com.gabriel.blognoticias.models.exception.TokenExpiradoException;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
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
  private TokenService tokenService;

  @Autowired
  private UsuarioRepository repository;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    try {
      var token = this.recoverToken(request);

      if (token != null) {
        var login = tokenService.validateToken(token);
        UserDetails user = repository.findByNome(login);

        if (user != null) {
          var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
          SecurityContextHolder.getContext().setAuthentication(authentication);
        }
      }
      filterChain.doFilter(request, response);
    } catch (TokenExpiradoException ex) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    }
  }

  private String recoverToken(HttpServletRequest request) {
    // 1. Tentar recuperar de HttpOnly Cookie
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if ("token".equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }

    // 2. Fallback para header Authorization: Bearer <token>
    var authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.replace("Bearer ", "");
    }

    return null;
  }
}
