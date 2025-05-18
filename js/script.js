document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todos os carrosseis
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
            
            // Esconde botões quando necessário
            if (currentIndex === 0) {
                prevBtn.classList.add('hidden');
            } else {
                prevBtn.classList.remove('hidden');
            }
            
            if (currentIndex >= itemCount - 1) {
                nextBtn.classList.add('hidden');
            } else {
                nextBtn.classList.remove('hidden');
            }
        }
        
        // Botão próximo
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < itemCount - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }
        
        // Botão anterior
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }
        
        // Inicializa
        updateCarousel();
    });
    
    // Sistema de Login/Cadastro
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulação de login
            alert('Login realizado com sucesso! Redirecionando...');
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 1000);
        });
    }
    
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            
            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }
            
            // Simulação de cadastro
            alert('Cadastro realizado com sucesso! Bem-vindo ao Avalia 360.');
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 1000);
        });
    }
    
    // Logout
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Deseja realmente sair da sua conta?')) {
                alert('Você foi desconectado com sucesso.');
                window.location.href = 'index.html';
            }
        });
    });
    
    // Slider de avaliação
    const ratingSlider = document.getElementById('nota');
    const ratingValue = document.getElementById('rating-value');
    
    if (ratingSlider && ratingValue) {
        ratingSlider.addEventListener('input', function() {
            ratingValue.textContent = `Nota: ${this.value}/5`;
            ratingValue.style.fontWeight = 'bold';
            ratingValue.style.color = 
                this.value < 2 ? 'var(--error-red)' : 
                this.value < 4 ? '#FFA500' : '#4CAF50';
        });
        
        // Dispara o evento para inicializar
        ratingSlider.dispatchEvent(new Event('input'));
    }
});