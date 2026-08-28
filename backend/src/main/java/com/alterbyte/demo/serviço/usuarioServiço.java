package com.alterbyte.demo.serviço;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.ArrayList;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import com.alterbyte.demo.config.AutenticacaoUtil;
import com.alterbyte.demo.modelo.loginRespostaModelo;
import com.alterbyte.demo.modelo.respostaModelo;
import com.alterbyte.demo.modelo.seguidorModelo;
import com.alterbyte.demo.modelo.usuarioModelo;
import com.alterbyte.demo.repositorio.seguidorRepositorio;
import com.alterbyte.demo.repositorio.usuarioRepositorio;

import reactor.core.publisher.Mono;

@Service
public class usuarioServiço {

    @Autowired
    private usuarioRepositorio ur;

    @Autowired
    private seguidorRepositorio sr;

    @Autowired
    private respostaModelo rm;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private tokenServico ts;

    @Value("${app.upload.dir}")
    private String pastaUpload;

    //listar usuários
    public Iterable<usuarioModelo> listarUsuarios(){
        return ur.findAll();
    }

    //listar seguidores
    public Iterable<seguidorModelo> listarSeguidores(){
        return sr.findAll();
    }

    //listar seguindo de um usuário
    public ResponseEntity<?> listarSeguindoDeUm(Long usuarioId){

        if(ur.findById(usuarioId).isPresent() == false){
            rm.setMensagem("Não existe esse usuário!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }
        ArrayList<Long> seguindo = new ArrayList<Long>();
        for(Long i = (long)0; i <= sr.count(); i++){
            if(sr.findById(i).isPresent()){
                if(sr.findById(i).get().getUsuarioSeguindoId() == usuarioId){
                    seguindo.add(sr.findById(i).get().getUsuarioSeguidoId());
                }
            }
        }
        return new ResponseEntity<>(seguindo, HttpStatus.OK);
    }

        //listar seguidores de um usuário
        public ResponseEntity<?> listarSeguidoresDeUm(Long usuarioId){

            if(ur.findById(usuarioId).isPresent() == false){
                rm.setMensagem("Não existe esse usuário!");
                return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
            }
            ArrayList<Long> seguidores = new ArrayList<Long>();
            for(Long i = (long)0; i <= sr.count(); i++){
                if(sr.findById(i).isPresent()){
                    if(sr.findById(i).get().getUsuarioSeguidoId() == usuarioId){
                        seguidores.add(sr.findById(i).get().getUsuarioSeguindoId());
                    }
                }
            }
            return new ResponseEntity<>(seguidores, HttpStatus.OK);
        }

     //listar usuários únicos
    public Optional<usuarioModelo> listarUm(long usuarioId){
        return ur.findById(usuarioId);
    }

    //Esse monte de else if me dói, mas funciona.
    //cadastrar ou alterar conta de usuários
    public ResponseEntity<?> cadastrarAlterar(usuarioModelo pm, String acao){

        //só é possível alterar a própria conta, nunca a de outro usuário
        if(acao.equals("alterar")){
            pm.setUsuarioId(AutenticacaoUtil.obterUsuarioAutenticado());
        }

        for(Long i = (long)0; i <= ur.count(); i++){
            if(ur.findById(i).isPresent()){
                if(ur.findById(i).get().getNome().equals(pm.getNome()) ){
                    rm.setMensagem("Esse nome já está em uso!");
                    return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
                }
                else if(ur.findById(i).get().getEmail().equals(pm.getEmail())){
                    rm.setMensagem("Esse email já está em uso!");
                    return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
                }
            }
        }

        if(pm.getNome().equals("")){
            rm.setMensagem("O nome é obrigatório!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }
        else if(pm.getEmail().equals("")){
            rm.setMensagem("O email é obrigatório!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }
        else if(pm.getSenha().equals("")){
            rm.setMensagem("A senha é obrigatória!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }

        else{
            //só hasheia se a senha recebida ainda não for um hash bcrypt (evita hashear de novo numa alteração)
            if(!pm.getSenha().startsWith("$2a$") && !pm.getSenha().startsWith("$2b$")){
                pm.setSenha(passwordEncoder.encode(pm.getSenha()));
            }

            if(acao.equals("cadastrar")){
                usuarioModelo salvo = ur.save(pm);
                salvo.setSenha(null);
                return new ResponseEntity<usuarioModelo>(salvo, HttpStatus.CREATED);
            }
            else{
                usuarioModelo salvo = ur.save(pm);
                salvo.setSenha(null);
                return new ResponseEntity<usuarioModelo>(salvo, HttpStatus.OK);
            }
        }
    }

    //login
    public ResponseEntity<?> login(String nome, String senha){
        Optional<usuarioModelo> usuario = ur.findByNome(nome);

        if(usuario.isPresent() && passwordEncoder.matches(senha, usuario.get().getSenha())){
            usuarioModelo encontrado = usuario.get();
            encontrado.setSenha(null);

            loginRespostaModelo resposta = new loginRespostaModelo();
            resposta.setUsuario(encontrado);
            resposta.setToken(ts.gerarToken(encontrado.getUsuarioId()));

            return new ResponseEntity<loginRespostaModelo>(resposta, HttpStatus.OK);
        }

        rm.setMensagem("Nome e/ou senha incorretos!");
        return new ResponseEntity<respostaModelo>(rm, HttpStatus.UNAUTHORIZED);
    }
     //remover Usuarios
     public ResponseEntity<?> remover(long usuarioId){
        //só é possível remover a própria conta
        if(!AutenticacaoUtil.obterUsuarioAutenticado().equals(usuarioId)){
            rm.setMensagem("Você só pode remover sua própria conta!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.FORBIDDEN);
        }

        ur.deleteById(usuarioId);
        if(ur.findById(usuarioId).isPresent()){
            rm.setMensagem("Usuário removido com sucesso");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.OK);
        }
        rm.setMensagem("Esse usuário não existe...");
        return new ResponseEntity<respostaModelo>(rm, HttpStatus.OK);
     }

     //seguir usuario
     public ResponseEntity<?> seguir(Long usuarioSeguidoId, Long usuarioSeguindoId){
        Optional<usuarioModelo> usuarioSeguido = ur.findById(usuarioSeguidoId);
        Optional<usuarioModelo> usuarioSeguindo = ur.findById(usuarioSeguindoId);

        for(Long i = (long)0; i <= sr.count(); i ++){
            if(sr.findById(i).isPresent()){
                if(sr.findById(i).get().getUsuarioSeguidoId().equals(usuarioSeguidoId) && sr.findById(i).get().getUsuarioSeguindoId().equals(usuarioSeguindoId)){
                    rm.setMensagem("Você já segue essa pessoa!");
                    return new ResponseEntity<respostaModelo>(rm, HttpStatus.OK);
                }
            }
        }

        if(usuarioSeguido.isPresent() && usuarioSeguindo.isPresent()){
            int seguidores = usuarioSeguido.get().getSeguidores();
            usuarioSeguido.get().setSeguidores(seguidores+1);

            int seguindo = usuarioSeguindo.get().getSeguindo();
            usuarioSeguindo.get().setSeguindo(seguindo+1);
            
            seguidorModelo seguidor = new seguidorModelo();
            seguidor.setUsuarioSeguidoId(usuarioSeguidoId);
            seguidor.setUsuarioSeguindoId(usuarioSeguindoId);
            sr.save(seguidor);

            rm.setMensagem("Seguido!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.OK);
        }
        rm.setMensagem("Esse usuário não existe...");
        return new ResponseEntity<respostaModelo>(rm, HttpStatus.OK);
     }



          //parar de seguir usuario
          public ResponseEntity<?> pararDeSeguir(Long usuarioSeguidoId, Long usuarioSeguindoId){
            Optional<usuarioModelo> usuarioSeguido = ur.findById(usuarioSeguidoId);
            Optional<usuarioModelo> usuarioSeguindo = ur.findById(usuarioSeguindoId);

            for(Long i = (long)0; i <= sr.count(); i ++){
                if(sr.findById(i).isPresent()){
                    if(sr.findById(i).get().getUsuarioSeguidoId() == usuarioSeguidoId && sr.findById(i).get().getUsuarioSeguindoId() == usuarioSeguindoId){

                        sr.deleteById(i);
                    
                        int seguidores = usuarioSeguido.get().getSeguidores();
                        usuarioSeguido.get().setSeguidores(seguidores-1);
        
                        int seguindo = usuarioSeguindo.get().getSeguindo();
                        usuarioSeguindo.get().setSeguindo(seguindo-1);

                        ur.save(usuarioSeguido.get());
                        ur.save(usuarioSeguindo.get());

                        rm.setMensagem("Parado de seguir!");
                        return new ResponseEntity<respostaModelo>(rm, HttpStatus.OK);
                    }
                }
            }
            rm.setMensagem("Você não segue esse usuário");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.OK);
         }

    //salvar foto de perfil
    public ResponseEntity<?> salvarFotoPerfil(Long usuarioId, MultipartFile arquivo){
        //só é possível trocar a própria foto
        if(!AutenticacaoUtil.obterUsuarioAutenticado().equals(usuarioId)){
            rm.setMensagem("Você só pode trocar a foto da sua própria conta!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.FORBIDDEN);
        }

        Optional<usuarioModelo> usuario = ur.findById(usuarioId);
        if(usuario.isEmpty()){
            rm.setMensagem("Esse usuário não existe!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }

        if(arquivo.isEmpty()){
            rm.setMensagem("Envie um arquivo de imagem!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }

        String tipo = arquivo.getContentType();
        if(tipo == null || !tipo.startsWith("image/")){
            rm.setMensagem("O arquivo precisa ser uma imagem!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.BAD_REQUEST);
        }

        try{
            Path pasta = Paths.get(pastaUpload);
            Files.createDirectories(pasta);

            String extensao = "";
            String nomeOriginal = arquivo.getOriginalFilename();
            if(nomeOriginal != null && nomeOriginal.contains(".")){
                extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
            }
            String nomeArquivo = UUID.randomUUID().toString() + extensao;

            Files.copy(arquivo.getInputStream(), pasta.resolve(nomeArquivo), StandardCopyOption.REPLACE_EXISTING);

            //apaga a foto antiga, se tinha uma, pra não acumular lixo em disco
            String fotoAntiga = usuario.get().getFotoPerfil();
            if(fotoAntiga != null){
                Files.deleteIfExists(pasta.resolve(fotoAntiga));
            }

            usuario.get().setFotoPerfil(nomeArquivo);
            usuarioModelo salvo = ur.save(usuario.get());
            salvo.setSenha(null);

            return new ResponseEntity<usuarioModelo>(salvo, HttpStatus.OK);
        } catch(IOException e){
            rm.setMensagem("Erro ao salvar a imagem!");
            return new ResponseEntity<respostaModelo>(rm, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
