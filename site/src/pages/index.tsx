import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}></div>
      </div>
    </header>
  );
}

function HomepageCards() {
  return (
    <section className="margin-vert--lg">
      <div className="container">
        <div className="row">
          <div className="col col--4">
            <div className="card">
              <div className="card__header">
                <h3>База знаний</h3>
              </div>
              <div className="card__body">
                <p>
                  Вход в основную базу знаний вайб-кодеров: гайды, обзоры,
                  плейбуки и паттерны.
                </p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to="/docs/intro">
                  Открыть базу знаний
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card">
              <div className="card__header">
                <h3>Блог</h3>
              </div>
              <div className="card__body">
                <p>
                  Истории, обновления и заметки о развитии SafeVibe и
                  экспериментальные форматы.
                </p>
              </div>
              <div className="card__footer">
                <Link className="button button--secondary button--block" to="/blog">
                  Перейти в блог
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card">
              <div className="card__header">
                <h3>Мини-аппы</h3>
              </div>
              <div className="card__body">
                <p>
                  Интерактивные инструменты и утилиты поверх базы знаний:
                  TagExplorer, планировщики и другие.
                </p>
              </div>
              <div className="card__footer">
                <Link className="button button--outline button--block" to="/docs/apps/intro">
                  Открыть раздел мини-апп
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="SafeVibe — база знаний и мини-аппы для вайб-кодеров">
      <HomepageHeader />
      <main>
        <HomepageCards />
      </main>
    </Layout>
  );
}
