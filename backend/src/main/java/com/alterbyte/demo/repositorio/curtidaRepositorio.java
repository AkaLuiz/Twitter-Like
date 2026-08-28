package com.alterbyte.demo.repositorio;

import org.springframework.data.repository.CrudRepository;
import com.alterbyte.demo.modelo.curtidaModelo;

public interface curtidaRepositorio extends CrudRepository<curtidaModelo, Long>{
    
}