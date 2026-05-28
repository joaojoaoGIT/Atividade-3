async function carregarDados() {
    const btn = document.getElementById('loadBtn');
    const lista = document.getElementById('Lista');
    try {
        if (btn) { btn.disabled = true; btn.classList.add('loading'); }
        lista.innerHTML = '';
        // placeholders while carregando
        for (let i = 0; i < 3; i++) {
            const sk = document.createElement('div');
            sk.className = 'card skeleton';
            lista.appendChild(sk);
        }

        const resposta = await fetch('aluno.json');
        if (!resposta.ok) throw new Error('Arquivo não encontrado');
        const alunos = await resposta.json();

        lista.innerHTML = '';
        if (!Array.isArray(alunos) || alunos.length === 0) {
            lista.innerHTML = '<p class="empty">Nenhum aluno encontrado.</p>';
            return;
        }

        alunos.forEach((aluno, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.setProperty('--delay', `${index * 80}ms`);
            card.innerHTML = `
                <h3>${aluno.name}</h3>
                <p><strong>Idade:</strong> ${aluno.idade}</p>
                <p><strong>Curso:</strong> ${aluno.curso}</p>
                <p><strong>Cidade:</strong> ${aluno.cidade}</p>
                <p><strong>Email:</strong> <a href="mailto:${aluno.email}">${aluno.email}</a></p>
            `;
            lista.appendChild(card);
        });
    } catch (err) {
        lista.innerHTML = `<p class="error">Erro ao carregar dados: ${err.message}</p>`;
        console.error(err);
    } finally {
        if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
    }
}