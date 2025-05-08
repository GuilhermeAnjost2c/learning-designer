
import { Dynamic } from "@/store/dynamicsStore";

export const sampleDynamics: Omit<Dynamic, "id" | "createdAt">[] = [
  {
    name: "Apresentação em Pares",
    category: "Quebra-gelo",
    objective: "Facilitar a apresentação dos participantes de forma dinâmica e interativa",
    materials: "Nenhum",
    description: "Os participantes formam pares e têm 5 minutos para se conhecerem mutuamente. Depois, cada pessoa apresenta seu par ao grupo todo.",
    duration: 20,
    minimumParticipants: 4,
    maximumParticipants: 30
  },
  {
    name: "Desafio da Torre",
    category: "Trabalho em equipe",
    objective: "Promover cooperação e comunicação entre os membros da equipe",
    materials: "Macarrão espaguete seco, fita adesiva, barbante, marshmallows",
    description: "Em equipes, os participantes devem construir a torre mais alta possível usando apenas os materiais fornecidos. A torre deve ser autossustentável e o marshmallow deve ficar no topo.",
    duration: 30,
    minimumParticipants: 6,
    maximumParticipants: 20
  },
  {
    name: "Feedback em Círculo",
    category: "Feedback",
    objective: "Praticar a habilidade de dar e receber feedback de forma construtiva",
    materials: "Cadeiras, papéis, canetas",
    description: "Os participantes sentam-se em círculo. Cada pessoa escreve uma qualidade e uma oportunidade de melhoria para a pessoa à sua direita. Depois, todos compartilham seus feedbacks em voz alta.",
    duration: 40,
    minimumParticipants: 5,
    maximumParticipants: 15
  },
  {
    name: "Solução Criativa de Problemas",
    category: "Criatividade",
    objective: "Estimular o pensamento criativo e inovador",
    materials: "Objetos aleatórios (clipe, copo, elástico, etc.), papel, canetas",
    description: "Cada equipe recebe um objeto aleatório e um problema para resolver. Eles devem encontrar uma forma de usar o objeto para resolver o problema de maneira criativa.",
    duration: 25,
    minimumParticipants: 4,
    maximumParticipants: 24
  },
  {
    name: "Círculo de Energia",
    category: "Energização",
    objective: "Aumentar a energia do grupo e criar foco",
    materials: "Nenhum",
    description: "Em círculo, os participantes passam uma palma para a pessoa ao lado, em sequência, criando um ritmo. Gradualmente aumenta-se a velocidade e pode-se adicionar sons.",
    duration: 10,
    minimumParticipants: 6,
    maximumParticipants: 30
  }
];
