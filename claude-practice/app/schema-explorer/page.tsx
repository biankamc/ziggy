'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeKind = 'parent' | 'child';
type EdgeKind = 'IS_PARENT_OF' | 'RELATED_TO';

interface SchemaNode {
  id: string;
  label: string;
  kind: NodeKind;
  parentId?: string;
}

interface SchemaEdge {
  from: string;
  to: string;
  kind: EdgeKind;
}

interface Position {
  x: number;
  y: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const NODES: SchemaNode[] = [
  { id: 'artist', label: 'Artist', kind: 'parent' },
  { id: 'album', label: 'Album', kind: 'parent' },
  { id: 'playlist', label: 'Playlist', kind: 'parent' },
  { id: 'user', label: 'User', kind: 'parent' },
  { id: 'podcast', label: 'Podcast', kind: 'parent' },
  { id: 'artist-genre', label: 'RefGenre', kind: 'child', parentId: 'artist' },
  { id: 'artist-status', label: 'ArtistStatus', kind: 'child', parentId: 'artist' },
  { id: 'artist-country', label: 'RefCountry', kind: 'child', parentId: 'artist' },
  { id: 'artist-label', label: 'RefLabel', kind: 'child', parentId: 'artist' },
  { id: 'artist-verified', label: 'VerificationStatus', kind: 'child', parentId: 'artist' },
  { id: 'album-type', label: 'RefAlbumType', kind: 'child', parentId: 'album' },
  { id: 'album-status', label: 'AlbumStatus', kind: 'child', parentId: 'album' },
  { id: 'album-rating', label: 'RefExplicitRating', kind: 'child', parentId: 'album' },
  { id: 'album-language', label: 'RefLanguage', kind: 'child', parentId: 'album' },
  { id: 'playlist-status', label: 'PlaylistStatus', kind: 'child', parentId: 'playlist' },
  { id: 'playlist-category', label: 'RefPlaylistCategory', kind: 'child', parentId: 'playlist' },
  { id: 'playlist-visibility', label: 'RefVisibility', kind: 'child', parentId: 'playlist' },
  { id: 'user-tier', label: 'RefSubscriptionTier', kind: 'child', parentId: 'user' },
  { id: 'user-status', label: 'UserStatus', kind: 'child', parentId: 'user' },
  { id: 'user-region', label: 'RefRegion', kind: 'child', parentId: 'user' },
  { id: 'podcast-status', label: 'PodcastStatus', kind: 'child', parentId: 'podcast' },
  { id: 'podcast-category', label: 'RefPodcastCategory', kind: 'child', parentId: 'podcast' },
  { id: 'podcast-episode-type', label: 'RefEpisodeType', kind: 'child', parentId: 'podcast' },
];

const EDGES: SchemaEdge[] = [
  { from: 'artist', to: 'artist-genre', kind: 'IS_PARENT_OF' },
  { from: 'artist', to: 'artist-status', kind: 'IS_PARENT_OF' },
  { from: 'artist', to: 'artist-country', kind: 'IS_PARENT_OF' },
  { from: 'artist', to: 'artist-label', kind: 'IS_PARENT_OF' },
  { from: 'artist', to: 'artist-verified', kind: 'IS_PARENT_OF' },
  { from: 'album', to: 'album-type', kind: 'IS_PARENT_OF' },
  { from: 'album', to: 'album-status', kind: 'IS_PARENT_OF' },
  { from: 'album', to: 'album-rating', kind: 'IS_PARENT_OF' },
  { from: 'album', to: 'album-language', kind: 'IS_PARENT_OF' },
  { from: 'playlist', to: 'playlist-status', kind: 'IS_PARENT_OF' },
  { from: 'playlist', to: 'playlist-category', kind: 'IS_PARENT_OF' },
  { from: 'playlist', to: 'playlist-visibility', kind: 'IS_PARENT_OF' },
  { from: 'user', to: 'user-tier', kind: 'IS_PARENT_OF' },
  { from: 'user', to: 'user-status', kind: 'IS_PARENT_OF' },
  { from: 'user', to: 'user-region', kind: 'IS_PARENT_OF' },
  { from: 'podcast', to: 'podcast-status', kind: 'IS_PARENT_OF' },
  { from: 'podcast', to: 'podcast-category', kind: 'IS_PARENT_OF' },
  { from: 'podcast', to: 'podcast-episode-type', kind: 'IS_PARENT_OF' },
  { from: 'artist', to: 'album', kind: 'RELATED_TO' },
  { from: 'album', to: 'playlist', kind: 'RELATED_TO' },
  { from: 'user', to: 'playlist', kind: 'RELATED_TO' },
  { from: 'artist', to: 'podcast', kind: 'RELATED_TO' },
  { from: 'user', to: 'podcast', kind: 'RELATED_TO' },
  { from: 'user', to: 'artist', kind: 'RELATED_TO' },
];

// ─── Layout ───────────────────────────────────────────────────────────────────

function computeLayout(nodes: SchemaNode[]): Record<string, Position> {
  const positions: Record<string, Position> = {};
  const cx = 500;
  const cy = 420;
  const parentRadius = 205;
  const childRadius = 100;
  const childSpread = Math.PI / 3;

  const parents = nodes.filter(n => n.kind === 'parent');
  parents.forEach((parent, i) => {
    const angle = (i / parents.length) * 2 * Math.PI - Math.PI / 2;
    const px = cx + parentRadius * Math.cos(angle);
    const py = cy + parentRadius * Math.sin(angle);
    positions[parent.id] = { x: px, y: py };

    const children = nodes.filter(n => n.parentId === parent.id);
    children.forEach((child, j) => {
      const offset =
        children.length > 1 ? childSpread * (j / (children.length - 1) - 0.5) : 0;
      const childAngle = angle + offset;
      positions[child.id] = {
        x: px + childRadius * Math.cos(childAngle),
        y: py + childRadius * Math.sin(childAngle),
      };
    });
  });

  return positions;
}

const NODE_POSITIONS = computeLayout(NODES);
const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAdjustedEndpoints(
  from: Position,
  to: Position,
  rFrom: number,
  rTo: number,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: from.x + ux * rFrom,
    y1: from.y + uy * rFrom,
    x2: to.x - ux * (rTo + 9),
    y2: to.y - uy * (rTo + 9),
  };
}

