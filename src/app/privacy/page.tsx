import type {Metadata} from 'next';
import Link from 'next/link';
import {LegalPage} from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Política de Privacidade · Toskio',
  description:
    'Saiba como a Toskio coleta, utiliza, protege e compartilha dados pessoais.',
};

const sections = [
  {
    id: 'visao-geral',
    title: '1. Visão geral',
    content: (
      <>
        <p>
          Esta Política de Privacidade explica como a Toskio trata dados
          pessoais quando você cria uma conta, administra um negócio, agenda um
          serviço ou entra em contato conosco.
        </p>
        <p>
          Aplicamos os princípios de necessidade, transparência, segurança e
          controle do titular. O tratamento pode variar conforme você seja um
          responsável pelo negócio, integrante da equipe ou cliente que faz um
          agendamento.
        </p>
      </>
    ),
  },
  {
    id: 'dados-coletados',
    title: '2. Dados que coletamos',
    content: (
      <>
        <p>Podemos tratar as seguintes categorias de dados:</p>
        <ul>
          <li>
            <strong>Conta:</strong> nome, e-mail, credenciais protegidas e
            preferências;
          </li>
          <li>
            <strong>Negócio:</strong> nome comercial, serviços, horários, equipe
            e informações públicas da página de agendamento;
          </li>
          <li>
            <strong>Agendamento:</strong> nome e contato do tutor, serviço,
            data, horário e informações necessárias sobre o pet;
          </li>
          <li>
            <strong>Uso e dispositivo:</strong> endereço IP, navegador,
            registros técnicos e interações com a plataforma;
          </li>
          <li>
            <strong>Suporte:</strong> mensagens e informações enviadas em um
            pedido de ajuda.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'uso-dos-dados',
    title: '3. Como usamos os dados',
    content: (
      <>
        <p>Utilizamos dados pessoais para:</p>
        <ul>
          <li>criar e proteger contas;</li>
          <li>disponibilizar páginas, agendas e ferramentas de gestão;</li>
          <li>registrar, confirmar e comunicar agendamentos;</li>
          <li>integrar calendários quando essa opção for ativada;</li>
          <li>prestar suporte e enviar avisos operacionais;</li>
          <li>prevenir fraude, abuso e incidentes de segurança;</li>
          <li>analisar e melhorar a experiência da Toskio;</li>
          <li>cumprir obrigações legais e exercer direitos.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'bases-legais',
    title: '4. Bases legais',
    content: (
      <>
        <p>
          Tratamos dados quando isso é necessário para executar o serviço
          solicitado, cumprir uma obrigação legal, atender a um interesse
          legítimo compatível com seus direitos ou quando você fornece
          consentimento. Quando o tratamento depender de consentimento, ele
          poderá ser retirado a qualquer momento.
        </p>
        <p>
          Nos agendamentos, o negócio escolhido também decide como utilizar os
          dados recebidos para prestar o atendimento e pode atuar como
          responsável independente por esse tratamento.
        </p>
      </>
    ),
  },
  {
    id: 'compartilhamento',
    title: '5. Compartilhamento de dados',
    content: (
      <>
        <p>Podemos compartilhar dados somente quando necessário com:</p>
        <ul>
          <li>o negócio com o qual você realiza um agendamento;</li>
          <li>
            fornecedores de infraestrutura, autenticação, e-mail, análise,
            pagamentos e suporte;
          </li>
          <li>integrações ativadas por você, como um serviço de calendário;</li>
          <li>
            autoridades públicas, quando houver obrigação legal ou pedido
            válido.
          </li>
        </ul>
        <p>
          Não vendemos dados pessoais. Exigimos que fornecedores tratem as
          informações de acordo com nossas instruções e medidas de proteção
          adequadas.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '6. Cookies e tecnologias semelhantes',
    content: (
      <>
        <p>
          Utilizamos tecnologias necessárias para manter sessões, lembrar
          preferências, proteger a plataforma e compreender seu desempenho.
          Quando exigido, pediremos sua escolha antes de ativar tecnologias não
          essenciais.
        </p>
      </>
    ),
  },
  {
    id: 'retencao',
    title: '7. Retenção e segurança',
    content: (
      <>
        <p>
          Mantemos dados pelo tempo necessário para prestar o serviço, cumprir
          obrigações legais, resolver disputas e proteger direitos. Depois
          disso, as informações são eliminadas ou anonimizadas com segurança.
        </p>
        <p>
          Adotamos controles técnicos e organizacionais para reduzir riscos de
          acesso indevido, perda, alteração ou divulgação. Nenhum sistema é
          totalmente infalível; por isso, também monitoramos e aprimoramos essas
          medidas continuamente.
        </p>
      </>
    ),
  },
  {
    id: 'transferencias',
    title: '8. Transferências internacionais',
    content: (
      <>
        <p>
          Alguns fornecedores podem processar dados fora do seu país. Nesses
          casos, utilizamos mecanismos reconhecidos pela legislação aplicável e
          exigimos proteções adequadas para as informações transferidas.
        </p>
      </>
    ),
  },
  {
    id: 'direitos',
    title: '9. Seus direitos',
    content: (
      <>
        <p>
          Conforme a legislação aplicável, você pode solicitar confirmação do
          tratamento, acesso, correção, portabilidade, anonimização, limitação
          ou eliminação de dados, além de se opor a determinados usos e retirar
          consentimentos.
        </p>
        <p>
          Para exercer um direito, envie uma mensagem para{' '}
          <a href="mailto:ola@toskio.com">ola@toskio.com</a>. Podemos pedir
          informações adicionais para confirmar sua identidade e proteger sua
          conta.
        </p>
      </>
    ),
  },
  {
    id: 'alteracoes-contato',
    title: '10. Alterações e contato',
    content: (
      <>
        <p>
          Podemos atualizar esta política para acompanhar mudanças legais ou na
          plataforma. A data no início da página indica a versão mais recente;
          alterações relevantes serão comunicadas de forma adequada.
        </p>
        <p>
          Dúvidas sobre privacidade podem ser enviadas para{' '}
          <a href="mailto:ola@toskio.com">ola@toskio.com</a>. O uso da
          plataforma também está sujeito aos nossos{' '}
          <Link href="/terms">Termos de Uso</Link>.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Seus dados merecem cuidado"
      title="Política de Privacidade"
      description="Aqui explicamos, em linguagem simples, quais dados usamos, por que precisamos deles e quais escolhas você pode fazer."
      updatedAt="12 de agosto de 2026"
      sections={sections}
    />
  );
}
