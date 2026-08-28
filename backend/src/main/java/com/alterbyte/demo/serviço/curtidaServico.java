package com.alterbyte.demo.serviço;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.alterbyte.demo.modelo.curtidaModelo;
import com.alterbyte.demo.modelo.postagemModelo;
import com.alterbyte.demo.modelo.respostaModelo;
import com.alterbyte.demo.repositorio.curtidaRepositorio;
import com.alterbyte.demo.repositorio.postagemRepositorio;

@Service
public class curtidaServico {

    @Autowired
    private postagemRepositorio pr;

    @Autowired
    private respostaModelo rm;

    @Autowired
    curtidaRepositorio cr;

        //listar curtidas
    public Iterable<curtidaModelo> listar(){
        return cr.findAll();
    }


        //curtir postagem
    public ResponseEntity<?> curtir( Long postagemId, Long usuarioId){
        Optional<postagemModelo> postagem = pr.findById(postagemId);
        
        if(postagem.isPresent()){
            curtidaModelo cm = new curtidaModelo();
            int curtidas = postagem.get().getCurtidas()+1;
            cm.setBotaoCurtida(true);
            postagem.get().setCurtidas(curtidas);

            
            cm.setPostagemId(postagemId);
            cm.setUsuarioId(usuarioId);
            cr.save(cm);
            return new ResponseEntity<postagemModelo>(pr.save(postagem.get()), HttpStatus.OK);
        }
        rm.setMensagem("Postagem não encontrada");
        return new ResponseEntity<respostaModelo>(rm, HttpStatus.NOT_FOUND);
    }

    //descurtir postagem
    public ResponseEntity<?> descurtir(long postagemId, Long usuarioId, Long curtidaId){
        Optional<postagemModelo> postagem = pr.findById(postagemId);
        if(postagem.isPresent()){
            int curtidas = postagem.get().getCurtidas()-1;
            postagem.get().setCurtidas(curtidas);

            cr.deleteById(curtidaId);
            return new ResponseEntity<postagemModelo>(pr.save(postagem.get()), HttpStatus.OK);
        }
        rm.setMensagem("Postagem não encontrada");
        return new ResponseEntity<respostaModelo>(rm, HttpStatus.NOT_FOUND);
    }
    
}
