class TreeNode {
    valor: number;
    esquerda: TreeNode | null = null;
    direita: TreeNode | null = null;
    constructor(valor: number) {
        this.valor = valor;
    }
}

class ArvoreBinaria {
    raiz: TreeNode | null = null;

    inserir(valor: number): void {
        this.raiz = this._inserir(this.raiz, valor);
    }

    private _inserir(no: TreeNode | null, valor: number): TreeNode {
        if (no === null) return new TreeNode(valor);
        if (valor < no.valor) no.esquerda = this._inserir(no.esquerda, valor);
        else if (valor > no.valor) no.direita = this._inserir(no.direita, valor);
        return no;
    }

    buscar(valor: number): boolean {
        return this._buscar(this.raiz, valor);
    }

    private _buscar(no: TreeNode | null, valor: number): boolean {
        if (!no) return false;
        if (valor === no.valor) return true;
        return valor < no.valor
            ? this._buscar(no.esquerda, valor)
            : this._buscar(no.direita, valor);
    }

    emOrdem(): string {
        const resultado: number[] = [];
        this._emOrdem(this.raiz, resultado);
        return resultado.join(" ");
    }

    private _emOrdem(no: TreeNode | null, resultado: number[]): void {
        if (!no) return;
        this._emOrdem(no.esquerda, resultado);
        resultado.push(no.valor);
        this._emOrdem(no.direita, resultado);
    }

    preOrdem(): string {
        const r: number[] = [];
        this._preOrdem(this.raiz, r);
        return r.join(" ");
    }

    private _preOrdem(no: TreeNode | null, r: number[]): void {
        if (!no) return;
        r.push(no.valor);
        this._preOrdem(no.esquerda, r);
        this._preOrdem(no.direita, r);
    }

    posOrdem(): string {
        const r: number[] = [];
        this._posOrdem(this.raiz, r);
        return r.join(" ");
    }

    private _posOrdem(no: TreeNode | null, r: number[]): void {
        if (!no) return;
        this._posOrdem(no.esquerda, r);
        this._posOrdem(no.direita, r);
        r.push(no.valor);
    }

    largura(): string {
        if (!this.raiz) return "";
        const fila: TreeNode[] = [this.raiz];
        const r: number[] = [];

        while (fila.length > 0) {
            const atual = fila.shift()!;
            r.push(atual.valor);
            if (atual.esquerda) fila.push(atual.esquerda);
            if (atual.direita) fila.push(atual.direita);
        }

        return r.join(" ");
    }

    altura(): number {
        return this._altura(this.raiz);
    }

    private _altura(no: TreeNode | null): number {
        if (!no) return -1;
        return 1 + Math.max(this._altura(no.esquerda), this._altura(no.direita));
    }

    contar(): number {
        return this._contar(this.raiz);
    }

    private _contar(no: TreeNode | null): number {
        if (!no) return 0;
        return 1 + this._contar(no.esquerda) + this._contar(no.direita);
    }

    ancestrais(valor: number): string {
        const caminho: number[] = [];
        let atual = this.raiz;
        while (atual) {
            if (valor === atual.valor) break;
            caminho.push(atual.valor);
            atual = valor < atual.valor ? atual.esquerda : atual.direita;
        }
        return atual ? caminho.join(" → ") : "Elemento não encontrado";
    }

    descendentes(valor: number): string {
        const no = this._encontrar(this.raiz, valor);
        if (!no) return "Elemento não encontrado";
        const r: number[] = [];
        this._preOrdem(no.esquerda, r);
        this._preOrdem(no.direita, r);
        return r.length ? r.join(" ") : "Sem descendentes";
    }

    nivel(valor: number): number {
        let atual = this.raiz;
        let nivel = 0;
        while (atual) {
            if (valor === atual.valor) return nivel;
            atual = valor < atual.valor ? atual.esquerda : atual.direita;
            nivel++;
        }
        return -1; // não encontrado
    }

    private _encontrar(no: TreeNode | null, valor: number): TreeNode | null {
        if (!no || no.valor === valor) return no;
        return valor < no.valor
            ? this._encontrar(no.esquerda, valor)
            : this._encontrar(no.direita, valor);
    }

    isEstritamenteBinaria(no: TreeNode | null = this.raiz): boolean {
        if (!no) return true;
        if ((no.esquerda && !no.direita) || (!no.esquerda && no.direita)) return false;
        return this.isEstritamenteBinaria(no.esquerda) && this.isEstritamenteBinaria(no.direita);
    }

    isCheia(): boolean {
        const altura = this.altura();
        return this.contar() === Math.pow(2, altura + 1) - 1;
    }
}

// === Integração com HTML ===
const arvore = new ArvoreBinaria();
const saida2 = document.getElementById("saida2")!;
const getValor = () => parseInt((document.getElementById("valor") as HTMLInputElement).value);

(window as any).inserir = () => {
    const v = getValor();
    arvore.inserir(v);
    saida2.textContent = `Valor ${v} inserido.`;
};

(window as any).buscar = () => {
    const v = getValor();
    saida2.textContent = arvore.buscar(v)
        ? `O valor ${v} está na árvore.`
        : `O valor ${v} não está na árvore.`;
};

(window as any).emOrdem = () => saida2.textContent = "Em-Ordem:\n" + arvore.emOrdem();
(window as any).preOrdem = () => saida2.textContent = "Pré-Ordem:\n" + arvore.preOrdem();
(window as any).posOrdem = () => saida2.textContent = "Pós-Ordem:\n" + arvore.posOrdem();
(window as any).largura = () => saida2.textContent = "Busca em Largura:\n" + arvore.largura();
(window as any).altura = () => saida2.textContent = "Altura da árvore: " + arvore.altura();
(window as any).quantidade = () => saida2.textContent = "Total de elementos: " + arvore.contar();
(window as any).ancestrais = () => saida2.textContent = "Ancestrais: " + arvore.ancestrais(getValor());
(window as any).descendentes = () => saida2.textContent = "Descendentes: " + arvore.descendentes(getValor());
(window as any).nivel = () => {
    const nivel = arvore.nivel(getValor());
    saida2.textContent = nivel >= 0 ? `Nível do elemento: ${nivel}` : "Elemento não encontrado.";
};
(window as any).estritamenteBinaria = () => saida2.textContent = arvore.isEstritamenteBinaria()
    ? "A árvore é estritamente binária." : "Não é estritamente binária.";
(window as any).arvoreCheia = () => saida2.textContent = arvore.isCheia()
    ? "A árvore é cheia." : "A árvore não é cheia.";
