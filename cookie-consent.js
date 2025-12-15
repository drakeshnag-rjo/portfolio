// Cookie Consent Management System
// GDPR Compliant Cookie Banner and Settings

(function () {
    'use strict';

    // Cookie consent configuration
    const COOKIE_CONFIG = {
        consentCookieName: 'cookieConsent',
        consentCookieExpiry: 365, // days
        categories: {
            essential: {
                name: 'Essential',
                description: 'Required for the website to function properly',
                required: true,
                cookies: ['cookieConsent', 'sessionId']
            },
            analytics: {
                name: 'Analytics',
                description: 'Help us understand how visitors use our website',
                required: false,
                cookies: ['_ga', '_gid', '_gat']
            },
            functional: {
                name: 'Functional',
                description: 'Enable enhanced functionality and personalization',
                required: false,
                cookies: ['userPreferences', 'theme']
            },
            performance: {
                name: 'Performance',
                description: 'Collect information about website performance',
                required: false,
                cookies: ['performanceMetrics']
            }
        }
    };

    // Cookie utility functions
    const CookieUtils = {
        set: function (name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
        },

        get: function (name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        delete: function (name) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        },

        deleteAll: function (cookieNames) {
            cookieNames.forEach(name => this.delete(name));
        }
    };

    // Consent Manager
    const ConsentManager = {
        getConsent: function () {
            const consent = CookieUtils.get(COOKIE_CONFIG.consentCookieName);
            if (!consent) return null;
            try {
                return JSON.parse(decodeURIComponent(consent));
            } catch (e) {
                return null;
            }
        },

        setConsent: function (preferences) {
            const consentData = {
                timestamp: new Date().toISOString(),
                preferences: preferences
            };
            CookieUtils.set(
                COOKIE_CONFIG.consentCookieName,
                encodeURIComponent(JSON.stringify(consentData)),
                COOKIE_CONFIG.consentCookieExpiry
            );
            this.applyConsent(preferences);
        },

        applyConsent: function (preferences) {
            // Remove cookies for categories that are not consented
            Object.keys(COOKIE_CONFIG.categories).forEach(category => {
                const categoryConfig = COOKIE_CONFIG.categories[category];
                if (!categoryConfig.required && !preferences[category]) {
                    // Delete cookies for this category
                    CookieUtils.deleteAll(categoryConfig.cookies);
                }
            });

            // Trigger analytics initialization if consented
            if (preferences.analytics) {
                this.initializeAnalytics();
            }

            // Trigger other category-specific initializations
            if (preferences.functional) {
                this.initializeFunctional();
            }

            if (preferences.performance) {
                this.initializePerformance();
            }
        },

        initializeAnalytics: function () {
            // Initialize Google Analytics or other analytics tools
            console.log('Analytics initialized');
            // Example: Load Google Analytics script
            // This is where you would load your analytics script
            // window.dataLayer = window.dataLayer || [];
            // function gtag(){dataLayer.push(arguments);}
            // gtag('js', new Date());
            // gtag('config', 'GA_MEASUREMENT_ID');
        },

        initializeFunctional: function () {
            console.log('Functional cookies initialized');
            // Initialize functional features
        },

        initializePerformance: function () {
            console.log('Performance cookies initialized');
            // Initialize performance monitoring
        },

        hasConsent: function () {
            return this.getConsent() !== null;
        }
    };

    // Banner Manager
    const BannerManager = {
        banner: null,
        modal: null,

        init: function () {
            // Check if consent already exists
            if (ConsentManager.hasConsent()) {
                const consent = ConsentManager.getConsent();
                ConsentManager.applyConsent(consent.preferences);
                return;
            }

            // Check for Do Not Track
            if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
                // Respect DNT - only essential cookies
                ConsentManager.setConsent({
                    essential: true,
                    analytics: false,
                    functional: false,
                    performance: false
                });
                return;
            }

            // Show banner if no consent exists
            this.createBanner();
            this.createModal();
        },

        createBanner: function () {
            const banner = document.createElement('div');
            banner.id = 'cookieConsentBanner';
            banner.innerHTML = `
                <div class="cookie-banner-content">
                    <div class="cookie-banner-header">
                        <div class="cookie-icon">🍪</div>
                        <h3>Cookie Preferences</h3>
                    </div>
                    <div class="cookie-banner-text">
                        <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                        By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or 
                        reject non-essential cookies.</p>
                        <p>Read our <a href="privacy-policy.html">Privacy Policy</a> and 
                        <a href="cookie-policy.html">Cookie Policy</a> for more information.</p>
                    </div>
                    <div class="cookie-banner-actions">
                        <button class="btn btn-accept-all" id="acceptAllCookies">Accept All</button>
                        <button class="btn btn-reject-all" id="rejectAllCookies">Reject Non-Essential</button>
                        <button class="btn btn-customize" id="customizeCookies">Customize Preferences</button>
                    </div>
                </div>
            `;
            document.body.appendChild(banner);
            this.banner = banner;

            // Add event listeners
            document.getElementById('acceptAllCookies').addEventListener('click', () => this.acceptAll());
            document.getElementById('rejectAllCookies').addEventListener('click', () => this.rejectAll());
            document.getElementById('customizeCookies').addEventListener('click', () => this.openModal());
        },

        createModal: function () {
            const modal = document.createElement('div');
            modal.id = 'cookieSettingsModal';
            modal.innerHTML = `
                <div class="cookie-settings-content">
                    <div class="cookie-settings-header">
                        <h2>Cookie Preferences</h2>
                        <button class="close-modal" id="closeModal">&times;</button>
                    </div>
                    <div class="cookie-categories">
                        ${this.generateCategorySettings()}
                    </div>
                    <div class="cookie-settings-actions">
                        <button class="btn btn-accept-all" id="modalAcceptAll">Accept All</button>
                        <button class="btn btn-primary" id="savePreferences">Save Preferences</button>
                        <button class="btn btn-reject-all" id="modalRejectAll">Reject Non-Essential</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            this.modal = modal;

            // Add event listeners
            document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
            document.getElementById('modalAcceptAll').addEventListener('click', () => {
                this.acceptAll();
                this.closeModal();
            });
            document.getElementById('modalRejectAll').addEventListener('click', () => {
                this.rejectAll();
                this.closeModal();
            });
            document.getElementById('savePreferences').addEventListener('click', () => this.savePreferences());

            // Close modal on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        },

        generateCategorySettings: function () {
            let html = '';
            Object.keys(COOKIE_CONFIG.categories).forEach(categoryKey => {
                const category = COOKIE_CONFIG.categories[categoryKey];
                const disabled = category.required ? 'disabled checked' : '';
                const checked = category.required ? 'checked' : '';

                html += `
                    <div class="cookie-category-setting">
                        <div class="cookie-category-header">
                            <h3>${category.name}</h3>
                            <label class="toggle-switch">
                                <input type="checkbox" 
                                       id="cookie-${categoryKey}" 
                                       ${disabled}
                                       data-category="${categoryKey}">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <p class="cookie-category-description">${category.description}</p>
                        ${category.required ? '<p class="cookie-note"><strong>Note:</strong> These cookies are essential and cannot be disabled.</p>' : ''}
                    </div>
                `;
            });
            return html;
        },

        openModal: function () {
            if (this.modal) {
                this.modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },

        closeModal: function () {
            if (this.modal) {
                this.modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        acceptAll: function () {
            const preferences = {};
            Object.keys(COOKIE_CONFIG.categories).forEach(category => {
                preferences[category] = true;
            });
            ConsentManager.setConsent(preferences);
            this.hideBanner();
        },

        rejectAll: function () {
            const preferences = {};
            Object.keys(COOKIE_CONFIG.categories).forEach(category => {
                preferences[category] = COOKIE_CONFIG.categories[category].required;
            });
            ConsentManager.setConsent(preferences);
            this.hideBanner();
        },

        savePreferences: function () {
            const preferences = {};
            Object.keys(COOKIE_CONFIG.categories).forEach(category => {
                const checkbox = document.getElementById(`cookie-${category}`);
                preferences[category] = checkbox ? checkbox.checked : false;
            });
            ConsentManager.setConsent(preferences);
            this.hideBanner();
            this.closeModal();
        },

        hideBanner: function () {
            if (this.banner) {
                this.banner.style.animation = 'slideDown 0.5s ease-out';
                setTimeout(() => {
                    this.banner.remove();
                }, 500);
            }
        }
    };

    // Global function to open cookie settings (called from cookie policy page)
    window.openCookieSettings = function () {
        if (!BannerManager.modal) {
            BannerManager.createModal();
        }

        // Load current preferences
        const consent = ConsentManager.getConsent();
        if (consent && consent.preferences) {
            Object.keys(consent.preferences).forEach(category => {
                const checkbox = document.getElementById(`cookie-${category}`);
                if (checkbox && !checkbox.disabled) {
                    checkbox.checked = consent.preferences[category];
                }
            });
        }

        BannerManager.openModal();
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => BannerManager.init());
    } else {
        BannerManager.init();
    }

    // Add slideDown animation for banner hiding
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

})();
