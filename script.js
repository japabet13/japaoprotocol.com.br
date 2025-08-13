// --- Scripts da Aplicação ---

async function callGeminiAPI(prompt, maxRetries = 5) {
    const apiKey = ""; // A chave será fornecida pelo ambiente
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429 || response.status >= 500) {
                    const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                return "Não foi possível obter uma resposta da IA. Tente novamente.";
            }

        } catch (error) {
            if (i === maxRetries - 1) {
                console.error("Erro ao chamar a API Gemini após várias tentativas:", error);
                return "Ocorreu um erro de comunicação com a IA. Por favor, verifique a sua ligação à internet e tente novamente.";
            }
        }
    }
}

function initDynamicFAQ() {
    const askBtn = document.getElementById('askFaqBtn');
    const questionInput = document.getElementById('faqQuestion');
    const resultDiv = document.getElementById('faqResult');

    askBtn.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        if (!question) {
            resultDiv.textContent = "Por favor, escreva a sua pergunta.";
            return;
        }

        resultDiv.innerHTML = `<p class="font-bold">Você perguntou:</p><p class="mb-4">${question}</p><p class="font-bold">Resposta da IA:</p><p>A gerar resposta...</p>`;
        askBtn.disabled = true;

        const prompt = `Você é um assistente especialista no curso 'Japão Protocol', um treinamento sobre Arbitragem Esportiva. O seu criador é o Marcos (Investidor Japão). Responda à seguinte pergunta de um potencial aluno de forma clara, concisa e encorajadora: "${question}"`;
        
        const responseText = await callGeminiAPI(prompt);
        resultDiv.innerHTML = `<p class="font-bold">Você perguntou:</p><p class="mb-4">${question}</p><p class="font-bold">Resposta da IA:</p><p>${responseText}</p>`;
        askBtn.disabled = false;
        questionInput.value = "";
    });
}

function setupDynamicHeader() {
    const spotsContainer = document.getElementById('spots-container');
    if (spotsContainer) {
        const randomSpots = Math.floor(Math.random() * 10) + 1;
        spotsContainer.textContent = `${randomSpots} VAGAS DISPONÍVEIS`;
    }

    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('pt-BR', options);
        dateElement.textContent = `HOJE, ${formattedDate.toUpperCase()}`;
    }
}

function initTestimonialsSwiper() {
    new Swiper('#testimonials-swiper-wrapper .swiper-testimonials', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        navigation: {
            nextEl: '#testimonials-swiper-wrapper .swiper-button-next',
            prevEl: '#testimonials-swiper-wrapper .swiper-button-prev',
        },
        pagination: {
            el: '#testimonials-swiper-wrapper .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 }
        }
    });
}

function initModulesSwiper() {
    new Swiper('#modules-swiper-wrapper .swiper-modules', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        navigation: {
            nextEl: '#modules-swiper-wrapper .swiper-button-next',
            prevEl: '#modules-swiper-wrapper .swiper-button-prev',
        },
        coverflowEffect: {
            rotate: 20,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '#modules-swiper-wrapper .swiper-pagination-modules',
            clickable: true,
        },
         breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

function initFAQAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = header.querySelector('.plus-icon');

        header.addEventListener('click', () => {
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherContent = otherItem.querySelector('.accordion-content');
                    const otherIcon = otherItem.querySelector('.plus-icon');
                    otherContent.style.maxHeight = null;
                    otherIcon.classList.remove('rotate-45');
                }
            });

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.classList.remove('rotate-45');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.classList.add('rotate-45');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupDynamicHeader();
    initTestimonialsSwiper();
    initModulesSwiper();
    initFAQAccordion();
    initDynamicFAQ();
});
