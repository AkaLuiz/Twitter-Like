package com.alterbyte.demo.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Table(name = "reposts")
@Data
public class repostModelo {

    @Id
    private Long id;
    
    @Column(name = "botaoRepost")
	private boolean botaoRepost;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "postagem_id", nullable = false)
    private Long postagemId;
}

