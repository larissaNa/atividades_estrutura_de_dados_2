class ListaNode<T> {
    public next: ListaNode<T> | null = null;
    public prev: ListaNode<T> | null = null;
    constructor(public value: T) {}
}

class ListaDuplamenteEncadeada<T> {
    private head: ListaNode<T> | null = null;
    private tail: ListaNode<T> | null = null;
    private tamanho = 0;

    isEmpty(): boolean {
        return this.tamanho === 0;
    }

    size(): number {
        return this.tamanho;
    }

    clear(): void {
        this.head = this.tail = null;
        this.tamanho = 0;
    }

    insertAtBeginning(value: T): void {
        const node = new ListaNode(value);
        if (this.isEmpty()) {
            this.head = this.tail = node;
        } else {
            node.next = this.head;
            this.head!.prev = node;
            this.head = node;
        }
        this.tamanho++;
    }

    insertAtEnd(value: T): void {
        const node = new ListaNode(value);
        if (this.isEmpty()) {
            this.head = this.tail = node;
        } else {
            node.prev = this.tail;
            this.tail!.next = node;
            this.tail = node;
        }
        this.tamanho++;
    }

    insertAt(value: T, index: number): void {
        if (index < 0 || index > this.tamanho) throw new Error("Índice inválido");
        if (index === 0) return this.insertAtBeginning(value);
        if (index === this.tamanho) return this.insertAtEnd(value);

        const node = new ListaNode(value);
        let current = this.head!;
        for (let i = 0; i < index; i++) current = current.next!;

        node.next = current;
        node.prev = current.prev;
        current.prev!.next = node;
        current.prev = node;
        this.tamanho++;
    }

    removeFromBeginning(): T | null {
        if (this.isEmpty()) return null;
        const removed = this.head!;
        this.head = removed.next;
        if (this.head) this.head.prev = null;
        else this.tail = null;
        this.tamanho--;
        return removed.value;
    }

    removeFromEnd(): T | null {
        if (this.isEmpty()) return null;
        const removed = this.tail!;
        this.tail = removed.prev;
        if (this.tail) this.tail.next = null;
        else this.head = null;
        this.tamanho--;
        return removed.value;
    }

    removeAt(index: number): T | null {
        if (index < 0 || index >= this.tamanho) throw new Error("Índice inválido");
        if (index === 0) return this.removeFromBeginning();
        if (index === this.tamanho - 1) return this.removeFromEnd();

        let current = this.head!;
        for (let i = 0; i < index; i++) current = current.next!;

        current.prev!.next = current.next;
        current.next!.prev = current.prev;
        this.tamanho--;
        return current.value;
    }

    printForward(): string {
        let current = this.head;
        let result = [];
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result.join(" → ");
    }

    printBackward(): string {
        let current = this.tail;
        let result = [];
        while (current) {
            result.push(current.value);
            current = current.prev;
        }
        return result.join(" ← ");
    }
}

// ================== Integração com a página ==================
const lista = new ListaDuplamenteEncadeada<string>();
const saida = document.getElementById("saida")!;

function pegarValor(): string {
    const input = document.getElementById("valor") as HTMLInputElement;
    return input.value.trim();
}

function pegarPosicao(): number | null {
    const input = document.getElementById("posicao") as HTMLInputElement;
    return input.value ? parseInt(input.value) : null;
}

(window as any).inserirInicio = () => {
    const valor = pegarValor();
    if (valor) {
        lista.insertAtBeginning(valor);
        saida.textContent = `Valor '${valor}' inserido no início.`;
    }
};

(window as any).inserirFim = () => {
    const valor = pegarValor();
    if (valor) {
        lista.insertAtEnd(valor);
        saida.textContent = `Valor '${valor}' inserido no fim.`;
    }
};

(window as any).inserirPosicao = () => {
    const valor = pegarValor();
    const pos = pegarPosicao();
    if (valor && pos !== null) {
        try {
            lista.insertAt(valor, pos);
            saida.textContent = `Valor '${valor}' inserido na posição ${pos}.`;
        } catch (err) {
            saida.textContent = String(err);
        }
    }
};

(window as any).removerInicio = () => {
    const valor = lista.removeFromBeginning();
    saida.textContent = valor !== null ? `Removido do início: ${valor}` : "Lista vazia.";
};

(window as any).removerFim = () => {
    const valor = lista.removeFromEnd();
    saida.textContent = valor !== null ? `Removido do fim: ${valor}` : "Lista vazia.";
};

(window as any).removerPosicao = () => {
    const pos = pegarPosicao();
    if (pos !== null) {
        try {
            const valor = lista.removeAt(pos);
            saida.textContent = valor !== null ? `Removido da posição ${pos}: ${valor}` : "Valor não encontrado.";
        } catch (err) {
            saida.textContent = String(err);
        }
    }
};

(window as any).exibirOrdemNormal = () => {
    saida.textContent = "Ordem normal:\n" + lista.printForward();
};

(window as any).exibirOrdemInversa = () => {
    saida.textContent = "Ordem inversa:\n" + lista.printBackward();
};

(window as any).verificarVazia = () => {
    saida.textContent = lista.isEmpty() ? "A lista está vazia." : "A lista contém elementos.";
};

(window as any).esvaziarLista = () => {
    lista.clear();
    saida.textContent = "Lista esvaziada.";
};

(window as any).tamanhoLista = () => {
    saida.textContent = `Tamanho atual da lista: ${lista.size()}`;
};
