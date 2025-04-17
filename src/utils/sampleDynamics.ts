
import { Dynamic, DynamicCategory } from "@/store/dynamicsStore";

// Gera um ID aleatório
const generateId = () => Math.random().toString(36).substring(2, 9);

// Amostra com 100 dinâmicas para treinamentos corporativos
export const sampleDynamics: Omit<Dynamic, 'id' | 'createdAt'>[] = [
  // Quebra-gelo (10)
  {
    name: "Dois Verdades e Uma Mentira",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Conhecer melhor os participantes e criar um ambiente descontraído",
    materials: "Nenhum material necessário",
    description: "Cada participante compartilha três informações sobre si: duas verdadeiras e uma falsa. Os demais devem tentar identificar qual é a mentira.",
    duration: 15,
    minimumParticipants: 4,
    maximumParticipants: 30
  },
  {
    name: "Bingo Humano",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Facilitar a interação entre os participantes e descobrir coisas em comum",
    materials: "Cartões de bingo com características ou experiências, canetas",
    description: "Distribua cartões com diferentes características (ex: 'tem dois filhos', 'já viajou para a Europa'). Os participantes circulam buscando pessoas que se encaixem nas descrições e coletam assinaturas.",
    duration: 20,
    minimumParticipants: 8,
    maximumParticipants: 50
  },
  {
    name: "Entrevista em Pares",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Aprofundar o conhecimento entre os participantes",
    materials: "Lista de perguntas sugeridas (opcional)",
    description: "Divida o grupo em pares e peça que entrevistem um ao outro por 5 minutos cada. Depois, cada pessoa apresenta seu par para o grupo.",
    duration: 30,
    minimumParticipants: 4,
    maximumParticipants: 30
  },
  {
    name: "A Linha do Tempo",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Conhecer a trajetória profissional dos participantes",
    materials: "Papel, canetas coloridas, linha para representar o tempo",
    description: "Crie uma linha do tempo no espaço. Peça que os participantes se posicionem de acordo com o tempo de experiência na área/empresa e compartilhem um momento marcante.",
    duration: 25,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "Adjetivos com Iniciais",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Memorizar os nomes dos participantes de forma divertida",
    materials: "Nenhum material necessário",
    description: "Cada pessoa diz seu nome precedido por um adjetivo com a mesma inicial (ex: 'Brilhante Bruno'). O próximo repete todos os nomes anteriores antes de acrescentar o seu.",
    duration: 15,
    minimumParticipants: 5,
    maximumParticipants: 20
  },
  {
    name: "Objeto que me Representa",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Conhecer valores e características pessoais dos participantes",
    materials: "Objetos variados ou imagens de objetos",
    description: "Espalhe diversos objetos ou imagens. Cada participante escolhe um que o represente e explica o motivo da escolha para o grupo.",
    duration: 20,
    minimumParticipants: 5,
    maximumParticipants: 25
  },
  {
    name: "Mapa de Origens",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Conhecer a diversidade geográfica e cultural do grupo",
    materials: "Mapa grande ou representação no chão com fita adesiva",
    description: "Crie um mapa no chão e peça que cada pessoa se posicione onde nasceu ou cresceu, compartilhando uma curiosidade sobre o local.",
    duration: 20,
    minimumParticipants: 8,
    maximumParticipants: 40
  },
  {
    name: "Telefone sem Fio Gestual",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Descontrair o ambiente e trabalhar a comunicação não-verbal",
    materials: "Lista de ações ou mensagens para transmitir",
    description: "Em fila, o primeiro participante faz um gesto para o segundo, que deve repetir para o terceiro, e assim por diante. O último deve adivinhar qual era a mensagem original.",
    duration: 15,
    minimumParticipants: 6,
    maximumParticipants: 20
  },
  {
    name: "Quem Sou Eu?",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Criar um ambiente divertido e estimular a interação",
    materials: "Post-its, canetas, fita adesiva",
    description: "Cole um post-it na testa de cada participante com nome de uma personalidade. Todos circulam fazendo perguntas de sim/não para descobrir quem são.",
    duration: 20,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Eu Nunca...",
    category: "Quebra-gelo" as DynamicCategory,
    objective: "Compartilhar experiências de vida de forma leve e divertida",
    materials: "Nenhum material necessário (versão corporativa sem álcool)",
    description: "Em círculo, cada pessoa completa a frase 'Eu nunca...' com algo que nunca fez. Quem já fez levanta a mão ou dá um passo à frente, criando interação.",
    duration: 15,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  
  // Integração (9)
  {
    name: "Construção de Torre",
    category: "Integração" as DynamicCategory,
    objective: "Estimular trabalho em equipe e comunicação efetiva",
    materials: "Espaguete cru, fita adesiva, barbante, marshmallows",
    description: "Divida em equipes. Cada grupo deve construir a torre mais alta possível usando apenas os materiais fornecidos, dentro do tempo determinado.",
    duration: 30,
    minimumParticipants: 8,
    maximumParticipants: 40
  },
  {
    name: "Nó Humano",
    category: "Integração" as DynamicCategory,
    objective: "Promover a solução de problemas em conjunto e quebrar barreiras físicas",
    materials: "Espaço amplo",
    description: "Em círculo, todos dão as mãos aleatoriamente com pessoas não adjacentes, criando um 'nó'. Sem soltar as mãos, o grupo deve desembaraçar-se.",
    duration: 20,
    minimumParticipants: 8,
    maximumParticipants: 20
  },
  {
    name: "Desenho Cooperativo",
    category: "Integração" as DynamicCategory,
    objective: "Estimular a criatividade coletiva e a comunicação",
    materials: "Papel grande, canetas coloridas",
    description: "Em grupos, todos desenham simultaneamente em um papel grande, criando uma obra coletiva. Pode-se estabelecer um tema ou deixar livre.",
    duration: 25,
    minimumParticipants: 4,
    maximumParticipants: 30
  },
  {
    name: "Barco Salva-vidas",
    category: "Integração" as DynamicCategory,
    objective: "Trabalhar tomada de decisão em grupo e valores compartilhados",
    materials: "Fichas com perfis de personagens",
    description: "O grupo representa passageiros de um barco que está afundando. Há um bote salva-vidas com capacidade limitada. O grupo deve decidir quem será salvo, com base em perfis fornecidos.",
    duration: 45,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Círculo de Apreciação",
    category: "Integração" as DynamicCategory,
    objective: "Fortalecer vínculos e reconhecer qualidades entre os participantes",
    materials: "Nenhum material necessário",
    description: "Em círculo, cada pessoa tem a oportunidade de agradecer ou elogiar outro participante, destacando contribuições ou qualidades observadas.",
    duration: 30,
    minimumParticipants: 5,
    maximumParticipants: 20
  },
  {
    name: "Quebra-cabeça Coletivo",
    category: "Integração" as DynamicCategory,
    objective: "Promover a colaboração e comunicação entre subgrupos",
    materials: "Quebra-cabeças com peças misturadas entre os grupos",
    description: "Divida em equipes e distribua as peças de diferentes quebra-cabeças. Para completar seu quebra-cabeça, cada equipe precisará negociar peças com as outras.",
    duration: 30,
    minimumParticipants: 12,
    maximumParticipants: 40
  },
  {
    name: "Mural de Expectativas",
    category: "Integração" as DynamicCategory,
    objective: "Alinhar expectativas e estabelecer objetivos compartilhados",
    materials: "Painel grande, post-its, canetas",
    description: "Cada participante escreve suas expectativas para o evento/treinamento e compartilha brevemente antes de colar no mural coletivo.",
    duration: 25,
    minimumParticipants: 6,
    maximumParticipants: 40
  },
  {
    name: "Ilha Deserta",
    category: "Integração" as DynamicCategory,
    objective: "Explorar valores e prioridades do grupo",
    materials: "Listas de itens, papel, canetas",
    description: "Em grupos, os participantes imaginam estar presos em uma ilha deserta. Devem selecionar apenas 5 itens de uma lista fornecida, justificando suas escolhas para sobrevivência coletiva.",
    duration: 30,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "Teia de Conexões",
    category: "Integração" as DynamicCategory,
    objective: "Visualizar as conexões e interdependências do grupo",
    materials: "Rolo de barbante ou lã",
    description: "Em círculo, um participante segura a ponta do barbante e compartilha uma característica pessoal. Quem se identificar recebe o barbante, criando uma teia que representa as conexões do grupo.",
    duration: 20,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  
  // Energização (9)
  {
    name: "Zip Zap Zop",
    category: "Energização" as DynamicCategory,
    objective: "Aumentar o nível de energia e foco do grupo",
    materials: "Nenhum material necessário",
    description: "Em círculo, os participantes passam a energia dizendo 'Zip' (para esquerda), 'Zap' (para direita) ou 'Zop' (atravessando o círculo). Quem errar ou demorar é eliminado ou recomeça a contagem.",
    duration: 10,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Espelho em Movimento",
    category: "Energização" as DynamicCategory,
    objective: "Ativar o corpo e estimular a concentração",
    materials: "Música animada (opcional)",
    description: "Em pares, um participante faz movimentos que o outro deve imitar como um espelho. Após alguns minutos, trocam-se os papéis.",
    duration: 10,
    minimumParticipants: 4,
    maximumParticipants: 40
  },
  {
    name: "Dança das Cadeiras Cooperativa",
    category: "Energização" as DynamicCategory,
    objective: "Estimular a cooperação e o bom humor",
    materials: "Cadeiras (uma a menos que o número de participantes), música",
    description: "Semelhante à dança das cadeiras tradicional, mas quando a música para, todos devem encontrar um lugar para sentar, mesmo que seja no colo de alguém. A cada rodada, retira-se uma cadeira.",
    duration: 15,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Contagem Coletiva",
    category: "Energização" as DynamicCategory,
    objective: "Estimular a concentração e sintonia do grupo",
    materials: "Nenhum material necessário",
    description: "O grupo deve contar até um número definido, com apenas uma pessoa falando cada número. Se duas pessoas falarem simultaneamente, a contagem recomeça do início.",
    duration: 10,
    minimumParticipants: 5,
    maximumParticipants: 25
  },
  {
    name: "Maestro",
    category: "Energização" as DynamicCategory,
    objective: "Estimular a observação e atenção do grupo",
    materials: "Nenhum material necessário",
    description: "Um voluntário sai da sala. O grupo escolhe um 'maestro' que irá iniciar e mudar movimentos que todos copiam. O voluntário retorna e tenta identificar quem é o maestro.",
    duration: 15,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Palmas Rítmicas",
    category: "Energização" as DynamicCategory,
    objective: "Energizar o grupo e trabalhar concentração e ritmo",
    materials: "Nenhum material necessário",
    description: "O facilitador estabelece um padrão rítmico com palmas que o grupo deve repetir. Progressivamente aumenta-se a complexidade dos ritmos.",
    duration: 10,
    minimumParticipants: 5,
    maximumParticipants: 50
  },
  {
    name: "Estátua",
    category: "Energização" as DynamicCategory,
    objective: "Estimular expressão corporal e despertar energia",
    materials: "Música",
    description: "Com música, todos dançam livremente. Quando a música para, todos ficam imóveis na posição em que estavam. Quem se mover sai ou faz uma tarefa divertida.",
    duration: 15,
    minimumParticipants: 6,
    maximumParticipants: 50
  },
  {
    name: "Siga o Mestre",
    category: "Energização" as DynamicCategory,
    objective: "Ativar o corpo e promover descontração",
    materials: "Música animada (opcional)",
    description: "Em círculo, cada participante, na sua vez, propõe um movimento que todos devem repetir. Pode ser acompanhado por música.",
    duration: 15,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "Pega-Rabo",
    category: "Energização" as DynamicCategory,
    objective: "Liberar energia e promover movimento físico",
    materials: "Tiras de tecido ou papel para serem os 'rabos'",
    description: "Cada participante recebe uma tira de tecido para colocar no cinto/calça como um 'rabo'. Todos tentam pegar o rabo dos outros enquanto protegem o seu.",
    duration: 15,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  
  // Trabalho em equipe (9)
  {
    name: "Ponte de Papel",
    category: "Trabalho em equipe" as DynamicCategory,
    objective: "Desenvolver planejamento coletivo e solução de problemas",
    materials: "Folhas de papel, fita adesiva, tesouras",
    description: "Em equipes, os participantes devem construir uma ponte apenas com os materiais fornecidos. A ponte deve ter pelo menos 30cm de comprimento e suportar um objeto pequeno.",
    duration: 40,
    minimumParticipants: 8,
    maximumParticipants: 40
  },
  {
    name: "Desafio do Marshmallow",
    category: "Trabalho em equipe" as DynamicCategory,
    objective: "Estimular planejamento, prototipagem e trabalho colaborativo",
    materials: "Espaguete cru, fita adesiva, barbante, marshmallows",
    description: "Em equipes, construir a estrutura mais alta possível que sustente um marshmallow no topo usando apenas os materiais fornecidos.",
    duration: 35,
    minimumParticipants: 8,
    maximumParticipants: 40
  },
  {
    name: "Campo Minado",
    category: "Trabalho em equipe" as DynamicCategory,
    objective: "Desenvolver comunicação clara e confiança",
    materials: "Vendas para os olhos, objetos para criar obstáculos",
    description: "Crie um percurso com obstáculos. Em pares, um vendado deve atravessar o campo guiado apenas pelas instruções verbais do parceiro.",
    duration: 30,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "Pipeline",
    category: "Trabalho em equipe" as DynamicCategory,
    objective: "Promover coordenação e planejamento conjunto",
    materials: "Canos de PVC cortados ao meio ou calhas de papel",
    description: "Divida em equipes com vários canos. Devem transportar uma bolinha de um ponto A ao B, usando os canos como calhas que vão passando de pessoa para pessoa.",
    duration: 30,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Quadrados Perfeitos",
    category: "Trabalho em equipe" as DynamicCategory,
    objective: "Estimular cooperação e percepção da interdependência",
    materials: "Envelopes com pedaços de papel que formam quadrados quando combinados corretamente",
    description: "Cada participante recebe peças que não formam um quadrado completo. Sem falar, apenas doando peças, todos devem conseguir formar quadrados idênticos.",
    duration: 30,
    minimumParticipants: 5,
    maximumParticipants: 25
  },
  {
    name: "Círculo de Apoio",
    category: "Trabalho em equipe" as DynamicCategory,
    objective: "Desenvolver confiança mútua e suporte entre os membros",
    materials: "Espaço amplo e livre de obstáculos",
    description: "Em círculo apertado, uma pessoa fica no centro e, mantendo o corpo rígido, se deixa cair em qualquer direção. O grupo ampara a pessoa, não deixando que caia.",
    duration: 20,
    minimumParticipants: 8,
    maximumParticipants: 15
  },
  {
    name: "História Colaborativa",
    category: "Trabalho em equipe" as DynamicCategory,
    objective: "Estimular criatividade coletiva e escuta ativa",
    materials: "Nenhum material necessário",
    description: "Em círculo, inicie uma história com uma frase. Cada pessoa acrescenta uma frase, construindo uma narrativa coletiva.",
    duration: 25,
    minimumParticipants: 5,
    maximumParticipants: 20
  },
  {
    name: "Tapete Mágico",
    category: "Trabalho em equipe" as DynamicCategory,
    objective: "Trabalhar resolução de problemas e coordenação",
    materials: "Lona ou cobertor grande o suficiente para todo o grupo ficar em pé",
    description: "Todo o grupo fica em pé sobre o 'tapete'. O desafio é virar o tapete do avesso sem que ninguém pise fora dele.",
    duration: 25,
    minimumParticipants: 8,
    maximumParticipants: 20
  },
  {
    name: "Contagem Regressiva",
    category: "Trabalho em equipe" as DynamicCategory,
    objective: "Desenvolver comunicação não-verbal e sintonia de grupo",
    materials: "Nenhum material necessário",
    description: "De olhos fechados, o grupo deve fazer uma contagem regressiva (ex: 20 a 1). Qualquer pessoa pode falar qualquer número, mas se duas pessoas falarem ao mesmo tempo, o grupo recomeça.",
    duration: 15,
    minimumParticipants: 6,
    maximumParticipants: 20
  },
  
  // Comunicação (9)
  {
    name: "Telefone sem Fio com Desenho",
    category: "Comunicação" as DynamicCategory,
    objective: "Demonstrar como a informação pode ser distorcida na comunicação",
    materials: "Papel, canetas",
    description: "A primeira pessoa recebe um desenho simples e o descreve para a segunda sem mostrar. A segunda desenha baseado na descrição e passa sua versão para a terceira, e assim por diante.",
    duration: 25,
    minimumParticipants: 6,
    maximumParticipants: 20
  },
  {
    name: "Construção às Cegas",
    category: "Comunicação" as DynamicCategory,
    objective: "Trabalhar clareza nas instruções e feedback",
    materials: "Blocos de montar, vendas para os olhos",
    description: "Em pares, um constrói algo simples e depois deve orientar verbalmente o parceiro vendado a reproduzir a mesma estrutura.",
    duration: 30,
    minimumParticipants: 4,
    maximumParticipants: 30
  },
  {
    name: "Escuta Ativa",
    category: "Comunicação" as DynamicCategory,
    objective: "Praticar técnicas de escuta efetiva",
    materials: "Temas para discussão em cartões",
    description: "Em pares, uma pessoa fala sobre um tema por 2 minutos. A outra deve escutar sem interromper e depois resumir o que entendeu antes de trocar os papéis.",
    duration: 20,
    minimumParticipants: 4,
    maximumParticipants: 40
  },
  {
    name: "Jogo das Palavras Proibidas",
    category: "Comunicação" as DynamicCategory,
    objective: "Desenvolver habilidades de descrição e comunicação alternativa",
    materials: "Cartões com palavras e suas 'palavras proibidas'",
    description: "Um participante deve fazer o grupo adivinhar uma palavra sem usar determinadas palavras relacionadas (ex: descrever 'café' sem usar 'bebida', 'quente', 'preto').",
    duration: 25,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "Instrução em Cadeia",
    category: "Comunicação" as DynamicCategory,
    objective: "Demonstrar a importância da precisão na transmissão de informações",
    materials: "Tarefa complexa escrita em papel",
    description: "A primeira pessoa lê uma instrução complexa e a passa verbalmente para a segunda, que a passa para a terceira, e assim por diante. A última pessoa deve executar a tarefa.",
    duration: 25,
    minimumParticipants: 6,
    maximumParticipants: 20
  },
  {
    name: "Debate Silencioso",
    category: "Comunicação" as DynamicCategory,
    objective: "Exercitar a comunicação escrita e a argumentação",
    materials: "Papel grande ou quadro branco, canetas coloridas",
    description: "Escreva um tema controverso no centro do papel. Os participantes debatem o tema escrevendo argumentos e contra-argumentos, conectando ideias com linhas, sem falar.",
    duration: 30,
    minimumParticipants: 5,
    maximumParticipants: 20
  },
  {
    name: "Estilos de Comunicação",
    category: "Comunicação" as DynamicCategory,
    objective: "Conscientizar sobre diferentes estilos de comunicação",
    materials: "Cartões com estilos de comunicação (assertivo, passivo, agressivo, manipulador)",
    description: "Em grupos, os participantes recebem cartões com estilos de comunicação e devem encenar situações usando esses estilos. O restante do grupo identifica o estilo utilizado.",
    duration: 40,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Leitura Corporal",
    category: "Comunicação" as DynamicCategory,
    objective: "Sensibilizar para a importância da comunicação não-verbal",
    materials: "Cartões com emoções ou mensagens",
    description: "Os participantes devem transmitir emoções ou mensagens apenas com expressões faciais e linguagem corporal, enquanto os outros tentam interpretar.",
    duration: 25,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "Coletiva de Imprensa",
    category: "Comunicação" as DynamicCategory,
    objective: "Desenvolver habilidades de síntese e clareza na comunicação",
    materials: "Cartões com temas ou notícias fictícias",
    description: "Um participante assume o papel de porta-voz de uma organização e deve responder a perguntas dos demais, que atuam como jornalistas, sobre uma situação fornecida pelo facilitador.",
    duration: 35,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  
  // Liderança (9)
  {
    name: "O Navio",
    category: "Liderança" as DynamicCategory,
    objective: "Explorar diferentes estilos de liderança e seus efeitos",
    materials: "Vendas para os olhos, obstáculos para criar um percurso",
    description: "Divida em grupos. Cada grupo nomeia um capitão que deve guiar seu 'navio' (equipe de olhos vendados) através de obstáculos usando diferentes estilos de liderança indicados pelo facilitador.",
    duration: 40,
    minimumParticipants: 10,
    maximumParticipants: 40
  },
  {
    name: "Construção Silenciosa",
    category: "Liderança" as DynamicCategory,
    objective: "Trabalhar liderança situacional e comunicação não-verbal",
    materials: "Blocos de montar ou materiais de escritório",
    description: "Em equipes, devem construir uma estrutura específica, mas apenas o líder sabe como deve ser o resultado final. O líder não pode falar, apenas gesticular.",
    duration: 35,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Ilha de Liderança",
    category: "Liderança" as DynamicCategory,
    objective: "Observar a emergência natural de líderes e diferentes papéis em grupos",
    materials: "Objetos diversos para resolver problemas (corda, caneta, papel, etc)",
    description: "Apresente um cenário de sobrevivência em uma ilha deserta. O grupo deve resolver uma série de desafios sem designar oficialmente um líder. Observe quem assume papéis de liderança.",
    duration: 45,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Fábrica com Defeito",
    category: "Liderança" as DynamicCategory,
    objective: "Trabalhar delegação de tarefas e gestão sob pressão",
    materials: "Materiais para montar um produto simples (ex: aviões de papel)",
    description: "O grupo forma uma linha de produção com um líder designado. Durante a atividade, o facilitador introduz 'defeitos' que o líder deve identificar e corrigir reorganizando o processo.",
    duration: 45,
    minimumParticipants: 8,
    maximumParticipants: 25
  },
  {
    name: "Liderança às Cegas",
    category: "Liderança" as DynamicCategory,
    objective: "Desenvolver confiança e técnicas de influência",
    materials: "Vendas para os olhos, objetos para montar um circuito",
    description: "Todos vendados exceto o líder, que deve guiar o grupo a completar uma tarefa apenas com comandos verbais, sem poder tocar nos participantes.",
    duration: 35,
    minimumParticipants: 6,
    maximumParticipants: 20
  },
  {
    name: "Círculo de Feedback",
    category: "Liderança" as DynamicCategory,
    objective: "Praticar dar e receber feedback construtivo",
    materials: "Papel, canetas",
    description: "Em círculo, cada participante recebe feedback estruturado dos demais sobre suas habilidades de liderança observadas durante o treinamento.",
    duration: 45,
    minimumParticipants: 6,
    maximumParticipants: 20
  },
  {
    name: "Momento de Crise",
    category: "Liderança" as DynamicCategory,
    objective: "Trabalhar a tomada de decisão sob pressão",
    materials: "Cenários de crise impressos, temporizador",
    description: "Divida em equipes com um líder cada. Apresente um cenário de crise empresarial. O líder tem 5 minutos para consultar sua equipe e tomar decisões cruciais.",
    duration: 40,
    minimumParticipants: 10,
    maximumParticipants: 40
  },
  {
    name: "Visão Compartilhada",
    category: "Liderança" as DynamicCategory,
    objective: "Trabalhar a comunicação de visão e engajamento",
    materials: "Papel grande, canetas coloridas",
    description: "O líder designado deve criar uma visão para um projeto fictício e comunicá-la de forma inspiradora. A equipe dá feedback sobre o poder de inspiração e clareza da mensagem.",
    duration: 35,
    minimumParticipants: 6,
    maximumParticipants: 25
  },
  {
    name: "Troca de Líderes",
    category: "Liderança" as DynamicCategory,
    objective: "Experimentar diferentes estilos de liderança",
    materials: "Tarefa complexa que leva tempo para ser completada",
    description: "Durante uma tarefa prolongada, diferentes pessoas assumem o papel de líder a cada 10 minutos. Ao final, o grupo discute como os diferentes estilos impactaram o trabalho.",
    duration: 50,
    minimumParticipants: 8,
    maximumParticipants: 25
  },
  
  // Criatividade (9)
  {
    name: "SCAMPER",
    category: "Criatividade" as DynamicCategory,
    objective: "Estimular o pensamento criativo sistemático",
    materials: "Flip chart, post-its, canetas",
    description: "Aplique as técnicas SCAMPER (Substituir, Combinar, Adaptar, Modificar, Propor outros usos, Eliminar, Reorganizar) para melhorar um produto ou serviço existente.",
    duration: 45,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "Crazy 8's",
    category: "Criatividade" as DynamicCategory,
    objective: "Gerar grande quantidade de ideias em curto espaço de tempo",
    materials: "Papel A4 dobrado em 8 partes, canetas",
    description: "Cada pessoa deve criar 8 ideias diferentes para solucionar um problema em 8 minutos, desenhando cada ideia em uma seção do papel.",
    duration: 20,
    minimumParticipants: 3,
    maximumParticipants: 30
  },
  {
    name: "Objeto Extraordinário",
    category: "Criatividade" as DynamicCategory,
    objective: "Estimular o pensamento além das funções óbvias",
    materials: "Objetos comuns (clipe, garrafa, etc)",
    description: "Cada equipe recebe um objeto comum e deve encontrar pelo menos 30 usos não convencionais para ele em 10 minutos.",
    duration: 25,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "Conexões Forçadas",
    category: "Criatividade" as DynamicCategory,
    objective: "Estimular associações criativas improváveis",
    materials: "Cartões com palavras aleatórias",
    description: "Os participantes sorteiam duas palavras aparentemente sem relação e devem criar um produto ou serviço que combine os dois conceitos.",
    duration: 30,
    minimumParticipants: 4,
    maximumParticipants: 30
  },
  {
    name: "Brainstorming Reverso",
    category: "Criatividade" as DynamicCategory,
    objective: "Abordar problemas de uma nova perspectiva",
    materials: "Flip chart, post-its, canetas",
    description: "Em vez de buscar soluções, o grupo lista todas as formas de piorar o problema. Depois, inverte cada ideia para encontrar possíveis soluções.",
    duration: 35,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "Chapéus do Pensamento",
    category: "Criatividade" as DynamicCategory,
    objective: "Explorar diferentes perspectivas de pensamento",
    materials: "Chapéus ou cartões de 6 cores diferentes (branco, vermelho, preto, amarelo, verde, azul)",
    description: "Baseado no método de Edward de Bono, cada cor representa um modo de pensar. Os participantes analisam uma situação usando cada 'chapéu' sequencialmente.",
    duration: 45,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "Protótipo Rápido",
    category: "Criatividade" as DynamicCategory,
    objective: "Materializar ideias rapidamente para testá-las",
    materials: "Materiais diversos de escritório, sucatas, cola, tesoura",
    description: "Em equipes, criam protótipos físicos simples de uma ideia em 20 minutos, usando apenas os materiais disponíveis.",
    duration: 45,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "Biografias Cruzadas",
    category: "Criatividade" as DynamicCategory,
    objective: "Buscar inspiração em diferentes perspectivas",
    materials: "Cartões com nomes de personalidades famosas de diferentes áreas",
    description: "Diante de um desafio, os participantes sorteiam uma personalidade e devem imaginar como essa pessoa abordaria o problema.",
    duration: 35,
    minimumParticipants: 5,
    maximumParticipants: 25
  },
  {
    name: "Storyboard Coletivo",
    category: "Criatividade" as DynamicCategory,
    objective: "Visualizar soluções através de narrativas",
    materials: "Papel grande dividido em quadros, canetas coloridas",
    description: "Em equipes, criam uma história em quadrinhos que representa a jornada de solução de um problema, com cada pessoa adicionando um quadro à história.",
    duration: 40,
    minimumParticipants: 4,
    maximumParticipants: 24
  },
  
  // Resolução de problemas (9)
  {
    name: "Diagrama de Ishikawa",
    category: "Resolução de problemas" as DynamicCategory,
    objective: "Identificar causas raiz de problemas",
    materials: "Papel grande, post-its, canetas",
    description: "Em grupos, crie um diagrama de espinha de peixe para analisar as possíveis causas de um problema, organizando-as em categorias como pessoas, processos, tecnologia, etc.",
    duration: 45,
    minimumParticipants: 5,
    maximumParticipants: 25
  },
  {
    name: "Os 5 Porquês",
    category: "Resolução de problemas" as DynamicCategory,
    objective: "Aprofundar a análise para encontrar a causa raiz",
    materials: "Papel, canetas",
    description: "Diante de um problema, pergunte 'por quê?' cinco vezes consecutivas, cada resposta levando a uma nova pergunta, para chegar à causa fundamental.",
    duration: 30,
    minimumParticipants: 4,
    maximumParticipants: 30
  },
  {
    name: "Matriz de Priorização",
    category: "Resolução de problemas" as DynamicCategory,
    objective: "Tomar decisões baseadas em critérios objetivos",
    materials: "Papel grande com matriz desenhada, adesivos para votação",
    description: "Crie uma matriz com eixos de 'Impacto' e 'Esforço'. Posicione as possíveis soluções na matriz para identificar 'quick wins' e prioridades.",
    duration: 40,
    minimumParticipants: 5,
    maximumParticipants: 25
  },
  {
    name: "Círculo de Soluções",
    category: "Resolução de problemas" as DynamicCategory,
    objective: "Gerar múltiplas perspectivas sobre um problema",
    materials: "Papel, canetas",
    description: "Um participante apresenta um problema real. Cada pessoa no círculo tem um minuto para oferecer uma sugestão ou perspectiva, sem debates ou interrupções.",
    duration: 35,
    minimumParticipants: 6,
    maximumParticipants: 20
  },
  {
    name: "Análise SWOT Dinâmica",
    category: "Resolução de problemas" as DynamicCategory,
    objective: "Analisar fatores internos e externos que afetam um problema",
    materials: "Papel grande dividido em quatro quadrantes, post-its, canetas",
    description: "Em equipes, preenchem uma matriz SWOT (Forças, Fraquezas, Oportunidades, Ameaças) relacionada a um desafio organizacional, movendo-se entre os quadrantes a cada 5 minutos.",
    duration: 40,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Redefinição do Problema",
    category: "Resolução de problemas" as DynamicCategory,
    objective: "Enxergar o problema de diferentes ângulos",
    materials: "Papel, canetas",
    description: "Um problema é apresentado. Os participantes devem reescrever o problema pelo menos 10 vezes, alterando a perspectiva, o enquadramento ou o foco.",
    duration: 30,
    minimumParticipants: 4,
    maximumParticipants: 25
  },
  {
    name: "World Café",
    category: "Resolução de problemas" as DynamicCategory,
    objective: "Explorar múltiplas dimensões de um problema complexo",
    materials: "Mesas com papel grande, canetas coloridas",
    description: "Crie 'cafés' temáticos, cada um abordando um aspecto do problema. Os participantes rotacionam entre os cafés, construindo sobre as ideias dos grupos anteriores.",
    duration: 60,
    minimumParticipants: 12,
    maximumParticipants: 50
  },
  {
    name: "Desafio de Requisitos Limitados",
    category: "Resolução de problemas" as DynamicCategory,
    objective: "Estimular a criatividade dentro de restrições",
    materials: "Descrição do problema com restrições específicas",
    description: "Apresente um problema com restrições artificiais (ex: solução com custo zero, implementável em 24h). As limitações forçam o grupo a pensar fora da caixa.",
    duration: 35,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "Prós e Contras Expandidos",
    category: "Resolução de problemas" as DynamicCategory,
    objective: "Avaliar soluções de forma abrangente",
    materials: "Papel, canetas, template com quatro quadrantes",
    description: "Para cada solução, o grupo identifica não apenas prós e contras, mas também 'como maximizar os prós' e 'como mitigar os contras', criando uma análise mais profunda.",
    duration: 35,
    minimumParticipants: 5,
    maximumParticipants: 25
  },
  
  // Tomada de decisão (9)
  {
    name: "Quadrante de Decisão",
    category: "Tomada de decisão" as DynamicCategory,
    objective: "Avaliar opções com base em critérios definidos",
    materials: "Papel grande com quadrantes desenhados, post-its, canetas",
    description: "Divida um papel em quatro quadrantes: 'Faça agora', 'Planeje', 'Delegue', 'Elimine'. Posicione decisões pendentes nos quadrantes com base em urgência e importância.",
    duration: 35,
    minimumParticipants: 4,
    maximumParticipants: 25
  },
  {
    name: "Tribunal de Decisões",
    category: "Tomada de decisão" as DynamicCategory,
    objective: "Explorar prós e contras de forma aprofundada",
    materials: "Cartões com papéis (juiz, advogados, testemunhas, júri)",
    description: "Simule um tribunal onde uma decisão está sendo julgada. Divida papéis de promotor, defesa, testemunhas e júri. Conduza um 'julgamento' para chegar a um veredito.",
    duration: 50,
    minimumParticipants: 10,
    maximumParticipants: 30
  },
  {
    name: "Votação por Pontos",
    category: "Tomada de decisão" as DynamicCategory,
    objective: "Priorizar opções coletivamente",
    materials: "Lista de opções em papel grande, adesivos coloridos",
    description: "Gere uma lista de opções e dê a cada participante um número limitado de 'pontos' (adesivos). Eles distribuem seus pontos entre as opções, revelando preferências coletivas.",
    duration: 25,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "RAPID",
    category: "Tomada de decisão" as DynamicCategory,
    objective: "Clarificar papéis no processo decisório",
    materials: "Planilha RAPID (Recomenda, Aprova, Performa, Input, Decide)",
    description: "Para uma decisão importante, atribua claramente os papéis RAPID a diferentes membros da equipe e simule o processo decisório com esses papéis.",
    duration: 45,
    minimumParticipants: 5,
    maximumParticipants: 20
  },
  {
    name: "Seis Chapéus do Pensamento",
    category: "Tomada de decisão" as DynamicCategory,
    objective: "Analisar decisões de múltiplas perspectivas",
    materials: "Descrição dos seis chapéus (fatos, emoções, crítico, otimista, criativo, processo)",
    description: "Diante de uma decisão, o grupo analisa a questão usando sequencialmente os seis modos de pensamento: fatos objetivos, reações emocionais, riscos potenciais, benefícios, alternativas criativas e organização do processo.",
    duration: 45,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "Análise de Cenários",
    category: "Tomada de decisão" as DynamicCategory,
    objective: "Avaliar consequências de decisões a longo prazo",
    materials: "Template para construção de cenários, post-its, canetas",
    description: "Para uma decisão importante, o grupo projeta três cenários possíveis (melhor caso, pior caso, caso mais provável) e avalia como a decisão se comportaria em cada um.",
    duration: 45,
    minimumParticipants: 6,
    maximumParticipants: 25
  },
  {
    name: "Decisão por Consenso Gradual",
    category: "Tomada de decisão" as DynamicCategory,
    objective: "Construir concordância em decisões difíceis",
    materials: "Cartões com escala de 1-5 para cada participante",
    description: "O grupo avalia propostas com cartões numerados (1=bloqueia, 5=apoia totalmente). Quem votar abaixo de 3 deve explicar suas preocupações, que são então incorporadas na proposta até alcançar concordância mínima de 3 de todos.",
    duration: 40,
    minimumParticipants: 5,
    maximumParticipants: 20
  },
  {
    name: "Galeria de Decisões",
    category: "Tomada de decisão" as DynamicCategory,
    objective: "Coletar feedback amplo sobre possíveis decisões",
    materials: "Papel grande para cada opção, canetas coloridas, adesivos",
    description: "As opções de decisão são apresentadas em 'estações' ao redor da sala. Os participantes circulam, adicionam comentários, sugestões e preocupações em cada estação.",
    duration: 35,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Árvore de Decisão",
    category: "Tomada de decisão" as DynamicCategory,
    objective: "Visualizar consequências e probabilidades de diferentes caminhos",
    materials: "Papel grande, post-its, canetas coloridas",
    description: "O grupo constrói uma árvore visual com diferentes opções, ramificações de consequências, estimativas de probabilidade e valores de resultado para cada caminho possível.",
    duration: 45,
    minimumParticipants: 4,
    maximumParticipants: 20
  },
  
  // Feedback (9)
  {
    name: "Feedback Sanduíche",
    category: "Feedback" as DynamicCategory,
    objective: "Praticar a estrutura básica de feedback construtivo",
    materials: "Cartões com situações para role-play",
    description: "Em pares, praticam dar feedback usando a estrutura: ponto positivo, área de melhoria, conclusão positiva. Depois discutem como foi a experiência de dar e receber.",
    duration: 30,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "SBI (Situação, Comportamento, Impacto)",
    category: "Feedback" as DynamicCategory,
    objective: "Estruturar feedback específico e baseado em comportamentos observáveis",
    materials: "Cartões com o modelo SBI, situações para prática",
    description: "Os participantes praticam dar feedback usando a estrutura: descrever a situação específica, o comportamento observado e o impacto que teve, sem julgamentos.",
    duration: 35,
    minimumParticipants: 6,
    maximumParticipants: 30
  },
  {
    name: "Troca de Janelas",
    category: "Feedback" as DynamicCategory,
    objective: "Compreender diferentes perspectivas e pontos cegos",
    materials: "Template da Janela de Johari, papel, canetas",
    description: "Baseado na Janela de Johari, os participantes identificam características que conhecem sobre si, que os outros conhecem sobre eles, áreas desconhecidas e pontos cegos, compartilhando em pequenos grupos.",
    duration: 45,
    minimumParticipants: 6,
    maximumParticipants: 24
  },
  {
    name: "Círculo de Apreciação",
    category: "Feedback" as DynamicCategory,
    objective: "Praticar feedback positivo específico",
    materials: "Nenhum material necessário",
    description: "Em círculo, cada participante recebe feedback positivo específico de todos os outros sobre suas contribuições durante o treinamento ou projeto.",
    duration: 40,
    minimumParticipants: 5,
    maximumParticipants: 20
  },
  {
    name: "Feedback 360° Simplificado",
    category: "Feedback" as DynamicCategory,
    objective: "Receber feedback de múltiplas perspectivas",
    materials: "Formulários com perguntas estruturadas de feedback",
    description: "Cada participante recebe feedback anônimo de vários colegas sobre aspectos específicos de sua atuação, seguindo um formulário estruturado.",
    duration: 50,
    minimumParticipants: 8,
    maximumParticipants: 30
  },
  {
    name: "Stop, Start, Continue",
    category: "Feedback" as DynamicCategory,
    objective: "Estruturar feedback de forma prática e orientada à ação",
    materials: "Post-its em três cores diferentes, canetas",
    description: "Em grupos pequenos, cada pessoa recebe feedback em três categorias: o que deveria parar de fazer, começar a fazer e continuar fazendo.",
    duration: 35,
    minimumParticipants: 6,
    maximumParticipants: 24
  },
  {
    name: "Aquário de Feedback",
    category: "Feedback" as DynamicCategory,
    objective: "Observar e aprender com exemplos de feedback bem estruturado",
    materials: "Cenários preparados, cadeiras em círculos concêntricos",
    description: "Alguns voluntários formam um círculo interno e praticam dar e receber feedback sobre cenários reais, enquanto o círculo externo observa e depois comenta sobre as técnicas utilizadas.",
    duration: 45,
    minimumParticipants: 10,
    maximumParticipants: 30
  },
  {
    name: "Metáfora do Espelho",
    category: "Feedback" as DynamicCategory,
    objective: "Refletir sobre como receber feedback de forma construtiva",
    materials: "Pequenos espelhos ou cartões com imagem de espelho",
    description: "Os participantes refletem e compartilham sobre como reagem ao receber feedback (defensiva, abertura, negação), usando a metáfora do espelho para discutir como o feedback reflete algo que podemos não ver em nós mesmos.",
    duration: 30,
    minimumParticipants: 6,
    maximumParticipants: 25
  },
  {
    name: "Mapa de Feedback",
    category: "Feedback" as DynamicCategory,
    objective: "Visualizar padrões e áreas de desenvolvimento",
    materials: "Papel grande com modelo de mapa, post-its, canetas coloridas",
    description: "Cada participante cria um mapa visual de feedback recebido, agrupando temas, identificando padrões e definindo áreas prioritárias para desenvolvimento.",
    duration: 40,
    minimumParticipants: 5,
    maximumParticipants: 25
  },
  
  // Reflexão (9)
  {
    name: "Círculo de Compartilhamento",
    category: "Reflexão" as DynamicCategory,
    objective: "Criar espaço para reflexão e aprendizado coletivo",
    materials: "Objeto de fala (bastão, bola, etc)",
    description: "Em círculo, cada participante tem a oportunidade de compartilhar insights pessoais sobre o aprendizado do dia/evento, usando um objeto que passa de mão em mão indicando quem tem a palavra.",
    duration: 30,
    minimumParticipants: 5,
    maximumParticipants: 25
  },
  {
    name: "Carta para o Futuro",
    category: "Reflexão" as DynamicCategory,
    objective: "Concretizar compromissos e aprendizados",
    materials: "Papel, envelopes, canetas",
    description: "Cada participante escreve uma carta para si mesmo, detalhando aprendizados, compromissos e metas para aplicar o conteúdo do treinamento. As cartas são enviadas por email 1-3 meses depois.",
    duration: 25,
    minimumParticipants: 5,
    maximumParticipants: 50
  },
  {
    name: "Retrospectiva com Estrela",
    category: "Reflexão" as DynamicCategory,
    objective: "Avaliar múltiplas dimensões de um evento ou projeto",
    materials: "Papel grande com estrela de 5 pontas desenhada, post-its, canetas",
    description: "Na estrela, cada ponta representa uma dimensão: O que gostei? O que aprendi? O que faltou? O que questionei? O que levarei comigo? Todos contribuem em todas as dimensões com post-its.",
    duration: 35,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "Jornada do Herói",
    category: "Reflexão" as DynamicCategory,
    objective: "Mapear a trajetória pessoal de aprendizado",
    materials: "Papel grande, canetas coloridas",
    description: "Baseado no conceito de 'Jornada do Herói', cada participante cria uma representação visual de sua jornada durante o treinamento/projeto, identificando desafios, momentos de descoberta e transformações.",
    duration: 40,
    minimumParticipants: 4,
    maximumParticipants: 25
  },
  {
    name: "Mapa de Impacto",
    category: "Reflexão" as DynamicCategory,
    objective: "Visualizar o impacto de aprendizados em diferentes esferas",
    materials: "Papel com círculos concêntricos, canetas coloridas",
    description: "Desenhe círculos concêntricos representando diferentes esferas (individual, equipe, organização, clientes). Os participantes mapeiam como aplicarão os aprendizados em cada esfera.",
    duration: 30,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "Diário de Aprendizado",
    category: "Reflexão" as DynamicCategory,
    objective: "Documentar e processar aprendizados cotidianos",
    materials: "Cadernos ou templates de diário, canetas",
    description: "Introduza um formato estruturado de diário com perguntas como: O que aprendi hoje? Como isso se relaciona com o que já sabia? Como aplicarei este conhecimento? Pratique o preenchimento em grupo.",
    duration: 25,
    minimumParticipants: 5,
    maximumParticipants: 50
  },
  {
    name: "Linha do Tempo de Aprendizados",
    category: "Reflexão" as DynamicCategory,
    objective: "Visualizar a evolução do conhecimento ao longo do tempo",
    materials: "Papel grande com linha do tempo, post-its, canetas",
    description: "Crie uma linha do tempo do programa/projeto. Os participantes colocam post-its indicando momentos-chave de aprendizado, desafios superados e insights importantes.",
    duration: 35,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "Três Níveis de Reflexão",
    category: "Reflexão" as DynamicCategory,
    objective: "Aprofundar a reflexão para além da superfície",
    materials: "Papel com template dos três níveis, canetas",
    description: "Guie uma reflexão estruturada em três níveis: 1) O que aconteceu? (fatos) 2) Como me senti/reagimos? (emoções) 3) O que isso significa? (aprendizados e implicações)",
    duration: 30,
    minimumParticipants: 5,
    maximumParticipants: 30
  },
  {
    name: "Conselho ao Meu Eu do Passado",
    category: "Reflexão" as DynamicCategory,
    objective: "Concretizar aprendizados e perceber crescimento",
    materials: "Papel, canetas",
    description: "Os participantes escrevem um conselho que dariam a si mesmos no início do programa/projeto, baseado no que aprenderam e como cresceram desde então.",
    duration: 25,
    minimumParticipants: 5,
    maximumParticipants: 40
  }
];
