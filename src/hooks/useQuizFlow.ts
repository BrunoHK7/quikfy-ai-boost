
import { useState, useMemo } from 'react';

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

export const useQuizFlow = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
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
    handleAnswer,
    goToPreviousQuestion,
    questions: filteredQuestions
  };
};
