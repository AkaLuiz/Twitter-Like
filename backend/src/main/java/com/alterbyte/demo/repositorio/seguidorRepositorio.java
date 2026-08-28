package com.alterbyte.demo.repositorio;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import com.alterbyte.demo.modelo.seguidorModelo;


public interface seguidorRepositorio extends CrudRepository<seguidorModelo, Long>{

    Optional<seguidorModelo> findByUsuarioSeguidoIdAndUsuarioSeguindoId(Long usuarioSeguidoId, Long usuarioSeguindoId);

}
