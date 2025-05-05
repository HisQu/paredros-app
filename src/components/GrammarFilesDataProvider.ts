import {
    TreeDataProvider,
    TreeItem,
    TreeItemIndex,
    Disposable,
  } from 'react-complex-tree';
  
  /* ------------------------------------------------------------------ */
  /*  very small local event helper – no external EventEmitter needed   */
  /* ------------------------------------------------------------------ */
  function createEmitter<P>() {
    const handlers = new Set<(payload: P) => void>();
  
    return {
      on(h: (payload: P) => void): Disposable {
        handlers.add(h);
        return { dispose: () => handlers.delete(h) };
      },
      emit(p: P) {
        handlers.forEach(h => h(p));
      },
    };
  }
  
  /* ------------------------------------------------------------------ */
  /*  our custom provider                                               */
  /* ------------------------------------------------------------------ */
  export class GrammarFilesDataProvider<T = unknown>
    implements TreeDataProvider<T>
  {
    private items: Record<TreeItemIndex, TreeItem<T>>;
    private readonly change = createEmitter<TreeItemIndex[]>(); // ← **mutable**
  
    constructor(initial: Record<TreeItemIndex, TreeItem<T>>) {
      this.items = initial;
    }
  
    /* mandatory: return one item */
    async getTreeItem(id: TreeItemIndex): Promise<TreeItem<T>> {
      return this.items[id];
    }
  
    /* mandatory: return children of an item */
    async getTreeItemChildren(id: TreeItemIndex): Promise<TreeItemIndex[]> {
      return this.items[id].children ?? [];
    }
  
    /* mandatory: let RCT subscribe to updates */
    onDidChangeTreeData(
      listener: (changedIds: TreeItemIndex[]) => void
    ): Disposable {
      return this.change.on(listener);
    }
  
    /* ----------------------------------------------------------------
     * helpers you call from your React code
     * -------------------------------------------------------------- */
  
    /** Replace the whole map and tell the tree which ids changed */
    setItems(
      newItems: Record<TreeItemIndex, TreeItem<T>>,
      changed: TreeItemIndex[] = Object.keys(newItems)
    ) {
      this.items = newItems;
      this.change.emit(changed);
    }
  
    /** Patch a single item (e.g. mark file as “changed”) */
    updateItem(id: TreeItemIndex, partial: Partial<TreeItem<T>>) {
      this.items = {
        ...this.items,
        [id]: { ...this.items[id], ...partial },
      };
      this.change.emit([id]);
    }
  }