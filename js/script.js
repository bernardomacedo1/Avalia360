document.addEventListener('DOMContentLoaded', function() {
// carrossel
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

// autenticaçao
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

//perfil
    if (window.location.pathname.includes('perfil.html')) {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        
        if (!usuarioLogado) return window.location.href = 'login.html';

        document.querySelector('.profile-picture').alt = `Foto de ${usuarioLogado.nome}`;
        document.getElementById('username').textContent = usuarioLogado.nome;
        document.getElementById('email').textContent = usuarioLogado.email;
        document.getElementById('data-cadastro').textContent = 
            new Date(usuarioLogado.dataCadastro).toLocaleDateString('pt-BR');
    }

//verificar rotas
    if (['perfil.html', 'avaliacao.html'].some(pagina => 
        window.location.pathname.includes(pagina))) {
        if (!verificarSessao()) window.location.href = 'login.html';
    }
});