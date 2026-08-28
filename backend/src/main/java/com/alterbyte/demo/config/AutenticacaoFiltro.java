package com.alterbyte.demo.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.alterbyte.demo.serviço.tokenServico;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AutenticacaoFiltro extends OncePerRequestFilter {

    @Autowired
    private tokenServico ts;

    //rotas que não exigem token: leitura pública (feed) e as duas que servem pra entrar no sistema
    private static final String[] ROTAS_PUBLICAS = {
        "/login",
        "/cadastre/usuarios",
        "/"
    };

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (ehRotaPublica(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String cabecalho = request.getHeader("Authorization");

        if (cabecalho == null || !cabecalho.startsWith("Bearer ")) {
            responderNaoAutorizado(response, "Token de autenticação ausente");
            return;
        }

        try {
            String token = cabecalho.substring(7);
            Long usuarioId = ts.validarTokenEObterUsuarioId(token);
            request.setAttribute(AutenticacaoUtil.ATRIBUTO_USUARIO_ID, usuarioId);
            filterChain.doFilter(request, response);
        } catch (JwtException | IllegalArgumentException e) {
            responderNaoAutorizado(response, "Token inválido ou expirado");
        }
    }

    //escreve a resposta na mão: esse filtro roda antes do Spring MVC processar @CrossOrigin,
    //então precisa do próprio header de CORS; e o corpo usa "mensagem" pra combinar com o
    //resto da API, já que o sendError() do Spring devolveria "message" em inglês
    private void responderNaoAutorizado(HttpServletResponse response, String mensagem) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.getWriter().write("{\"mensagem\":\"" + mensagem + "\"}");
    }

    private boolean ehRotaPublica(HttpServletRequest request) {
        //GET (leitura) e OPTIONS (preflight de CORS) sempre passam sem token
        if ("GET".equalsIgnoreCase(request.getMethod()) || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String caminho = request.getServletPath();
        for (String rota : ROTAS_PUBLICAS) {
            if (rota.equals(caminho)) {
                return true;
            }
        }
        return false;
    }

}
