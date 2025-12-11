const questions = [
    {
        id: 1,
        text: "Quanto tempo você costuma passar sentado por dia?",
        type: "single",
        options: [
            "Menos de 4 horas",
            "Entre 4 e 8 horas",
            "Mais de 8 horas por dia"
        ]
    },
    {
        id: 2,
        text: "Você costuma se alongar ou fazer qualquer tipo de mobilidade durante a semana?",
        type: "single",
        options: [
            "Sim, com frequência",
            "Às vezes",
            "Não faço alongamento"
        ]
    },
    {
        id: 3,
        text: "Você sente que tem ou já teve postura curvada?",
        type: "single",
        options: [
            "Não, minha postura é excelente",
            "Às vezes percebo",
            "Sim, e me incomoda"
        ]
    },
    {
        id: 4,
        text: "Você consegue encostar as mãos nos pés sem dobrar os joelhos?",
        type: "single",
        options: [
            "Sim, tranquilamente",
            "Chego perto",
            "Não chego nem perto"
        ]
    },
    {
        id: 5,
        text: "Já sentiu dores ou tensão em alguma dessas regiões? (Selecione todas que se aplicam)",
        type: "multiple",
        options: [
            "Lombar",
            "Pescoço",
            "Posterior da coxa",
            "Nenhuma das anteriores"
        ]
    },
    {
        id: 6,
        text: "Você acredita que perdeu altura desde a adolescência?",
        type: "single",
        options: [
            "Sim, percebo isso no espelho",
            "Talvez, nunca medi direito",
            "Não percebi diferença"
        ]
    },
    {
        id: 7,
        text: "Em fotos ou espelhos, você já se sentiu \"menor\" do que realmente é?",
        type: "single",
        options: [
            "Sim, frequentemente",
            "Raramente",
            "Nunca pensei nisso"
        ]
    },
    {
        id: 8,
        text: "Você toparia dedicar 20 minutos por dia para ganhar até 8cm de altura?",
        type: "single",
        options: [
            "Sim, quero meu plano agora",
            "Talvez, dependendo da rotina",
            "Não tenho certeza"
        ]
    }
];

let currentStep = 0;
const answers = {};
const totalQuestions = 8;

const questionContainer = document.getElementById('question-container');
const progressFill = document.getElementById('progress-fill');
const questionTracker = document.getElementById('question-tracker');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const headerTitle = document.querySelector('.quiz-header h1');
const headerDesc = document.querySelector('.quiz-header p');
const appContainer = document.querySelector('.app-container');

function init() {
    renderStep();

    btnNext.addEventListener('click', () => {
        if (!isStepValid()) return;

        if (currentStep < questions.length) {
            currentStep++;
            renderStep();
        } else if (currentStep === questions.length) {
            currentStep++;
            renderProcessingScreen();
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--; // Logic to go back from processing/result not fully handled but works for inputs
            renderStep();
        }
    });

    questionContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('custom-input')) {
            const height = document.getElementById('input-height')?.value;
            const age = document.getElementById('input-age')?.value;
            answers['height'] = height;
            answers['age'] = age;
            updateNextButtonState();
        }
    });
}

function renderStep() {
    appContainer.classList.remove('header-hidden'); // Ensure header is shown
    document.querySelector('.quiz-footer').classList.remove('hidden'); // Ensure footer shown

    if (currentStep < questions.length) {
        renderQuestion(questions[currentStep]);
    } else if (currentStep === questions.length) {
        renderInputStep();
    }
}

function renderQuestion(question) {
    headerTitle.innerText = "Análise de Potencial";
    headerDesc.innerText = "Descubra quanto você pode crescer nos próximos 30 dias.";

    const progressPercent = ((currentStep + 1) / (totalQuestions + 1)) * 100;
    progressFill.style.width = `${progressPercent}%`;
    questionTracker.textContent = `Pergunta ${currentStep + 1} de ${totalQuestions}`;

    btnBack.classList.remove('invisible');
    if (currentStep === 0) btnBack.classList.add('invisible');

    if (currentStep === questions.length - 1) {
        btnNext.innerHTML = `Próxima Etapa <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    } else {
        btnNext.innerHTML = `Próxima Pergunta <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }

    updateNextButtonState();

    let optionsHtml = '';
    question.options.forEach((opt, index) => {
        const isSelected = isOptionSelected(question.id, opt);
        const checkboxClass = question.type === 'multiple' ? 'checkbox' : '';

        optionsHtml += `
            <div class="option-card ${isSelected ? 'selected' : ''}" onclick="selectOption('${opt}')">
                <div class="option-input ${checkboxClass}"></div>
                <span class="option-label">${opt}</span>
            </div>
        `;
    });

    questionContainer.innerHTML = `
        <h2 class="question-text">${question.text}</h2>
        <div class="options-list">
            ${optionsHtml}
        </div>
    `;
}

