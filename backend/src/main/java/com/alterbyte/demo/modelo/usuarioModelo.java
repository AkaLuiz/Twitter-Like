package com.alterbyte.demo.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Data
public class usuarioModelo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usuarioId;

	@Column(name = "nome")
	private String nome;
    
	@Column(name = "email")
    private String email;

	@Column(name = "senha")
	private String senha;

	@Column(name = "seguidores")
	private int seguidores;

	@Column(name = "seguindo")
	private int seguindo;

}
