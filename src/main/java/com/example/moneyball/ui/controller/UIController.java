package com.example.moneyball.ui.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.moneyball.ui.config.ServerConfig;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/")
public class UIController {
	@Autowired
	private Environment environment;
	
	@GetMapping("")
	public String index() {
		return "index.html";
	}
	
	@GetMapping("/ws")
	public String ws(Model model) {
		String phase  = environment.getProperty("phase","local");
		ServerConfig serverConfig = ServerConfig.getInstance();
		model.addAttribute("configData",serverConfig.getConfig(phase));
		return "./WEB-INF/jsp/index.jsp";
	}
}
