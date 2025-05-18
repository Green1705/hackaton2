document.addEventListener('DOMContentLoaded', function() {

            const mkdBtn = document.getElementById("mkdBtn");
            const enBtn = document.getElementById("enBtn");
            const langMkd = document.getElementById("langMkd");
            const langEn = document.getElementById("langEn");

            const modal = document.getElementById("serviceModal");
            const requestButtons = document.querySelectorAll('.request-service');
            const closeBtn = document.querySelector('.close-btn');
            const serviceInput = document.getElementById("service");
            const serviceForm = document.getElementById("serviceForm");
            const submitMessage = document.getElementById("submitMessage");

            const modalTitle = document.getElementById("modalTitle");
            const nameLabel = document.getElementById("nameLabel");
            const ageLabel = document.getElementById("ageLabel");
            const phoneLabel = document.getElementById("phoneLabel");
            const emailLabel = document.getElementById("emailLabel");
            const problemLabel = document.getElementById("problemLabel");
            const submitBtn = document.getElementById("submitBtn");

                    const statusModal = document.getElementById("statusModal");
            const closeStatusBtn = document.getElementById("closeStatusBtn");
            const statusTitle = document.getElementById("statusTitle");

            serviceForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Hide the request modal
                modal.classList.remove('active');
                
                // Show the status modal
                statusModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Set the correct title based on language
                if (currentLang === 'mkd') {
                    statusTitle.textContent = 'Услугата е прифатена';
                } else {
                    statusTitle.textContent = 'Service Request Accepted';
                }
                
                // Reset form
                this.reset();
            });

            // Add close handler for status modal
            closeStatusBtn.addEventListener('click', function() {
                statusModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });

            // Close status modal when clicking outside
            statusModal.addEventListener('click', function(e) {
                if (e.target === statusModal) {
                    statusModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });

            let currentLang = 'en';

            mkdBtn.addEventListener("click", function() {
                currentLang = 'mkd';
                langEn.classList.remove('active');
                langMkd.classList.add('active');
                updateModalText('mkd');
            });

            enBtn.addEventListener("click", function() {
                currentLang = 'en';
                langMkd.classList.remove('active');
                langEn.classList.add('active');
                updateModalText('en');
            });

            function updateModalText(lang) {
                if (lang === 'mkd') {
                    modalTitle.textContent = 'Побарајте услуга';
                    nameLabel.textContent = 'Име и Презиме';
                    ageLabel.textContent = 'Возраст';
                    phoneLabel.textContent = 'Телефонски број';
                    emailLabel.textContent = 'Е-Маил';
                    problemLabel.textContent = 'Опишете го вашето барање';
                    submitBtn.textContent = 'Потврдете барање';
                } else {
                    modalTitle.textContent = 'Request Service';
                    nameLabel.textContent = 'Full Name';
                    ageLabel.textContent = 'Age';
                    phoneLabel.textContent = 'Phone Number';
                    emailLabel.textContent = 'Email';
                    problemLabel.textContent = 'Describe Your Service Needs';
                    submitBtn.textContent = 'Submit Request';
                }
            }

        
            requestButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const serviceName = this.getAttribute('data-service');
                    serviceInput.value = serviceName;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

          
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });

          
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });

         
            serviceForm.addEventListener('submit', function(e) {
                e.preventDefault();

                this.reset();

                submitMessage.style.display = 'block';

                setTimeout(function() {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    submitMessage.style.display = 'none';
                }, 3000);
            });

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    let targetId = this.getAttribute('href');
                    if (currentLang === 'mkd' && targetId === '#about') {
                        targetId = '#about-mkd';
                    } else if (currentLang === 'mkd' && targetId === '#contact') {
                        targetId = '#contact-mkd';
                    } else if (currentLang === 'mkd' && targetId === '#services') {
                        targetId = '#services-mkd';
                    }
                    
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });
        const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved user preference
if (localStorage.getItem('darkMode') === 'enabled') {
  body.classList.add('dark-mode');
  darkModeToggle.classList.add('active');
}

// Toggle dark mode
darkModeToggle.addEventListener('click', function() {
  this.classList.toggle('active');
  body.classList.toggle('dark-mode');
  
  // Save user preference
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

