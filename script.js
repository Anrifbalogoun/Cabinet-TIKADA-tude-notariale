document.addEventListener('DOMContentLoaded', () => {

    // Clé d'accès Web3Forms
    const WEB3FORMS_ACCESS_KEY = "93bff63d-cd7d-4a62-a4c7-13a83551ad92";

    // --- 1. HERO CAROUSEL / SLIDER ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    let currentSlide = 0;
    const slideInterval = 6000; // 6 secondes

    function showSlide(index) {
        if (!slides.length) return;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => showSlide(idx));
    });

    // Auto Slide
    let timer = setInterval(nextSlide, slideInterval);

    // Pause au survol
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(timer));
        heroSection.addEventListener('mouseleave', () => timer = setInterval(nextSlide, slideInterval));
    }

    // --- 2. MODAL DÉTAILS SERVICES ---
    const serviceData = {
        1: {
            title: "Droit Immobilier",
            icon: "fa-house-chimney",
            description: "Nous vous accompagnons dans l'acquisition, la vente ou le financement de vos biens immobiliers résidentiels et professionnels.",
            items: [
                "Rédaction et signature de compromis / promesses de vente",
                "Vérification préalable du cadastre, urbanisme et hypothèque",
                "Actes de prêt hypothécaire et refinancement",
                "Baux d'habitation et servitudes foncières"
            ]
        },
        2: {
            title: "Droit de la Famille",
            icon: "fa-people-roof",
            description: "Protégez vos proches et structurez les engagements familiaux avec des conseils avisés et adaptés à votre situation.",
            items: [
                "Contrats de mariage et conventions de PACS",
                "Changements de régime matrimonial",
                "Conventions de divorce par consentement mutuel",
                "Adoptions et protections des incapables (tutelle/curatelle)"
            ]
        },
        3: {
            title: "Successions & Patrimoine",
            icon: "fa-box-archive",
            description: "Anticipez et gérez la transmission de vos biens dans le respect des volontés et de la législation fiscale.",
            items: [
                "Règlement complet des dossiers de succession",
                "Donations entre époux et donations-partages",
                "Rédaction et conservation de testaments authentiques",
                "Partages d'indivision"
            ]
        },
        4: {
            title: "Droit des Affaires",
            icon: "fa-briefcase",
            description: "Partenaire juridique de l'entreprise à chaque étape stratégique de son développement.",
            items: [
                "Statuts de sociétés (SAS, SARL, SCI, etc.)",
                "Cessions de fonds de commerce et de pas-de-porte",
                "Baux commerciaux (rédaction, renouvellement)",
                "Cessions de parts sociales et fusion d'entreprises"
            ]
        },
        5: {
            title: "Gestion Patrimoniale",
            icon: "fa-chart-line",
            description: "Optimisation et structuration à long terme de vos actifs financiers et immobiliers.",
            items: [
                "Audit patrimonial et bilan fiscal",
                "Démembrement de propriété (usufruit / nue-propriété)",
                "Création et gestion de Holdings Familiales",
                "Transmission d'entreprises (Pacte Dutreil)"
            ]
        },
        6: {
            title: "Droit Rural & Collectivités",
            icon: "fa-building-flag",
            description: "Conseil spécialisé pour les exploitants agricoles, fonciers et les acteurs publics locaux.",
            items: [
                "Baux ruraux à long terme et cessibles",
                "Constitutions de GFA, GAEC et SCEA",
                "Accompagnement des collectivités sur les actes administratifs",
                "Transaction foncières et aménagement du territoire"
            ]
        }
    };

    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalIconClass = document.getElementById('modal-icon-class');
    const modalDesc = document.getElementById('modal-description');
    const modalList = document.getElementById('modal-list');
    const closeModalBtn = document.querySelector('.close-modal');

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.getAttribute('data-service');
            const data = serviceData[serviceId];

            if (data && modal) {
                modalTitle.textContent = data.title;
                modalIconClass.className = `fa-solid ${data.icon}`;
                modalDesc.textContent = data.description;

                modalList.innerHTML = '';
                data.items.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fa-solid fa-check"></i> ${item}`;
                    modalList.appendChild(li);
                });

                modal.style.display = 'flex';
            }
        });
    });

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) modal.style.display = 'none';
    });

    const modalRdvBtn = document.getElementById('modal-rdv-btn');
    if (modalRdvBtn && modal) {
        modalRdvBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // --- 3. GESTION DU FORMULAIRE DE RENDEZ-VOUS (WEB3FORMS) ---
    const rdvForm = document.getElementById('appointment-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = rdvForm ? rdvForm.querySelector('button[type="submit"]') : null;

    function showFeedback(type, message) {
        if (!feedback) return;
        feedback.style.display = 'block';
        feedback.className = `form-feedback ${type}`;
        feedback.textContent = message;
    }

    if (rdvForm) {
        rdvForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const cleanAccessKey = typeof WEB3FORMS_ACCESS_KEY === 'string'
                ? WEB3FORMS_ACCESS_KEY.trim()
                : '';

            if (!cleanAccessKey) {
                showFeedback('error', "Clé d'accès Web3Forms manquante.");
                return;
            }

            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Envoi en cours...</span>';
            }

            const formData = new FormData(rdvForm);
            formData.set("access_key", cleanAccessKey);

            if (!formData.get("subject")) {
                formData.set("subject", "Nouvelle Demande de Rendez-vous - Cabinet Tikada");
            }

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showFeedback(
                        'success',
                        'Votre demande de rendez-vous a bien été transmise. Notre étude vous contactera sous 24h.'
                    );
                    rdvForm.reset();

                    setTimeout(() => {
                        if (feedback) {
                            feedback.style.display = 'none';
                        }
                    }, 6000);
                } else {
                    throw new Error(data.message || "Erreur lors de l'envoi du formulaire.");
                }
            } catch (error) {
                showFeedback('error', "Erreur lors de l'envoi : " + error.message);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    // --- 4. NAVIGATION MOBILE ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navbar = document.querySelector('.navbar');

    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) navbar.classList.remove('active');
        });
    });
});
