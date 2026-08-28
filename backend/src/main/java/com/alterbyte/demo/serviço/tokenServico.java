package com.alterbyte.demo.serviço;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class tokenServico {

    @Value("${app.jwt.secret}")
    private String segredo;

    @Value("${app.jwt.expiracao-ms}")
    private long expiracaoMs;

    private SecretKey chave() {
        return Keys.hmacShaKeyFor(segredo.getBytes());
    }

    //gera um token para o usuário autenticado
    public String gerarToken(Long usuarioId) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expiracaoMs);

        return Jwts.builder()
                .subject(usuarioId.toString())
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(chave())
                .compact();
    }

    //valida o token e devolve o id do usuário dono dele
    public Long validarTokenEObterUsuarioId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(chave())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return Long.parseLong(claims.getSubject());
    }

}
