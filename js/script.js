document.addEventListener('DOMContentLoaded', function() {

//autenticação
    function salvarUsuario(usuario) {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios.push(usuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    function verificarLogin(email, senha) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        return usuarios.find(user => user.email === email && user.senha === senha);
    }

    function verificarSessao() {
        return localStorage.getItem('usuarioLogado');
    }

    function logout() {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    }

//avaliaçao
    function salvarAvaliacao(avaliacao) {
        let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
        avaliacoes.push(avaliacao);
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
    }

    function getAvaliacoesUsuario() {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioLogado) return [];
        
        const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
        return avaliacoes.filter(av => av.usuarioEmail === usuarioLogado.email);
    }

    function excluirAvaliacao(id) {
        let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
        avaliacoes = avaliacoes.filter(av => av.id !== id);
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
        window.location.reload();
    }

//carrossel
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const inner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        
        let currentIndex = 0;
        const itemCount = items.length;
        
        function updateCarousel() {
            inner.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            if (prevBtn) prevBtn.classList.toggle('hidden', currentIndex === 0);
            if (nextBtn) nextBtn.classList.toggle('hidden', currentIndex >= itemCount - 1);
        }
        
        if (nextBtn) nextBtn.addEventListener('click', () => currentIndex < itemCount - 1 && ++currentIndex && updateCarousel());
        if (prevBtn) prevBtn.addEventListener('click', () => currentIndex > 0 && --currentIndex && updateCarousel());
        
        updateCarousel();
    });

//formulario de avaliação
    const formAvaliacao = document.getElementById('formAvaliacao');
    if (formAvaliacao) {
        const notaSlider = document.getElementById('nota');
        const ratingValue = document.getElementById('rating-value');
        if (notaSlider && ratingValue) {
            notaSlider.addEventListener('input', function() {
                ratingValue.textContent = `Nota selecionada: ${this.value}`;
            });
        }

        formAvaliacao.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            if (!usuarioLogado) return window.location.href = 'login.html';

            const empresa = document.getElementById('empresa').value;
            const experiencia = document.getElementById('experiencia').value;
            const nota = document.getElementById('nota').value;
            
            const novaAvaliacao = {
                id: Date.now(),
                usuarioEmail: usuarioLogado.email,
                empresa: empresa,
                experiencia: experiencia,
                nota: nota,
                data: new Date().toISOString()
            };

            salvarAvaliacao(novaAvaliacao);
            alert('Avaliação enviada com sucesso!');
            window.location.href = 'avaliacoes.html';
        });
    }

//perfil.html
    if (window.location.pathname.includes('perfil.html')) {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        
        if (!usuarioLogado) return window.location.href = 'login.html';

        document.querySelector('.profile-picture').alt = `Foto de ${usuarioLogado.nome}`;
        document.getElementById('username').textContent = usuarioLogado.nome;
        document.getElementById('email').textContent = usuarioLogado.email;
        document.getElementById('data-cadastro').textContent = 
            new Date(usuarioLogado.dataCadastro).toLocaleDateString('pt-BR');
        
        const avaliacoes = getAvaliacoesUsuario().slice(0, 3);
        const avaliacoesContainer = document.querySelector('.avaliacoes-container');
        
        if (avaliacoes.length === 0) {
            avaliacoesContainer.innerHTML = '<p>Você ainda não fez nenhuma avaliação.</p>';
        } else {
            avaliacoesContainer.innerHTML = avaliacoes.map(av => `
                <div class="avaliacao-item">
                    <h3>${av.empresa}</h3>
                    <p>${av.experiencia}</p>
                    <p><strong>Nota:</strong> ${av.nota}/5</p>
                    <p><small>Postado em: ${new Date(av.data).toLocaleDateString('pt-BR')}</small></p>
                </div>
            `).join('');
        }
    }

//avaliacoes.html
    if (window.location.pathname.includes('avaliacoes.html')) {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioLogado) return window.location.href = 'login.html';

        const avaliacoes = getAvaliacoesUsuario();
        const listaAvaliacoes = document.getElementById('lista-avaliacoes');

        if (avaliacoes.length === 0) {
            listaAvaliacoes.innerHTML = '<p>Você ainda não fez nenhuma avaliação.</p>';
        } else {
            listaAvaliacoes.innerHTML = avaliacoes.map(av => `
                <div class="avaliacao-item">
                    <h3>${av.empresa} <span class="nota">${av.nota}/5</span></h3>
                    <p>${av.experiencia}</p>
                    <small>${new Date(av.data).toLocaleDateString('pt-BR')}</small>
                    <button class="btn-excluir" data-id="${av.id}">Excluir</button>
                </div>
            `).join('');

            document.querySelectorAll('.btn-excluir').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    if (confirm('Deseja realmente excluir esta avaliação?')) {
                        excluirAvaliacao(id);
                    }
                });
            });
        }
    }

//cadastro
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;

            if (senha !== confirmarSenha) return alert('As senhas não coincidem!');

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            if (usuarios.some(user => user.email === email)) return alert('Este email já está cadastrado!');

            const novoUsuario = {
                nome: nome,
                email: email,
                senha: senha,
                dataCadastro: new Date().toISOString()
            };

            salvarUsuario(novoUsuario);
            localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'perfil.html';
        });
    }

//login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            const usuario = verificarLogin(email, senha);
            
            if (usuario) {
                localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                window.location.href = 'perfil.html';
            } else {
                alert('Email ou senha incorretos!');
            }
        });
    }

  //sair / logout
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Deseja realmente sair da sua conta?')) logout();
        });
    });

//rotas
    if (['perfil.html', 'avaliacoes.html', 'avaliar.html'].some(pagina => 
        window.location.pathname.includes(pagina))) {
        if (!verificarSessao()) window.location.href = 'login.html';
    }
});