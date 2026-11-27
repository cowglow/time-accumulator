import React from 'react';
import { useAppState } from '../contexts/AppStateContext';

/** Selection state for an entry list plus the bulk actions the selection
 *  footer offers: tag with a pool, and omit (or restore, when everything
 *  picked is already omitted). Selections of entries no longer visible in
 *  `visible` are ignored. */
export const useEntrySelection = (visible: TimeEntry[]) => {
  const { assignPool, setEntriesState } = useAppState();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const picked = visible.filter(entry => selected.has(entry.id));
  const ids = picked.map(entry => entry.id);
  const allOmitted = picked.length > 0 && picked.every(entry => entry.state === 'omitted');

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const clear = () => setSelected(new Set());

  const tag = (poolId: string) => {
    assignPool(ids, poolId);
    clear();
  };

  const stateToggle = allOmitted
    ? {
        label: 'Restore',
        onClick: () => {
          setEntriesState(ids, 'counted');
          clear();
        },
      }
    : {
        label: 'Omit',
        onClick: () => {
          setEntriesState(ids, 'omitted');
          clear();
        },
      };

  return {
    selectedIds: new Set(ids),
    count: ids.length,
    toggle,
    clear,
    tag,
    stateToggle,
  };
};
