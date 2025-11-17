import React, {useMemo, useState, type ReactElement} from 'react';
import Link from '@docusaurus/Link';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';

type ToolCategory = 'ide' | 'cli' | 'llm' | 'mcp' | 'service';

interface ToolEntry {
  id: string;
  title: string;
  description: string;
  path: string;
  category: ToolCategory;
  tags: string[];
  status: 'draft' | 'stable' | 'needs-review';
}

const CATEGORY_LABEL: Record<ToolCategory, string> = {
  ide: 'IDE',
  cli: 'CLI',
  llm: 'LLM',
  mcp: 'MCP',
  service: 'Сервисы',
};

interface ToolsListProps {
  initialCategory?: ToolCategory | 'all';
}

export function ToolsList({initialCategory = 'ide'}: ToolsListProps): ReactElement {
  const [category, setCategory] = useState<ToolCategory | 'all'>(initialCategory);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'title-asc' | 'title-desc'>('title-asc');

  const allDocsData = useAllDocsData();
  const defaultPluginData = allDocsData.default;
  const currentVersion = defaultPluginData.versions[0];
  const allDocs = Object.values(currentVersion.docs);

  const entries: ToolEntry[] = useMemo(() => {
    return allDocs
      .filter((doc) => doc.id.startsWith('tools/'))
      .map((doc) => {
        const d = doc as any;
        const parts = d.id.split('/');
        // tools/<category>/...
        const categoryPart = (parts[1] ?? 'ide') as ToolCategory;
        const frontMatter = d.frontMatter ?? {};
        const status = (frontMatter.status as ToolEntry['status']) ?? 'draft';
        const tags: string[] = Array.isArray(frontMatter.tags)
          ? frontMatter.tags.map((t: unknown) => (typeof t === 'string' ? t : '')).filter(Boolean)
          : [];

        return {
          id: d.id as string,
          title: (d.title as string) ?? '',
          description: (d.description as string) ?? '',
          path: (d.path as string) ?? '#',
          category: categoryPart,
          tags,
          status,
        };
      });
  }, [allDocsData]);

  const filtered = useMemo(() => {
    let items = entries;

    if (category !== 'all') {
      items = items.filter((item) => item.category === category);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    items = [...items].sort((a, b) => {
      if (sort === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return b.title.localeCompare(a.title);
    });

    return items;
  }, [category, query, sort]);

  return (
    <section className="margin-vert--lg">
      <div className="container">
        <div className="row margin-bottom--sm">
          <div className="col col--4">
            <label className="margin-right--sm">
              Категория
              <select
                className="margin-left--sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as ToolCategory | 'all')}>
                <option value="all">Все</option>
                <option value="ide">IDE</option>
                <option value="cli">CLI</option>
                <option value="llm">LLM</option>
                <option value="mcp">MCP</option>
                <option value="service">Сервисы</option>
              </select>
            </label>
          </div>
          <div className="col col--4">
            <label className="margin-right--sm">
              Поиск
              <input
                className="margin-left--sm"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Название, тег, описание"
              />
            </label>
          </div>
          <div className="col col--4">
            <label className="margin-right--sm">
              Сортировка
              <select
                className="margin-left--sm"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}>
                <option value="title-asc">По названию (А→Я)</option>
                <option value="title-desc">По названию (Я→А)</option>
              </select>
            </label>
          </div>
        </div>

        <div className="row">
          {filtered.map((item) => (
            <div key={item.id} className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>{item.title}</h3>
                </div>
                <div className="card__body">
                  <p>{item.description}</p>
                  <p>
                    <strong>Категория:</strong> {CATEGORY_LABEL[item.category]}
                  </p>
                  <p>
                    <strong>Теги:</strong> {item.tags.join(', ')}
                  </p>
                  <p>
                    <strong>Статус:</strong> {item.status}
                  </p>
                </div>
                <div className="card__footer">
                  <Link className="button button--secondary button--block" to={item.path}>
                    Открыть заметку
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col col--12">
              <p>Ничего не найдено по текущим фильтрам.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
