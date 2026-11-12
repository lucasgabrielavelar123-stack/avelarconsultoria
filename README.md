# Site da Avelar Consultoria

Projeto em JavaScript puro, HTML e CSS. Esta revisão inclui o CNPJ informado, evidências com fontes, casos de quatro setores, exemplos da literatura nos painéis e um roteiro condicional de 30/60/90 dias. A identidade visual e as interações anteriores foram preservadas.

## Abrir e editar

1. Extraia o ZIP inteiro e abra a pasta no VS Code.
2. Abra `index.html` em um navegador atualizado.
3. Edite os arquivos, salve e atualize a página. Node.js e npm não são necessários.

`Site_Avelar_Arquivo_Unico.html` reúne o código para um teste rápido. Para manutenção, prefira os arquivos separados do ZIP. As versões são independentes: editar uma não atualiza a outra. Inter e Instrument Serif carregam pelo Google Fonts; sem internet, o site usa fontes alternativas.

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura, conteúdo, demonstrações e formulário. |
| `styles.css` | Identidade visual, fontes, responsividade e animações. |
| `script.js` | Menu, abas, simulador e abertura do WhatsApp. |
| `config.js` | Marca, contato, localização, CNPJ, fotos e LinkedIn. |
| `assets/favicon.svg` | Ícone da marca provisória. |

## WhatsApp e formulário

O destino configurado é **+55 (62) 99131-0782** (`5562991310782`). O formulário exige nome, empresa, telefone com DDD e segmento. Ao clicar em **Enviar meu cenário pelo WhatsApp**, abre a conversa com essas informações, frentes selecionadas e desafio descrito. Não há modal ou download obrigatório. A própria página oferece um link para reabrir a conversa caso o aplicativo não abra.

**O visitante confirma o envio no WhatsApp.** Um link de conversa não pode enviar mensagens automaticamente pela conta do visitante. O site não afirma que o lead foi recebido. O botão flutuante e os contatos do rodapé levam ao mesmo número.

O telefone do cliente integra a mensagem. **Esta entrega não salva os leads em servidor, CRM, planilha ou webhook.** Se o visitante não confirmar o envio, a consultoria não recebe os dados. A captura independente do WhatsApp exige uma integração adicional. Nenhuma mensagem de teste foi enviada para o número configurado.

## Fotos e LinkedIn pendentes

Os cards priorizam a experiência prática e não exibem iniciais nem os termos formando e formanda. Não foram criadas fotografias artificiais, certificações ou URLs de perfil presumidas.

**Ainda são necessárias fotos reais e os links do LinkedIn de Nathally e Lucas.** O código está preparado para ambos. Crie `assets/equipe`, adicione as fotos e preencha em `config.js`:

```javascript
equipe: {
  nathally: { foto: "assets/equipe/nathally.jpg", linkedin: "" },
  lucas: { foto: "assets/equipe/lucas.jpg", linkedin: "" },
},
```

Cole URLs reais de perfis `https://www.linkedin.com/in/...` nos campos `linkedin`. As fotos só aparecem quando carregam corretamente, e os links só aparecem quando configurados. Na ausência desses dados, permanecem os cards de apresentação sem imagens quebradas ou links fictícios. Ajuste o recorte em `.founder-photo img` no CSS, se necessário.

## Dados institucionais

Avelar Consultoria continua sendo uma sugestão provisória de marca. Nome, subtítulo, WhatsApp e região são editáveis em `config.js`; atualize também os metadados estáticos de `index.html` e o ícone ao definir a marca oficial.

O rodapé informa **Goiânia e Região Metropolitana — GO | Atendimento presencial e remoto** como área de atuação, sem afirmar um endereço de sede legal. O rodapé exibe **CNPJ 70.082.137/0001-18**, conforme informado pelo proprietário, também disponível em `config.js`. O e-mail comercial ainda precisa ser preenchido em `email`; campos vazios ficam ocultos.

Nunca inclua senhas, chaves privadas, credenciais ou tokens nos arquivos públicos do site.

## Jornada e navegação

Ordem da página: Início → Por que organizar / Pesquisas (01) → Soluções (02) → Na prática / Entregas (03) → Método (04) → Casos reais (05) → Simulador (06) → Quem somos (07) → FAQ (08) → Contato.

