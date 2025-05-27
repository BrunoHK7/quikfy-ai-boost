import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  type: 'multiple' | 'open';
  options?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  placeholder?: string;
  conditional?: {
    dependsOn: string;
    value: string;
  };
}

interface BriefingData {
  objective: string;
  communication_style: string;
  swearing_permission: string;
  emotional_vector: string;
  tone_of_voice: string;
  main_emotion: string;
  content: {
    main_topic: string;
    results_or_story: string;
    contrast: string;
    step_by_step: string[];
    lead_magnet: string | null;
    lead_access_method: string | null;
    product: string | null;
    buy_method: string | null;
  };
  user_id: string;
  project_id: string;
  created_at: string;
}

const questions: Question[] = [
  {
    id: 'objetivo',
    question: 'Qual é o objetivo do carrossel?',
    type: 'multiple',
    options: [
      {
        id: 'seguidores',
        title: 'Atrair seguidores',
        description: 'Aumentar o número de seguidores e engagement'
      },
      {
        id: 'leads',
        title: 'Coletar leads',
        description: 'Capturar contatos interessados'
      },
      {
        id: 'vendas',
        title: 'Gerar vendas',
        description: 'Converter diretamente em vendas'
      }
    ]
  },
  {
    id: 'assunto',
    question: 'Qual é o assunto principal do carrossel?',
    type: 'open',
    placeholder: 'Ex: Como triplicar vendas online, segredos de marketing digital, transformação pessoal...'
  },
  {
    id: 'estiloComunicacao',
    question: 'Qual estilo de comunicação você prefere?',
    type: 'multiple',
    options: [
      {
        id: 'euVoce',
        title: 'Eu falando com você',
        description: 'Comunicação direta e pessoal'
      },
      {
        id: 'euVoces',
        title: 'Eu falando com vocês',
        description: 'Comunicação para grupo'
      },
      {
        id: 'nosVoce',
        title: 'Nós falando com você',
        description: 'Comunicação empresarial pessoal'
      },
      {
        id: 'voceVoce',
        title: 'Você falando com você mesmo',
        description: 'Autorreflexão e coaching'
      },
      {
        id: 'narradorNeutro',
        title: 'Narrador neutro',
        description: 'Comunicação imparcial'
      },
      {
        id: 'terceiraPessoa',
        title: 'Terceira pessoa',
        description: 'Ele/ela fez isso...'
      }
    ]
  },
  {
    id: 'palavroes',
    question: 'Você permite o uso de palavrões no carrossel?',
    type: 'multiple',
    options: [
      {
        id: 'nao',
        title: '❌ Não usar palavrões',
        description: 'Linguagem completamente limpa'
      },
      {
        id: 'censurado',
        title: '🤐 Com censura',
        description: 'Ex: "prr4", "fda" - censurado'
      },
      {
        id: 'explicito',
        title: '🔥 Uso explícito permitido',
        description: 'Linguagem sem restrições'
      }
    ]
  },
  {
    id: 'vetorEmocional',
    question: 'Qual vetor emocional principal do carrossel?',
    type: 'multiple',
    options: [
      {
        id: 'medo',
        title: 'Medo',
        description: 'Medo de perder oportunidades'
      },
      {
        id: 'ganancia',
        title: 'Ganância',
        description: 'Desejo de ganhos e resultados'
      }
    ]
  },
  {
    id: 'tomFala',
    question: 'Qual tom de fala você prefere?',
    type: 'multiple',
    options: [
      {
        id: 'acusador',
        title: 'Acusador',
        description: 'Tom direto e confrontativo'
      },
      {
        id: 'humilhativo',
        title: 'Humilhativo',
        description: 'Tom que diminui o leitor'
      },
      {
        id: 'enaltecedor',
        title: 'Enaltecedor',
        description: 'Tom que eleva o leitor'
      },
      {
        id: 'motivacionalAgressivo',
        title: 'Motivacional agressivo',
        description: 'Motivação com força'
      },
      {
        id: 'professoral',
        title: 'Professoral',
        description: 'Tom educativo e didático'
      },
      {
        id: 'camarada',
        title: 'Camarada',
        description: 'Tom amigável e próximo'
      },
      {
        id: 'narradorImparcial',
        title: 'Narrador imparcial',
        description: 'Tom neutro e objetivo'
      },
      {
        id: 'consultivo',
        title: 'Consultivo profissional',
        description: 'Tom especialista e confiável'
      }
    ]
  },
  {
    id: 'emocao',
    question: 'Qual emoção você quer que a pessoa sinta ao consumir esse carrossel?',
    type: 'multiple',
    options: [
      {
        id: 'vergonha',
        title: 'Vergonha',
        description: 'Por não ter agido antes'
      },
      {
        id: 'orgulho',
        title: 'Orgulho',
        description: 'Por ter conhecimento exclusivo'
      },
      {
        id: 'desejo',
        title: 'Desejo',
        description: 'Vontade intensa de ter'
      },
      {
        id: 'raiva',
        title: 'Raiva',
        description: 'Indignação com a situação atual'
      },
      {
        id: 'ambicao',
        title: 'Ambição',
        description: 'Vontade de crescer e conquistar'
      },
      {
        id: 'urgencia',
        title: 'Urgência / Medo de perder',
        description: 'Necessidade de agir rapidamente'
      },
      {
        id: 'curiosidade',
        title: 'Curiosidade',
        description: 'Vontade de saber mais'
      },
      {
        id: 'confianca',
        title: 'Confiança / Segurança',
        description: 'Sensação de certeza'
      }
    ]
  },
  {
    id: 'resultados',
    question: 'Quais resultados, histórias ou aprendizados você quer compartilhar?',
    type: 'open',
    placeholder: 'Descreva aqui sua história, resultados ou transformação que servirá de base para o carrossel...'
  },
  {
    id: 'contraste',
    question: 'Qual contraste (antes e depois) você deseja mostrar?',
    type: 'open',
    placeholder: 'Ex: Antes: Vendedor fracassado / Depois: R$ 50k por mês. Antes: Tímido e inseguro / Depois: Palestrante reconhecido...'
  },
  {
    id: 'passoAPasso',
    question: 'Qual é o passo a passo que você quer apresentar?',
    type: 'open',
    placeholder: 'Liste aqui o passo a passo, pode ser por linhas ou separado por vírgulas...'
  },
  {
    id: 'iscaDigital',
    question: 'Qual é sua isca digital?',
    type: 'open',
    placeholder: 'Ex: E-book gratuito, checklist, planilha, curso grátis, consultoria...',
    conditional: {
      dependsOn: 'objetivo',
      value: 'leads'
    }
  },
  {
    id: 'acessoIsca',
    question: 'Como a pessoa acessa a isca?',
    type: 'open',
    placeholder: 'Ex: Link na bio, comentando QUERO, mandando DM, WhatsApp...',
    conditional: {
      dependsOn: 'objetivo',
      value: 'leads'
    }
  },
  {
    id: 'produto',
    question: 'O que exatamente você está vendendo?',
    type: 'open',
    placeholder: 'Descreva seu produto/serviço, principais benefícios e valor...',
    conditional: {
      dependsOn: 'objetivo',
      value: 'vendas'
    }
  },
  {
    id: 'comoComprar',
    question: 'Como a pessoa pode comprar?',
    type: 'open',
    placeholder: 'Ex: Link na bio, comentando QUERO, mandando DM, WhatsApp, site...',
    conditional: {
      dependsOn: 'objetivo',
      value: 'vendas'
    }
  }
];

