package com.alterbyte.demo.serviço;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alterbyte.demo.modelo.comentarioModelo;
import com.alterbyte.demo.repositorio.comentarioRepositorio;

@Service
public class comentarioServico {

    @Autowired
    private comentarioRepositorio cr;

    //listar vínculos de comentários
    public Iterable<comentarioModelo> listar(){
        return cr.findAll();
    }

}