O menu desktop inclui Evidências, Soluções, Na prática, Método, Casos reais, Simulador, Quem somos e Dúvidas. A navegação móvel inclui essas frentes e Contato. Na primeira dobra, os segmentos são Comércio & Varejo, Bares & Restaurantes, Serviços & Estética e Pequenas Indústrias. Os IDs das âncoras foram mantidos.

Cada botão “Quero olhar para essa frente” usa a solução ativa para marcar Fiscal, Financeiro ou Operação no formulário e sugerir um desafio correspondente. Seleções anteriores permanecem. O texto sugerido pode acompanhar uma nova escolha de frente; uma descrição escrita ou editada pelo visitante é preservada. O CTA do estudo usa o mesmo comportamento e mantém o contexto de tempos e movimentos.

Os painéis preservam seus selos de dados fictícios ou cenário simulado e as premissas necessárias para interpretar os cálculos. Os rodapés priorizam como a ferramenta será aplicada à empresa, sem repetir avisos de isenção em todos os blocos.

## Exemplos das entregas — cinco abas

A seção “Na prática / O que você recebe” mantém cinco botões, preservando a identidade e a estrutura da página:

| Aba | Conteúdo |
| --- | --- |
| Margem por produto | Margens, Curva ABC de produtos/clientes/fornecedores e matriz de prioridades. |
| Cadastro fiscal no ERP | Mapa ilustrativo de conferência de cadastros. |
| Estoques e perdas | Medições físicas da literatura em três lojas de Pombal/PB, com exemplo separado de capital de giro. |
| Fluxo de caixa e DRE | DRE simplificada, medidor de ponto de equilíbrio e movimentações de caixa. |
| Eficiência e gargalos | Capacidade por etapa, OEE, simulação de melhoria e fluxo de POPs. |

Cada painel identifica sua base: **dados da literatura**, **dados fictícios** ou **cenário simulado**. Estudos externos não são projetos, clientes ou endossos da Avelar.

### Margem e Curva ABC

O seletor de exemplo alterna entre engenharia de cardápio (Gularte e Cardoso, 2020, dados de 2017) e serviços de beleza (Alves e Santos, 2025). A tabela mantém a métrica publicada: contribuição no primeiro estudo e lucro reportado na tabela 17 no segundo. Os custos da tabela 16 de beleza não conciliam com a tabela 17; essa limitação fica acessível na leitura da fonte. Não foi criado um custo unitário para fechar a diferença.

O recorte do cardápio contém Filet mignon, Brie ao forno, Rolinhos suínos e Salada de abacate. A contribuição total dos quatro itens é R$ 25.502,58. A ABC calculada somente para esse recorte agrupa Filet + Brie na classe A (R$ 21.793,49), Rolinhos na B (R$ 2.704,70) e Salada na C (R$ 1.004,39). Os valores em centavos da fonte são preservados; percentuais são arredondados apenas na exibição.

A matriz é outra análise: preserva a classificação do artigo dentro de cada categoria original. Entradas e pratos principais não compartilham um corte único de contribuição/popularidade. A ABC continua claramente identificada como o recorte de cardápio mesmo quando o visitante escolhe a tabela de serviços; não foram inventados volumes para classificar os três serviços.

O seletor de ABC também mantém os exemplos fictícios de clientes e fornecedores. Para clientes, a contribuição de R$ 40.000 é distribuída em 75%, 20% e 5% (2, 3 e 5 clientes). Para fornecedores, a base de compras de R$ 60.000 é distribuída em 70%, 20% e 10% (2, 3 e 5 fornecedores). A matriz de fornecedores cruza criticidade e compras, sem atribuir margem de venda a fornecedor.

### Fluxo de caixa e DRE

O controle de vendas varia entre R$ 40 mil e R$ 150 mil. Tributos de 10%, demais custos variáveis de 50% e custos fixos de R$ 30.000 são premissas fictícias. A margem de contribuição é 40%, e o ponto de equilíbrio é R$ 30.000 / 40% = R$ 75.000. O resultado líquido do cenário pressupõe que não existam outras despesas além das mostradas.

Para o caixa, o saldo inicial é R$ 8.000; 90% das vendas são recebidas no período e todos os custos apresentados são pagos. Com vendas de R$ 100.000, a DRE mostra R$ 10.000 de resultado, enquanto o caixa termina com R$ 8.000: a diferença corresponde às vendas ainda não recebidas no exemplo. Caixa e resultado não são tratados como a mesma métrica.

