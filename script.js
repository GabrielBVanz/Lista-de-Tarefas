const API_URL = 'http://159.65.228.63/tarefas';

window.onload = function() {
    carregarTarefas();
};

function mostrarTela(tela) {
    document.getElementById('tela-lista').classList.add('hidden');
    document.getElementById('tela-cadastro').classList.add('hidden');
    
    if (tela === 'lista') {
        document.getElementById('tela-lista').classList.remove('hidden');
        carregarTarefas();
    } else {
        document.getElementById('tela-cadastro').classList.remove('hidden');
    }
}

async function carregarTarefas() {
    const tabela = document.getElementById('tabela-tarefas');
    const msgVazio = document.getElementById('msg-vazio');
    const loading = document.getElementById('loading');

    tabela.innerHTML = `
        <tr>
            <th>Prioridade</th>
            <th>Descrição</th>
            <th>Local</th>
            <th>Data Limite</th>
            <th>Recursos</th>
        </tr>
    `;
    tabela.classList.add('hidden');
    msgVazio.classList.add('hidden');
    loading.classList.remove('hidden');

    const response = await fetch(API_URL);
    const dados = await response.json();

    loading.classList.add('hidden');

    if (dados.length === 0) {
        msgVazio.classList.remove('hidden');
    } else {
        tabela.classList.remove('hidden');

        dados.forEach(tarefa => {
            const tr = document.createElement('tr');
            
            tr.classList.add('texto-'+(tarefa.prioridade.toLowerCase()));

            let descTexto = tarefa.descricao || tarefa.conteudo || '-';
            let localTexto = tarefa.local || '-';
            let dataTexto = tarefa.dataLimite || tarefa.data || '-';
            let recursos = tarefa.recursosNecessarios || tarefa.recursos || null;
            let recursosTexto = '-';
            if (recursos) {
                if (Array.isArray(recursos)) {
                    recursosTexto = recursos.flat().join(', ');
                } else if (typeof recursos === 'string') {
                    recursosTexto = recursos;
                }
            }

            tr.innerHTML = `
                <td>${tarefa.prioridade || '-'}</td>
                <td>${descTexto}</td>
                <td>${localTexto}</td>
                <td>${dataTexto}</td>
                <td>${recursosTexto}</td>
            `;
            tabela.appendChild(tr);
        });
    }
}

async function salvarTarefa(event) {
    event.preventDefault();
    
    const btn = event.target.querySelector('button');
    btn.disabled = true;
    btn.innerText = 'Salvando...';

    const desc = document.getElementById('desc').value;
    const local = document.getElementById('local').value;
    const prioridade = document.getElementById('prioridade').value;
    const dataInput = document.getElementById('data').value;
    const recursosInput = document.getElementById('recursos').value;
    const matricula = document.getElementById('matricula').value;

    const dataFormatada = dataInput.replace('T', ' ') + ':00';

    const listaRecursos = recursosInput.split(',').map(item => item.trim()).filter(i => i);

    const novaTarefa = {
        prioridade: prioridade,
        descricao: desc,
        local: local,
        recursosNecessarios: listaRecursos,
        dataLimite: dataFormatada,
        matricula: matricula
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTarefa)
    });

    if (response.ok) {
        alert('Tarefa cadastrada com sucesso!');
        document.getElementById('form-tarefa').reset();
        mostrarTela('lista');
    } else {
        alert('Erro ao salvar na API.');
    }

    btn.disabled = false;
    btn.innerText = 'Salvar Tarefa';
}