function renderInputStep() {
    progressFill.style.width = `100%`;
    questionTracker.textContent = `Última etapa`;

    btnBack.classList.remove('invisible');
    btnNext.innerHTML = `Calcular Resultado <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    const hVal = answers['height'] || '';
    const aVal = answers['age'] || '';

    questionContainer.innerHTML = `
        <h2 class="question-text">Qual é a sua altura atual (em cm) e sua idade?</h2>
        <div class="input-group">
            <input type="number" id="input-height" class="custom-input" placeholder="Altura (cm) Ex: 175" value="${hVal}">
            <input type="number" id="input-age" class="custom-input" placeholder="Idade Ex: 25" value="${aVal}">
        </div>
    `;
    updateNextButtonState();
}

function renderProcessingScreen() {
    document.querySelector('.quiz-footer').classList.add('hidden');

    headerTitle.innerText = "Analisando Seu Potencial de Crescimento";
    headerDesc.innerText = "Por favor, aguarde enquanto nosso algoritmo processa suas respostas";

    questionTracker.textContent = "Progresso";
    const percentSpan = document.createElement('span');
    percentSpan.style.float = 'right';
    percentSpan.id = 'process-percent';
    percentSpan.innerText = '0%';
    questionTracker.appendChild(percentSpan);

    progressFill.style.width = '0%';

    questionContainer.innerHTML = `
        <div class="processing-container">
            <div class="processing-card">
                <div class="processing-header">
                    <div class="pulse-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div>
                        <div class="processing-title">Gerando protocolo personalizado...</div>
                        <div class="processing-text">Adaptando exercícios específicos para o seu perfil</div>
                    </div>
                </div>
                <div class="status-row">
                    <div class="status-dot"></div>
                    <span class="status-text">Processando dados em tempo real...</span>
                </div>
            </div>

            <div class="processing-card">
                <div class="processing-title" style="margin-bottom:8px;">Fatos sobre o Grow Max:</div>
                <div class="processing-text">Exercícios personalizados têm 3x mais eficácia que protocolos genéricos.</div>
            </div>
        </div>
    `;

    // Slower progress 10s roughly
    let p = 0;
    // 10000ms / 100 steps = 100ms per step.
    const interval = setInterval(() => {
        p += 1;
        if (p > 100) p = 100;

        progressFill.style.width = `${p}%`;
        document.getElementById('process-percent').innerText = `${p}%`;

        if (p === 100) {
            clearInterval(interval);
            setTimeout(() => {
                renderResultScreen();
            }, 500);
        }
    }, 100); // 100 * 100 = 10000ms = 10s
}

function renderResultScreen() {
    appContainer.classList.add('header-hidden');
    questionContainer.innerHTML = ''; // Clear

    // Calculations
    const height = parseInt(answers['height']) || 170;
    const age = answers['age'] || 25;

    // Potencial Gain: Random between 5, 6, 7
    // Math.random() < 0.33 -> 5. 0.33-0.66 -> 6. >0.66 -> 7.
    // floor(random * 3) -> 0,1,2. +5 -> 5,6,7.
    const potentialGain = Math.floor(Math.random() * 3) + 5;

    const finalHeight = height + potentialGain;
    const partial30 = (height + (potentialGain * 0.7)).toFixed(1).replace('.0', ''); // 70% of gains in 30 days
    // Actually image says: 30d -> 179.5 (from 176 to 181 is +5). 3.5 gain in 30d? That's 70%.
    // 60d -> 180.8. That's 4.8 gain. 96%.
    // Let's use simple logic: 30d ~ 70%, 60d ~ 90%, 90d ~ 100%

    const gain30 = potentialGain * 0.7;
    const gain60 = potentialGain * 0.9;

    // Format numbers
    const h30 = (height + gain30).toFixed(1).replace('.0', '');
    const h60 = (height + gain60).toFixed(1).replace('.0', '');

    const html = `
        <div class="result-header">
            <h2>Seu corpo tem potencial para ganhar até <span class="highlight-red">+${potentialGain}cm</span> de Altura.</h2>
        </div>

        <div class="comparison-container">
            <div class="stat-card">
                <span class="stat-label">Altura atual</span>
                <span class="stat-value">${height}cm</span>
            </div>
            <div class="arrow-divider">&rsaquo;</div>
            <div class="stat-card">
                <span class="stat-label">Altura potencial</span>
                <span class="stat-value">${finalHeight}cm</span>
            </div>
        </div>

        <div class="projection-card">
            <div class="chart-header">
                <span class="chart-icon-red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 6H23V12" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                Projeção de crescimento
            </div>
            
            <div class="chart-graph">
                <!-- Implicit CSS-only visual connection can be done with a pseudo element on container or just individual heights -->
                <!-- We will use a repeating gradient or svg line for the trend specific to mobile width if needed, but flex-items are best -->
                <div class="chart-line-bg"></div>

                <div class="chart-column">
                    <div class="point-label-top">Hoje</div>
                    <div class="dot-container" style="height: 20%;">
                         <div class="dot"></div>
                    </div>
                    <div class="point-label-bottom">${height}cm</div>
                </div>
                <div class="chart-column">
                    <div class="point-label-top">30d</div>
                    <div class="dot-container" style="height: 50%;">
                         <div class="dot"></div>
                    </div>
                    <div class="point-label-bottom">${h30}cm</div>
                </div>
                <div class="chart-column">
                    <div class="point-label-top">60d</div>
                    <div class="dot-container" style="height: 75%;">
                         <div class="dot"></div>
                    </div>
                    <div class="point-label-bottom">${h60}cm</div>
                </div>
                <div class="chart-column">
                    <div class="point-label-top">90d</div>
                    <div class="dot-container" style="height: 100%;">
                         <div class="dot"></div>
                    </div>
                    <div class="point-label-bottom">${finalHeight}cm</div>
                </div>
            </div>
            
            <div class="projection-footer">
                Projeção baseada em potencial de +${potentialGain}cm em 90 dias
            </div>
        </div>

        <div class="result-description">
            Seu corpo tem potencial para alcançar <span class="highlight-red-text">${finalHeight}cm</span> em <span class="highlight-red-text">90 dias</span>, conseguindo já chegar em até <span class="highlight-red-text">${h30}cm</span> em apenas <span class="highlight-red-text">30 dias</span>. Potencial <span class="highlight-red-text">96%</span> maior que outros usuários de <span class="highlight-red-text">${age} anos</span>.
        </div>

        <div class="cta-container">
            <div class="locked-progress-bg">
                <div class="locked-progress-fill"></div>
            </div>
            <div class="locked-text">
                0 cm de ${potentialGain} cm desbloqueados
            </div>
            <button class="btn-cta-start" onclick="window.location.href='https://oferta-temporaria.vercel.app/'">
                INICIAR MEU CRESCIMENTO
            </button>
        </div>
    `;

    questionContainer.innerHTML = html;

    // Ensure styles are refreshed
    questionContainer.className = 'question-container result-mode';
}


function selectOption(optionValue) {
    if (currentStep >= questions.length) return;

    const question = questions[currentStep];

    if (question.type === 'single') {
        answers[question.id] = optionValue;
    } else {
        let currentSelection = answers[question.id] || [];
        if (!Array.isArray(currentSelection)) currentSelection = [];

        const exclusiveOption = "Nenhuma das anteriores";

        if (optionValue === exclusiveOption) {
            if (currentSelection.includes(exclusiveOption)) {
                currentSelection = [];
            } else {
                currentSelection = [exclusiveOption];
            }
        } else {
            if (currentSelection.includes(exclusiveOption)) {
                currentSelection = currentSelection.filter(item => item !== exclusiveOption);
            }
            if (currentSelection.includes(optionValue)) {
                currentSelection = currentSelection.filter(item => item !== optionValue);
            } else {
                currentSelection.push(optionValue);
            }
        }

        answers[question.id] = currentSelection;
    }

    updateOptionsUI();
    updateNextButtonState();
}

function updateOptionsUI() {
    const question = questions[currentStep];
    const options = document.querySelectorAll('.option-card');

    options.forEach((card, index) => {
        const optText = question.options[index];
        const isSelected = isOptionSelected(question.id, optText);

        if (isSelected) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function isOptionSelected(qId, val) {
    const ans = answers[qId];
    if (!ans) return false;
    if (Array.isArray(ans)) {
        return ans.includes(val);
    }
    return ans === val;
}

function isStepValid() {
    if (currentStep < questions.length) {
        const ans = answers[questions[currentStep].id];
        if (!ans) return false;
        if (Array.isArray(ans) && ans.length === 0) return false;
        return true;
    } else if (currentStep === questions.length) {
        const h = answers['height'];
        const a = answers['age'];
        return (h && h > 50 && h < 300 && a && a > 5 && a < 120);
    }
    return false;
}

function updateNextButtonState() {
    if (isStepValid()) {
        btnNext.classList.remove('disabled');
    } else {
        btnNext.classList.add('disabled');
    }
}

function renderPlansScreen() {

    appContainer.classList.add('header-hidden');
    document.querySelector('.quiz-footer').classList.add('hidden'); // Ensure defaults are hidden
    questionContainer.innerHTML = '';

    // Timer logic: 1d 23h 35m 13s -> 171313 seconds
    let timeLeft = 171313;

    // Updated HTML with Banner, Strikethrough Prices, and Footer
    const html = `
        <div class="plans-container">
            <div class="urgent-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ÚLTIMAS VAGAS COM ESSE VALOR!
            </div>

            <div class="plans-header">
                <div class="plans-title">Planos <span class="text-grow-red">GROW</span></div>
                <div class="plans-subtitle">Escolha o plano ideal para desbloquear sua altura real e transformar sua postura</div>
                
                <div class="countdown-container">
                    <div class="countdown-label-top">Oferta especial termina em:</div>
                    <div class="timer-boxes">
                        <div class="timer-box">
                            <span class="timer-number" id="t-days">01</span>
                            <span class="timer-label">Dias</span>
                        </div>
                        <div class="timer-box">
                            <span class="timer-number" id="t-hours">23</span>
                            <span class="timer-label">Horas</span>
                        </div>
                        <div class="timer-box">
                            <span class="timer-number" id="t-mins">35</span>
                            <span class="timer-label">Minutos</span>
                        </div>
                        <div class="timer-box">
                            <span class="timer-number" id="t-secs">13</span>
                            <span class="timer-label">Segundos</span>
                        </div>
                    </div>
                </div>
                
                <div class="plans-subtitle" style="margin-top:20px;">
                    Escolha o Plano Ideal Para Você<br>
                    Desbloqueie sua altura real com um protocolo personalizado para o seu perfil
                </div>
            </div>

            <!-- PLAN 1: GROW Essencial -->
            <div class="plan-card">
                <div class="plan-badge">INICIANTE</div>
                <div class="plan-name">GROW Essencial</div>
                <div class="plan-type">Protocolo de 30 dias</div>
                
                <div class="price-box">
                    <span class="old-price">R$ 67,00</span>
                    <span class="current-price">R$ 14,90</span>
                </div>
                
                <div class="plan-details-box">
                    <div class="detail-row">
                        <span class="detail-icon">📏</span>
                        <strong>Ganho esperado:</strong> 2 a 4 cm
                    </div>
                </div>

                <div class="ideal-for-label">Ideal para:</div>
                <div class="ideal-for-text" style="margin-bottom: 20px;">
                    Iniciantes ou pessoas que passam muito tempo sentadas e querem crescer com segurança
                </div>
                
                <div class="features-list">
                    <div class="feature-item">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Protocolo de 30 dias com exercícios acessíveis (15 min/dia)</span>
                    </div>
                    <div class="feature-item">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Rotina prática para melhorar postura e alongamento progressivo</span>
                    </div>
                    <div class="feature-item">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Guia para sentar, dormir e se mover sem comprimir sua estrutura</span>
                    </div>
                    <div class="feature-item">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Dicas de alimentação que favorecem leveza corporal e mobilidade articular</span>
                    </div>
                    <div class="feature-item">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Suporte por e-mail com orientações semanais</span>
                    </div>
                    <div class="feature-item">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Resultado permanente: Ao corrigir sua estrutura e mobilizar sua cartilagem, seu corpo adota uma nova postura estável</span>
                    </div>
                </div>

                <div class="toggle-view" style="margin-bottom: 20px;">Ver mais benefícios</div>

                <a href="https://pay.kirvano.com/565d6486-da2c-474c-843e-c689d0092c68" style="text-decoration:none;">
                    <button class="btn-select-plan">
                        ESCOLHER PLANO ESSENCIAL
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12H19"/><path d="M12 5L19 12L12 19"/></svg>
                    </button>
                </a>
            </div>

            <!-- PLAN 2: GROW Evolution (Recommended) -->
            <div class="plan-card recommended">
                <div class="plan-badge">RECOMENDADO</div>
                <div class="plan-name">GROW Evolution</div>
                <div class="plan-type">Protocolo de 60 dias</div>
                
                <div class="price-box">
                    <span class="old-price">R$ 97,00</span>
                    <span class="current-price">R$ 19,90</span>
                </div>
                
                <div class="plan-details-box">
                    <div class="detail-row">
                        <span class="detail-icon">📏</span>
                        <strong>Ganho esperado:</strong> 3 a 6 cm
                    </div>
                </div>

                <div class="ideal-for-label">Ideal para:</div>
                <div class="ideal-for-text" style="margin-bottom: 20px;">
                    Quem quer crescer naturalmente e ainda melhorar a simetria e definição do corpo
                </div>
                
                <div class="features-list">
                    <div class="feature-item">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Treinos híbridos para casa ou academia, combinando alongamento e ativação muscular (20 min/dia)</span>
                    </div>
                    <div class="feature-item">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Plano de 60 dias com progressão focada em crescimento + aparência física</span>
                    </div>
                    <div class="feature-item">
                        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Guia alimentar para ganhar massa magra sem comprometer a mobilidade</span>
                    </div>
                </div>

                <div class="toggle-view" style="margin-bottom: 20px;">Ver mais benefícios</div>

                <a href="#" style="text-decoration:none;" onclick="alert('Link do Evolution não fornecido, redirecionando para Padrão por enquanto'); window.location.href='https://pay.kirvano.com/565d6486-da2c-474c-843e-c689d0092c68'; return false;">
                    <button class="btn-select-plan">
                        ESCOLHER PLANO EVOLUTION
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12H19"/><path d="M12 5L19 12L12 19"/></svg>
                    </button>
                </a>
            </div>


        </div>
    `;

    questionContainer.innerHTML = html;
    questionContainer.className = 'question-container';

    // Start Boxed Timer
    const tDays = document.getElementById('t-days');
    const tHours = document.getElementById('t-hours');
    const tMins = document.getElementById('t-mins');
    const tSecs = document.getElementById('t-secs');

    const interval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(interval);
            // Optionally, update the timer boxes to show "00" or "EXPIRED"
            if (tDays) tDays.innerText = '00';
            if (tHours) tHours.innerText = '00';
            if (tMins) tMins.innerText = '00';
            if (tSecs) tSecs.innerText = '00';
            return;
        }
        timeLeft--;

        const d = Math.floor(timeLeft / (3600 * 24));
        const h = Math.floor((timeLeft % (3600 * 24)) / 3600);
        const m = Math.floor((timeLeft % 3600) / 60);
        const s = timeLeft % 60;

        if (tDays) tDays.innerText = d < 10 ? '0' + d : d;
        if (tHours) tHours.innerText = h < 10 ? '0' + h : h;
        if (tMins) tMins.innerText = m < 10 ? '0' + m : m;
        if (tSecs) tSecs.innerText = s < 10 ? '0' + s : s;
    }, 1000);
}

// Start
// Start
init();
