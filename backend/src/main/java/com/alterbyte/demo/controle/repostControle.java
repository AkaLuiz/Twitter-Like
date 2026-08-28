package com.alterbyte.demo.controle;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.alterbyte.demo.modelo.repostModelo;
import com.alterbyte.demo.serviço.repostServico;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.*;


@RestController
@CrossOrigin(origins = "*")
public class repostControle {

    @Autowired
    repostServico rs;

    @GetMapping("/liste/reposts")
    public Iterable<repostModelo> listar() {
        return rs.listar();
    }

    @GetMapping("/liste/reposts/{repostId}")
    public Optional<repostModelo> listarUm(@PathVariable Long repostId){
        return rs.listarUm(repostId);
    }

    @PostMapping("/reposte/{postagemId}/usuarios/{usuarioId}")
    public ResponseEntity<?> repostar(@PathVariable Long postagemId, @PathVariable Long usuarioId) {
        return rs.repostar(postagemId, usuarioId);
    }

    @DeleteMapping("/desreposte/{postagemId}/repost/{repostId}")
    public ResponseEntity<?> desrepostar(@PathVariable Long postagemId, @PathVariable Long repostId) {
        return rs.desrepostar(postagemId, repostId);
    }
    
    
}
