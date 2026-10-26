# Site da Base 1 · guia para editar com o Claude

Landing page da Base 1, uma agência que prepara empreendimentos imobiliários para o mercado. É um site estático (HTML e CSS, sem build) publicado pelo GitHub Pages a partir do ramo `main`. O que chega ao `main` fica no ar em 1 a 2 minutos em https://cultureon.github.io/base1portugal.github.io/

Este ficheiro é público, como o resto do repositório e do site. Não pôr aqui informação interna (preços, fees, dados de clientes).

## Ficheiros

- `index.html`: todo o conteúdo e a estrutura da página.
- `assets/site.css`: estilos. Cores, tamanhos de letra e espaçamentos estão como variáveis no `:root`, no topo do ficheiro.
- `assets/img/`: imagens e logótipos (`base1-logo-white.png`, `base1-logo-black.png`, `base1-logo-orange.png`).
- `assets/fonts/`: Space Mono alojada no próprio site. Não carregar do Google Fonts, para o site continuar sem pedidos a terceiros e sem banner de cookies.
- `assets/video/ferragudo-bay-teaser.mp4`: filme do caso (1 min, 1080p, cerca de 22 MB), com capa em `assets/img/fb-filme.jpg`. Vídeos novos comprimidos em H.264 com `+faststart`, bem abaixo dos 100 MB que o GitHub aceita por ficheiro. Sem YouTube, Vimeo ou Drive embutidos.
- `assets/img/og.jpg`: imagem de partilha (1200 × 630) para WhatsApp e LinkedIn.
- `favicon-32.png`, `apple-touch-icon.png`.
- `.nojekyll`: não apagar.

## Estrutura da página, por ordem

1. Topo (fundo preto), com menu Caso · Método · Equipa · Contacto, e imagem aérea do Ferragudo Bay.
2. 01 · O problema.
3. Quanto vale um mês (fundo preto). Exemplos financeiros ilustrativos, com as hipóteses escritas.
4. 02 · Caso Ferragudo Bay (`#caso`): abertura, rooftop, ponto de partida, produto, investigação, conceito, ativos de venda e resultado.
5. Convite ao contacto, logo a seguir ao caso.
6. 03 · Como trabalhamos (`#metodo`).
7. 04 · Ao lado de quem desenha e de quem vende.
8. 05 · Equipa (`#equipa`): Cristian, Rafael, Justino, Vagas, por esta ordem.
9. 06 · Contacto (`#contacto`, fundo laranja) e rodapé.

## Identidade

- Letra: Space Mono. Títulos em caixa alta (classe `.caps`).
- Cores da Base 1: fundo `--ground` #EEEEEE, texto `--ink` #111111, laranja `--orange` #E35436, preto `--night` #0E0E0E.
- A secção do caso usa só a paleta do Ferragudo Bay (`--fb-stone`, `--fb-navy`, `--fb-clay`, `--fb-mist`, `--fb-sky`) e não leva o laranja da Base 1. Esta troca de paleta é intencional: mostra que a Base 1 faz a marca do cliente e não a sua. Manter. A abertura do caso tem fundo `--fb-navy`, com texto e logótipo a branco (`fb-logo-white.svg`, versão simplificada do logótipo).
- Tudo alinhado à esquerda. Sem ícones, gradientes, sombras ou cantos arredondados (a única exceção é o arco da fotografia da vila). O texto não anima.

## Regras de texto

- Português de Portugal. Nunca usar travessões: usar vírgulas, dois pontos, parênteses ou frases separadas.
- Escrever sempre "Base 1", nunca "Base One".
- A voz da Base 1 é seca e factual. O lirismo é do Ferragudo Bay, não da Base 1.
- "Praia" vai sempre qualificada: "praia do estuário" ou "praia de rio".
- A fábrica é "a mais antiga registada no levantamento académico das duas margens do Arade". Nunca "a primeira fábrica do Arade".
- Não citar concorrentes pelo nome. Não inventar números nem resultados. Exemplos financeiros vão marcados como ilustrativos.
- Vocabulário fora: luxo, lifestyle, autêntico, exclusivo, charme, soluções, parceiro estratégico, 360, chave na mão, storytelling, DNA da marca, jornada do cliente.

## Como trabalhar

- Pode haver duas pessoas a editar. Começar sempre da versão mais recente do `main`.
- Alterações pequenas, um commit por alteração, com mensagem clara em português.
- Sempre que mudar o `assets/site.css`, atualizar o `?v=` no `<link>` do `index.html` (por exemplo, a data do dia). Sem isso, os browsers podem mostrar o HTML novo com o CSS antigo durante uns minutos.
- Ver a página a 1440 px e a 390 px de largura antes de dar por terminado: nada pode sair do ecrã na horizontal e o texto não pode ficar cortado.
- Imagens novas em JPG, até cerca de 2000 px de largura e abaixo de cerca de 400 KB, sempre com `width`, `height` e `alt` no `<img>`. Por baixo da primeira dobra, `loading="lazy"`.
- Manter `<meta name="robots" content="noindex">` enquanto o site estiver no endereço github.io.
- Publicar: só o que chega ao `main` vai para o ar. Se o trabalho for feito noutro ramo, abrir um pull request e fazer merge para o `main` quando estiver aprovado.

## Pendentes técnicos

- Domínio base1.pt: quando existir, criar o ficheiro `CNAME`, configurar os registos DNS, tirar o `noindex`, acrescentar `sitemap.xml` e `robots.txt`, atualizar o endereço de `og:image` e passar as imagens a WebP.
- Email no domínio, para substituir `base1portugal@gmail.com` em todo o site.
- Página de política de privacidade e identificação legal no rodapé (denominação social, sede, NIPC).
- Confirmar que o número de telefone tem WhatsApp (há dois links `wa.me`).
