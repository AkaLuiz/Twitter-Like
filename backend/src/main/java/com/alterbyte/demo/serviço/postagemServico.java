package com.alterbyte.demo.serviço;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alterbyte.demo.modelo.comentarioModelo;
import com.alterbyte.demo.modelo.postagemModelo;
import com.alterbyte.demo.modelo.respostaModelo;
import com.alterbyte.demo.repositorio.comentarioRepositorio;
import com.alterbyte.demo.repositorio.postagemRepositorio;
import com.alterbyte.demo.repositorio.usuarioRepositorio;

@Service
public class postagemServico {

    @Autowired
    private postagemRepositorio pr;

    @Autowired
    private comentarioRepositorio cr;

    @Autowired
    private usuarioRepositorio ur;

    @Autowired
    private respostaModelo rm;

    //listar postagens
    public Iterable<postagemModelo> listar(){
        return pr.findAll();
    }

     //listar postagens únicos
    public Optional<postagemModelo> listarUm(long codigo){
        return pr.findById(codigo);
    }

    //postar ou editar postagens
    public ResponseEntity<?> postarEditar(postagemModelo pm, String acao){
        if(pm.getTexto().equals("")){
            rm.setMensagem("Não pode ser enviada uma mensagem vazia!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }
        else if(pm.getUsuarioPostagemId() == null) {
            rm.setMensagem("Você precisa de uma conta para comentar!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }
        else if(ur.findById(pm.getUsuarioPostagemId()).isPresent() == false) {
            rm.setMensagem("Você precisa de uma conta para comentar!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }
        else{
            if(acao.equals("cadastrar")){
                return new ResponseEntity<postagemModelo>(pr.save(pm), HttpStatus.CREATED);
            }
            else{
                return new ResponseEntity<postagemModelo>(pr.save(pm), HttpStatus.OK);
            }
        }
    }

    //comentar
    public ResponseEntity<?> comentar(postagemModelo pm, Long postagemId){
        if(pm.getTexto().equals("")){
            rm.setMensagem("Não pode ser enviada uma mensagem vazia!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }
        else if(pm.getUsuarioPostagemId() == null) {
            rm.setMensagem("Você precisa de uma conta para comentar!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }
        else if(ur.findById(pm.getUsuarioPostagemId()).isPresent() == false) {
            rm.setMensagem("Você precisa de uma conta para comentar!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }
        else{
            if(pr.findById(postagemId).isPresent()){
                comentarioModelo comentario = new comentarioModelo();
                comentario.setComentarioId(pm.getPostagemId());
                comentario.setPostagemId(pr.findById(postagemId).get().getPostagemId());
                comentario.setUsuarioId(pm.getUsuarioPostagemId());
                cr.save(comentario);
                return new ResponseEntity<postagemModelo>(pr.save(pm), HttpStatus.CREATED);
            }  
            rm.setMensagem("Essa postagem não existe!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST); 
        }
    }
    
     //remover postagem
     public ResponseEntity<?> remover(long postagemId){
        pr.deleteById(postagemId);
        rm.setMensagem("Post removido!");
        return new ResponseEntity<respostaModelo>(rm, HttpStatus.OK);
     }
    
}
