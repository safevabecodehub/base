import React, { type ReactElement } from 'react';
import Link from '@docusaurus/Link';

export function GlobalHub(): ReactElement {
  const sections = [
    {
      id: 'concepts',
      title: 'Концепции',
      description: 'Философия вайб-кодинга, базовые принципы и идеи.',
      to: '/docs/concepts',
    },
    {
      id: 'tools',
      title: 'Инструменты',
      description: 'Хаб инструментов: IDE, AI-агенты, CLI и сервисы.',
      to: '/docs/tools',
    },
    {
      id: 'workflows',
      title: 'Воркфлоу',
      description: 'Сценарии работы, пайплайны и лучшие практики.',
      to: '/docs/workflows',
    },
    {
      id: 'apps',
      title: 'Мини-аппы',
      description: 'Интерактивные приложения для вайб-кодеров.',
      to: '/docs/apps',
    },
    {
      id: 'community',
      title: 'Сообщество',
      description: 'Правила, форматы общения и полезные ссылки.',
      to: '/docs/community',
    },
    {
      id: 'meta',
      title: 'Meta',
      description: 'Архитектура базы знаний, правила и гайды по контрибьюшну.',
      to: '/docs/meta',
    },
  ];

  return (
    <section className="margin-vert--lg">
      <div className="container">
        <div className="row">
          {sections.map((section) => (
            <div key={section.id} className="col col--4 margin-bottom--lg">
              <Link className="card tools-section-card" to={section.to}>
                <div className="card__header">
                  <h3>{section.title}</h3>
                </div>
                <div className="card__body">
                  <p>{section.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
