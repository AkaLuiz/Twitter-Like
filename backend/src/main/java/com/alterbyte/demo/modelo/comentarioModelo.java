package com.alterbyte.demo.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Table(name = "comentarios")
@Data
public class comentarioModelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "botaoComentario")
	private boolean botaoComentario;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "comentario_id")
    private Long comentarioId;

    @Column(name = "postagem_id")
    private Long postagemId;
}

