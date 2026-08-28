package com.alterbyte.demo.controle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alterbyte.demo.modelo.comentarioModelo;
import com.alterbyte.demo.serviço.comentarioServico;

@RestController
@CrossOrigin(origins = "*")
public class comentarioControle {

    @Autowired
    private comentarioServico cs;

    @GetMapping("/liste/comentarios")
    public Iterable<comentarioModelo> listar(){
        return cs.listar();
    }

}
