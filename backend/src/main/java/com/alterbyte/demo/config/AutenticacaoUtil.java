package com.alterbyte.demo.config;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class AutenticacaoUtil {

    public static final String ATRIBUTO_USUARIO_ID = "usuarioAutenticadoId";

    //id do usuário dono do token validado pelo AutenticacaoFiltro na requisição atual
    public static Long obterUsuarioAutenticado() {
        ServletRequestAttributes atributos = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (atributos == null) {
            return null;
        }
        return (Long) atributos.getRequest().getAttribute(ATRIBUTO_USUARIO_ID);
    }

}
