package com.alterbyte.demo.repositorio;

import org.springframework.data.repository.CrudRepository;
import com.alterbyte.demo.modelo.postagemModelo;

public interface postagemRepositorio extends CrudRepository<postagemModelo, Long>{
    
}
