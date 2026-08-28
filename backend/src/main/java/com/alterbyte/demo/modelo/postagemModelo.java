package com.alterbyte.demo.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "postagens")
@Data
public class postagemModelo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	
	@Column(name = "postagemId")
    private Long postagemId;

	@Column(name = "usuarioPostagemId")
	private Long usuarioPostagemId;

	@Column(name = "curtidas")
    private int curtidas;

    @Column(name = "comentarios")
    private int comentarios;

	@Column(name = "reposts")
    private int reposts;

    @Column(name = "texto", length = 280)
    private String texto;

}


