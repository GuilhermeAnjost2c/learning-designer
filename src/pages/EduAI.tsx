
import { useState, useEffect } from "react";
import { Bot, FileText, LayoutTemplate, User, Brain, RefreshCw, CheckCircle, Lightbulb, Target, Puzzle, Award, MessageSquare, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  category: string;
  tags?: string[];
  isNew?: boolean;
};

type DialogState = {
  isOpen: boolean;
  tool: Tool | null;
  inputValue: string;
  isLoading: boolean;
  result: string | null;
};

const EduAI = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    tool: null,
    inputValue: "",
    isLoading: false,
    result: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();
  
  const tools: Tool[] = [
    {
      id: "content-review",
      name: "Revisão de Conteúdo",
      description: "Analisa e melhora o conteúdo existente para maior eficácia de aprendizagem",
      icon: <FileText className="h-14 w-14 text-blue-500" />,
      prompt: "Revisão de conteúdo educacional",
      category: "Conteúdo",
      isNew: true,
    },
    {
      id: "training-matrix",
      name: "Matriz de Treinamento",
      description: "Cria uma matriz estruturada para programas de treinamento completos",
      icon: <LayoutTemplate className="h-14 w-14 text-indigo-500" />,
      prompt: "Desenvolvimento de matriz de treinamento",
      category: "Planejamento",
    },
    {
      id: "learner-profile",
      name: "Perfil do Aprendiz",
      description: "Ajuda a definir personas de aprendizes para personalizar a experiência",
      icon: <User className="h-14 w-14 text-purple-500" />,
      prompt: "Criação de perfil de aprendiz",
      category: "Análise",
      tags: ["Personalização", "UX"],
    },
    {
      id: "learning-design",
      name: "Design Instrucional",
      description: "Assistência no design de experiências de aprendizagem eficazes",
      icon: <Brain className="h-14 w-14 text-rose-500" />,
      prompt: "Design instrucional para objetivo de aprendizagem",
      category: "Design",
    },
    {
      id: "learning-objectives",
      name: "Objetivos de Aprendizagem",
      description: "Desenvolvimento de objetivos claros e mensuráveis para seu treinamento",
      icon: <Target className="h-14 w-14 text-green-500" />,
      prompt: "Elaboração de objetivos de aprendizagem",
      category: "Planejamento",
      isNew: true,
    },
    {
      id: "engagement-strategies",
      name: "Estratégias de Engajamento",
      description: "Técnicas para aumentar o envolvimento e a participação dos aprendizes",
      icon: <Puzzle className="h-14 w-14 text-amber-500" />,
      prompt: "Estratégias de engajamento para treinamento",
      category: "Engajamento",
    },
    {
      id: "learning-evaluation",
      name: "Avaliação de Aprendizagem",
      description: "Métodos para avaliar a eficácia do seu programa de treinamento",
      icon: <CheckCircle className="h-14 w-14 text-cyan-500" />,
      prompt: "Métodos de avaliação de aprendizagem",
      category: "Avaliação",
    },
    {
      id: "innovation-insights",
      name: "Insights de Inovação",
      description: "Tendências e inovações em educação corporativa para inspirar seu projeto",
      icon: <Lightbulb className="h-14 w-14 text-yellow-500" />,
      prompt: "Tendências de inovação em educação corporativa",
      category: "Inovação",
      tags: ["Tendências", "Futuro"],
      isNew: true,
    },
    {
      id: "certification-design",
      name: "Design de Certificação",
      description: "Estruturação de programas de certificação interna ou externa",
      icon: <Award className="h-14 w-14 text-emerald-500" />,
      prompt: "Criação de programa de certificação",
      category: "Certificação",
    },
    {
      id: "training-script",
      name: "Roteiro de Treinamento",
      description: "Desenvolvimento de roteiros detalhados para sessões de treinamento",
      icon: <MessageSquare className="h-14 w-14 text-pink-500" />,
      prompt: "Elaboração de roteiro de treinamento",
      category: "Conteúdo",
    },
  ];

  // Extrair todas as categorias únicas dos tools
  const allCategories = ["all", ...Array.from(new Set(tools.map(tool => tool.category)))];

  // Filtrar ferramentas com base na pesquisa e categoria
  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      searchQuery === "" || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || tool.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const selectTool = (tool: Tool) => {
    setDialogState({
      isOpen: true,
      tool,
      inputValue: "",
      isLoading: false,
      result: null,
    });
  };

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      tool: null,
      inputValue: "",
      isLoading: false,
      result: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dialogState.inputValue.trim() || !dialogState.tool) return;
    
    setDialogState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await askDeepseek(
        `${dialogState.tool.prompt}: ${dialogState.inputValue}`
      );
      
      setDialogState(prev => ({
        ...prev,
        isLoading: false,
        result: response,
      }));
      
      toast({
        title: "Resposta gerada com sucesso",
        description: "Seu conteúdo foi gerado pela IA.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível obter uma resposta. Tente novamente.",
        variant: "destructive",
      });
      setDialogState(prev => ({ ...prev, isLoading: false }));
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
          resolve(`## Matriz de Treinamento

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
          resolve(`Obrigado por sua solicitação sobre design de experiência de aprendizagem.

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

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <Bot className="h-8 w-8" /> 
              Edu - Consultor de Aprendizagem
            </h1>
            <p className="text-muted-foreground mt-1">
              Ferramentas especializadas para design de experiências de aprendizagem
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Pesquisar ferramenta..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6" 
                  onClick={() => setSearchQuery("")}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "Todas categorias" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTools.map((tool) => (
            <Card 
              key={tool.id} 
              className="overflow-hidden border bg-card hover:shadow-md transition-all duration-300 hover:translate-y-[-4px] flex flex-col"
            >
              <CardHeader className="pb-2 flex-1">
                <div className="flex justify-between items-start">
                  <div className="mb-1">{tool.icon}</div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {tool.isNew && <Badge className="bg-rose-500">Novo</Badge>}
                  </div>
                </div>
                <CardTitle className="mt-2 text-xl">{tool.name}</CardTitle>
                <Badge variant="secondary" className="mt-1 mb-2">
                  {tool.category}
                </Badge>
                <CardDescription className="line-clamp-2 h-10">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button 
                  onClick={() => selectTool(tool)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Usar ferramenta
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Bot className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Nenhuma ferramenta encontrada</h3>
            <p className="text-muted-foreground mt-2">
              Tente ajustar seus filtros ou termos de pesquisa.
            </p>
          </div>
        )}

        <Dialog open={dialogState.isOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {dialogState.tool?.icon && <span className="h-6 w-6">{dialogState.tool.icon}</span>} 
                {dialogState.tool?.name}
              </DialogTitle>
              <DialogDescription>{dialogState.tool?.description}</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              {!dialogState.result ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="prompt" className="text-sm font-medium">
                      Detalhe sua solicitação:
                    </label>
                    <Textarea
                      id="prompt"
                      value={dialogState.inputValue}
                      onChange={(e) => setDialogState(prev => ({ ...prev, inputValue: e.target.value }))}
                      placeholder="Descreva em detalhes o que você precisa..."
                      className="min-h-[120px]"
                      disabled={dialogState.isLoading}
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md overflow-auto max-h-[50vh]">
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-line">
                      {dialogState.result}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-shrink-0 pt-4 border-t mt-4">
              {!dialogState.result ? (
                <div className="flex w-full flex-col sm:flex-row justify-between gap-2">
                  <Button type="button" variant="outline" onClick={closeDialog} className="sm:w-auto w-full">
                    Cancelar
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={dialogState.isLoading || !dialogState.inputValue?.trim()} 
                    className="sm:w-auto w-full"
                  >
                    {dialogState.isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    {dialogState.isLoading ? "Gerando..." : "Gerar conteúdo"}
                  </Button>
                </div>
              ) : (
                <div className="flex w-full flex-col sm:flex-row justify-between gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={closeDialog}
                    className="w-full sm:w-auto"
                  >
                    Fechar
                  </Button>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogState(prev => ({ ...prev, result: null }))}
                      className="w-full sm:w-auto flex-1"
                    >
                      Nova consulta
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(dialogState.result || "");
                        toast({
                          title: "Copiado para a área de transferência",
                          description: "O conteúdo foi copiado com sucesso.",
                        });
                      }}
                      className="w-full sm:w-auto flex-1"
                    >
                      Copiar conteúdo
                    </Button>
                  </div>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EduAI;
