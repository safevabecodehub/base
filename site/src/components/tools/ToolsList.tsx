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
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [tagFilter, setTagFilter] = useState<string>('all');

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
        const frontMatter = d.frontMatter ?? {};
        const status = (frontMatter.status as ToolEntry['status']) ?? 'draft';

        const docType = typeof frontMatter.type === 'string' ? (frontMatter.type as string) : undefined;
        if (docType === 'reference') {
          // Хабовые/категорийные страницы не показываем в плитке
          return null;
        }

        const rawFrontmatterTags = frontMatter.tags;
        const rawMetadataTags = (d.tags ?? []) as unknown[];

        const tagsFromFrontmatter: string[] = Array.isArray(rawFrontmatterTags)
          ? rawFrontmatterTags
              .map((t: unknown) => {
                if (typeof t === 'string') return t;
                if (t && typeof t === 'object' && 'label' in t && typeof (t as any).label === 'string') {
                  return (t as any).label as string;
                }
                return '';
              })
              .filter(Boolean)
          : [];

        const tagsFromMetadata: string[] = Array.isArray(rawMetadataTags)
          ? rawMetadataTags
              .map((t: unknown) => {
                if (typeof t === 'string') return t;
                if (t && typeof t === 'object' && 'label' in t && typeof (t as any).label === 'string') {
                  return (t as any).label as string;
                }
                return '';
              })
              .filter(Boolean)
          : [];

        const id = d.id as string;
        const slugPart = parts[2] ?? parts[1] ?? id;

        const allowedCategories: ToolCategory[] = ['ide', 'cli', 'llm', 'mcp', 'service'];
        const categoryFromFrontmatter = frontMatter.category as ToolCategory | undefined;
        const categoryFromTags = allowedCategories.find((cat) =>
          [...tagsFromFrontmatter, ...tagsFromMetadata].includes(cat),
        );
        const categoryPart =
          categoryFromFrontmatter && allowedCategories.includes(categoryFromFrontmatter)
            ? categoryFromFrontmatter
            : (categoryFromTags ?? 'ide');

        const derivedTags = ['tools', categoryPart, slugPart];
        const tags = [...new Set([...tagsFromFrontmatter, ...tagsFromMetadata, ...derivedTags])];

        const titleFromFrontmatter = typeof frontMatter.title === 'string' ? frontMatter.title : undefined;
        const titleFromMetadata = typeof d.title === 'string' ? (d.title as string) : undefined;
        const humanizedFromSlug = slugPart
          .split(/[\/]/)
          .pop()
          ?.replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, (ch: string) => ch.toUpperCase());

        return {
          id,
          title: titleFromFrontmatter ?? titleFromMetadata ?? humanizedFromSlug ?? id,
          description: (d.description as string) ?? '',
          path: (d.path as string) ?? '#',
          category: categoryPart,
          tags,
          status,
        };
      })
      .filter((entry): entry is ToolEntry => entry !== null);
  }, [allDocsData]);

  const availableCategories = useMemo(() => {
    const set = new Set<ToolCategory>();
    entries.forEach((e) => {
      if (CATEGORY_LABEL[e.category]) {
        set.add(e.category);
      }
    });
    return Array.from(set).sort((a, b) => CATEGORY_LABEL[a].localeCompare(CATEGORY_LABEL[b]));
  }, [entries]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const filtered = useMemo(() => {
    let items = entries;

    if (category !== 'all') {
      items = items.filter((item) => item.category === category);
    }

    if (tagFilter !== 'all') {
      items = items.filter((item) => item.tags.includes(tagFilter));
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
  }, [category, query, sort, tagFilter, entries]);

  return (
    <section className="margin-vert--lg">
      <div className="container">
        <div className="card padding--sm margin-bottom--md tools-toolbar">
          <div className="row tools-toolbar__row">
            <div className="col col--3">
              <label className="margin-bottom--xs display-block">
                <span className="text--bold">Категория</span>
                <select
                  className="margin-top--xs"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ToolCategory | 'all')}>
                  <option value="all">Все</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABEL[cat]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="col col--3">
              <label className="margin-bottom--xs display-block">
                <span className="text--bold">Тег</span>
                <select
                  className="margin-top--xs"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}>
                  <option value="all">Все</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="col col--3">
              <label className="margin-bottom--xs display-block">
                <span className="text--bold">Поиск</span>
                <input
                  className="margin-top--xs"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Название, тег, описание"
                />
              </label>
            </div>
            <div className="col col--3">
              <label className="margin-bottom--xs display-block">
                <span className="text--bold">Сортировка</span>
                <select
                  className="margin-top--xs"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}>
                  <option value="title-asc">По названию (А→Я)</option>
                  <option value="title-desc">По названию (Я→А)</option>
                </select>
              </label>
              <div className="tools-toolbar__view">
                <button
                  type="button"
                  className={`button button--sm ${view === 'grid' ? 'button--primary' : ''}`}
                  onClick={() => setView('grid')}>
                  Плитка
                </button>
                <button
                  type="button"
                  className={`button button--sm ${view === 'table' ? 'button--primary' : ''}`}
                  onClick={() => setView('table')}>
                  Таблица
                </button>
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="row">
            <div className="col col--12">
              <p>Ничего не найдено по текущим фильтрам.</p>
            </div>
          </div>
        )}

        {filtered.length > 0 && view === 'grid' && (
          <div className="row">
            {filtered.map((item) => (
              <div key={item.id} className="col col--4 margin-bottom--lg">
                <Link className="card tools-card" to={item.path}>
                  <div className="card__header">
                    <h3>{item.title}</h3>
                  </div>
                  <div className="card__body tools-card__body">
                    <p className="tools-card__description">{item.description}</p>
                    <div className="tools-card__meta">
                      <span className="tools-badge tools-badge--category">
                        {CATEGORY_LABEL[item.category]}
                      </span>
                      {item.tags.map((tag) => (
                        <span key={tag} className="tools-badge tools-badge--tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && view === 'table' && (
          <div className="row">
            <div className="col col--12">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Категория</th>
                      <th>Теги</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <Link to={item.path}>{item.title}</Link>
                        </td>
                        <td>{CATEGORY_LABEL[item.category]}</td>
                        <td>{item.tags.join(', ')}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
