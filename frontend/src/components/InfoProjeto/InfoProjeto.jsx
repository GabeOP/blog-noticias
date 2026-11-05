import React from 'react';
import { Info, ShieldCheck, Mail, BookOpen } from 'lucide-react';
import './InfoProjeto.css';

export function InfoProjeto() {
  return (
    <aside className="auth-info-card" aria-label="Informações sobre o projeto e privacidade">
      <div className="auth-info-header">
        <div className="auth-info-title">
          <Info size={18} className="auth-info-title-icon" />
          <h3>Sobre o Projeto & Privacidade</h3>
        </div>
      </div>

      <div className="auth-info-content">
        <div className="auth-info-item">
          <BookOpen size={17} className="auth-info-icon" />
          <div className="auth-info-text">
            <strong>Objetivo do Blog</strong>
            <p>
              Este é um projeto pessoal utilizado como portfólio. As postagens são voltadas para
              estudos práticos, documentando o que aprendi e estou aprendendo em desenvolvimento de software.
            </p>
          </div>
        </div>

        <div className="auth-info-item">
          <ShieldCheck size={17} className="auth-info-icon" />
          <div className="auth-info-text">
            <strong>Senhas Criptografadas</strong>
            <p>
              Sua senha é armazenada com criptografia de ponta (hash seguro) no banco de dados. Ninguém tem acesso à sua senha original.
            </p>
          </div>
        </div>

        <div className="auth-info-item">
          <Mail size={17} className="auth-info-icon" />
          <div className="auth-info-text">
            <strong>Sem Propagandas</strong>
            <p>
              Seu e-mail <strong>não</strong> será usado para spam ou publicidade. Ele é utilizado
              exclusivamente para o disparo do e-mail inicial, implementado para explorar e validar o fluxo de mensageria assíncrona do sistema.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

