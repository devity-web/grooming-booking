import type {Metadata} from 'next';
import Link from 'next/link';
import {LegalPage} from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Termos de Uso · Toskio',
  description:
    'Conheça os termos que orientam o uso da plataforma Toskio por negócios e clientes.',
};

const sections = [
  {
    id: 'aceitacao',
    title: '1. Aceitação dos termos',
    content: (
      <>
        <p>
          Estes Termos de Uso regulam o acesso e a utilização da Toskio. Ao
          criar uma conta, administrar uma página de agendamentos ou realizar um
          agendamento, você confirma que leu e concorda com estas condições.
        </p>
        <p>
          Se você utiliza a Toskio em nome de uma empresa ou de outro negócio,
          declara ter autorização para aceitar estes termos em nome dessa
          organização.
        </p>
      </>
    ),
  },
  {
    id: 'plataforma',
    title: '2. O que a Toskio oferece',
    content: (
      <>
        <p>
          A Toskio oferece ferramentas para organizar serviços, horários,
          clientes e agendamentos de negócios de cuidados para pets. A
          plataforma aproxima o negócio responsável pelo atendimento e o cliente
          que solicita o serviço.
        </p>
        <p>
          Cada negócio é responsável pelos serviços que anuncia e presta,
          incluindo preços, disponibilidade, qualidade, segurança, políticas de
          cancelamento e comunicação com seus clientes.
        </p>
      </>
    ),
  },
  {
    id: 'conta',
    title: '3. Conta e responsabilidades',
    content: (
      <>
        <p>Ao utilizar a plataforma, você se compromete a:</p>
        <ul>
          <li>fornecer informações corretas e mantê-las atualizadas;</li>
          <li>
            proteger suas credenciais e não compartilhar o acesso à conta;
          </li>
          <li>usar a Toskio de forma lícita e respeitosa;</li>
          <li>
            informar imediatamente qualquer uso não autorizado ou problema de
            segurança.
          </li>
        </ul>
        <p>
          Você é responsável pelas atividades realizadas em sua conta e pelos
          dados que cadastra ou recebe por meio dela.
        </p>
      </>
    ),
  },
  {
    id: 'agendamentos',
    title: '4. Agendamentos e cancelamentos',
    content: (
      <>
        <p>
          A confirmação exibida pela Toskio registra o agendamento entre o
          cliente e o negócio escolhido. Alterações, atrasos, cancelamentos,
          reembolsos e eventuais cobranças seguem as condições informadas pelo
          próprio negócio.
        </p>
        <p>
          A Toskio pode enviar comunicações operacionais sobre o agendamento,
          mas não garante que um serviço será realizado quando houver fatos fora
          do controle da plataforma.
        </p>
      </>
    ),
  },
  {
    id: 'planos',
    title: '5. Planos, pagamentos e cancelamento',
    content: (
      <>
        <p>
          Recursos pagos, valores, periodicidade e período de teste são
          apresentados antes da contratação. Salvo indicação diferente, as
          assinaturas são renovadas automaticamente até o cancelamento.
        </p>
        <p>
          Você pode cancelar a renovação a qualquer momento. O acesso aos
          recursos pagos permanece disponível até o fim do período já
          contratado, exceto quando a lei aplicável determinar outra solução.
        </p>
      </>
    ),
  },
  {
    id: 'uso-aceitavel',
    title: '6. Uso aceitável',
    content: (
      <>
        <p>Não é permitido utilizar a Toskio para:</p>
        <ul>
          <li>
            violar leis, direitos de terceiros ou normas de bem-estar animal;
          </li>
          <li>publicar conteúdo enganoso, ofensivo ou fraudulento;</li>
          <li>tentar acessar contas, sistemas ou dados sem autorização;</li>
          <li>
            interferir no funcionamento da plataforma ou distribuir código
            malicioso;
          </li>
          <li>
            copiar, revender ou explorar a plataforma sem autorização prévia.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'propriedade',
    title: '7. Conteúdo e propriedade intelectual',
    content: (
      <>
        <p>
          A Toskio, sua marca, interface, código e materiais são protegidos por
          direitos de propriedade intelectual. Estes termos concedem apenas o
          direito limitado de usar a plataforma durante a vigência da sua conta.
        </p>
        <p>
          Você mantém os direitos sobre o conteúdo que insere na plataforma e
          nos autoriza a processá-lo somente para operar, proteger e melhorar o
          serviço, de acordo com a nossa{' '}
          <Link href="/privacy">Política de Privacidade</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'disponibilidade',
    title: '8. Disponibilidade e encerramento',
    content: (
      <>
        <p>
          Trabalhamos para manter a Toskio disponível e segura, mas podem
          ocorrer interrupções para manutenção, correções ou eventos fora do
          nosso controle. Recursos também podem ser ajustados para acompanhar a
          evolução do produto.
        </p>
        <p>
          Podemos restringir ou encerrar contas que violem estes termos,
          comprometam a segurança da plataforma ou causem prejuízo a outras
          pessoas. Sempre que possível, comunicaremos a medida com antecedência.
        </p>
      </>
    ),
  },
  {
    id: 'responsabilidade',
    title: '9. Limitação de responsabilidade',
    content: (
      <>
        <p>
          Na extensão permitida pela lei, a Toskio não responde por perdas
          indiretas, interrupções causadas por terceiros ou pela relação entre o
          cliente e o negócio que presta o serviço. Nada nestes termos exclui
          direitos ou responsabilidades que não possam ser legalmente limitados.
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
          Podemos atualizar estes termos para refletir mudanças na plataforma ou
          na legislação. Quando a alteração for relevante, faremos uma
          comunicação adequada antes de sua entrada em vigor.
        </p>
        <p>
          Em caso de dúvida, escreva para{' '}
          <a href="mailto:ola@toskio.com">ola@toskio.com</a>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Transparência para uma rotina tranquila"
      title="Termos de Uso"
      description="Estas são as regras que ajudam a manter a Toskio segura, simples e justa para negócios, tutores e pets."
      updatedAt="12 de agosto de 2026"
      sections={sections}
    />
  );
}
