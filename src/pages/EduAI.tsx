
import { useState, useRef, useEffect } from "react";
import { Bot, Send, RefreshCw, Brain, FileText, LayoutTemplate, User, Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
};

const EduAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o Edu, seu consultor de Design de Experiência de Aprendizagem. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const tools: Tool[] = [
    {
      id: "content-review",
      name: "Revisão de Conteúdo",
      description: "Analisa e melhora o conteúdo existente para maior eficácia de aprendizagem",
      icon: <FileText className="h-5 w-5" />,
      prompt: "Por favor, revise o seguinte conteúdo de aprendizagem e sugira melhorias:\n\n"
    },
    {
      id: "training-matrix",
      name: "Matriz de Treinamento",
      description: "Cria uma matriz estruturada para programas de treinamento completos",
      icon: <LayoutTemplate className="h-5 w-5" />,
      prompt: "Preciso de uma matriz de treinamento para o seguinte tema ou habilidade:\n\n"
    },
    {
      id: "learner-profile",
      name: "Perfil do Aprendiz",
      description: "Ajuda a definir personas de aprendizes para personalizar a experiência",
      icon: <User className="h-5 w-5" />,
      prompt: "Ajude-me a criar um perfil de aprendiz para o seguinte contexto:\n\n"
    },
    {
      id: "learning-design",
      name: "Design Instrucional",
      description: "Assistência no design de experiências de aprendizagem eficazes",
      icon: <Brain className="h-5 w-5" />,
      prompt: "Preciso criar um design instrucional para o seguinte objetivo de aprendizagem:\n\n"
    },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const response = await askDeepseek(
        selectedTool 
          ? `${selectedTool.prompt}${inputValue}`
          : inputValue
      );
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ]);
      
      setSelectedTool(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível obter uma resposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const askDeepseek = async (message: string): Promise<string> => {
    // In a real implementation, this would call the Deepseek API
    // For now, we'll simulate a response with a timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        const systemPrompt = "Você é o Edu, um assistente especializado em Design de Experiência de Aprendizagem para educação corporativa. Sua missão é ajudar a criar, melhorar e avaliar experiências de aprendizagem eficazes. Seja detalhado, atencioso e colaborativo em suas respostas.";
        
        // Simulate different responses based on the message content
        if (message.includes("matriz de treinamento")) {
          resolve(`Aqui está uma matriz de treinamento sugerida para seu tema:

## Matriz de Treinamento

### Nível 1: Fundamentos
- **Módulo 1.1**: Conceitos Básicos (2 horas)
- **Módulo 1.2**: Terminologia Essencial (1 hora)
- **Avaliação**: Quiz de verificação de conhecimento

### Nível 2: Aplicação Prática
- **Módulo 2.1**: Estudo de Casos (3 horas)
- **Módulo 2.2**: Exercícios Práticos (4 horas)
- **Avaliação**: Projeto prático em pequenos grupos

### Nível 3: Especialização
- **Módulo 3.1**: Técnicas Avançadas (3 horas)
- **Módulo 3.2**: Resolução de Problemas Complexos (4 horas)
- **Avaliação**: Simulação de cenário real

Este é apenas um framework inicial. Podemos adaptar esta estrutura para atender às necessidades específicas do seu contexto organizacional.`);
        } else if (message.includes("revisão de conteúdo")) {
          resolve(`## Análise de Conteúdo

Após revisar o material fornecido, aqui estão minhas observações e sugestões para aprimoramento:

### Pontos Fortes
- Estrutura lógica dos tópicos
- Exemplos práticos incluídos

### Oportunidades de Melhoria
1. **Engajamento**: Adicione perguntas reflexivas ao longo do conteúdo
2. **Acessibilidade**: Simplifique a linguagem técnica nas seções 2 e 4
3. **Retenção**: Incorpore elementos visuais para conceitos complexos
4. **Aplicação**: Adicione exercícios práticos após cada módulo

### Sugestões de Reformulação
Para a seção introdutória, sugiro reescrever desta forma:
"Este módulo apresenta os fundamentos de X, preparando você para aplicar estes conceitos em situações reais do dia a dia profissional."

Estou à disposição para trabalhar em revisões mais detalhadas de seções específicas.`);
        } else if (message.includes("perfil do aprendiz")) {
          resolve(`## Perfil do Aprendiz: Gestor de Nível Médio em Transição Digital

### Características Demográficas
- **Faixa etária**: 35-45 anos
- **Experiência profissional**: 10+ anos em gestão
- **Conhecimento técnico**: Intermediário, com lacunas em tecnologias recentes

### Necessidades de Aprendizagem
- Atualização em ferramentas digitais de gestão
- Métodos de liderança em ambientes híbridos
- Análise de dados para tomada de decisão

### Preferências de Aprendizado
- Valoriza exemplos práticos e estudos de caso
- Prefere aprendizado aplicável imediatamente
- Aprecia mentoria e troca entre pares

### Desafios
- Tempo limitado para dedicar ao aprendizado
- Resistência a metodologias muito diferentes das tradicionais
- Necessidade de resultados rápidos e mensuráveis

### Recomendações de Design
- Sessões curtas (máximo 30 minutos)
- Combinar teoria com aplicação prática imediata
- Incluir elementos de networking com outros gestores
- Oferecer recursos complementares para aprofundamento opcional`);
        } else {
          resolve(`Obrigado por sua pergunta sobre design de experiência de aprendizagem.

Para criar experiências de aprendizagem verdadeiramente eficazes, recomendo considerar estas dimensões-chave:

1. **Compreensão do público-alvo**
   - Quem são seus aprendizes?
   - Qual o conhecimento prévio que possuem?
   - Quais suas motivações e barreiras?

2. **Clareza nos objetivos**
   - O que os aprendizes devem ser capazes de fazer após a experiência?
   - Como isso se conecta com suas necessidades reais?

3. **Engajamento e diversidade**
   - Como diversificar as estratégias pedagógicas?
   - Quais elementos podem gerar conexão emocional?

4. **Avaliação significativa**
   - Como verificar a eficácia da aprendizagem?
   - Que mecanismos de feedback são mais apropriados?

Posso ajudar a aprofundar qualquer uma dessas dimensões ou explorar outros aspectos específicos do seu contexto de aprendizagem.`);
        }
      }, 1500);
    });
  };

  const resetConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Olá! Sou o Edu, seu consultor de Design de Experiência de Aprendizagem. Como posso ajudar você hoje?",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Conversa reiniciada",
      description: "Todas as mensagens anteriores foram removidas.",
    });
  };

  const selectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setInputValue(tool.prompt);
    toast({
      title: `Ferramenta: ${tool.name}`,
      description: "Adicione suas informações específicas à solicitação.",
    });
  };

  const saveConversation = () => {
    const conversationData = JSON.stringify(messages);
    const blob = new Blob([conversationData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `edu-conversation-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Conversa salva",
      description: "O arquivo foi baixado para seu computador.",
    });
  };

  return (
    <div className="container py-4 max-w-6xl mx-auto">
      <Tabs defaultValue="chat" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <Bot className="h-6 w-6" /> Edu - Consultor de Aprendizagem
          </h1>
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tools">Ferramentas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 h-[calc(100vh-300px)]">
                <div className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4 h-full">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-lg ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="whitespace-pre-line">{message.content}</div>
                            <div
                              className={`text-xs mt-2 ${
                                message.role === "user"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messageEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Digite sua pergunta ou desafio de aprendizagem..."
                      className="flex-1 min-h-[80px]"
                      disabled={isLoading}
                    />
                    <div className="flex flex-col gap-2">
                      <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                        {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        title="Reiniciar conversa"
                        onClick={resetConversation}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        title="Salvar conversa"
                        onClick={saveConversation}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
                
                {selectedTool && (
                  <div className="w-64 p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      {selectedTool.icon}
                      {selectedTool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedTool.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedTool(null)}
                    >
                      Limpar ferramenta
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tools">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Card key={tool.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tool.icon}
                    {tool.name}
                  </CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => selectTool(tool)}
                  >
                    Usar ferramenta
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EduAI;
