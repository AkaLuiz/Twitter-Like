package com.alterbyte.demo.repositorio;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import com.alterbyte.demo.modelo.usuarioModelo;


public interface usuarioRepositorio extends CrudRepository<usuarioModelo, Long>{

    Optional<usuarioModelo> findByNome(String nome);

}
