export const TICKERS = [
  "TAEE4",
  "BBAS3",
  "CSMG3",
  "BBSE3",
  "KLBN4",
  "ITSA4",
  "SAPR4",
  "ITUB4",
  "BBDC4",
  "CMIG4",
  "CXSE3",
  "BRSR6",
  "SANB4",
  "PETR4",
  "TIMS3",
] as const;

export type Ticker = (typeof TICKERS)[number];

export const MOCK_COMPANY_ABOUT: Record<Ticker, string> = {
  TAEE4:
    "A Taesa (Transmissora Aliança de Energia Elétrica S.A.) é um dos maiores grupos privados de transmissão de energia elétrica do Brasil em termos de receita anual permitida. A companhia é dedicada exclusivamente à construção, operação e manutenção de ativos de transmissão de alta tensão, operando milhares de quilômetros de linhas de transmissão por todas as regiões do país. Seu modelo de negócios é altamente previsível e resiliente, baseado em contratos de concessão de longo prazo indexados à inflação (IGP-M ou IPCA), o que a torna historicamente uma das maiores e mais consistentes pagadoras de dividendos da B3.",

  BBAS3:
    "Fundado em 1808, o Banco do Brasil S.A. é a instituição financeira mais antiga do país e opera sob um modelo de economia mista, controlado pelo Governo Federal. O banco é um dos líderes do Sistema Financeiro Nacional, possuindo uma capilaridade física invejável e forte presença digital. Destaca-se globalmente como o maior parceiro e financiador do agronegócio brasileiro, além de possuir forte atuação no crédito corporativo, de varejo e na prestação de serviços governamentais. Combina eficiência de banco privado com o papel estratégico de desenvolvimento econômico nacional.",

  CSMG3:
    "A Copasa (Companhia de Saneamento de Minas Gerais) é uma concessionária de serviços de saneamento básico controlada pelo Estado de Minas Gerais. Suas principais atividades englobam o planejamento, a execução, a ampliação e a operação de sistemas de abastecimento de água potável, esgotamento sanitário e destinação final de resíduos sólidos. A companhia atende a centenas de municípios mineiros, operando sob contratos de programa de longo prazo e um modelo regulatório tarifário que garante receita estável e forte geração de caixa voltada para a modernização da infraestrutura hídrica estadual.",

  BBSE3:
    "A BB Seguridade Participações S.A. é a empresa do grupo Banco do Brasil que consolida todas as participações em seguros, previdência privada aberta, capitalização e planos de assistência odontológica. Operando sob um modelo de 'bancassurance', a companhia utiliza com exclusividade a gigantesca base de clientes e a rede de agências físicas e digitais do Banco do Brasil para comercializar seus produtos. Esse modelo de negócios demanda pouquíssimo reinvestimento de capital (baixo Capex), permitindo à BB Seguridade registrar margens de lucro extraordinárias e distribuir quase a totalidade de seus ganhos em dividendos.",

  KLBN4:
    "Fundada em 1899, a Klabin S.A. é a maior produtora e exportadora de papéis para embalagens do Brasil, sendo a única do país a oferecer ao mercado uma solução integrada em celulose de fibra curta, fibra longa e fluff. A companhia possui um modelo de negócios verticalizado, gerenciando desde florestas plantadas de pinus e eucalipto até fábricas de papelão ondulado e sacos industriais. Líder em sustentabilidade, a Klabin atende de forma resiliente os setores de alimentos, bebidas, higiene e construção civil, tanto no mercado interno quanto no internacional.",

  ITSA4:
    "A Itaúsa S.A. é uma das maiores holdings puras do Brasil, com mais de 45 anos de história. Embora o seu principal e mais valioso ativo seja a participação relevante no Itaú Unibanco, a companhia vem executando uma sólida estratégia de diversificação de portfólio no setor não financeiro. Atualmente, possui participações em marcas líderes de seus segmentos, como Alpargatas (Havaianas), Dexco (Deca/Duratex), CCR (concessões rodoviárias), Aegea Saneamento, Copa Energia e NTS. Seu objetivo é gerar valor de longo prazo para os acionistas através de uma governança rigorosa e distribuição recorrente de proventos.",

  SAPR4:
    "A Sanepar (Companhia de Saneamento do Paraná) é a empresa estatal responsável pela prestação de serviços de saneamento básico no estado do Paraná. Atendendo a quase totalidade dos municípios paranaenses, a companhia é referência nacional em índices de atendimento de água tratada e tratamento de esgoto coletado. Suas receitas provêm de tarifas reguladas pela AGEPAR, garantindo previsibilidade financeira. A Sanepar é reconhecida pela constante eficiência operacional e elevados investimentos em sustentabilidade e preservação de mananciais hídricos na região Sul.",

  ITUB4:
    "O Itaú Unibanco Holding S.A. é o maior banco privado do Brasil e da América Latina, com presença global em mais de 18 países. A instituição oferece uma gama completa de serviços financeiros para pessoas físicas e jurídicas, englobando conta corrente, cartões de crédito, seguros, banco de investimento e gestão de fortunas. Líder na transformação digital bancária brasileira, o Itaú destaca-se por sua sólida estrutura de capital, controle de inadimplência rigoroso, eficiência operacional diferenciada e forte capacidade de geração de lucros de forma consistente mesmo em cenários macroeconômicos desafiadores.",

  BBDC4:
    "O Banco Bradesco S.A. é um dos pilares do sistema financeiro brasileiro. Fundado em 1943 com a filosofia de democratizar o acesso bancário, o banco construiu uma das maiores redes de atendimento do país, com forte presença física e digital que atende desde pequenos municípios até grandes corporações. Além de sua forte atuação de crédito e varejo bancário, o Bradesco possui o maior grupo segurador da América Latina (Grupo Bradesco Seguros), que contribui historicamente de forma muito significativa para o resultado líquido e estabilidade dos lucros da organização.",

  CMIG4:
    "A Cemig (Companhia Energética de Minas Gerais), conhecida como uma das maiores holding do setor elétrico brasileiro, é controlada pelo Estado de Minas Gerais e possui participações em mais de uma centena de empresas. Suas operações cobrem toda a cadeia de energia: geração (predominantemente hidrelétrica), transmissão, distribuição e comercialização de energia, além de distribuição de gás canalizado (Gasmig). A Cemig Distribuição é uma das maiores distribuidoras do país em extensão de rede e número de clientes, oferecendo alta previsibilidade regulatória.",

  CXSE3:
    "A Caixa Seguridade Participações S.A. é a empresa que consolida os negócios de seguros, previdência, capitalização e consórcios da Caixa Econômica Federal. Semelhante ao modelo de bancassurance de outros grandes bancos, a Caixa Seguridade aproveita a exclusividade de distribuição de seus produtos na gigantesca rede física da Caixa — o banco líder em crédito imobiliário e poupança no Brasil. O baixo nível de endividamento combinado com receitas recorrentes geradas por taxas de corretagem confere à empresa alta rentabilidade e atratividade para investidores focados em dividendos.",

  BRSR6:
    "O Banrisul (Banco do Estado do Rio Grande do Sul S.A.) é uma sociedade de economia mista com foco de atuação regional no estado do Rio Grande do Sul. O banco atua como um importante motor financeiro para o desenvolvimento do comércio, serviços, indústria e agronegócio gaúcho. Através de sua rede física de agências, correspondentes e canais digitais, o Banrisul oferece serviços de crédito comercial, crédito consignado, financiamentos agrícolas e serviços de adquirência de cartões (Vero), mantendo uma posição competitiva dominante em sua região geográfica de origem.",

  SANB4:
    "O Santander Brasil S.A. é a subsidiária brasileira do gigante financeiro espanhol Grupo Santander. Trata-se do terceiro maior banco privado do país por ativos e depósitos. O banco foca suas atividades no varejo bancário de alta renda, crédito corporativo, financiamento ao consumo (líder através da Santander Financiamentos) e serviços de investment banking. O Santander Brasil destaca-se pela agilidade comercial, alta eficiência operacional, forte cultura de inovação tecnológica e por sua relevante contribuição de resultados para a matriz global na Europa.",

  PETR4:
    "A Petrobras (Petróleo Brasileiro S.A.) é uma das maiores empresas de energia integrada de capital misto do mundo, controlada pelo Governo Federal do Brasil. A companhia é líder nacional e referência internacional no setor de óleo e gás, destacando-se de forma pioneira na exploração e produção de petróleo em águas ultraprofundas e no desenvolvimento da tecnologia de extração do Pré-Sal. Suas atividades incluem refino, transporte, comercialização de derivados de petróleo, gás natural e geração de energia elétrica, apresentando alta relevância macroeconômica e expressivo fluxo de caixa livre.",

  TIMS3:
    "A TIM S.A. é uma das principais empresas de telecomunicações do Brasil, controlada indiretamente pela Telecom Italia. A companhia oferece serviços de telefonia móvel de voz e dados (líder nacional em cobertura 4G e pioneira na expansão de redes 5G), banda larga residencial de ultravelocidade (TIM Ultrafibras) e serviços corporativos de conectividade. O foco estratégico da TIM está ancorado na digitalização, na melhoria constante da infraestrutura de telecomunicações no país e na monetização de sua base de clientes corporativos e residenciais.",
};
