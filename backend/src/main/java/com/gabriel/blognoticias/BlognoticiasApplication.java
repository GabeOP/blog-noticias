package com.gabriel.blognoticias;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@SpringBootApplication
@EnableScheduling
public class BlognoticiasApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlognoticiasApplication.class, args);
	}

	@Scheduled(fixedDelay = 14000)
	private static void antiafk() {
		System.out.println(".");
	}
}
