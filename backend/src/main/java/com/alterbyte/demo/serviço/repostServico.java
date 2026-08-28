package com.alterbyte.demo.serviço;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.alterbyte.demo.config.AutenticacaoUtil;
import com.alterbyte.demo.modelo.postagemModelo;
import com.alterbyte.demo.modelo.repostModelo;
import com.alterbyte.demo.modelo.respostaModelo;
import com.alterbyte.demo.repositorio.postagemRepositorio;
import com.alterbyte.demo.repositorio.repostRepositorio;

@Service
public class repostServico {

    @Autowired
    repostRepositorio rr;

    @Autowired
    postagemRepositorio pr;

    @Autowired
    private respostaModelo rem;

    //listar repostagens
    public Iterable<repostModelo> listar(){
        return rr.findAll();
    }

    //listar uma repostagem
    public Optional<repostModelo> listarUm(Long id){
        return rr.findById(id);
    }

    public ResponseEntity<?> repostar( Long postagemId, Long usuarioId){
        Optional<postagemModelo> postagem = pr.findById(postagemId);

        if(postagem.isPresent()){
            int reposts = postagem.get().getReposts()+1;
            postagem.get().setReposts(reposts);
            pr.save(postagem.get());

            repostModelo rm = new repostModelo();
            postagemModelo pm = new postagemModelo();

            pm.setUsuarioPostagemId(usuarioId);
            pm.setTexto(postagem.get().getTexto());
            pr.save(pm);

            rm.setId(pm.getPostagemId());
            rm.setBotaoRepost(true);
            rm.setPostagemId(postagemId);
            rm.setUsuarioId(usuarioId);
            rr.save(rm);
            
            return new ResponseEntity<postagemModelo>(pr.save(pm), HttpStatus.OK);
        }
        rem.setMensagem("Postagem não encontrada");
        return new ResponseEntity<respostaModelo>(rem, HttpStatus.NOT_FOUND);
    }
    
    public ResponseEntity<?> desrepostar(Long postagemId, Long repostId){
        Optional<repostModelo> repost = rr.findById(repostId);
        if(repost.isEmpty()){
            rem.setMensagem("Repost não encontrado");
            return new ResponseEntity<respostaModelo>(rem, HttpStatus.NOT_FOUND);
        }
        if(!repost.get().getUsuarioId().equals(AutenticacaoUtil.obterUsuarioAutenticado())){
            rem.setMensagem("Você só pode remover seus próprios reposts!");
            return new ResponseEntity<respostaModelo>(rem, HttpStatus.FORBIDDEN);
        }

        Optional<postagemModelo> postagem = pr.findById(postagemId);
        if(postagem.isPresent()){
            int reposts = postagem.get().getReposts()-1;
            postagem.get().setReposts(reposts);
            pr.save(postagem.get());

            rr.deleteById(repostId);
            pr.deleteById(repostId);

            rem.setMensagem("Repost removido!");
            return new ResponseEntity<respostaModelo>(rem, HttpStatus.OK);
        }
        rem.setMensagem("Postagem não encontrada");
        return new ResponseEntity<respostaModelo>(rem, HttpStatus.NOT_FOUND);
    }
    
}
