package com.alterbyte.demo.modelo;

import org.springframework.stereotype.Component;

import jakarta.persistence.Table;
import lombok.Data;

@Component
@Table(name = "respostas")
@Data
public class respostaModelo {
    
    private String mensagem;

	public String getMensagem() {
		return mensagem;
	}

	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
	}

    
}