const mapAnswerToLabel = (questionId: string, answerId: string): string => {
  const question = questions.find(q => q.id === questionId);
  if (!question || !question.options) return answerId;
  
  const option = question.options.find(opt => opt.id === answerId);
  return option ? option.title : answerId;
};

// Function to clean text for JSON compatibility
const cleanTextForJson = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/"/g, '') // Remove quotes
    .replace(/'/g, '') // Remove single quotes
    .replace(/`/g, '') // Remove backticks
    .replace(/\{/g, '') // Remove opening braces
    .replace(/\}/g, '') // Remove closing braces
    .replace(/\[/g, '') // Remove opening brackets
    .replace(/\]/g, '') // Remove closing brackets
    .replace(/,/g, ' ') // Replace commas with spaces
    .replace(/\\/g, '') // Remove backslashes
    .replace(/\n/g, ' ') // Replace line breaks with spaces
    .replace(/\r/g, ' ') // Replace carriage returns with spaces
    .replace(/\t/g, ' ') // Replace tabs with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing spaces
};

const formatBriefingText = (data: BriefingData): string => {
  const stepList = data.content.step_by_step
    .map((step, index) => `${index + 1}. ${cleanTextForJson(step)}`)
    .join('|');
  
  let briefingText = `Objetivo: ${cleanTextForJson(data.objective)}|Estilo de comunicação: ${cleanTextForJson(data.communication_style)}|Vetor emocional: ${cleanTextForJson(data.emotional_vector)}|Emoção principal: ${cleanTextForJson(data.main_emotion)}|Tópico: ${cleanTextForJson(data.content.main_topic)}|História ou resultado: ${cleanTextForJson(data.content.results_or_story)}|Contraste: ${cleanTextForJson(data.content.contrast)}|Passos: ${stepList}`;

  // Add conditional fields if they exist
  if (data.content.lead_magnet) {
    briefingText += `|Lead magnet: ${cleanTextForJson(data.content.lead_magnet)}`;
  }
  
  if (data.content.lead_access_method) {
    briefingText += `|Método de acesso: ${cleanTextForJson(data.content.lead_access_method)}`;
  }
  
  if (data.content.product) {
    briefingText += `|Produto: ${cleanTextForJson(data.content.product)}`;
  }
  
  if (data.content.buy_method) {
    briefingText += `|Método de compra: ${cleanTextForJson(data.content.buy_method)}`;
  }

  return briefingText;
};

export const useQuizFlow = () => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter questions based on conditional logic
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      if (!question.conditional) return true;
      
      const { dependsOn, value } = question.conditional;
      return answers[dependsOn] === value;
    });
  }, [answers]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const isCompleted = currentQuestionIndex >= filteredQuestions.length;

  const formatBriefingData = (): BriefingData => {
    const stepByStepText = answers.passoAPasso || '';
    const stepByStepArray = stepByStepText
      .split(/\n|,/)
      .map(step => step.trim())
      .filter(step => step.length > 0);

    return {
      objective: mapAnswerToLabel('objetivo', answers.objetivo),
      communication_style: mapAnswerToLabel('estiloComunicacao', answers.estiloComunicacao),
      swearing_permission: mapAnswerToLabel('palavroes', answers.palavroes),
      emotional_vector: mapAnswerToLabel('vetorEmocional', answers.vetorEmocional),
      tone_of_voice: mapAnswerToLabel('tomFala', answers.tomFala),
      main_emotion: mapAnswerToLabel('emocao', answers.emocao),
      content: {
        main_topic: answers.assunto || '',
        results_or_story: answers.resultados || '',
        contrast: answers.contraste || '',
        step_by_step: stepByStepArray,
        lead_magnet: answers.iscaDigital || null,
        lead_access_method: answers.acessoIsca || null,
        product: answers.produto || null,
        buy_method: answers.comoComprar || null,
      },
      user_id: user?.id || '',
      project_id: `project_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
  };

  const sendToWebhook = async (data: BriefingData) => {
    try {
      console.log('Enviando dados para o webhook:', data);
      
      const briefingText = formatBriefingText(data);
      
      const response = await fetch('https://hook.us2.make.com/tgxerfwg3b1w4wprg47gfg4hhtb1a1xc', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        mode: 'no-cors',
        body: briefingText,
      });

      console.log('Dados enviados com sucesso para o webhook');
      
      toast({
        title: "Briefing Enviado!",
        description: "Seu briefing foi enviado com sucesso para processamento.",
      });
    } catch (error) {
      console.error('Erro ao enviar para o webhook:', error);
      
      toast({
        title: "Erro no Envio",
        description: "Houve um erro ao enviar o briefing. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleAnswer = async (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    // Check if this is the last question
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= filteredQuestions.length) {
      // Quiz completed, send to webhook
      setIsSubmitting(true);
      const briefingData = formatBriefingData();
      briefingData.content = {
        ...briefingData.content,
        [questionId === 'passoAPasso' ? 'step_by_step' : 
         questionId === 'assunto' ? 'main_topic' :
         questionId === 'resultados' ? 'results_or_story' :
         questionId === 'contraste' ? 'contrast' :
         questionId === 'iscaDigital' ? 'lead_magnet' :
         questionId === 'acessoIsca' ? 'lead_access_method' :
         questionId === 'produto' ? 'product' :
         questionId === 'comoComprar' ? 'buy_method' : questionId
        ]: questionId === 'passoAPasso' 
          ? answer.split(/\n|,/).map(step => step.trim()).filter(step => step.length > 0)
          : answer
      };
      
      await sendToWebhook(briefingData);
      setIsSubmitting(false);
    }
    
    // Auto-advance for multiple choice questions
    if (currentQuestion?.type === 'multiple') {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    } else {
      // For open questions, advance immediately
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: filteredQuestions.length,
    answers,
    isCompleted,
    isSubmitting,
    handleAnswer,
    goToPreviousQuestion,
    questions: filteredQuestions,
    briefingData: isCompleted ? formatBriefingData() : null
  };
};
