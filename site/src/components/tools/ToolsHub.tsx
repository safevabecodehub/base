import React, { type ReactElement } from 'react';
import Link from '@docusaurus/Link';

export function ToolsHub(): ReactElement {
  const sections = [
    {
      id: 'ide',
      title: 'IDE',
      description: 'Редакторы и IDE: Cursor, Windsurf, Zed и другие.',
      to: '/docs/tools/ide',
    },
    {
      id: 'cli',
      title: 'CLI-инструменты',
      description: 'Командная строка для работы с LLM и кодом.',
      to: '/docs/tools/cli',
    },
    {
      id: 'llm',
      title: 'LLM',
      description: 'Модели и клиенты: GPT, Claude, GLM, Qwen, Gemini и др.',
      to: '/docs/tools/llm',
    },
    {
      id: 'mcp',
      title: 'MCP',
      description: 'Провайдеры контекста и расширений: Context7, Claude Context, Sequential.',
      to: '/docs/tools/mcp',
    },
    {
      id: 'services',
      title: 'Сервисы',
      description: 'Внешние сервисы: AI Studio, Z AI, Perplexity и провайдеры.',
      to: '/docs/tools/services',
    },
  ];

  return (
    <section className="margin-vert--lg">
      <div className="container">
        <div className="row">
          {sections.map((section) => (
            <div key={section.id} className="col col--4 margin-bottom--lg">
              <Link className="card card--secondary" to={section.to}>
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
