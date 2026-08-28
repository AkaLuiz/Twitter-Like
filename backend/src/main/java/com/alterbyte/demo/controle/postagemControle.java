package com.alterbyte.demo.controle;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.alterbyte.demo.modelo.postagemModelo;
import com.alterbyte.demo.serviço.postagemServico;


@RestController
@CrossOrigin(origins = "*")
public class postagemControle {

    @Autowired
    private postagemServico ps;

    @GetMapping("/liste/postagens")
    public Iterable<postagemModelo> listar(){
        return ps.listar();
    }

    @GetMapping("/liste/postagens/{postagemId}")
    public Optional<postagemModelo> listarUm(@PathVariable Long postagemId){
        return ps.listarUm(postagemId);
    }    

    @PostMapping("/poste")
    public ResponseEntity<?> postar(@RequestBody postagemModelo pm){
        return ps.postarEditar(pm,"cadastrar");
    }

    @PostMapping("/comente/{postagemId}")
    public ResponseEntity<?> comentar(@RequestBody postagemModelo pm, @PathVariable Long postagemId) {
        return ps.comentar(pm, postagemId);
    }
    
    @PutMapping("/edite/postagem")
    public ResponseEntity<?> editar(@RequestBody postagemModelo pm){
        return ps.postarEditar(pm,"alterar");
    }

    @DeleteMapping("/remove/postagem/{postagemId}")
    public ResponseEntity<?> remover(@PathVariable Long postagemId){
        return ps.remover(postagemId);
    }

    @GetMapping("/")
    public String rota(){
        return "Api de postagens funcionando!";
    }
    
}
