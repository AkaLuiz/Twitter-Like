package com.alterbyte.demo.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Table(name = "curtidas")
@Data
public class curtidaModelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "botaoCurtida")
	private boolean botaoCurtida;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "postagem_id", nullable = false)
    private Long postagemId;
}