Os valores são calculados em centavos. Cenários abaixo do ponto de equilíbrio mostram resultado negativo; saldo negativo de caixa também permanece visível. As alíquotas do exemplo não constituem orientação tributária.

### Capacidade, OEE e POPs

Preparação tem capacidade efetiva de 180 unidades/dia, embalagem de 150 e a produção possui capacidade nominal de 250. No cenário inicial, disponibilidade de 80%, desempenho de 80% e qualidade de 75% produzem OEE de 48% e capacidade efetiva de 120 unidades/dia. A produção limita o processo.

Ao ativar a melhoria ilustrativa, disponibilidade passa a 90%, desempenho permanece em 80% e qualidade passa a 5/6 (83,3% exibidos), resultando em OEE de 60% e capacidade efetiva de 150 unidades/dia. A capacidade do processo considera o mínimo entre todas as etapas, e as vendas adicionais são limitadas à demanda fictícia de 150 unidades/dia.

A margem adicional hipotética é 30 unidades vendidas/dia × R$ 6 de contribuição por unidade × 22 dias = R$ 3.960/mês. Depende de demanda e venda do volume; custos de implantação não estão deduzidos. Não se apresenta como economia líquida garantida.

O exemplo de POPs reúne compras, recebimento, faturamento e conferência de caixa, com responsáveis, momento da atividade e registro de conferência. O fluxo é ilustrativo e deve ser adaptado a uma operação real.

## Simulador

A simulação de um único período calcula: economia bruta = custo de referência × redução; economia elegível = máximo entre zero e economia bruta menos implantação; honorários = economia elegível × participação; benefício da empresa = economia bruta − implantação − honorários. Usa centavos e mostra saldo negativo se a implantação superar a economia, com honorários zero.

Não substitui a medição contratual: não há compensação de implantação entre períodos, abatimento de setup, inflação, mix, sazonalidade ou tratamento de créditos tributários.

## Conteúdo e privacidade

A base permanece o documento fornecido de estruturação da consultoria, de 05/11/2026. A apresentação destaca a experiência prática, sem atribuir formação concluída, especialização acadêmica ou registro profissional. Atos privativos continuam condicionados a profissional habilitado.

A página não salva uma cópia do formulário após recarregar, não inclui cookies de publicidade nem análise de tráfego. Abrir o WhatsApp compartilha com esse serviço a mensagem preparada. Google Fonts recebe as requisições das fontes; a hospedagem pode manter registros técnicos. Atualize a nota de privacidade caso adicione captura de leads ou outras integrações.

São mantidos navegação por teclado, foco visível, preferência por movimento reduzido e piso de 11 px para textos informativos.

## Publicar

O site é estático. Envie os arquivos para uma hospedagem preservando a pasta `assets`. O código não publica nada automaticamente. Configure os dados institucionais definitivos, fotos e perfis antes da divulgação.

## Estudo aplicado em studio de beleza

Incluído em 06/11/2026 a partir dos seis recortes de imagens e da estimativa mensal fornecidos pelo usuário. O estudo aparece na abertura, em uma seção própria com gráfico e tabela, na apresentação de Lucas, na frente operacional e na FAQ. O botão do estudo seleciona a frente operacional e sugere um texto no formulário, preservando uma descrição já digitada pelo visitante.

Os recortes comparam o **cenário atual com o cenário proposto** e um slide se intitula **Resultados Estimados**. Por isso, o site não apresenta essas projeções como economia de caixa já realizada por um cliente da consultoria. Não atribui publicação, aceite em congresso, autoria de Nathally ou contratação comercial que os recortes não comprovam. O nome do studio não foi informado.

| Indicador | Atual | Proposto | Variação informada no artigo |
| --- | --- | --- | --- |
| Ciclo total | 171 s | 129 s | 24,5%; 42 s |
| Transportes | 44 s | 14 s | 68,1%; 30 s |
| Operações | 97 s | 85 s | 12,3%; 12 s |
| Inspeções | 30 s | 30 s | Mantidas |
| Rateio fixo | R$ 0,54 | R$ 0,40 | R$ 0,14 por ciclo |
| Custo direto total | R$ 4,20 | R$ 4,06 | 3,3%; R$ 0,14 por ciclo |

