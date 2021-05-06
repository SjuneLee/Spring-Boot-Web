package com.example.moneyball.ui.config;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.springframework.core.io.ClassPathResource;

import lombok.extern.slf4j.Slf4j;


@Slf4j
public class ServerConfig {
	
	private static ServerConfig serverConfig;
	public static ServerConfig getInstance() {
		if (serverConfig == null) {
			serverConfig = new ServerConfig();
		}
		return serverConfig;
	}
	
	private String configData;
	
	private ServerConfig() {
		configData = null;
	}
	
	public String getConfig(String phase) {
		if (configData == null) {
			ClassPathResource resource = new ClassPathResource("config/"+phase+".json");
			
			try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));){
				
				StringBuilder sb = new StringBuilder();
				String line = null;
				while ((line = reader.readLine()) != null) {
					sb.append(line.trim());
				}
				configData = sb.toString();
			} catch (IOException e) {
				e.toString();
			}
		}
		
		return configData;
	}
}
