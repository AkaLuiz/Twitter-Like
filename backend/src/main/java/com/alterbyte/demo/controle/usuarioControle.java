package com.alterbyte.demo.controle;

import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.alterbyte.demo.config.AutenticacaoUtil;
import com.alterbyte.demo.modelo.seguidorModelo;
import com.alterbyte.demo.modelo.usuarioModelo;
import com.alterbyte.demo.serviço.usuarioServiço;

import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "*")
public class usuarioControle {

    @Autowired
    private usuarioServiço us;

    @GetMapping("/liste/usuarios")
    public Iterable<usuarioModelo> listarUsuarios(){
        return us.listarUsuarios();
    }

    @GetMapping("/liste/usuarios/{usuarioId}")
    public Optional<usuarioModelo> listarUm(@PathVariable Long usuarioId){
        return us.listarUm(usuarioId);
    }

    @GetMapping("/liste/seguidores")
    public Iterable<seguidorModelo> listarSeguidores(){
        return us.listarSeguidores();
    }

    @GetMapping("/liste/seguindo/{usuarioId}")
    public ResponseEntity<?> listarSeguindoDeUmUsuario(@PathVariable Long usuarioId){
        return us.listarSeguindoDeUm(usuarioId);
    }

    @GetMapping("/liste/seguidores/{usuarioId}")
    public ResponseEntity<?> listarSeguidoresDeUm(@PathVariable Long usuarioId){
        return us.listarSeguidoresDeUm(usuarioId);
    }
    
    @PostMapping("/cadastre/usuarios")
    public ResponseEntity<?> cadastrar(@RequestBody usuarioModelo pm){
        return us.cadastrarAlterar(pm,"cadastrar");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody usuarioModelo pm){
        return us.login(pm.getNome(), pm.getSenha());
    }
    @PutMapping("/altere/usuarios")
    public ResponseEntity<?> alterar(@RequestBody usuarioModelo pm){
        return us.cadastrarAlterar(pm,"alterar");
    }

    @DeleteMapping("/remove/usuarios/{usuarioId}")
    public ResponseEntity<?> removerUsuario(@PathVariable Long usuarioId){
        return us.remover(usuarioId);
    }

    @PostMapping("/segue/usuarios/{usuarioSeguidoId}/usuarios/{usuarioSeguindoId}")
    public ResponseEntity<?> seguir(@PathVariable Long usuarioSeguidoId, @PathVariable Long usuarioSeguindoId) {
        //quem está seguindo é sempre o dono do token, não o que vier na URL
        return us.seguir(usuarioSeguidoId, AutenticacaoUtil.obterUsuarioAutenticado());
    }

    @DeleteMapping("/dessegue/usuarios/{usuarioSeguidoId}/usuarios/{usuarioSeguindoId}")
    public ResponseEntity<?> pararDeSeguir(@PathVariable Long usuarioSeguidoId, @PathVariable Long usuarioSeguindoId) {
        return us.pararDeSeguir(usuarioSeguidoId, AutenticacaoUtil.obterUsuarioAutenticado());
    }
    
}
