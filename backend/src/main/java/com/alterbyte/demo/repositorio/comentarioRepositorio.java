package com.alterbyte.demo.repositorio;

import org.springframework.data.repository.CrudRepository;
import com.alterbyte.demo.modelo.comentarioModelo;

public interface comentarioRepositorio extends CrudRepository<comentarioModelo, Long>{
    
}