// ─── Graph Panel ──────────────────────────────────────────────────────────────

interface GraphPanelProps {
  selectedId: string | null;
  searchQuery: string;
  onSelect: (id: string | null) => void;
}

function GraphPanel({ selectedId, searchQuery, onSelect }: GraphPanelProps) {
  const connectedIds = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const connected = new Set<string>();
    EDGES.forEach(e => {
      if (e.from === selectedId) connected.add(e.to);
      if (e.to === selectedId) connected.add(e.from);
    });
    return connected;
  }, [selectedId]);

  const activeEdgeIndices = useMemo(() => {
    if (!selectedId) return new Set<number>();
    const active = new Set<number>();
    EDGES.forEach((e, i) => {
      if (e.from === selectedId || e.to === selectedId) active.add(i);
    });
    return active;
  }, [selectedId]);

  const matchedIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(NODES.filter(n => n.label.toLowerCase().includes(q)).map(n => n.id));
  }, [searchQuery]);

  const getNodeOpacity = (nodeId: string) => {
    if (selectedId) {
      return nodeId === selectedId || connectedIds.has(nodeId) ? 1 : 0.2;
    }
    if (searchQuery.trim()) {
      return matchedIds.has(nodeId) ? 1 : 0.2;
    }
    return 1;
  };

  const getEdgeOpacity = (i: number) => {
    if (selectedId) return activeEdgeIndices.has(i) ? 0.9 : 0.07;
    return 0.45;
  };

  return (
    <div className="w-full h-full bg-slate-950 relative select-none">
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 space-y-2 z-10">
        <p className="font-medium text-slate-100 mb-1">Legend</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
          <span>Parent Object</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-300 shrink-0" />
          <span>Child Node</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="24" height="10" className="shrink-0">
            <line x1="0" y1="5" x2="20" y2="5" stroke="#94a3b8" strokeWidth="1.5" />
          </svg>
          <span>IS_PARENT_OF</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="24" height="10" className="shrink-0">
            <line x1="0" y1="5" x2="20" y2="5" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="4 2" />
          </svg>
          <span>RELATED_TO</span>
        </div>
      </div>

      {/* Focus indicator */}
      {selectedId && (
        <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 z-10 flex items-center gap-2">
          <span className="text-slate-500">Focus:</span>
          <span className="text-white font-medium font-mono">{NODE_MAP[selectedId]?.label}</span>
          <button
            className="text-slate-500 hover:text-slate-300 ml-1"
            onClick={() => onSelect(null)}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 830"
        preserveAspectRatio="xMidYMid meet"
        onClick={() => onSelect(null)}
      >
        <defs>
          <marker
            id="arrow-parent"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
          <marker
            id="arrow-related"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fb923c" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map((edge, i) => {
          const from = NODE_POSITIONS[edge.from];
          const to = NODE_POSITIONS[edge.to];
          if (!from || !to) return null;

          const rFrom = NODE_MAP[edge.from]?.kind === 'parent' ? 22 : 14;
          const rTo = NODE_MAP[edge.to]?.kind === 'parent' ? 22 : 14;
          const { x1, y1, x2, y2 } = getAdjustedEndpoints(from, to, rFrom, rTo);
          const isRelated = edge.kind === 'RELATED_TO';

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isRelated ? '#fb923c' : '#94a3b8'}
              strokeWidth={isRelated ? 1.5 : 1}
              strokeDasharray={isRelated ? '6 3' : undefined}
              markerEnd={isRelated ? 'url(#arrow-related)' : 'url(#arrow-parent)'}
              opacity={getEdgeOpacity(i)}
              style={{ transition: 'opacity 0.2s' }}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map(node => {
          const pos = NODE_POSITIONS[node.id];
          if (!pos) return null;

          const isParent = node.kind === 'parent';
          const isSelected = node.id === selectedId;
          const isConnected = connectedIds.has(node.id);
          const isMatched = matchedIds.has(node.id);
          const r = isParent ? 22 : 14;

          return (
            <g
              key={node.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={e => {
                e.stopPropagation();
                onSelect(node.id);
              }}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              opacity={getNodeOpacity(node.id)}
            >
              {isSelected && (
                <circle r={r + 10} fill="#facc15" opacity={0.15} filter="url(#glow)" />
              )}
              {isSelected && (
                <circle r={r + 6} fill="none" stroke="#facc15" strokeWidth={2} />
              )}
              {!isSelected && isConnected && selectedId && (
                <circle r={r + 5} fill="none" stroke="#93c5fd" strokeWidth={1.5} opacity={0.7} />
              )}
              {isMatched && !selectedId && (
                <circle r={r + 6} fill="none" stroke="#86efac" strokeWidth={2} opacity={0.9} />
              )}
              <circle
                r={r}
                fill={isParent ? '#3b82f6' : '#93c5fd'}
                stroke={isSelected ? '#facc15' : isParent ? '#1d4ed8' : '#60a5fa'}
                strokeWidth={isSelected ? 2 : 1}
              />
              <text
                textAnchor="middle"
                dy={r + 14}
                fontSize={isParent ? 11 : 9}
                fill="#e2e8f0"
                fontFamily="var(--font-geist-mono, ui-monospace, monospace)"
                style={{ pointerEvents: 'none' }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Tree Panel ───────────────────────────────────────────────────────────────

interface TreePanelProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

function TreePanel({ selectedId, onSelect, search, onSearchChange }: TreePanelProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['deal']));

  const parents = NODES.filter(n => n.kind === 'parent');

  const filteredParents = useMemo(() => {
    if (!search.trim()) return parents;
    const q = search.toLowerCase();
    return parents.filter(p => {
      const children = NODES.filter(n => n.parentId === p.id);
      return (
        p.label.toLowerCase().includes(q) ||
        children.some(c => c.label.toLowerCase().includes(q))
      );
    });
  }, [search, parents]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedNode = selectedId ? NODE_MAP[selectedId] : null;

  const connections = useMemo(() => {
    if (!selectedId) return null;
    return {
      children: EDGES.filter(e => e.from === selectedId && e.kind === 'IS_PARENT_OF').length,
      parents: EDGES.filter(e => e.to === selectedId && e.kind === 'IS_PARENT_OF').length,
      related: EDGES.filter(
        e => (e.from === selectedId || e.to === selectedId) && e.kind === 'RELATED_TO',
      ).length,
    };
  }, [selectedId]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b shrink-0">
        <h2 className="font-semibold text-sm mb-3">Schema Explorer</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
          {search && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => onSearchChange('')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {search && (
          <p className="text-xs text-muted-foreground mt-2">
            {filteredParents.length} group{filteredParents.length !== 1 ? 's' : ''} matched
          </p>
        )}
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredParents.length === 0 ? (
          <p className="text-xs text-muted-foreground px-4 py-6 text-center">No results</p>
        ) : (
          filteredParents.map(parent => {
            const allChildren = NODES.filter(n => n.parentId === parent.id);
            const visibleChildren =
              search.trim()
                ? allChildren.filter(c =>
                    c.label.toLowerCase().includes(search.toLowerCase()),
                  )
                : allChildren;
            const isExpanded = expanded.has(parent.id);
            const isSelected = selectedId === parent.id;

            return (
              <div key={parent.id}>
                <button
                  className={cn(
                    'w-full flex items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-accent text-left transition-colors',
                    isSelected && 'bg-accent font-medium',
                  )}
                  onClick={() => {
                    onSelect(parent.id);
                    if (!isExpanded) setExpanded(prev => new Set([...prev, parent.id]));
                  }}
                >
                  <span
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={e => toggleExpand(parent.id, e)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span className="truncate">{parent.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground shrink-0 pl-2">
                    {allChildren.length}
                  </span>
                </button>

                {isExpanded && (
                  <div className="ml-7 mb-0.5">
                    {visibleChildren.map(child => {
                      const isChildSelected = selectedId === child.id;
                      return (
                        <button
                          key={child.id}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-1 rounded text-xs hover:bg-accent text-left transition-colors',
                            isChildSelected && 'bg-accent font-medium',
                          )}
                          onClick={() => onSelect(child.id)}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                          <span className="truncate font-mono">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Node detail card */}
      {selectedNode && connections && (
        <div className="border-t p-4 shrink-0 bg-muted/30">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Selected</p>
              <p className="font-medium text-sm truncate font-mono">{selectedNode.label}</p>
            </div>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full shrink-0 ml-2',
                selectedNode.kind === 'parent'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
              )}
            >
              {selectedNode.kind}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Children', value: connections.children },
              { label: 'Parents', value: connections.parents },
              { label: 'Related', value: connections.related },
            ].map(({ label, value }) => (
              <div key={label} className="bg-background rounded-md p-2 border">
                <p className="text-base font-bold leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchemaExplorerPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-72 border-r flex flex-col shrink-0 overflow-hidden">
        <TreePanel
          selectedId={selectedId}
          onSelect={setSelectedId}
          search={search}
          onSearchChange={setSearch}
        />
      </aside>
      <main className="flex-1 overflow-hidden">
        <GraphPanel
          selectedId={selectedId}
          searchQuery={search}
          onSelect={setSelectedId}
        />
      </main>
    </div>
  );
}
