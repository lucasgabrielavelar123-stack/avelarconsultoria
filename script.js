/*
 * AVELAR CONSULTORIA — JavaScript puro, sem bibliotecas.
 * Execute abrindo index.html. Personalize a marca e os contatos em config.js.
 * Este site não recebe documentos, não envia formulários a um servidor e não
 * armazena dados pessoais. O formulário abre o WhatsApp com a mensagem pronta;
 * o visitante confirma o envio no próprio aplicativo.
 */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const config = Object.assign({
    nomeCurto: "Avelar",
    nomeCompleto: "Avelar Consultoria",
    subtitulo: "CONSULTORIA INTEGRADA",
    whatsapp: "5562991310782",
    email: "",
    localidade: "Goiânia e Região Metropolitana — GO",
    atendimento: "Atendimento presencial e remoto",
    cnpj: "70.082.137/0001-18",
    equipe: {},
  }, window.CONSULTORIA_CONFIG || {});

  // 1. Marca e canal comercial: apenas valores fornecidos pelo proprietário.
  $$('[data-brand]').forEach((element) => {
    const dot = document.createElement("span");
    dot.className = "brand-dot";
    dot.textContent = ".";
    element.replaceChildren(document.createTextNode(String(config.nomeCurto)), dot);
  });
  $$('[data-brand-subtitle]').forEach((element) => { element.textContent = config.subtitulo; });
  $$('[data-brand-plain]').forEach((element) => { element.textContent = config.nomeCompleto; });
  $$('[data-brand-label]').forEach((element) => {
    element.setAttribute("aria-label", `${config.nomeCompleto}, início`);
  });
  document.title = `${config.nomeCompleto} | Clareza para crescer`;
  $('meta[property="og:title"]').content = `${config.nomeCompleto} — Clareza para crescer`;
  $('#year').textContent = String(new Date().getFullYear());

  const whatsappDigits = String(config.whatsapp).replace(/\D/g, "");
  const validWhatsapp = /^[1-9]\d{9,14}$/.test(whatsappDigits);
  const email = String(config.email).trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function contactLink(message = "Olá! Gostaria de conversar sobre a minha empresa.") {
    if (validWhatsapp) return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
    if (validEmail) {
      return `mailto:${email}?subject=${encodeURIComponent("Primeira conversa — " + config.nomeCompleto)}&body=${encodeURIComponent(message)}`;
    }
    return null;
  }

  const directContact = $('#direct-contact');
  if (contactLink()) {
    directContact.hidden = false;
    directContact.href = contactLink();
    directContact.textContent = validWhatsapp ? "Conversar pelo WhatsApp ↗" : "Conversar por e-mail ↗";
    if (validWhatsapp) {
      directContact.target = "_blank";
      directContact.rel = "noopener noreferrer";
    }
  }

  // Canal visível no rodapé e atalho flutuante, inclusive sem preencher o formulário.
  const whatsappFloat = $('#whatsapp-float');
  const footerWhatsapp = $('#footer-whatsapp');
  whatsappFloat.hidden = !validWhatsapp;
  footerWhatsapp.hidden = !validWhatsapp;
  if (validWhatsapp) {
    whatsappFloat.href = contactLink();
    whatsappFloat.setAttribute("aria-label", `Conversar com ${config.nomeCompleto} pelo WhatsApp`);
    footerWhatsapp.href = contactLink();
    const formatted = whatsappDigits.startsWith("55") && whatsappDigits.length === 13
      ? whatsappDigits.slice(2).replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
      : `+${whatsappDigits}`;
    $('span', footerWhatsapp).textContent = formatted;
  }
  if (validEmail) {
    $('#footer-email').hidden = false;
    $('#footer-email').href = `mailto:${email}`;
    $('#footer-email').textContent = email;
  }
  $$('[data-location]').forEach(element => { element.textContent = config.localidade; });
  $$('[data-service-mode]').forEach(element => { element.textContent = config.atendimento; });
  if (String(config.cnpj).trim()) {
    $('#footer-cnpj').hidden = false;
    $('#footer-cnpj').textContent = `CNPJ: ${String(config.cnpj).trim()}`;
  }

  // Fotos e perfis só aparecem quando dados reais são configurados e válidos.
  // Nenhum retrato, credencial ou endereço de LinkedIn é presumido.
  $$('[data-profile]').forEach(card => {
    const profile = (config.equipe || {})[card.dataset.profile] || {};
    const image = $('[data-profile-photo]', card);
    const linkedin = $('[data-profile-linkedin]', card);
    if (profile.foto) {
      try {
        const url = new URL(String(profile.foto), window.location.href);
        const localPhoto = url.origin === window.location.origin && ["http:", "https:", "file:"].includes(url.protocol);
        const embeddedPhoto = /^data:image\/(?:png|jpeg|webp|avif);base64,/i.test(String(profile.foto));
        if (url.protocol === "https:" || localPhoto || embeddedPhoto) {
          image.addEventListener("load", () => {
            image.parentElement.hidden = false;
            card.classList.add("has-photo");
          }, { once: true });
          image.addEventListener("error", () => {
            image.parentElement.hidden = true;
            card.classList.remove("has-photo");
          });
          image.src = url.href;
        }
      } catch { /* Foto ausente: preserva o card de apresentação. */ }
    }
    if (profile.linkedin) {
      try {
        const url = new URL(String(profile.linkedin));
        const linkedinDomain = url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com");
        if (url.protocol === "https:" && linkedinDomain && url.pathname.startsWith("/in/")) {
          linkedin.href = url.href;
          linkedin.hidden = false;
        }
      } catch { /* Um perfil inválido não gera um link quebrado. */ }
    }
  });

  // 2. Navegação: menu móvel, progresso de leitura e seção ativa.
  const header = $('#cabecalho');
  const menuToggle = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  let scrollFrame = null;

  function setMenu(open, returnFocus = false) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    mobileNav.hidden = !open;
    document.body.classList.toggle("menu-is-open", open);
    if (returnFocus) menuToggle.focus();
  }
  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  $$('a', mobileNav).forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) setMenu(false, true);
  });
  const desktopViewport = window.matchMedia("(min-width: 901px)");
  desktopViewport.addEventListener("change", (event) => { if (event.matches) setMenu(false); });

  function updateScroll() {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
    header.classList.toggle("is-scrolled", window.scrollY > 16);
    $('.reading-progress').style.transform = `scaleX(${progress})`;
    scrollFrame = null;
  }
  function scheduleScroll() {
    if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(updateScroll);
  }
  window.addEventListener("scroll", scheduleScroll, { passive: true });
  window.addEventListener("resize", scheduleScroll, { passive: true });
  updateScroll();

  if ("IntersectionObserver" in window) {
    const navLinks = $$('.desktop-nav a');
    const navigationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) navLinks.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 });
    $$('#inicio, #pesquisas, #solucoes, #entregas, #metodo, #estudo, #simulador, #sobre, #duvidas, #contato').forEach((section) => navigationObserver.observe(section));
  }

  // 3. Entradas ao rolar. Sem suporte ou com movimento reduzido, tudo é visível.
  if ("IntersectionObserver" in window && !motionPreference.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.documentElement.classList.add("motion-enabled");
    $$('.reveal').forEach((element) => revealObserver.observe(element));
  }
  function animateContent(element) {
    // Uma interação explícita nunca deixa o painel preso ao estado de entrada.
    element.classList.add("is-visible");
    if (motionPreference.matches || !element.animate) return;
    element.animate([
      { opacity: 0.5, transform: "translateY(5px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: 280, easing: "ease-out" });
  }

  // Saltos por âncora também revelam o destino. Isso preserva a legibilidade
  // quando o navegador rola rapidamente ou adia o IntersectionObserver.
  function revealAnchorTarget(hash) {
    if (!hash || hash === "#") return;
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!target) return;
    if (target.classList.contains("reveal")) target.classList.add("is-visible");
    $$('.reveal', target).forEach(element => element.classList.add("is-visible"));
  }
  $$('a[href^="#"]').forEach(link => link.addEventListener("click", () => revealAnchorTarget(link.hash)));
  revealAnchorTarget(window.location.hash);

  // 4. Abas de soluções. Conteúdo baseado nas frentes do documento fornecido.
  const services = {
    fiscal: {
      contactFront: "Gestão fiscal",
      contactChallenge: "Quero revisar os cadastros e as divergências fiscais no ERP da minha empresa.",
      kicker: "CONSISTÊNCIA NA ORIGEM",
      title: "O cuidado com o fiscal começa dentro da operação.",
      description: "Organizamos os dados que alimentam sua rotina fiscal, identificamos inconsistências e preparamos uma base confiável para a tomada de decisão e a validação contábil.",
      note: "As validações e os atos privativos são realizados pelo contador do cliente ou por profissional habilitado contratado para o projeto.",
      deliveries: [
        ["Cadastros mais consistentes", "Revisão operacional de dados de produtos e identificação de divergências no ERP."],
        ["Conferência nas entradas", "Fluxos e checklists para cruzar pedidos, documentos fiscais e recebimento."],
        ["Oportunidades documentadas", "Mapeamento de inconsistências e simulações gerenciais para análise do responsável técnico."],
      ],
    },
    financeiro: {
      contactFront: "Gestão financeira",
      contactChallenge: "Quero entender meu fluxo de caixa, as margens e o ponto de equilíbrio da minha empresa.",
      kicker: "CLAREZA SOBRE O CAIXA",
      title: "O dinheiro precisa de direção, além de controle.",
      description: "Conectamos custos, margens e prazos para dar visibilidade ao resultado de cada decisão. Analisamos onde o caixa se perde e quais oportunidades merecem prioridade.",
      note: "Priorizamos oportunidades com dados validados e acompanhamos os ganhos após a implementação.",
      deliveries: [
        ["Tarifas e contratos sob análise", "Mapeamento de despesas recorrentes e apoio à renegociação de taxas, tarifas e contratos."],
        ["Capital de giro com propósito", "Análise dos prazos de estoque, pagamento e recebimento para organizar o ciclo financeiro."],
        ["Preços com margem visível", "Custos por produto, margem de contribuição e ferramentas para decisões de preço e desconto."],
      ],
    },
    operacao: {
      contactFront: "Eficiência operacional",
      contactChallenge: "Quero identificar gargalos, perdas e oportunidades de padronização na minha operação.",
      kicker: "EFICIÊNCIA NA PRÁTICA",
      title: "O resultado também se constrói no dia a dia.",
      description: "Analisamos tempos, movimentos, perdas e capacidade em rotinas de produção e serviços. Apoiamos métodos mais consistentes e controles que ajudam sua equipe a decidir.",
      note: "Indicadores e rotinas são construídos com sua equipe, com responsabilidades definidas em cada etapa.",
      deliveries: [
        ["Métodos e produção com planejamento", "Estudos de tempos e movimentos, padronização, PCP, sequenciamento e análise de capacidade."],
        ["Menos perdas, estoques melhores", "Fichas técnicas, curva ABC, inventário e acompanhamento do consumo real de materiais."],
        ["Dados que viram decisão", "Automação de controles, planilhas integradas e painéis gerenciais para acompanhar os indicadores."],
      ],
    },
  };

  function createDelivery([title, description], index) {
    const article = document.createElement("article");
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const content = document.createElement("div");
    const heading = document.createElement("h4");
    heading.textContent = title;
    const paragraph = document.createElement("p");
    paragraph.textContent = description;
    content.append(heading, paragraph);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-diagonal");
    svg.append(use);
    article.append(number, content, svg);
    return article;
  }

  function selectService(key) {
    const service = services[key];
    if (!service) return;
    $$('[data-service]').forEach((button) => {
      const selected = button.dataset.service === key;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    $('#service-kicker').textContent = service.kicker;
    $('#service-title').textContent = service.title;
    $('#service-description').textContent = service.description;
    $('#service-note').textContent = service.note;
    $('#service-contact').dataset.contactService = key;
    $('#service-deliveries').replaceChildren(...service.deliveries.map(createDelivery));
    $('#service-panel').setAttribute("aria-labelledby", `tab-${key}`);
    animateContent($('#service-panel'));
  }

  const serviceButtons = $$('[data-service]');
  serviceButtons.forEach((button) => button.addEventListener("click", () => selectService(button.dataset.service)));

  // Teclado acessível: setas, Home e End para os dois conjuntos de abas.
  function tabKeyboard(buttons, vertical = false) {
    buttons.forEach((button, index) => button.addEventListener("keydown", (event) => {
      let next;
      const previousKey = vertical ? "ArrowUp" : "ArrowLeft";
      const nextKey = vertical ? "ArrowDown" : "ArrowRight";
      if (event.key === nextKey) next = (index + 1) % buttons.length;
      else if (event.key === previousKey) next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = buttons.length - 1;
      else return;
      event.preventDefault();
      buttons[next].focus();
      buttons[next].click();
    }));
  }
  tabKeyboard(serviceButtons);

  // 5. Método: uma entrega concreta por etapa.
  const methodSteps = [
    {
        "period": "Dias 1 a 15",
        "name": "Diagnóstico e linha de base",
        "short": "Sigilo, dados e medição da rotina.",
        "title": "Primeiro, damos nome ao problema.",
        "description": "Combinamos o sigilo e o escopo, conciliamos até 90 dias de registros disponíveis e observamos a operação. Quando aplicável, pesamos ou cronometramos por 5 a 7 dias para construir a linha de base.",
        "chips": [
            "Dados conciliados",
            "Medição em campo",
            "Linha de base acordada"
        ]
    },
    {
        "period": "Dias 16 a 30",
        "name": "Organização e primeiras rotinas",
        "short": "Contas separadas, retiradas e gestão visual.",
        "title": "Controles simples que cabem na rotina.",
        "description": "Organizamos a separação entre empresa e sócios, um pró-labore acordado com a contabilidade, o registro das retiradas e o calendário de pagamentos. Com a equipe, priorizamos regras de bolso, gestão visual e ajustes iniciais de 5S.",
        "chips": [
            "Retiradas identificadas",
            "Contas a pagar visíveis",
            "Organização inicial"
        ]
    },
    {
        "period": "Dias 31 a 60",
        "name": "Custos e piloto assistido",
        "short": "Margens, fichas técnicas e um responsável.",
        "title": "Um piloto pequeno. Uma medição clara.",
        "description": "Apuramos contribuição por produto e canal, estruturamos fichas técnicas e analisamos ABC, consumo e reposição. Ponto de pedido = consumo médio × prazo de reposição + estoque de segurança, com consumo e prazo na mesma unidade de tempo. Implantamos o piloto com um responsável interno e revisões frequentes.",
        "chips": [
            "Margem por canal",
            "Fichas técnicas e ABC",
            "Piloto com responsável"
        ]
    },
    {
        "period": "Dias 61 a 90",
        "name": "Validar e sustentar",
        "short": "Resultado, auditoria e rotina permanente.",
        "title": "O resultado precisa continuar depois.",
        "description": "Comparamos o piloto com a linha de base e validamos a memória de cálculo. Separamos economia recorrente, capital de giro liberado e capacidade disponível; combinamos auditorias quinzenais e registramos os resultados com o cliente e, quando necessário, sua contabilidade.",
        "chips": [
            "Resultados sem dupla contagem",
            "Auditoria quinzenal",
            "Registro de validação"
        ]
    }
];

  function selectMethod(index) {
    const step = methodSteps[index];
    if (!step) return;
    $$('[data-step]').forEach((button) => {
      const selected = Number(button.dataset.step) === index;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    const number = String(index + 1).padStart(2, "0");
    $('#method-count').textContent = `${number} / 04`;
    $('#method-number').textContent = number;
    $('#method-period').textContent = step.period;
    $('#method-detail-title').textContent = step.title;
    $('#method-detail-description').textContent = step.description;
    $('#method-chips').replaceChildren(...step.chips.map((text) => {
      const chip = document.createElement("span");
      chip.textContent = text;
      return chip;
    }));
    $('#method-panel').setAttribute("aria-labelledby", `step-${index}`);
    animateContent($('.method-detail-copy'));
  }
  const methodButtons = $$('[data-step]');
  methodButtons.forEach((button) => button.addEventListener("click", () => selectMethod(Number(button.dataset.step))));
  tabKeyboard(methodButtons, true);

  // Exemplos visuais: dados fictícios e rótulos explícitos em cada painel.
  const demoButtons = $$('[data-demo]');
  function selectDemo(key) {
    demoButtons.forEach(button => {
      const selected = button.dataset.demo === key;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      const panel = $(`#demo-${button.dataset.demo}`);
      panel.hidden = !selected;
      if (selected) animateContent(panel);
    });
  }
  demoButtons.forEach(button => button.addEventListener("click", () => selectDemo(button.dataset.demo)));
  tabKeyboard(demoButtons);

  const caseButtons = $$('[data-case]');
  function selectCase(key) {
    caseButtons.forEach(button => { const active=button.dataset.case===key; button.setAttribute('aria-selected',String(active));button.tabIndex=active ? 0 : -1; });
    $$('[data-case-panel]').forEach(panel => { const active=panel.dataset.casePanel===key;panel.hidden=!active;if(active){animateContent(panel);$$('.reveal',panel).forEach(el=>el.classList.add('is-visible'));} });
  }
  caseButtons.forEach(button=>button.addEventListener('click',()=>selectCase(button.dataset.case)));
  tabKeyboard(caseButtons);
  $('.hero-study-link').addEventListener('click',()=>selectCase('autoral'));
  const sectorChallenges={varejo:'Quero avaliar perdas de estoque, compras e o fluxo de atendimento do meu negócio.',restaurantes:'Quero medir desperdícios, custos e margens no meu restaurante.',industria:'Quero organizar processos e avaliar gargalos, tempos e retrabalho na minha operação.'};
  $$('[data-sector-contact]').forEach(link=>link.addEventListener('click',()=>prefillContact('Eficiência operacional',sectorChallenges[link.dataset.sectorContact])));


  // Estudo fornecido pelo autor: custo identificado, não promessa de economia.
  // 900 reais/mês é uma estimativa relatada; 10.800 é sua projeção em 12 meses.
  const studyPeriodButtons = $$('[data-study-period]');
  const studyCostFormat = new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0,
  });
  studyPeriodButtons.forEach(button => button.addEventListener("click", () => {
    const annual = button.dataset.studyPeriod === "anual";
    studyPeriodButtons.forEach(option => option.setAttribute("aria-pressed", String(option === button)));
    $('#study-cost-value').textContent = `≈ ${studyCostFormat.format(annual ? 900 * 12 : 900)}`;
    $('#study-cost-label').textContent = annual
      ? "Custo anual projetado de atividades sem valor agregado."
      : "Custo mensal estimado de atividades sem valor agregado.";
    animateContent($('.study-cost-live'));
  }));

  // O CTA preserva escolhas e texto próprio. Só substitui a sugestão do site.
  let autoFilledChallenge = "";
  function prefillContact(front, suggestedChallenge) {
    const option = $$('input[name="frentes"]').find(input => input.value === front);
    if (option) option.checked = true;
    const challenge = $('#challenge');
    if (!challenge.value.trim() || challenge.value === autoFilledChallenge) {
      challenge.value = suggestedChallenge;
      autoFilledChallenge = suggestedChallenge;
    }
  }
  $$('[data-service-contact]').forEach(link => link.addEventListener("click", () => {
    const service = services[link.dataset.contactService];
    if (service) prefillContact(service.contactFront, service.contactChallenge);
  }));

  let studyInterest = false;
  $$('[data-study-contact]').forEach(link => link.addEventListener("click", () => {
    studyInterest = true;
    prefillContact("Eficiência operacional", "Gostaria de avaliar tempos, movimentações e métodos de trabalho na minha empresa.");
  }));

  // 6. Simulador de UM período. Todos os cálculos monetários usam centavos.
  // E = custo de referência × redução; L = max(0, E - implantação)
  // H = L × participação; B = E - implantação - H
  // B pode ser negativo. Não escondemos o custo quando a economia é insuficiente.
  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 2,
  });
  const currencyCents = new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
  const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
  const costInput = $('#monthly-cost');
  const reductionInput = $('#reduction');
  const implementationInput = $('#implementation');
  const feeInput = $('#fee');
  const money = (cents) => (Math.round(cents) % 100 ? currencyCents : currency).format(cents / 100);
  let countFrame = null;
  let displayedBenefit = 240000;

  function clampInput(input) {
    const parsed = input.valueAsNumber;
    const minimum = Number(input.min || 0);
    const maximum = Number(input.max || Number.MAX_SAFE_INTEGER);
    return Math.min(maximum, Math.max(minimum, Number.isFinite(parsed) ? parsed : minimum));
  }
  function fillRange(input) {
    const fraction = (clampInput(input) - Number(input.min)) / (Number(input.max) - Number(input.min));
    input.style.setProperty("--fill", `${fraction * 100}%`);
  }
  function showBenefit(target, immediate = false) {
    if (countFrame !== null) window.cancelAnimationFrame(countFrame);
    const element = $('#retained-value');
    if (immediate || motionPreference.matches || document.hidden) {
      displayedBenefit = target;
      element.textContent = money(target);
      return;
    }
    const start = displayedBenefit;
    const startedAt = performance.now();
    function tick(time) {
      const progress = Math.min(1, (time - startedAt) / 300);
      const eased = 1 - (1 - progress) ** 3;
      displayedBenefit = Math.round(start + (target - start) * eased);
      element.textContent = money(displayedBenefit);
      if (progress < 1) countFrame = window.requestAnimationFrame(tick);
      else countFrame = null;
    }
    countFrame = window.requestAnimationFrame(tick);
  }
  function calculate(immediate = false) {
    const costCents = Math.round(clampInput(costInput) * 100);
    const reduction = clampInput(reductionInput);
    const implementationCents = Math.round(clampInput(implementationInput) * 100);
    const percentage = clampInput(feeInput);
    const gross = Math.round(costCents * reduction / 100);
    const eligible = Math.max(0, gross - implementationCents);
    const fee = Math.round(eligible * percentage / 100);
    const benefit = gross - implementationCents - fee;

    $('#monthly-cost-output').textContent = money(costCents);
    $('#reduction-output').textContent = `${decimal.format(reduction)}%`;
    $('#gross-value').textContent = money(gross);
    $('#implementation-value').textContent = `− ${money(implementationCents)}`;
    $('#eligible-value').textContent = money(eligible);
    $('#fee-value').textContent = `− ${money(fee)}`;
    $('#fee-percentage').textContent = `(${decimal.format(percentage)}%)`;
    $('#retained-bar').style.width = `${eligible ? (eligible - fee) / eligible * 100 : 0}%`;
    $('#fee-bar').style.width = `${eligible ? fee / eligible * 100 : 0}%`;

    let status;
    if (benefit < 0) status = "Neste período, a implantação supera a economia. O saldo é negativo e não há honorários de êxito.";
    else if (eligible === 0) status = "Não há economia líquida elegível neste cenário. Honorários de êxito: R$ 0.";
    else if (percentage === 100) status = "Nesta premissa, a participação absorve toda a economia elegível. Nenhum benefício líquido permanece com a empresa.";
    else if (percentage > 50) status = "Nesta premissa, a participação da consultoria supera o benefício que permanece com a empresa.";
    else if (percentage === 50) status = "Nesta premissa, a economia elegível é dividida igualmente entre empresa e consultoria.";
    else status = "A maior parte do benefício permanece com a sua empresa.";
    $('#calc-status').textContent = status;
    showBenefit(benefit, immediate);
    fillRange(costInput);
    fillRange(reductionInput);
  }
  [costInput, reductionInput, implementationInput, feeInput].forEach((input) => {
    input.addEventListener("input", () => calculate());
    input.addEventListener("change", () => {
      input.value = String(clampInput(input));
      calculate();
    });
  });
  calculate(true);

  // Evidências externas: dados e recortes próprios; não são resultados da consultoria.
  const researchTopics = {
    caixa: {
      kind: "LEVANTAMENTO · PEQUENOS NEGÓCIOS", value: "61%",
      label: "declararam pagar despesas do negócio com a conta pessoal.",
      context: "Sebrae · dados de 2025 · divulgação em jan/2026",
      title: "Conta misturada. Resultado difícil de enxergar.",
      finding: "No levantamento Hábitos Financeiros, 61% relataram esse uso da conta pessoal. No mesmo levantamento, 10% responderam não ter o controle financeiro pesquisado. São indicadores distintos.",
      mechanism: "Retiradas e despesas sem identificação dificultam saber o que a operação gerou e quanto pode ser reinvestido. Separar os registros melhora a leitura do caixa; a economia precisa ser medida.",
      action: "Na prática: conciliar entradas e saídas, registrar retiradas e acompanhar o fluxo de caixa.",
      method: "Respostas declaradas por pequenos negócios em 2025. O percentual descreve um hábito, não a proporção de empresas sem lucro nem um prejuízo causado exclusivamente por ele.",
      chartTitle: "Uma prática ainda frequente", chartMax: 100,
      bars: [["Uso da conta pessoal",61,"61%"]],
      source: "Sebrae / ASN", url: "https://agenciasebrae.com.br/cultura-empreendedora/61-dos-empreendedores-brasileiros-fazem-pagamentos-da-empresa-com-a-conta-pessoal/", example: "",
      front: "Gestão financeira", challenge: "Quero organizar o fluxo de caixa, as retiradas e a leitura do resultado da minha empresa.",
      cta: "Quero organizar meu caixa", tool: "Ver o painel de caixa", demo: "caixa",
    },
    margem: {
      kind: "LEVANTAMENTO · ALIMENTAÇÃO FORA DO LAR", value: "32,5%",
      label: "das microempresas do recorte declararam lucro no mês.",
      context: "Abrasel · resultado de jun/2025 · coleta em jul/2025",
      title: "Vender é o começo. Margem é o que sustenta.",
      finding: "Entre as microempresas de alimentação pesquisadas, 32,5% ficaram no lucro, 45% no equilíbrio e 22% no prejuízo em junho de 2025.",
      mechanism: "Preço precisa considerar insumos, tributos, taxas e o canal de venda. Contribuição positiva por item ainda precisa cobrir os custos fixos do negócio.",
      action: "Na prática: apurar custo por produto e canal, acompanhar o mix e calcular o ponto de equilíbrio.",
      method: "O levantamento total ouviu 2.565 empresários. A divulgação não informa o tamanho do subgrupo de microempresas. Respostas declaradas, percentuais arredondados e um mês de referência; não medem a causa do desempenho.",
      chartTitle: "Resultado declarado no recorte", chartMax: 100,
      bars: [["Lucro",32.5,"32,5%"],["Equilíbrio",45,"45%"],["Prejuízo",22,"22%"]],
      source: "Abrasel", url: "https://odp.abrasel.com.br/noticias/noticias/micro-pequenas-empresas-enfrentam-maiores-dificuldade250812111225/",
      example: "Exemplo de cálculo: custo de R$ 100 + 60% = preço de R$ 160. A margem bruta é 37,5%, antes das demais despesas. Acréscimo sobre custo e margem sobre venda são medidas diferentes.",
      front: "Gestão financeira", challenge: "Quero conhecer as margens por produto e canal e o ponto de equilíbrio da minha empresa.",
      cta: "Quero entender minhas margens", tool: "Ver o painel de margem", demo: "margem",
    },
    estoque: {
      kind: "INDICADOR SETORIAL · SUPERMERCADOS", value: "1,82%",
      label: "de perdas médias no setor supermercadista em 2025.",
      context: "ABRAS · ano-base 2025 · divulgação em mai/2026",
      title: "O que sai do estoque também sai da margem.",
      finding: "A ABRAS divulgou 1,82% de perda média, equivalente ao índice setorial de eficiência de 98,18%. Inventário e validade aparecem entre os pontos de atenção.",
      mechanism: "Vencimento e avaria consomem recursos sem virar venda. Reduzir baixas pode preservar o resultado; reduzir o estoque, por si só, libera capital de giro, não cria lucro.",
      action: "Na prática: conferir estoque físico, priorizar validade e giro e ajustar compras ao consumo.",
      method: "É um indicador do setor e de seus participantes, não uma taxa a aplicar automaticamente a uma loja. A nota consultada não detalha toda a amostra e sua ponderação.",
      chartTitle: "Frentes para investigar na operação", chartMax: 100,
      bars: [], chips: ["Inventário confiável", "Validade e giro", "Compras e consumo"],
      source: "ABRAS", url: "https://www.abras.com.br/comites/eficiencia-operacional/noticias/35085/eficiencia-operacional-sobe-para-9818-aponta-pesquisa-da-abras", example: "",
      front: "Eficiência operacional", challenge: "Quero medir perdas, organizar o estoque e melhorar a relação entre compras, validade e giro.",
      cta: "Quero mapear minhas perdas", tool: "Ver o painel de estoque", demo: "estoque",
    },
    produtividade: {
      kind: "RESULTADO DE PROGRAMA · INDÚSTRIA", value: "+52,11%",
      label: "de ganho médio de produtividade divulgado para os participantes.",
      context: "Brasil Mais Produtivo · primeira fase, 2016–2018",
      title: "Capacidade também se ganha com método.",
      finding: "A divulgação da ABDI, baseada na avaliação CEPAL/Ipea, registra esse ganho nas 3 mil pequenas e médias empresas atendidas com manufatura enxuta.",
      mechanism: "Menos deslocamento e retrabalho podem liberar capacidade. O benefício financeiro aparece com vendas adicionais ou custos efetivamente evitados, depois dos custos da mudança.",
      action: "Na prática: medir o gargalo, reorganizar o fluxo e padronizar o trabalho antes de ampliar recursos.",
      method: "Resultado agregado das empresas atendidas na primeira fase, divulgada em 2018. Não é taxa atual de toda a indústria, ganho de lucro nem efeito isolado de uma única ferramenta. Houve investimento e apoio técnico.",
      chartTitle: "Produtividade em índice · base anterior = 100", chartMax: 152.11,
      bars: [["Antes · base",100,"100"],["Depois · índice equivalente",152.11,"152,11"]],
      source: "ABDI · avaliação CEPAL/Ipea", url: "https://www.abdi.com.br/programa-bp-gera-ganho-de-52-na-produtividade-industrial/", example: "",
      front: "Eficiência operacional", challenge: "Quero avaliar gargalos, retrabalho e capacidade antes de ampliar os recursos da minha operação.",
      cta: "Quero avaliar minha capacidade", tool: "Ver o painel de gargalos", demo: "eficiencia",
    },
    tempo: {
      kind: "ESTUDO DE CASO · SUPERMERCADO", value: "−14min17s",
      label: "no tempo médio do ciclo de pedido após as mudanças relatadas.",
      context: "Mota e Carrijo · comparação 2023–2024 · publicação 2024",
      title: "Uma rotina mais clara encurta o caminho.",
      finding: "O caso registra ciclo médio de 1h41min04s antes e 1h26min47s depois de mudanças com PDCA, indicadores e plano de ação.",
      mechanism: "Pedidos com menos espera podem melhorar o atendimento e a capacidade. Tempo liberado só vira ganho financeiro quando há venda atendida ou custo evitado.",
      action: "Na prática: mapear etapas e responsáveis, registrar tempos e acompanhar atrasos e erros.",
      method: "Um supermercado do interior de MG; tempos de 26/jan a 28/fev de 2023 e 2024, seção 4.2. A consulta de satisfação envolveu 30 clientes e é outra medida. O estudo não demonstra aumento de lucro ou efeito causal isolado.",
      chartTitle: "Ciclo médio do pedido · mesma escala de tempo", chartMax: 6064,
      bars: [["Antes",6064,"1h41min04s"],["Depois",5207,"1h26min47s"]],
      source: "Mota e Carrijo · Capital Científico", url: "https://revistas.unicentro.br/index.php/capitalcientifico/article/download/7855/pdf", example: "",
      front: "Eficiência operacional", challenge: "Quero mapear o atendimento e os processos, reduzir esperas e definir rotinas e responsáveis.",
      cta: "Quero organizar meus processos", tool: "Ver o painel de eficiência", demo: "eficiencia",
    },
  };
  const researchUpdates = {"caixa": {"title": "Vende bem. Mas precisa cobrir o caixa com dinheiro próprio?", "finding": "Contas da empresa e do dono ainda se cruzam em muitos negócios. Sem identificar pagamentos e retiradas, fica difícil saber quanto a operação realmente deixa.", "mechanism": "Conciliar o caixa, separar as contas e definir retiradas registradas ajuda a enxergar custos e compromissos antes de recorrer a crédito.", "chartTitle": "Pesquisas distintas · cada indicador tem sua base", "bars": [["Pagamentos pela conta pessoal · 2025", 61, "61%"], ["Sem o controle pesquisado · 2025", 10, "10%"], ["Crédito obtido como PF · 2022", 61, "61%"], ["Dificuldade para obter crédito · 2022", 84, "84%"]], "method": "Os dois primeiros dados vêm de Hábitos Financeiros 2025. Os indicadores de crédito são da pesquisa de financiamento de 2022, com 6.345 entrevistas: 61% no recorte de crédito obtido como PF e 84% com dificuldade de acesso. Dificuldade não equivale a crédito negado, nem demonstra causa por falta de organização.", "extras": [{"title": "Crédito pessoal não é faturamento.", "text": "O levantamento de financiamento mostra maior uso de crédito PF em 2022. Para decidir, é preciso comparar o custo efetivo, o prazo e a necessidade de capital de giro.", "url": "https://agenciasebrae.com.br/wp-content/uploads/2023/01/credito-pessoa-fisica-juridica-nov-2022.pdf", "source": "Sebrae · financiamento, 2022"}, {"title": "Rotinas simples podem funcionar melhor.", "text": "Em experimento na República Dominicana, o treinamento com regras de bolso reduziu em 9 pontos percentuais os erros de relato financeiro. É um resultado de qualidade da informação, não aumento de lucro de 9%.", "url": "https://www.povertyactionlab.org/sites/default/files/research-paper/124_303%20Rules%20of%20Thumb%20AEJ%20Apr2014.pdf", "source": "Drexler, Fischer e Schoar, 2014"}, {"title": "Retiradas e lucros precisam de registro.", "text": "A Lei 15.270/2025 prevê, desde 2026, IRRF de 10% sobre o total de lucros e dividendos acima de R$ 50 mil no mês, pagos pela mesma PJ à mesma PF residente, inclusive no Simples. Há regras transitórias para resultados até 2025; a aplicação deve ser validada pela contabilidade.", "url": "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/dezembro/receita-federal-atualiza-normas-relativas-ao-imposto-sobre-a-renda-das-pessoas-fisicas", "source": "Receita Federal · Lei 15.270/2025"}]}, "margem": {"kind": "CONJUNTURA · BARES E RESTAURANTES", "value": "57%", "label": "declararam equilíbrio ou prejuízo em julho de 2026.", "context": "Abrasel · jul/2026 · divulgação em ago/2026", "title": "A venda cresce. O lucro precisa acompanhar.", "finding": "No recorte de julho de 2026, 37% ficaram no equilíbrio e 20% no prejuízo; 42% tiveram lucro e 1% não respondeu. Vendas e resultado precisam ser lidos juntos.", "mechanism": "Taxas do aplicativo, embalagem e custo da cozinha precisam entrar na conta de cada canal. Mais pedidos com contribuição insuficiente podem consumir caixa e capacidade.", "chartTitle": "Situação declarada · julho de 2026", "chartMax": 100, "bars": [["Lucro", 42, "42%"], ["Equilíbrio", 37, "37%"], ["Prejuízo", 20, "20%"], ["Sem resposta", 1, "1%"]], "source": "Abrasel · conjuntura 2026", "url": "https://abrasel.com.br/noticias/noticias/lucro-de-bares-e-restaurantes-atinge-melhor-resultado-desde-dezembro/", "example": "Caso didático do Sebrae: Marieta compra por R$ 10 e vende por R$ 16. Confunde o acréscimo de 60% com margem sobre vendas. Com R$ 12 mil de vendas e R$ 6 mil de despesas, espera sobrar R$ 1.200. A margem bruta de 37,5% gera R$ 4.500; o resultado é −R$ 1.500. Tobias é o consultor do exemplo.", "method": "Abrasel, julho de 2026. Os 57% são a soma de equilíbrio e prejuízo; 1% não respondeu. A fonte divulga a situação declarada, não a margem líquida de cada empresa. O caso Marieta/Tobias é didático, não resultado de cliente.", "extras": [{"title": "Delivery ocupa a mesma cozinha.", "text": "No estudo encomendado pela 99Food, aplicativos representaram em média 58% das vendas por delivery; 78% usavam a mesma linha de produção para salão e entrega. Volume, comissões e gargalos merecem leitura por canal.", "url": "https://vertentes.abrasel.com.br/noticias/noticias/aplicativos-geram-58-das-vendas-por-delivery-mas-operacao-fisica-dos-restaurantes-nao-acompanha-avanco-digital260921040142/", "source": "Abrasel / 99Food · 2026"}, {"title": "Reajustar preço também é um desafio.", "text": "No recorte de microempresas da pesquisa de 2025, 42% não acompanharam a inflação no cardápio entre jul/2024 e jun/2025. Isso não demonstra, sozinho, venda abaixo do custo.", "url": "https://odp.abrasel.com.br/noticias/noticias/micro-pequenas-empresas-enfrentam-maiores-dificuldade250812111225/", "source": "Abrasel · microempresas, 2025"}, {"title": "Markup não é margem.", "text": "O exemplo de Marieta e Tobias ajuda a separar preço, margem bruta e despesas. O ponto de equilíbrio mostra o volume necessário para cobrir a estrutura.", "url": "https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/E0482454CE9EA9190325714700417309/$File/NT00031FD6.pdf", "source": "Sebrae · Gestão Financeira, pp. 2–4"}]}, "estoque": {"title": "O lucro não pode vencer na prateleira.", "finding": "A ABRAS registra perda média de 1,82% no setor em 2025. Na loja, inventário, validade e recebimento ajudam a encontrar onde agir primeiro.", "mechanism": "Avarias e vencimentos consomem recursos sem gerar venda. Compras alinhadas ao giro ajudam a conter baixas e a preservar o capital de giro.", "extras": [{"title": "Inventário aparece entre as prioridades.", "text": "No estudo de Ituiutaba, erros de inventário tiveram 37% das menções à pergunta sobre perdas de maior impacto. O número mede respostas, não 37% do dinheiro perdido. Inventário, validade e avarias devem ser medidos separadamente no diagnóstico da loja.", "url": "https://anaiscbc.abcustos.org.br/anais/article/download/4987/5000/5130", "source": "Oliveira et al. · CBC, 2022 · tabela 6"}, {"title": "Três lojas. Perdas físicas mensuradas.", "text": "Em Pombal, as perdas registradas passaram de 277,83 para 236,21 kg; de 224,05 para 94,95 kg; e de 881,45 para 748,50 kg, com PDCA e ajustes operacionais.", "url": "https://static.even3.com/anais/632514.pdf?v=639082372606786730", "source": "Gonçalves et al., 2023 · figuras 7 e 8"}]}, "produtividade": {"title": "Antes de ampliar a fábrica, olhe o caminho do trabalho.", "finding": "A primeira fase do Brasil Mais Produtivo divulgou +52,11% de produtividade, −60,6% de movimentação e −64,82% de retrabalho nas empresas atendidas.", "chartTitle": "Melhorias do programa · indicadores independentes", "chartMax": 100, "bars": [["Ganho de produtividade", 52.11, "+52,11%"], ["Redução da movimentação", 60.6, "−60,6%"], ["Redução do retrabalho", 64.82, "−64,82%"]], "method": "Indicadores divulgados pela ABDI a partir da avaliação CEPAL/Ipea da primeira fase, concluída em 2018, com 3 mil atendimentos. São resultados agregados dos atendimentos, sem isolamento causal e sem equivalência a lucro. Investimentos e apoio técnico fizeram parte do programa.", "extras": [{"title": "5S organiza o acesso ao que se usa.", "text": "O caso de oficina de Meneghim e Tarrento relata melhora na procura de peças com organização e identificação. O diagnóstico fornecido informa 46 s para 14 s; o orçamento e o retorno financeiro não foram tratados como auditados.", "url": "https://ric.cps.sp.gov.br/handle/123456789/20938", "source": "Meneghim e Tarrento · 2017"}, {"title": "Sustentar faz parte do projeto.", "text": "Indicadores, responsáveis e revisões periódicas ajudam a manter o novo método. O ganho físico só entra no resultado financeiro quando há custo evitado ou venda adicional comprovada.", "url": "https://www.abdi.com.br/programa-bp-gera-ganho-de-52-na-produtividade-industrial/", "source": "ABDI · avaliação CEPAL/Ipea"}]}, "tempo": {"title": "Pedido parado. Cliente esperando. Rotina sem padrão.", "finding": "O estudo de supermercado registrou 14min17s a menos no ciclo médio. Medir etapas, atribuir responsáveis e acompanhar atrasos ajuda a localizar o problema.", "extras": [{"title": "Precificação em menos tempo.", "text": "No Studio Misa, o tempo relatado para precificar alisamento passou de 4 h para 0,5 h (30 min). A redução de 87,5% é operacional; os aumentos financeiros da tabela são projeções condicionadas a mudança de preço.", "url": "https://periodicos.ufrn.br/casoseconsultoria/article/download/39357/21338/150706", "source": "Morais et al., 2025 · tabela 4"}, {"title": "Melhorar um indicador pode esconder outro custo.", "text": "No estudo de Bicalho e Lima, sobras passaram de 11,22% para 8,32%, enquanto o consumo por pessoa subiu de 464,35 g para 536,19 g. Em preço fixo, é preciso avaliar porção e custo por refeição. A mudança nas sobras não foi estatisticamente significativa (p=0,17).", "url": "https://docs.bvsalud.org/biblioref/2017/05/322110/artigo.pdf", "source": "Bicalho e Lima · Nutrire, 2013 · tabela 2"}]}};
  Object.entries(researchUpdates).forEach(([key, values]) => Object.assign(researchTopics[key], values));

  let activeResearch = "caixa";
  const researchButtons = $$('[data-research]');
  function renderResearch(key, animate = true) {
    const topic = researchTopics[key];
    if (!topic) return;
    activeResearch = key;
    researchButtons.forEach(button => {
      const active = button.dataset.research === key;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    const panel = $('#research-panel');
    panel.setAttribute("aria-labelledby", `research-tab-${key}`);
    panel.dataset.topic = key;
    for (const property of ["kind","value","context","title","finding","mechanism","action","method"]) {
      $(`#research-${property}`).textContent = topic[property];
    }
    $('#research-stat-label').textContent = topic.label;
    $('#research-chart-title').textContent = topic.chartTitle;
    const rows = topic.bars.map(([label,value,display]) => {
      const row = document.createElement("div"); row.className = "evidence-bar-row";
      const top = document.createElement("div");
      const caption = document.createElement("span"); caption.textContent = label;
      const number = document.createElement("strong"); number.textContent = display;
      top.append(caption,number);
      const track = document.createElement("div"); track.className = "evidence-track"; track.setAttribute("aria-hidden","true");
      const fill = document.createElement("i"); fill.style.width = `${value / topic.chartMax * 100}%`;
      track.append(fill); row.append(top,track); return row;
    });
    (topic.chips || []).forEach(label => {
      const chip = document.createElement("span"); chip.className = "research-chip"; chip.textContent = label; rows.push(chip);
    });
    $('#research-chart-rows').replaceChildren(...rows);
    $('#research-source-link').textContent = `Fonte: ${topic.source} ↗`;
    $('#research-source-link').href = topic.url;
    $('#research-example').textContent = topic.example;
    $('#research-example').hidden = !topic.example;
    $('#research-method').closest('details').open = false;
    $('#research-extras').replaceChildren(...(topic.extras || []).map(item => {
      const article=document.createElement('article');
      const title=document.createElement('h4'); title.textContent=item.title;
      const paragraph=document.createElement('p'); paragraph.textContent=item.text;
      const link=document.createElement('a'); link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=`${item.source} ↗`;
      article.append(title,paragraph,link);return article;
    }));
    $('#research-deepdive').open=false;

    $('#research-contact').firstChild.textContent = `${topic.cta} `;
    $('#research-tool-link').firstChild.textContent = `${topic.tool} `;
    if (animate) animateContent(panel);
  }
  researchButtons.forEach(button => button.addEventListener("click", () => renderResearch(button.dataset.research)));
  tabKeyboard(researchButtons);
  $('#research-contact').addEventListener("click", () => {
    const topic = researchTopics[activeResearch];
    prefillContact(topic.front,topic.challenge);
  });
  $('#research-tool-link').addEventListener("click", () => selectDemo(researchTopics[activeResearch].demo));
  renderResearch("caixa",false);

  // Exemplo didático independente: não usa percentuais dos estudos como previsão.
  let impactShare = 1;
  function calculateResearchImpact() {
    const revenue = Math.round(clampInput($('#impact-revenue')) * 100);
    const margin = clampInput($('#impact-margin'));
    const expense = Math.round(clampInput($('#impact-cost')) * 100);
    const before = Math.round(revenue * margin / 100);
    const gross = Math.round(revenue * impactShare / 100);
    const gain = gross - expense;
    const after = before + gain;
    $('#impact-before').textContent = money(before);
    $('#impact-gross').textContent = money(gross);
    $('#impact-expense').textContent = `− ${money(expense)}`;
    $('#impact-gain').textContent = money(gain);
    $('#impact-after').textContent = money(after);
    $('#impact-final-row').classList.toggle("is-negative",after < 0);
    if (gross > Math.max(0, revenue - before)) {
      $('#impact-gain').textContent = "Rever premissas";
      $('#impact-after').textContent = "Rever premissas";
      $('#impact-final-row').classList.add("is-negative");
      $('#impact-status').textContent = "O custo a evitar supera o total de custos implícito na margem informada. Ajuste a margem ou o percentual escolhido.";
      return;
    }
    let status;
    if (gain < 0) status = "Neste cenário, os custos da melhoria superam os custos evitados no mês e reduzem o resultado.";
    else if (gain === 0) status = "Neste cenário, custos evitados e custos da melhoria se equilibram. O lucro permanece igual.";
    else if (before > 0) status = `Neste exemplo, o impacto líquido aumenta em ${decimal.format(gain / before * 100)}% o lucro inicial, com as mesmas vendas.`;
    else if (before === 0) status = "O cenário parte do equilíbrio e passa a um resultado positivo. A variação percentual sobre lucro zero não se aplica.";
    else if (after > 0) status = "O cenário passa de prejuízo para resultado positivo com os custos evitados informados.";
    else if (after === 0) status = "Os custos evitados levam o cenário ao equilíbrio, sem lucro ou prejuízo.";
    else status = "Os custos evitados reduzem o prejuízo, mas o resultado do cenário continua negativo.";
    $('#impact-status').textContent = status;
  }
  ['impact-revenue','impact-margin','impact-cost'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input',calculateResearchImpact);
    input.addEventListener('change',calculateResearchImpact);
  });
  $$('[data-impact-share]').forEach(button => button.addEventListener('click',() => {
    impactShare = Number(button.dataset.impactShare);
    $$('[data-impact-share]').forEach(option => option.setAttribute('aria-pressed',String(option === button)));
    calculateResearchImpact();
  }));
  calculateResearchImpact();


  // Demonstrações de gestão. Bases da literatura identificadas na interface e cenários fictícios
  // independentes do caso autoral e do simulador de honorários. Todos os valores monetários usam centavos.

  // Bases externas de custos: cada exemplo mantém a métrica e a fonte originais.
  const literatureExamples = {"cardapio": {"count": "4", "period": "jul–set/2017", "year": "2020", "caption": "Recorte de quatro itens; classes preservadas nos grupos originais", "heads": ["Item / grupo", "Vendas", "Contribuição unitária", "Contribuição total", "Classe no grupo original"], "rows": [["Filet mignon · principal", "232", "R$ 51,86", "R$ 12.031,52", "Estrela"], ["Brie ao forno · entrada", "417", "R$ 23,41", "R$ 9.761,97", "Burro de carga"], ["Rolinhos suínos · entrada", "89", "R$ 30,39", "R$ 2.704,70", "Quebra-cabeça"], ["Salada de abacate · entrada", "47", "R$ 21,37", "R$ 1.004,39", "Cão"]], "lesson": "No grupo de entradas, o Brie gerou R$ 9.761,97 de contribuição no período, contra R$ 2.704,70 dos rolinhos: volume também importa.", "note": "Contribuição e classes conforme os autores em seus grupos. Totais publicados preservados, inclusive arredondamentos. A medida considera a metodologia de custos do artigo; não equivale a lucro líquido nem recebimento de caixa.", "source": "Gularte e Cardoso (2020) · tabelas 1 e 2", "url": "https://revistas.usp.br/rta/article/download/152201/165657/453884"}, "beleza": {"count": "3", "period": "Por serviço", "year": "2025", "caption": "Preços e lucros unitários reportados na tabela 17; percentuais calculados sobre o preço", "heads": ["Serviço", "Preço", "Lucro reportado / serviço", "Lucro / preço"], "rows": [["Penteados", "R$ 150,00", "R$ 115,63", "77,09%"], ["Maquiagem", "R$ 150,00", "R$ 109,44", "72,96%"], ["Cursos", "R$ 400,00", "R$ 223,63", "55,91%"]], "lesson": "O curso tem o maior preço, mas o menor resultado relativo entre os três serviços da tabela.", "note": "Valores reportados na tabela 17 de Alves e Santos. Os percentuais foram calculados a partir dessa tabela. O artigo apresenta divergências entre os custos da tabela 16 e os resultados da 17; não foi reconstruído um custo unitário a partir delas. Esta é uma leitura diagnóstica, não um ganho após implantação.", "source": "Alves e Santos · Vianna Sapiens, 2025 · tabela 17", "url": "https://www.viannasapiens.com.br/revista/article/download/1018/501/3463"}};
  function renderLiterature() {
    const item = literatureExamples[$('#margin-case').value];
    ['count','period','year','caption','note'].forEach(key => $(`#literature-${key}`).textContent = item[key]);
    const heads = item.heads.map(label => { const th=document.createElement('th'); th.scope='col'; th.textContent=label; return th; });
    $('#literature-head').replaceChildren(...heads);
    $('#literature-body').replaceChildren(...item.rows.map(values => { const tr=document.createElement('tr'); values.forEach((value,i)=> {const cell=document.createElement(i ? 'td' : 'th'); if(!i)cell.scope='row';cell.textContent=value;tr.append(cell);});return tr;}));
    $('#margin-case-lesson').textContent=item.lesson;
    $('#literature-source').textContent=`${item.source} ↗`;
    $('#literature-source').href=item.url;
  }
  $('#margin-case').addEventListener('change',renderLiterature);
  renderLiterature();

  const abcScopes = {
    produtos: {"context": "Recorte real de quatro itens do cardápio · ABC calculada pela contribuição total dos itens selecionados.", "totalLabel": "Contribuição do recorte", "total": 25502.58, "groups": [{"share": 85.45602052811911, "count": "2 itens", "cents": 2179349}, {"share": 10.605593630134676, "count": "1 item", "cents": 270470}, {"share": 3.938385841746207, "count": "1 item", "cents": 100439}], "axisY": "Contribuição unitária · grupo original", "axisX": "Popularidade · grupo original", "cells": [["Alta contribuição · alta popularidade", "Estrela", "Filet mignon · prato principal"], ["Alta contribuição · baixa popularidade", "Quebra-cabeça", "Rolinhos suínos · entrada"], ["Baixa contribuição · alta popularidade", "Burro de carga", "Brie ao forno · entrada"], ["Baixa contribuição · baixa popularidade", "Cão", "Salada de abacate · entrada"]], "note": "ABC calculada somente para os quatro itens selecionados, não para o cardápio inteiro. A matriz preserva a classificação dos autores dentro de cada grupo original, com limites próprios; não cruza entradas e pratos principais em um limite único."},
    clientes: {
      context:"Exemplo fictício de 10 clientes · classificação pela contribuição gerada.",
      totalLabel:"Contribuição da carteira", total:40000,
      groups:[{share:75,count:"2 clientes"},{share:20,count:"3 clientes"},{share:5,count:"5 clientes"}],
      axisY:"Margem da carteira", axisX:"Frequência de compra",
      cells:[
        ["Alta margem · alta frequência","Relacionamento estratégico","Cliente Alfa"],
        ["Alta margem · baixa frequência","Potencial de recorrência","Cliente Gama"],
        ["Baixa margem · alta frequência","Rever condições","Cliente Beta"],
        ["Baixa margem · baixa frequência","Reavaliar esforço","Cliente Delta"],
      ],
      note:"Priorize clientes pela contribuição e ajuste o esforço comercial conforme a frequência e a margem da carteira.",
    },
    fornecedores: {
      context:"Exemplo fictício de 10 fornecedores · classificação pelo valor das compras.",
      totalLabel:"Compras analisadas", total:60000,
      groups:[{share:70,count:"2 fornecedores"},{share:20,count:"3 fornecedores"},{share:10,count:"5 fornecedores"}],
      axisY:"Criticidade para a operação", axisX:"Participação nas compras",
      cells:[
        ["Alta criticidade · alto valor","Gestão estratégica","Fornecedor Alfa"],
        ["Alta criticidade · baixo valor","Proteger o abastecimento","Fornecedor Gama"],
        ["Baixa criticidade · alto valor","Negociar condições","Fornecedor Beta"],
        ["Baixa criticidade · baixo valor","Padronizar compras","Fornecedor Delta"],
      ],
      note:"Para fornecedores, a Curva ABC considera o valor das compras; a matriz acrescenta a criticidade para proteger o abastecimento e orientar negociações.",
    },
  };
  function renderABC() {
    const scope = abcScopes[$('#abc-scope').value];
    if (!scope) return;
    $('#abc-context').textContent = scope.context;
    $('#abc-total-label').textContent = scope.totalLabel;
    $('#abc-total-value').textContent = money(scope.total * 100);
    $$('#abc-classes .abc-class-row').forEach((row, index) => {
      const group = scope.groups[index];
      $('.abc-share', row).textContent = `${decimal.format(group.share)}%`;
      $('.abc-track i', row).style.width = `${group.share}%`;
      $('.abc-count', row).textContent = group.count;
      $('.abc-amount', row).textContent = money(group.cents ?? Math.round(scope.total * group.share));
    });
    $('#matrix-axis-y').textContent = scope.axisY;
    $('#matrix-axis-x').textContent = scope.axisX;
    $$('[data-matrix-index]').forEach((cell, index) => {
      $('span', cell).textContent = scope.cells[index][0];
      $('h5', cell).textContent = scope.cells[index][1];
      $('p', cell).textContent = scope.cells[index][2];
    });
    $('#abc-note').textContent = scope.note;
  }
  $('#abc-scope').addEventListener("change", () => {
    renderABC();
    animateContent($('.abc-content'));
  });
  renderABC();

  // DRE: tributos hipotéticos de 10%, demais variáveis de 50%, fixos de R$ 30 mil.
  // Caixa: 90% das vendas recebidas e 100% dos custos pagos no período.
  // Ausência de outras despesas é uma premissa explícita do exemplo.
  const demoSales = $('#demo-sales');
  function renderCashAndDRE() {
    const revenue = Math.round(clampInput(demoSales) * 100);
    const taxes = Math.round(revenue * 0.10);
    const variableCosts = Math.round(revenue * 0.50);
    const deductions = taxes + variableCosts;
    const contribution = revenue - deductions;
    const fixed = 3000000;
    const net = contribution - fixed;
    const breakEven = Math.round(fixed / 0.40);
    const receipts = Math.round(revenue * 0.90);
    const payments = deductions + fixed;
    const closingCash = 800000 + receipts - payments;

    $('#demo-sales-output').textContent = money(revenue);
    demoSales.setAttribute("aria-valuetext", money(revenue));
    $('#dre-revenue').textContent = money(revenue);
    $('#dre-variable').textContent = `− ${money(deductions)}`;
    $('#dre-contribution').textContent = money(contribution);
    $('#dre-fixed').textContent = `− ${money(fixed)}`;
    $('#dre-net').textContent = money(net);
    $('#dre-net-row').classList.toggle("is-negative", net < 0);
    $('#pe-value').textContent = money(breakEven);
    $('#pe-fill').style.width = `${Math.min(100, revenue / (2 * breakEven) * 100)}%`;
    $('#pe-meter').setAttribute("aria-valuenow", String(revenue / 100));
    $('#pe-meter').setAttribute("aria-valuemax", String(2 * breakEven / 100));
    $('#pe-meter').setAttribute("aria-valuetext", `Vendas de ${money(revenue)} para um ponto de equilíbrio de ${money(breakEven)}`);
    $('#pe-meter').classList.toggle("is-below", revenue < breakEven);
    $('#pe-status').textContent = revenue < breakEven
      ? `Faltam ${money(breakEven - revenue)} em vendas para cobrir os custos do cenário.`
      : revenue === breakEven
        ? "Vendas no ponto de equilíbrio: custos cobertos e resultado zero neste cenário."
        : `Vendas ${money(revenue - breakEven)} acima do ponto de equilíbrio.`;
    $('#cash-in').textContent = money(receipts);
    $('#cash-out').textContent = `− ${money(payments)}`;
    $('#cash-final').textContent = money(closingCash);
    $('#cash-final-row').classList.toggle("is-negative", closingCash < 0);
    fillRange(demoSales);
  }
  demoSales.addEventListener("input", renderCashAndDRE);
  demoSales.addEventListener("change", renderCashAndDRE);
  renderCashAndDRE();

  // OEE e capacidade no mesmo modelo: 250 un./dia nominais na produção.
  // Atual: 80% × 80% × 75% = 48%, equivalentes a 120 un./dia.
  // Proposto: 90% × 80% × (5/6) = 60%, equivalentes a 150 un./dia.
  // As etapas de preparação (180) e embalagem (150) também limitam o processo.
  function renderCapacity() {
    const improved = $('#unlock-bottleneck').checked;
    const availability = improved ? 0.90 : 0.80;
    const performance = 0.80;
    const quality = improved ? 5 / 6 : 0.75;
    const oee = availability * performance * quality;
    const production = Math.round(250 * oee);
    const processCapacity = Math.min(180, production, 150);
    const sold = Math.min(processCapacity, 150);
    const extraSold = Math.max(0, sold - 120);
    const extraMargin = extraSold * 600 * 22;

    $('#production-capacity-value').textContent = `${production} un./dia`;
    $('#production-capacity-bar').style.width = `${production / 180 * 100}%`;
    $('#production-capacity-row').classList.toggle("is-bottleneck", !improved);
    $('#bottleneck-label').textContent = improved ? "Equalizado" : "Gargalo";
    const capacityUnit = document.createElement("small");
    capacityUnit.textContent = "un./dia";
    $('#process-capacity').replaceChildren(document.createTextNode(`${processCapacity} `), capacityUnit);
    $('#production-oee').textContent = `${decimal.format(oee * 100)}%`;
    $('#capacity-margin').textContent = money(extraMargin);
    $('#oee-availability').textContent = `${decimal.format(availability * 100)}%`;
    $('#oee-performance').textContent = `${decimal.format(performance * 100)}%`;
    $('#oee-quality').textContent = `${decimal.format(quality * 100)}%`;
    $('#capacity-context').textContent = improved
      ? "Produção e embalagem atendem à demanda de 150 un./dia no cenário proposto."
      : "A produção limita o processo a 120 unidades por dia.";
  }
  $('#unlock-bottleneck').addEventListener("change", renderCapacity);
  renderCapacity();

  // 7. FAQ nativo e acessível. Uma resposta aberta por vez.
  $$('.faq-list details').forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (detail.open) $$('.faq-list details').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });

  // 8. Diálogos: fechamento por Escape, botão e clique fora do conteúdo.
  const privacyModal = $('#privacy-modal');
  let lastTrigger = null;
  function openDialog(dialog, trigger) {
    lastTrigger = trigger || document.activeElement;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }
  $$('dialog').forEach((dialog) => {
    $$('[data-close-dialog]', dialog).forEach((button) => button.addEventListener("click", () => closeDialog(dialog)));
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    });
    dialog.addEventListener("close", () => {
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
    });
  });
  $('#privacy-button').addEventListener("click", (event) => openDialog(privacyModal, event.currentTarget));

  // 9. Conversão direta: valida os dados e abre o WhatsApp no clique de envio.
  // Sem modal, sem download obrigatório e sem fingir captura em um servidor.
  let briefing = "";
  const form = $('#briefing-form');
  const clientPhone = $('#client-phone');

  function normalizeClientPhone(value) {
    let digits = String(value).replace(/\D/g, "");
    if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2);
    return /^[1-9]\d(?:9\d{8}|[2-9]\d{7})$/.test(digits) ? `55${digits}` : null;
  }
  function formattedClientPhone(normalized) {
    const local = normalized.slice(2);
    return local.length === 11
      ? local.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
      : local.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  clientPhone.addEventListener("input", () => clientPhone.setCustomValidity(""));
  clientPhone.addEventListener("blur", () => {
    const normalized = normalizeClientPhone(clientPhone.value);
    if (normalized) clientPhone.value = formattedClientPhone(normalized);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const normalizedPhone = normalizeClientPhone(clientPhone.value);
    clientPhone.setCustomValidity(normalizedPhone ? "" : "Informe um telefone brasileiro válido com DDD, como (62) 99999-9999.");
    if (!form.reportValidity()) return;
    clientPhone.value = formattedClientPhone(normalizedPhone);
    const fields = new FormData(form);
    const areas = fields.getAll("frentes");
    briefing = [
      `PRIMEIRA CONVERSA — ${String(config.nomeCompleto).toLocaleUpperCase("pt-BR")}`,
      "",
      `Nome: ${String(fields.get("nome") || "").trim()}`,
      `Empresa: ${String(fields.get("empresa") || "").trim()}`,
      `Telefone / WhatsApp: +55 ${formattedClientPhone(normalizedPhone)}`,
      `Segmento: ${fields.get("segmento")}`,
      `Frentes de interesse: ${areas.length ? areas.join(", ") : "A identificar na conversa"}`,
      ...(studyInterest ? ["Referência: estudo de tempos e movimentos em studio de beleza"] : []),
      "",
      "Principal desafio:",
      String(fields.get("desafio") || "").trim() || "Gostaria de entender quais oportunidades podem existir na minha empresa.",
      "",
      "Este resumo não constitui proposta comercial ou diagnóstico técnico.",
    ].join("\n");
    const channel = contactLink(briefing);
    if (!channel) {
      notify("O canal de contato está indisponível. Tente o contato exibido no rodapé.");
      return;
    }
    const retry = $('#retry-contact');
    retry.href = channel;
    retry.textContent = validWhatsapp ? "Abrir WhatsApp novamente ↗" : "Abrir e-mail ↗";
    $('#contact-feedback').hidden = false;

    // Link acionado dentro do gesto do usuário, antes de qualquer operação assíncrona.
    // O aplicativo externo mantém a confirmação final do envio com o visitante.
    const launch = document.createElement("a");
    launch.href = channel;
    launch.target = "_blank";
    launch.rel = "noopener noreferrer";
    launch.dataset.whatsappLaunch = "true";
    document.body.append(launch);
    launch.click();
    launch.remove();
  });

  let toastTimeout;
  function notify(message) {
    const toast = $('#toast');
    // Diálogos nativos ficam na camada superior; a notificação acompanha essa camada.
    const activeDialog = $('dialog[open]');
    (activeDialog || document.body).append(toast);
    window.clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3800);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch { /* Fallback abaixo. */ }
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("aria-label", "Resumo para copiar");
    textarea.style.cssText = "position:fixed;inset:0 auto auto -9999px;opacity:0;";
    const activeDialog = $('dialog[open]');
    (activeDialog || document.body).append(textarea);
    const previousFocus = document.activeElement;
    textarea.focus();
    textarea.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch { copied = false; }
    textarea.remove();
    if (previousFocus && previousFocus.focus) previousFocus.focus({ preventScroll: true });
    return copied;
  }
  $('#copy-briefing').addEventListener("click", async () => {
    if (!briefing) return;
    const copied = await copyText(briefing);
    notify(copied ? "Mensagem copiada. Você pode colar na conversa do WhatsApp." : "O navegador bloqueou a cópia. Use Abrir WhatsApp novamente.");
  });
})();