Os percentuais foram preservados como apresentados, inclusive os arredondamentos do artigo. O gráfico usa os tempos absolutos e a mesma escala de 171 s para os dois cenários. Os totais são 97 + 44 + 30 = 171 e 85 + 14 + 30 = 129.

**Aproximadamente R$ 900/mês** é o custo de atividades sem valor agregado relatado pelo autor. **Aproximadamente R$ 10.800 em 12 meses** é sua anualização simples. Esses valores não foram convertidos em economia integral comprovada, nem derivados da redução percentual de transportes. O site explica que a parcela eliminada depende da implementação e medição. A variação de rateio ou de tempo também não é apresentada como redução automática de desembolsos.

O seletor mensal/anual modifica somente a apresentação desse custo identificado. O simulador geral de honorários continua independente, com suas premissas hipotéticas anteriores.


## Por que organizar — pesquisa e efeito no lucro

A seção `#pesquisas` aparece **imediatamente depois do Hero e antes de Soluções**. Ela transforma a promessa em um problema mensurável e conduz a uma solução e ao painel correspondente. Soluções e Entregas permanecem próximas.

As cinco abas são Caixa e controle, Preço e margem, Estoque e perdas, Produtividade e Tempo e processos. O dado principal, o mecanismo gerencial e a ação ficam visíveis. Evidências adicionais, critérios de leitura e a lista completa de **20 fontes** ficam em detalhes expansíveis para evitar excesso de opções.

Os relatórios fornecidos são revisões secundárias: “Relatorio_Consultoria_Processos_Financas(3).pdf” e “Diagnóstico Empírico de Gestão Financeira(2).docx”. O texto de instruções foi “Texto colado(4).txt”. As afirmações foram confrontadas com as fontes originais disponíveis. As diferenças e os itens sem confirmação suficiente estão em `NOTAS_DA_REVISAO.md`.

Entre os indicadores: 61% de uso de conta pessoal (Sebrae, 2025), 57% em equilíbrio ou prejuízo no recorte de julho de 2026 da Abrasel, 1,82% de perda setorial (ABRAS, base 2025), +52,11% de produtividade no B+P e redução de 14min17s no ciclo de pedidos de um supermercado. Cada indicador tem base e período próprios; não são somados ou generalizados como taxa nacional de desorganização.

O cálculo expansível de impacto é independente das pesquisas: lucro-base = receita × margem líquida informada; custos evitados = receita × percentual escolhido (0,5%, 1% ou 2%); impacto líquido = custos evitados − custos da melhoria; resultado posterior = lucro-base + impacto líquido. Com R$ 100.000 de receita, margem de 5%, hipótese de 1% de custos evitados e custo de melhoria zero, o lucro passa de R$ 5.000 para R$ 6.000 (+20%). Os percentuais são hipóteses selecionadas pelo visitante, não previsões dos estudos. O cálculo mantém vendas e outras despesas constantes, mostra resultados negativos e evita divisão por lucro zero.

## Casos por setor e método

`#estudo` tem quatro abas: Serviços & Estética (caso autoral), Supermercados, Bares & Restaurantes e Oficinas & Indústrias. Casos externos mantêm os recortes e fontes identificados. O caso de oficina de 46 s para 14 s é apresentado como relatado no diagnóstico fornecido, com a limitação de acesso atual ao PDF original explicitada. Não foram certificados orçamento e retorno financeiro.

O método mantém quatro passos e acrescenta um piloto condicional: dias 1–15 (diagnóstico e linha de base), 16–30 (organização e rotinas), 31–60 (custos e piloto assistido), 61–90 (validação e sustentação). O prazo depende dos dados e escopo. A etapa 3 explica o ponto de pedido: consumo médio × prazo de reposição + estoque de segurança; consumo e prazo devem usar a mesma unidade de tempo.

Chamadas de pesquisa e dos casos selecionam a frente adequada e sugerem um desafio no formulário. Um texto já editado pelo visitante é preservado.

## Conferência desta versão

Foram verificados a sintaxe JavaScript, IDs e âncoras, os cinco painéis, as abas de pesquisa e casos, o seletor de exemplos, a navegação e o rodapé com CNPJ. O pacote contém apenas os arquivos de produção e estas instruções; páginas internas de teste não fazem parte do ZIP.

Continuam pendentes os arquivos reais de fotos, URLs de LinkedIn e e-mail comercial. Não foram criadas credenciais, retratos ou contatos fictícios.
