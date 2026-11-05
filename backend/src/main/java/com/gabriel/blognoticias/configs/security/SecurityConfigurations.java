package com.gabriel.blognoticias.configs.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

  @Autowired
  SecurityFilter securityFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    return httpSecurity
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers(HttpMethod.POST, "/usuario/login").permitAll()
                    .requestMatchers(HttpMethod.POST, "/usuario/logout").permitAll()
                    .requestMatchers(HttpMethod.GET, "/usuario/me").permitAll()
                    .requestMatchers(HttpMethod.POST, "/usuario").permitAll()
                    .requestMatchers(HttpMethod.GET, "/usuario", "/usuario/**").hasAuthority("USER_READ")
                    .requestMatchers(HttpMethod.PATCH, "/usuario").hasAuthority("USER_UPDATE")
                    .requestMatchers(HttpMethod.PUT, "/usuario/*/roles").hasAuthority("USER_UPDATE")
                    .requestMatchers(HttpMethod.DELETE, "/usuario/**").hasAuthority("USER_DELETE")
                    .requestMatchers(HttpMethod.GET, "/roles", "/roles/**").hasAnyAuthority("USER_READ", "ROLE_MANAGE")
                    .requestMatchers(HttpMethod.POST, "/roles", "/roles/**").hasAuthority("ROLE_MANAGE")
                    .requestMatchers(HttpMethod.PUT, "/roles/**").hasAuthority("ROLE_MANAGE")
                    .requestMatchers(HttpMethod.DELETE, "/roles/**").hasAuthority("ROLE_MANAGE")
                    .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/post", "/post/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/post/*/up", "/post/{id}/up").authenticated()
                    .requestMatchers(HttpMethod.POST, "/post/upload").authenticated()
                    .requestMatchers(HttpMethod.POST, "/post", "/post/**").hasAuthority("POST_CREATE")
                    .requestMatchers(HttpMethod.PUT, "/post/**").authenticated()
                    .requestMatchers(HttpMethod.DELETE, "/post/**").authenticated()
                    .requestMatchers(HttpMethod.POST, "/comentario", "/comentario/**").authenticated()
                    .requestMatchers(HttpMethod.DELETE, "/comentario/**").authenticated()
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                    .anyRequest().authenticated()
            )
            .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList(
        "http://localhost:[*]",
        "http://127.0.0.1:[*]",
        "https://*.onrender.com"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
