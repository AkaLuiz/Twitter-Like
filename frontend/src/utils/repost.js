//dado um post do feed (que pode ser um post original ou a cópia gerada por um repost),
//resolve o post original de verdade e quem é o autor real do texto - sem depender de quem está olhando
export function resolverRepost(obj, vetorP, vetorR, vetorU) {
    const vinculo = vetorR.find(repost => repost.id === obj.postagemId);
    const postagemOriginal = vinculo
        ? (vetorP.find(p => p.postagemId === vinculo.postagemId) || obj)
        : obj;

    const autor = vetorU.find(u => u.usuarioId === postagemOriginal.usuarioPostagemId);
    const reposter = vinculo ? vetorU.find(u => u.usuarioId === obj.usuarioPostagemId) : null;

    return {
        ehRepost: !!vinculo,
        postagemOriginal,
        autor,
        reposter,
    };
}
