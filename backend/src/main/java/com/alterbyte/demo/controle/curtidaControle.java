package com.alterbyte.demo.controle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import com.alterbyte.demo.modelo.curtidaModelo;
import com.alterbyte.demo.serviço.curtidaServico;

@RestController
@CrossOrigin(origins = "*")
public class curtidaControle {

    @Autowired
    curtidaServico cs;

    @GetMapping("liste/curtidas")
    public Iterable<curtidaModelo> listar() {
        return cs.listar();
    }

    @PutMapping("/curte/postagem/{postagemId}/usuario/{usuarioId}")
    public ResponseEntity<?> curtir(@PathVariable Long postagemId, @PathVariable Long usuarioId){
        return cs.curtir(postagemId, usuarioId);
    }

    @PutMapping("/descurte/postagem/{postagemId}/usuario/{usuarioId}/curtida/{curtidaId}")
    public ResponseEntity<?> descurtir(@PathVariable Long postagemId, @PathVariable Long usuarioId, @PathVariable Long curtidaId){
        return cs.descurtir(postagemId, usuarioId, curtidaId);
    }
}