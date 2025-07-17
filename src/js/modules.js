// FC2 Dashboard - Modules
// Contains: Feature modules, data loading, and business logic

// Extend the app object with module functionality
Object.assign(app, {

    // ========================
    // DATA LOADING MODULES
    // ========================

    async loadMemberInfo() {
        // If this is called outside of initial load, refresh member data
        if (this.sessionInitialized) {
            const response = await this.apiCall('getMember', {
                scripts: '',
                bans: '',
                fc2t: '',
                achievements: '',
                beautify: ''
            });
            this.memberData = response;
            this.memberScripts = response.scripts || [];
            this.memberProjects = response.fc2t || [];
        }
        this.updateMemberInfoDisplay();
    },

    async refreshAchievements() {
        try {
            this.showMessage('Refreshing achievements...', 'info');
            
            const response = await this.apiCall('getMember', {
                achievements: '',
                beautify: ''
            });
            
            if (response && response.achievements) {
                // Update member data with new achievements
                if (this.memberData) {
                    this.memberData.achievements = response.achievements;
                }
                
                // Re-render achievements UI
                if (this.components && this.components.loadAchievements) {
                    await this.components.loadAchievements();
                }
                
                this.showMessage('Achievements refreshed', 'success');
            } else {
                this.showMessage('Failed to refresh achievements', 'error');
            }
        } catch (error) {
            console.error('Error refreshing achievements:', error);
            this.showMessage('Error refreshing achievements', 'error');
        }
    },

    showSettingsModal() {
        document.getElementById('settingsModal').classList.add('active');
        
        // Populate dropdowns when modal opens
        this.populateProtectionModeDropdown();
        this.populateLanguageDropdown();
    },

    closeSettingsModal() {
        document.getElementById('settingsModal').classList.remove('active');
    },

    async loadAllScripts() {
        // Only fetch if not part of initial load
        if (this.sessionInitialized) {
            const response = await this.apiCall('getAllScripts');
            this.allScripts = response;
        }
        
        this.displayMyScripts();
        this.displayAvailableScripts();
        this.populateScriptConfigSelect();

        // Apply default sorting
        setTimeout(() => {
            this.sortMyScripts();
            this.sortAvailableScripts();
        }, 100);
    },

    async loadAllProjects() {
        // Only fetch if not part of initial load  
        if (this.sessionInitialized) {
            const response = await this.apiCall('getFC2TProjects');
            this.allProjects = response;
        }

        this.displayMyProjects();
        this.displayAvailableProjects();

        // Apply default sorting
        setTimeout(() => {
            this.sortMyProjects();
            this.sortAvailableProjects();
        }, 100);
    },

    async loadOmegaInfo() {
        // Only fetch if not part of initial load
        if (this.sessionInitialized) {
            try {
                const response = await this.apiCall('getSoftware', { name: 'omega' });
                this.omegaVersion = response.version || 'Latest Version';
                this.omegaLastUpdate = response.elapsed || 'Recently';
            } catch (error) {
                console.log('Could not load Omega version info, using defaults');
            }
        }
        
        this.updateOmegaInfoDisplay();
    },

    // ========================
    // SCRIPT MANAGEMENT MODULE
    // ========================

    async toggleScript(scriptId, element) {
        try {
            await this.apiCall('toggleScriptStatus', {
                id: scriptId,
                needs_update: ''
            });
            element.classList.toggle('active');

            const isNowActive = element.classList.contains('active');
            this.showMessage(`Script ${isNowActive ? 'enabled' : 'disabled'}`, 'success');

            // Refresh member data
            const response = await this.apiCall('getMember', {
                scripts: '',
                beautify: ''
            });
            this.memberData = response;
            this.memberScripts = response.scripts || [];

            // Update displays
            this.displayMyScripts();
            this.populateScriptConfigSelect();

            // Update counts
            this.loadMemberInfo();

            // Apply current sorting
            setTimeout(() => {
                this.sortMyScripts();
            }, 100);

            // Update ALL toggle switches for this script ID
            document.querySelectorAll(`.toggle-switch[onclick*="toggleScript(${scriptId},"]`).forEach(toggle => {
                if (toggle !== element) {
                    if (isNowActive) {
                        toggle.classList.add('active');
                    } else {
                        toggle.classList.remove('active');
                    }
                }
            });

            // Update status text in ALL script cards for this script ID
            this.updateScriptCardStatus(scriptId, isNowActive);

        } catch (error) {
            console.error('Error toggling script:', error);
            element.classList.toggle('active'); // Revert on error
        }
    },

    async refreshScripts() {
        try {
            const response = await this.apiCall('getMember', {
                scripts: '',
                beautify: ''
            });
            this.memberData = response;
            this.memberScripts = response.scripts || [];

            this.displayMyScripts();
            await this.loadAllScripts();
            this.populateScriptConfigSelect();

            // Apply current sorting after refresh
            setTimeout(() => {
                this.sortMyScripts();
                this.sortAvailableScripts();
            }, 100);

            this.showMessage(`Scripts refreshed! (${this.memberScripts.length} active)`, 'success');
        } catch (error) {
            console.error('Error refreshing scripts:', error);
        }
    },

    updateScriptCardStatus(scriptId, isActive) {
        document.querySelectorAll(`.script-card`).forEach(card => {
            const toggleInCard = card.querySelector(`.toggle-switch[onclick*="toggleScript(${scriptId},"]`);
            if (toggleInCard) {
                const statusElement = card.querySelector('p');
                if (statusElement && statusElement.innerHTML.includes('<strong>Status:</strong>')) {
                    const statusText = statusElement.innerHTML;
                    const newStatusText = statusText.replace(
                        /<strong>Status:<\/strong> [^<]+/,
                        `<strong>Status:</strong> ${isActive ? '✅ Active' : '❌ Inactive'}`
                    );
                    statusElement.innerHTML = newStatusText;
                }
            }
        });
    },

    // ========================
    // PROJECT MANAGEMENT MODULE
    // ========================

    async toggleProject(projectId, element) {
        try {
            await this.apiCall('toggleProjectStatus', {
                id: projectId,
                needs_update: ''
            });
            element.classList.toggle('active');

            const isNowActive = element.classList.contains('active');
            this.showMessage(`Project ${isNowActive ? 'enabled' : 'disabled'}`, 'success');

            // Refresh member data
            const response = await this.apiCall('getMember', {
                fc2t: '',
                beautify: ''
            });
            this.memberData = response;
            this.memberProjects = response.fc2t || [];

            // Update displays
            this.displayMyProjects();

            // Update counts
            this.loadMemberInfo();

            // Apply current sorting
            setTimeout(() => {
                this.sortMyProjects();
            }, 100);

            // Update ALL toggle switches for this project ID
            document.querySelectorAll(`.toggle-switch[onclick*="toggleProject(${projectId},"]`).forEach(toggle => {
                if (toggle !== element) {
                    if (isNowActive) {
                        toggle.classList.add('active');
                    } else {
                        toggle.classList.remove('active');
                    }
                }
            });

            // Update status text in ALL project cards
            this.updateProjectCardStatus(projectId, isNowActive);

        } catch (error) {
            console.error('Error toggling project:', error);
            element.classList.toggle('active'); // Revert on error
        }
    },

    async refreshProjects() {
        try {
            const response = await this.apiCall('getMember', {
                fc2t: '',
                beautify: ''
            });
            this.memberData = response;
            this.memberProjects = response.fc2t || [];

            this.displayMyProjects();
            await this.loadAllProjects();

            // Apply current sorting after refresh
            setTimeout(() => {
                this.sortMyProjects();
                this.sortAvailableProjects();
            }, 100);

            this.showMessage(`Projects refreshed! (${this.memberProjects.length} active)`, 'success');
        } catch (error) {
            console.error('Error refreshing projects:', error);
        }
    },

    updateProjectCardStatus(projectId, isActive) {
        document.querySelectorAll(`.project-card`).forEach(card => {
            const toggleInCard = card.querySelector(`.toggle-switch[onclick*="toggleProject(${projectId},"]`);
            if (toggleInCard) {
                const statusElement = card.querySelector('p');
                if (statusElement && statusElement.innerHTML.includes('<strong>Status:</strong>')) {
                    const statusText = statusElement.innerHTML;
                    const newStatusText = statusText.replace(
                        /<strong>Status:<\/strong> [^<]+/,
                        `<strong>Status:</strong> ${isActive ? '✅ Active' : '❌ Inactive'}`
                    );
                    statusElement.innerHTML = newStatusText;
                }
            }
        });
    },

    jumpToScript(scriptId) {
        // Switch to scripts tab
        this.switchTab('scripts');

        // Update active tab visual
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector('.nav-tab[onclick*="scripts"]').classList.add('active');

        // Highlight the script card
        setTimeout(() => {
            const scriptCards = document.querySelectorAll('.script-card');
            scriptCards.forEach(card => {
                const scriptToggle = card.querySelector('.toggle-switch[onclick*="toggleScript"]');
                if (scriptToggle && scriptToggle.getAttribute('onclick').includes(`toggleScript(${scriptId},`)) {
                    card.style.border = '2px solid #4aff4a';
                    card.style.boxShadow = '0 0 20px rgba(74, 255, 74, 0.5)';
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        card.style.border = '';
                        card.style.boxShadow = '';
                    }, 3000);
                }
            });
        }, 100);

        this.showMessage(`Jumped to related script (ID: ${scriptId})`, 'success');
    },

    // ========================
    // CONFIGURATION MODULE
    // ========================

    async loadConfiguration() {
        try {
            console.log('Loading configuration from API...');
            const configText = await this.apiCall('getConfiguration');
            
            console.log('Raw config response:', configText);

            // Handle different types of empty/reset configurations
            let parsedConfig = {};
            
            if (!configText || configText === '' || configText === 'null' || configText === 'undefined') {
                parsedConfig = {};
            } else if (typeof configText === 'string') {
                try {
                    parsedConfig = JSON.parse(configText);
                } catch (parseError) {
                    console.error('Failed to parse configuration JSON:', parseError);
                    console.log('Using empty object due to parse error');
                    parsedConfig = {};
                }
            } else if (typeof configText === 'object' && configText !== null) {
                parsedConfig = configText;
            } else {
                console.log('Unknown configuration format, using empty object');
                parsedConfig = {};
            }

            // Update the current config
            this.currentConfig = parsedConfig;
            
            // Update the display with highlighting
            const configDisplay = document.getElementById('configDisplay');
            configDisplay.textContent = JSON.stringify(this.currentConfig, null, 2);
            this.highlightJSONEditor();

            // Setup event listeners for live editing
            this.setupJSONEditorFeatures();

            // Update software dropdown after loading configuration
            this.populateSoftwareDropdown();
            this.loadAutoSavePreference();


        } catch (error) {
            console.error('Error loading configuration:', error);
            
            // On API error, still use empty config
            this.currentConfig = {};
            
            // Update display with empty config and highlighting
            const configDisplay = document.getElementById('configDisplay');
            configDisplay.textContent = JSON.stringify(this.currentConfig, null, 2);
            configDisplay.className = 'json-editor hljs';
            hljs.highlightElement(configDisplay);
            
            this.populateSoftwareDropdown();
            this.loadAutoSavePreference();
            
            this.showMessage('Failed to load configuration. Using empty configuration.', 'error');
        }
    },

    async saveConfiguration(pushToOmega = false) {
        try {
            const configText = document.getElementById('configDisplay').textContent;

            try {
                JSON.parse(configText);
            } catch (e) {
                this.showMessage('Invalid JSON format', 'error');
                return;
            }

            // Use needs_update flag if pushing to Omega
            const params = pushToOmega ? {
                needs_update: ''
            } : {};

            await this.apiPost('setConfiguration', params, {
                value: configText
            });

            let message = 'Configuration saved successfully!';
            if (pushToOmega) {
                message += ' 🚀 Pushed to Omega!';
            }
            this.showMessage(message, 'success');

            // Update current config and software dropdown
            this.currentConfig = JSON.parse(configText);
            this.populateSoftwareDropdown();

        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    },

    async resetConfiguration() {
        if (!confirm('Are you sure you want to reset your configuration? This cannot be undone.')) {
            return;
        }

        try {
            await this.apiCall('resetConfiguration');
            this.showMessage('Configuration reset successfully!', 'success');
            await this.loadConfiguration();

        } catch (error) {
            console.error('Error resetting configuration:', error);
        }
    },

    formatJSON() {
        try {
            const configDisplay = document.getElementById('configDisplay');
            const configText = configDisplay.textContent;
            const parsed = JSON.parse(configText);
            const formatted = JSON.stringify(parsed, null, 2);
            
            configDisplay.textContent = formatted;
            
            // Apply JSON syntax highlighting
            configDisplay.textContent = formatted;
            this.highlightJSONEditor();

            // Update current config and software dropdown in case structure changed
            this.currentConfig = parsed;
            this.populateSoftwareDropdown();

            this.showMessage('JSON formatted and highlighted!', 'success');
        } catch (e) {
            this.showMessage('Invalid JSON format', 'error');
        }
    },

    // ========================
    // LANGUAGE MODULE
    // ========================

    async loadLanguages() {
        try {
            console.log('Loading translations to extract available languages...');
            const translations = await this.apiCall('getTranslations');

            console.log('Translations response received');

            // Extract all unique language codes from the translations
            const languageSet = new Set();

            if (typeof translations === 'object' && translations) {
                // Iterate through all translation entries
                Object.values(translations).forEach(translationEntry => {
                    if (typeof translationEntry === 'object' && translationEntry) {
                        // Get all language codes from this translation entry
                        Object.keys(translationEntry).forEach(langCode => {
                            languageSet.add(langCode);
                        });
                    }
                });
            }

            // Convert Set to object with display names
            this.availableLanguages = {};
            languageSet.forEach(langCode => {
                // Create nice display names
                const displayName = this.formatLanguageName(langCode);
                this.availableLanguages[langCode] = displayName;
            });


            this.populateLanguageDropdown();

        } catch (error) {
            console.error('Error loading languages:', error);

            // Fallback to basic language list
            this.availableLanguages = {
                'french': 'French',
                'chinese': 'Chinese',
                'spanish': 'Spanish',
                'russian': 'Russian',
                'dutch': 'Dutch',
                'polish': 'Polish',
                'turkish': 'Turkish',
                'german': 'German',
                'portuguese': 'Portuguese',
                'danish': 'Danish',
                'norwegian': 'Norwegian'
            };

            this.populateLanguageDropdown();
            this.showMessage('Using fallback language list - API may be unavailable', 'error');
        }
    },

    formatLanguageName(langCode) {
        // Create nice display names for language codes
        const languageNames = {
            'french': 'French (Français)',
            'chinese': 'Chinese (中文)',
            'spanish': 'Spanish (Español)',
            'russian': 'Russian (Русский)',
            'dutch': 'Dutch (Nederlands)',
            'polish': 'Polish (Polski)',
            'turkish': 'Turkish (Türkçe)',
            'german': 'German (Deutsch)',
            'portuguese': 'Portuguese (Português)',
            'danish': 'Danish (Dansk)',
            'norwegian': 'Norwegian (Norsk)',
            'italian': 'Italian (Italiano)',
            'japanese': 'Japanese (日本語)',
            'korean': 'Korean (한국어)',
            'arabic': 'Arabic (العربية)',
            'hebrew': 'Hebrew (עברית)',
            'hindi': 'Hindi (हिन्दी)',
            'thai': 'Thai (ไทย)',
            'vietnamese': 'Vietnamese (Tiếng Việt)',
            'finnish': 'Finnish (Suomi)',
            'swedish': 'Swedish (Svenska)',
            'czech': 'Czech (Čeština)',
            'hungarian': 'Hungarian (Magyar)',
            'romanian': 'Romanian (Română)',
            'bulgarian': 'Bulgarian (Български)',
            'croatian': 'Croatian (Hrvatski)',
            'slovak': 'Slovak (Slovenčina)',
            'slovenian': 'Slovenian (Slovenščina)',
            'estonian': 'Estonian (Eesti)',
            'latvian': 'Latvian (Latviešu)',
            'lithuanian': 'Lithuanian (Lietuvių)',
            'ukrainian': 'Ukrainian (Українська)',
            'belarusian': 'Belarusian (Беларуская)',
            'serbian': 'Serbian (Српски)',
            'macedonian': 'Macedonian (Македонски)',
            'albanian': 'Albanian (Shqip)',
            'greek': 'Greek (Ελληνικά)',
            'maltese': 'Maltese (Malti)',
            'irish': 'Irish (Gaeilge)',
            'welsh': 'Welsh (Cymraeg)',
            'scots': 'Scots Gaelic (Gàidhlig)',
            'basque': 'Basque (Euskera)',
            'catalan': 'Catalan (Català)'
        };

        // Return the fancy name if we have it, otherwise just capitalize the code
        return languageNames[langCode] || (langCode.charAt(0).toUpperCase() + langCode.slice(1));
    },

    populateLanguageDropdown() {
        // Try both the old config tab select and new settings modal select
        const configSelect = document.getElementById('languageSelect');
        const settingsSelect = document.getElementById('settingsLanguageSelect');
        
        // Get current language from member data if available
        const currentLang = this.memberData?.language || null;
        this.currentLanguage = currentLang || 'english';

        if (Object.keys(this.availableLanguages).length === 0) {
            const optionsHTML = '<option value="">No languages available</option>';
            if (configSelect) {
                configSelect.innerHTML = optionsHTML;
                configSelect.disabled = true;
            }
            if (settingsSelect) {
                settingsSelect.innerHTML = optionsHTML;
                settingsSelect.disabled = true;
            }
            return;
        }

        let optionsHTML = '<option value="">English (Default)</option>';

        // Sort languages alphabetically by display name
        const sortedLanguages = Object.entries(this.availableLanguages)
            .sort(([, a], [, b]) => a.localeCompare(b));

        sortedLanguages.forEach(([langCode, displayName]) => {
            const selected = langCode === currentLang ? 'selected' : '';
            optionsHTML += `<option value="${langCode}" ${selected}>${displayName}</option>`;
        });

        // Populate whichever selects exist
        if (configSelect) {
            configSelect.innerHTML = optionsHTML;
            configSelect.disabled = false;
        }
        if (settingsSelect) {
            settingsSelect.innerHTML = optionsHTML;
            settingsSelect.disabled = false;
        }

        // Update current language display in both places
        const configLangDisplay = document.getElementById('currentLanguageDisplay');
        const settingsLangDisplay = document.getElementById('settingsCurrentLanguageDisplay');
        
        const displayText = (currentLang && this.availableLanguages[currentLang]) 
            ? this.availableLanguages[currentLang] 
            : 'English (Default)';
            
        if (configLangDisplay) configLangDisplay.textContent = displayText;
        if (settingsLangDisplay) settingsLangDisplay.textContent = displayText;

        // Update language count display in both places
        const configCountDisplay = document.getElementById('languageCount');
        const settingsCountDisplay = document.getElementById('settingsLanguageCount');
        const count = Object.keys(this.availableLanguages).length;
        
        if (configCountDisplay) configCountDisplay.textContent = `${count}`;
        if (settingsCountDisplay) settingsCountDisplay.textContent = `${count}`;
    },

    async setLanguage() {
        const select = document.getElementById('languageSelect');
        if (!select) return;

        const languageCode = select.value;

        try {
            if (languageCode === '') {
                // Reset to English (omit lang parameter)
                await this.apiCall('setLanguage');
                this.currentLanguage = 'english';
                this.showMessage('Language reset to English', 'success');
            } else {
                // Set specific language
                await this.apiCall('setLanguage', {
                    lang: languageCode
                });
                this.currentLanguage = languageCode;

                const displayName = this.availableLanguages[languageCode] || languageCode;
                this.showMessage(`Language changed to ${displayName}`, 'success');
            }

            // Update member data
            if (this.memberData) {
                this.memberData.language = languageCode || null;
            }

        } catch (error) {
            console.error('Error setting language:', error);
            this.showMessage('Failed to change language', 'error');

            // Revert dropdown to previous value
            this.populateLanguageDropdown();
        }
    },

    // ========================
    // PROTECTION MODE MODULE
    // ========================

    populateProtectionModeDropdown() {
        // Try both the old config tab select and new settings modal select
        const configSelect = document.getElementById('protectionModeSelect');
        const settingsSelect = document.getElementById('settingsProtectionModeSelect');
        
        const currentProtection = this.memberData?.protection ?? 2; // Default to Kernel Mode

        let optionsHTML = '';
        Object.entries(this.protectionModes).forEach(([id, name]) => {
            const selected = parseInt(id) === currentProtection ? 'selected' : '';
            optionsHTML += `<option value="${id}" ${selected}>${name}</option>`;
        });

        // Populate whichever selects exist
        if (configSelect) configSelect.innerHTML = optionsHTML;
        if (settingsSelect) settingsSelect.innerHTML = optionsHTML;
    },

    async setProtectionMode() {
        // Try both selects
        const configSelect = document.getElementById('protectionModeSelect');
        const settingsSelect = document.getElementById('settingsProtectionModeSelect');
        
        const select = settingsSelect || configSelect;
        if (!select) return;

        const protectionMode = select.value;
        if (protectionMode === '') return;

        try {
            await this.apiCall('setProtection', {
                protection: protectionMode
            });

            const modeName = this.protectionModes[protectionMode];
            this.showMessage(`Protection mode set to: ${modeName}`, 'success');

            // Update member data
            if (this.memberData) {
                this.memberData.protection = parseInt(protectionMode);
            }

            // Update both selects to stay in sync
            if (configSelect) configSelect.value = protectionMode;
            if (settingsSelect) settingsSelect.value = protectionMode;

        } catch (error) {
            console.error('Error setting protection mode:', error);
            this.showMessage('Failed to set protection mode', 'error');

            // Revert both dropdowns to previous value
            this.populateProtectionModeDropdown();
        }
    },

    // ========================
    // ROLL SYSTEM MODULE
    // ========================

    async rollLoot() {
        const rollButton = document.getElementById('rollButton');

        // Check cooldown
        if (this.rollCooldown > 0) {
            this.showMessage(`Please wait ${this.rollCooldown} seconds before rolling again`, 'error');
            return;
        }

        // Disable button and show rolling animation
        rollButton.disabled = true;
        rollButton.classList.add('rolling');
        rollButton.textContent = '🎲 Rolling...';

        try {
            const result = await this.apiCall('rollLoot');

            // Show result in modal
            this.showRollResult(result);

            // Start 10-second cooldown
            this.startRollCooldown();

            // Update XP display if we got XP
            if (result.xp_gained) {
                // Refresh member data to get updated XP
                const memberResponse = await this.apiCall('getMember', {
                    beautify: ''
                });
                this.memberData = memberResponse;
                document.getElementById('userXP').textContent = this.memberData.xp.toLocaleString();
                this.loadMemberInfo(); // Update overview stats
            }

        } catch (error) {
            console.error('Roll error:', error);
            if (error.message.includes('cooldown')) {
                this.showMessage('Roll is on cooldown, please wait a moment', 'error');
                this.startRollCooldown(5); // Short cooldown if we hit the API cooldown
            }
        } finally {
            // Reset button after a short delay
            setTimeout(() => {
                rollButton.classList.remove('rolling');
                if (this.rollCooldown === 0) {
                    rollButton.disabled = false;
                    rollButton.textContent = '🎲 Roll Loot';
                }
            }, 1000);
        }
    },

    startRollCooldown(seconds = 10) {
        this.rollCooldown = seconds;
        const rollButton = document.getElementById('rollButton');

        const updateCooldown = () => {
            if (this.rollCooldown > 0) {
                rollButton.disabled = true;
                rollButton.textContent = `🎲 Wait ${this.rollCooldown}s`;
                this.rollCooldown--;
                setTimeout(updateCooldown, 1000);
            } else {
                rollButton.disabled = false;
                rollButton.textContent = '🎲 Roll Loot';
            }
        };

        updateCooldown();
    },

    showRollResult(result) {
        const modal = document.getElementById('rollResultModal');
        const content = document.getElementById('rollResultContent');

        let resultHTML = '';
        let displayMessage = '';

        if (typeof result === 'string') {
            displayMessage = result;
        } else if (typeof result === 'object' && result !== null) {
            // Extract the message from JSON response if available
            if (result.message) {
                displayMessage = result.message;
            } else if (result.xp_gained) {
                // Handle successful loot rolls with XP
                displayMessage = `You gained ${result.xp_gained} XP!`;
                if (result.item) {
                    displayMessage += `\n\nItem received: ${result.item}`;
                }
            } else {
                // Fallback to JSON if we can't extract a clean message
                displayMessage = JSON.stringify(result, null, 2);
            }
        } else {
            displayMessage = String(result);
        }

        // Style the message based on content
        if (displayMessage.toLowerCase().includes('cooldown') || displayMessage.toLowerCase().includes('once per')) {
            resultHTML = `<div class="roll-result-item" style="color: #ff8c00; border-left: 3px solid #ff8c00; padding-left: 15px;">⏰ ${displayMessage}</div>`;
        } else if (displayMessage.toLowerCase().includes('xp') || displayMessage.toLowerCase().includes('gained')) {
            resultHTML = `<div class="roll-result-item" style="color: #4aff4a; border-left: 3px solid #4aff4a; padding-left: 15px;">🎉 ${displayMessage}</div>`;
        } else {
            resultHTML = `<div class="roll-result-item">${displayMessage}</div>`;
        }

        content.innerHTML = resultHTML;
        modal.classList.add('active');
    },

    closeRollModal() {
        document.getElementById('rollResultModal').classList.remove('active');
    },

    // ========================
    // OMEGA MODULE
    // ========================

    // Session-based verification cache
    omegaVerified: false,

    showOmegaModal() {
        // Check if we're logged in OR if we've already verified this session
        if (this.apiKey || this.omegaVerified) {
            // User is logged in or already verified, show OS selection directly
            document.getElementById('omegaModal').classList.add('active');
        } else {
            // Not logged in and not verified, show verification modal
            document.getElementById('omegaVerificationModal').classList.add('active');
            // Focus on the input
            setTimeout(() => {
                document.getElementById('omegaVerificationKey').focus();
            }, 100);
        }
    },

    closeOmegaModal() {
        document.getElementById('omegaModal').classList.remove('active');
    },

    closeOmegaVerificationModal() {
        document.getElementById('omegaVerificationModal').classList.remove('active');
        document.getElementById('omegaVerificationKey').value = '';
    },

    async verifyAndDownloadOmega() {
        const keyInput = document.getElementById('omegaVerificationKey');
        const licenseKey = keyInput.value.trim();

        if (!licenseKey) {
            this.showMessage('Please enter your license key', 'error');
            return;
        }

        const verifyButton = document.querySelector('#omegaVerificationModal button');
        const originalText = verifyButton.textContent;
        verifyButton.disabled = true;
        verifyButton.textContent = '🔄 Verifying...';

        try {
            // Temporarily set the API key for verification
            const originalApiKey = this.apiKey;
            this.apiKey = licenseKey;
            
            try {
                // Make a simple API call to verify the key
                const result = await this.apiCall('getMember', { beautify: '' });
                
                // If we got a valid response, the key is valid
                if (result && result.username) {
                    this.omegaVerified = true; // Cache verification for this session
                    this.showMessage('✅ License key verified!', 'success');
                    
                    // Close verification modal and show OS selection
                    this.closeOmegaVerificationModal();
                    document.getElementById('omegaModal').classList.add('active');
                } else {
                    throw new Error('Invalid response from server');
                }
            } finally {
                // Restore the original API key (if any)
                this.apiKey = originalApiKey;
            }

        } catch (error) {
            console.error('Verification error:', error);
            if (error.message === 'INVALID_LICENSE_KEY' || error.message.includes('invalid license key')) {
                this.showMessage('❌ Invalid license key. Please check your key and try again.', 'error');
            } else if (error.message === 'HASH_MISMATCH') {
                this.showMessage('❌ Network change detected. Please use the login page instead.', 'error');
            } else {
                this.showMessage('❌ Verification failed. Please try again.', 'error');
            }
        } finally {
            verifyButton.disabled = false;
            verifyButton.textContent = originalText;
        }
    },

    downloadOmega(os) {
        const url = os === 'windows' ? 'https://constelia.ai/omega.bat' : 'https://constelia.ai/omega.sh';

        // Open in new tab (cross-origin downloads don't work)
        window.open(url, '_blank', 'noopener,noreferrer');

        this.showMessage(`Opening Omega for ${os === 'windows' ? 'Windows' : 'Linux'} in new tab...`, 'success');
        this.closeOmegaModal();
    },

    // ========================
    // TAB MANAGEMENT MODULE
    // ========================

    switchTab(tabName) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${tabName}-section`).classList.add('active');

        // Load data for specific tabs if needed
        if (tabName === 'perks' && this.allPerks.length === 0) {
            this.loadPerks();
        }

        if (tabName === 'config' && Object.keys(this.availableLanguages).length === 0) {
            this.loadLanguages();
        }

        if (tabName === 'builds' && this.allBuilds.length === 0) {
            this.loadBuilds();
        }

        if (tabName === 'sessions') {
            this.loadSessionInfo(); // Add this line
        }

        if (tabName === 'divinity') {
            this.loadDivinityChart();
        }

        if (tabName === 'achievements') {
            this.loadAchievements();
        }

        if (tabName === 'overview') {
            setTimeout(() => {
                const terminalInput = document.getElementById('terminalInput');
                if (terminalInput) {
                    terminalInput.focus({ preventScroll: true });
                }
            }, 100);
        }
    },

    // ========================
    // ADVANCED LOGIN MODULE
    // ========================

    toggleAdvanced() {
        const advancedSection = document.getElementById('advancedLogin');
        const advancedButton = document.querySelector('#loginSection button[onclick="app.toggleAdvanced()"]');

        if (advancedSection.style.display === 'none') {
            advancedSection.style.display = 'block';
            advancedButton.textContent = '⚙️ Hide Advanced';
            advancedButton.style.background = 'linear-gradient(135deg, #4a9eff, #357abd)';
        } else {
            advancedSection.style.display = 'none';
            advancedButton.textContent = '⚙️ Advanced';
            advancedButton.style.background = 'linear-gradient(135deg, #666, #555)';
        }
    },

    async wipeHandshake() {
        const keyInput = document.getElementById('wipeHandshakeKey');
        const licenseKey = keyInput.value.trim();

        if (!licenseKey) {
            this.showMessage('Please enter your license key to wipe handshake', 'error');
            keyInput.focus();
            return;
        }

        // Confirm the action
        if (!confirm('⚠️ Are you sure you want to wipe your handshake token?\n\nThis will:\n• Log you out from ALL devices\n• Clear your stored session\n• Require you to log in again\n\nThis action cannot be undone.')) {
            return;
        }

        const wipeButton = document.querySelector('button[onclick="app.wipeHandshake()"]');
        const originalText = wipeButton.textContent;

        try {
            // Disable button during operation
            wipeButton.disabled = true;
            wipeButton.textContent = '🔄 Wiping...';

            console.log('Attempting to wipe handshake with provided license key...');

            // Use the provided license key to call terminateHandshake
            const url = new URL('https://constelia.ai/api.php');
            url.searchParams.append('key', licenseKey);
            url.searchParams.append('cmd', 'terminateHandshake');

            const response = await fetch(url);
            const text = await response.text();

            // Parse the response
            const result = this.parseApiResponse(text);

            console.log('Handshake termination result:', result);

            // Clear stored handshake regardless of API result
            this.deleteHandshakeToken(); // FIXED: Use correct function name

            // Clear the input field
            keyInput.value = '';

            // If currently logged in, log out
            if (this.apiKey) {
                this.showMessage('🗑️ Handshake wiped successfully! You have been logged out from all devices.', 'success');

                // Force logout
                setTimeout(() => {
                    this.disconnect();
                }, 1500);
            } else {
                this.showMessage('🗑️ Handshake wiped successfully! All stored sessions have been cleared.', 'success');
            }

        } catch (error) {
            console.error('Error wiping handshake:', error);

            // Still clear local storage even if API call failed
            this.deleteHandshakeToken(); // FIXED: Use correct function name instead of this.deleteCookie
            keyInput.value = '';

            if (error.message.includes('invalid license key')) {
                this.showMessage('❌ Invalid license key. Local session cleared anyway.', 'error');
            } else if (error.message.includes('Failed to fetch')) {
                this.showMessage('⚠️ Network error, but local session has been cleared.', 'error');
            } else {
                this.showMessage(`⚠️ ${error.message} - Local session cleared anyway.`, 'error');
            }

            // If currently logged in, still log out since we cleared local storage
            if (this.apiKey) {
                setTimeout(() => {
                    this.disconnect();
                }, 2000);
            }

        } finally {
            // Re-enable button
            wipeButton.disabled = false;
            wipeButton.textContent = originalText;
        }
    },

    // ========================
    // SESSION MANAGEMENT MODULE  
    // ========================

    async loadSessionInfo() {
        try {
            // Load detailed member info with session data, history, bans, etc.
            const response = await this.apiCall('getMember', {
                scripts: '',
                bans: '',
                history: '',
                fc2t: '',
                xp: '',
                beautify: ''
            });
            
            this.memberData = response;
            this.memberScripts = response.scripts || [];
            this.memberProjects = response.fc2t || [];
            
            this.displayCurrentSessionInfo();
            this.displaySessionStats();
            this.displaySessionHistory();
            this.updatePersonalizedTerminal();
            
        } catch (error) {
            console.error('Error loading session info:', error);
            this.showMessage('Failed to load session information', 'error');
        }
    },

    displayCurrentSessionInfo() {
        const container = document.getElementById('currentSessionInfo');
        const session = this.memberData.session;
        const sessionHistory = this.memberData.session_history;
        
        if (!session) {
            container.innerHTML = '<p style="color: #888; text-align: center;">No active session information available</p>';
            return;
        }
        
        // Get the most recent session from history
        const recentSession = sessionHistory?.history?.[0];
        
        // Calculate session duration if we have start time
        let sessionDuration = 'Unknown';
        if (recentSession?.time_started) {
            const startTime = new Date(parseInt(recentSession.time_started) * 1000);
            const now = new Date();
            const durationMs = now - startTime;
            const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            
            if (days > 0) {
                sessionDuration = `${days}d ${hours}h ${minutes}m`;
            } else if (hours > 0) {
                sessionDuration = `${hours}h ${minutes}m`;
            } else {
                sessionDuration = `${minutes}m`;
            }
        }
        
        // Calculate expiration
        let expirationInfo = 'Unknown';
        if (recentSession?.time_expire) {
            const expireTime = new Date(parseInt(recentSession.time_expire) * 1000);
            const now = new Date();
            if (expireTime > now) {
                const remainingMs = expireTime - now;
                const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
                const remainingHours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                expirationInfo = `${remainingDays}d ${remainingHours}h remaining`;
            } else {
                expirationInfo = 'Expired';
            }
        }
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <div class="session-info-card">
                    <h4 style="color: #4a9eff; margin-bottom: 15px;">🖥️ Current Session</h4>
                    <div class="session-info-item">
                        <span class="session-label">Directory:</span>
                        <span class="session-value">${recentSession?.directory || session.directory || 'Not available'}</span>
                    </div>
                    <div class="session-info-item">
                        <span class="session-label">Duration:</span>
                        <span class="session-value">${sessionDuration}</span>
                    </div>
                    <div class="session-info-item">
                        <span class="session-label">Status:</span>
                        <span class="session-value" style="color: #4aff4a;">🟢 Active</span>
                    </div>
                    <div class="session-info-item">
                        <span class="session-label">Frozen:</span>
                        <span class="session-value" style="color: ${recentSession?.frozen === '1' ? '#ff6666' : '#4aff4a'};">
                            ${recentSession?.frozen === '1' ? '❄️ Yes' : '✅ No'}
                        </span>
                    </div>
                </div>
                
                <div class="session-info-card">
                    <h4 style="color: #4a9eff; margin-bottom: 15px;">🛡️ Security Info</h4>
                    <div class="session-info-item">
                        <span class="session-label">Protection:</span>
                        <span class="session-value">${this.protectionModes[this.memberData.protection] || 'Unknown'}</span>
                    </div>
                    <div class="session-info-item">
                        <span class="session-label">Hash Status:</span>
                        <span class="session-value" style="color: #4aff4a;">✅ Valid</span>
                    </div>
                    <div class="session-info-item">
                        <span class="session-label">Session Expires:</span>
                        <span class="session-value">${expirationInfo}</span>
                    </div>
                </div>
                
                ${recentSession?.humanizer_test ? `
                    <div class="session-info-card">
                        <h4 style="color: #4a9eff; margin-bottom: 15px;">🎯 Humanizer Test</h4>
                        ${this.displayHumanizerTest(recentSession.humanizer_test)}
                    </div>
                ` : ''}
            </div>
        `;
    },

    displayHumanizerTest(humanizerTestJson) {
        try {
            const test = JSON.parse(humanizerTestJson);
            const duration = ((test.end - test.start) / 1000).toFixed(1);
            const samples = test.times ? test.times.length : 0;
            
            return `
                <div class="session-info-item">
                    <span class="session-label">Test Duration:</span>
                    <span class="session-value">${duration}s</span>
                </div>
                <div class="session-info-item">
                    <span class="session-label">Samples:</span>
                    <span class="session-value">${samples}</span>
                </div>
                <div class="session-info-item">
                    <span class="session-label">Resolution:</span>
                    <span class="session-value">${test.screen_width}x${test.screen_height}</span>
                </div>
                <div class="session-info-item">
                    <span class="session-label">Status:</span>
                    <span class="session-value" style="color: #4aff4a;">✅ Passed</span>
                </div>
            `;
        } catch (e) {
            return `
                <div class="session-info-item">
                    <span class="session-label">Status:</span>
                    <span class="session-value" style="color: #4aff4a;">✅ Completed</span>
                </div>
            `;
        }
    },

    displaySessionStats() {
        const container = document.getElementById('sessionStats');
        const sessionHistory = this.memberData.session_history;
        
        if (!sessionHistory) {
            container.innerHTML = '<div class="spinner"></div>';
            return;
        }
        
        const totalSessions = sessionHistory.history?.length || 0;
        const successfulConnections = sessionHistory.success?.length || 0;
        const failedConnections = sessionHistory.failure?.length || 0;
        const totalConnections = successfulConnections + failedConnections;
        const successRate = totalConnections > 0 ? Math.round((successfulConnections / totalConnections) * 100) : 0;
        
        // Calculate recent activity (last 7 days)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const recentSessions = sessionHistory.history?.filter(h => 
            parseInt(h.time_started) * 1000 > sevenDaysAgo
        ).length || 0;
        
        // Get most recent software/version
        const recentSuccess = sessionHistory.success?.[0];
        const currentSoftware = recentSuccess ? `${recentSuccess.software} v${recentSuccess.version}` : 'Unknown';
        
        container.innerHTML = `
            <div class="stat-box">
                <div class="stat-label">Total Sessions</div>
                <div class="stat-value">${totalSessions}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Success Rate</div>
                <div class="stat-value" style="color: ${successRate >= 95 ? '#4aff4a' : successRate >= 80 ? '#ffcc00' : '#ff6666'}">${successRate}%</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Successful</div>
                <div class="stat-value" style="color: #4aff4a;">${successfulConnections}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Failed</div>
                <div class="stat-value" style="color: #ff6666;">${failedConnections}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Last 7 Days</div>
                <div class="stat-value">${recentSessions}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Current Software</div>
                <div class="stat-value" style="font-size: 14px; line-height: 1.2;">${currentSoftware}</div>
            </div>
        `;
    },

    displaySessionHistory() {
        const container = document.getElementById('sessionHistoryContainer');
        const sessionHistory = this.memberData.session_history;
        
        if (!sessionHistory || (!sessionHistory.success && !sessionHistory.failure)) {
            container.innerHTML = '<p style="color: #888; text-align: center; padding: 40px;">No session history available</p>';
            return;
        }
        
        // Combine success and failure arrays with timestamps for sorting
        const allEvents = [];
        
        // Add successful connections
        if (sessionHistory.success) {
            sessionHistory.success.forEach(event => {
                allEvents.push({
                    ...event,
                    type: 'success',
                    timestamp: parseInt(event.time)
                });
            });
        }
        
        // Add failed connections
        if (sessionHistory.failure) {
            sessionHistory.failure.forEach(event => {
                allEvents.push({
                    ...event,
                    type: 'failure',
                    timestamp: parseInt(event.time_attempt)
                });
            });
        }
        
        // Sort by timestamp (most recent first)
        allEvents.sort((a, b) => b.timestamp - a.timestamp);
        
        // Show last 15 events by default
        const displayEvents = allEvents.slice(0, 5);
        
        container.innerHTML = `
            <div style="margin-bottom: 20px; color: #aaa; font-size: 14px;">
                Showing ${displayEvents.length} of ${allEvents.length} total connection attempts
            </div>
            <div class="session-history-list">
                ${displayEvents.map(event => {
                    const isSuccess = event.type === 'success';
                    const timeStr = new Date(event.timestamp * 1000).toLocaleString();
                    
                    return `
                        <div class="session-history-item ${isSuccess ? 'success' : 'failure'}">
                            <div class="session-history-header">
                                <div class="session-status">
                                    ${isSuccess ? '✅ Connection Success' : '❌ Connection Failed'}
                                </div>
                                <div class="session-time">${timeStr}</div>
                            </div>
                            <div class="session-details">
                                ${event.software ? `<span class="session-detail">🖥️ ${event.software} v${event.version}</span>` : ''}
                                ${event.solution ? `<span class="session-detail">🖥️ ${event.solution} v${event.version}</span>` : ''}
                                ${event.directory ? `<span class="session-detail">📁 ${event.directory}</span>` : ''}
                                ${event.reason ? `<span class="session-detail session-error">⚠️ ${event.reason}</span>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            ${allEvents.length > 15 ? `
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn btn-small" onclick="app.showAllSessionHistory()">
                        📊 Show All ${allEvents.length} Connection Attempts
                    </button>
                </div>
            ` : ''}
        `;
    },

    showAllSessionHistory() {
        const container = document.getElementById('sessionHistoryContainer');
        const sessionHistory = this.memberData.session_history;
        
        // Combine and sort all events (same logic as above)
        const allEvents = [];
        
        if (sessionHistory.success) {
            sessionHistory.success.forEach(event => {
                allEvents.push({
                    ...event,
                    type: 'success',
                    timestamp: parseInt(event.time)
                });
            });
        }
        
        if (sessionHistory.failure) {
            sessionHistory.failure.forEach(event => {
                allEvents.push({
                    ...event,
                    type: 'failure',
                    timestamp: parseInt(event.time_attempt)
                });
            });
        }
        
        allEvents.sort((a, b) => b.timestamp - a.timestamp);
        
        container.innerHTML = `
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color: #aaa; font-size: 14px;">
                    Showing all ${allEvents.length} connection attempts
                </div>
                <button class="btn btn-small" onclick="app.displaySessionHistory()">
                    📋 Show Recent Only
                </button>
            </div>
            <div class="session-history-list" style="max-height: 500px; overflow-y: auto;">
                ${allEvents.map(event => {
                    const isSuccess = event.type === 'success';
                    const timeStr = new Date(event.timestamp * 1000).toLocaleString();
                    
                    return `
                        <div class="session-history-item ${isSuccess ? 'success' : 'failure'}" style="margin-bottom: 8px;">
                            <div class="session-history-header">
                                <div class="session-status">
                                    ${isSuccess ? '✅ Connection Success' : '❌ Connection Failed'}
                                </div>
                                <div class="session-time">${timeStr}</div>
                            </div>
                            <div class="session-details">
                                ${event.software ? `<span class="session-detail">🖥️ ${event.software} v${event.version}</span>` : ''}
                                ${event.solution ? `<span class="session-detail">🖥️ ${event.solution} v${event.version}</span>` : ''}
                                ${event.directory ? `<span class="session-detail">📁 ${event.directory}</span>` : ''}
                                ${event.reason ? `<span class="session-detail session-error">⚠️ ${event.reason}</span>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    async refreshSessionHistory() {
        try {
            await this.loadSessionInfo();
            this.showMessage('Session history refreshed!', 'success');
        } catch (error) {
            console.error('Error refreshing session history:', error);
            this.showMessage('Failed to refresh session history', 'error');
        }
    },

    async loadSessionHistory(detailed = false) {
        try {
            const flags = {
                scripts: '',
                history: '',
                beautify: ''
            };
            
            if (detailed) {
                // Add more flags for detailed info
                flags.bans = '';
                flags.xp = '';
                flags.rolls = '';
                flags.hashes = '';
            }
            
            const response = await this.apiCall('getMember', flags);
            this.memberData = response;
            
            this.displaySessionHistory();
            this.displaySessionStats();
            this.displayCurrentSessionInfo();
            
            if (detailed) {
                this.displayDetailedSecurityInfo();
                this.displayAccountActivity();
            }
            
            this.showMessage(detailed ? 'Detailed security & activity data loaded!' : 'Session history loaded!', 'success');
        } catch (error) {
            console.error('Error loading session history:', error);
            this.showMessage('Failed to load session history', 'error');
        }
    },

    displayDetailedSecurityInfo() {
        // Check if we already have a detailed security section
        let container = document.getElementById('detailedSecurityContainer');
        if (!container) {
            // Create new section after session stats
            const statsCard = document.querySelector('#sessions-section .card:nth-child(2)');
            const newCard = document.createElement('div');
            newCard.className = 'card';
            newCard.innerHTML = `
                <h2>🛡️ Security & Account Overview</h2>
                <div id="detailedSecurityContainer"></div>
            `;
            statsCard.insertAdjacentElement('afterend', newCard);
            container = document.getElementById('detailedSecurityContainer');
        }
        
        const steam = this.memberData.steam || {};
        const hashes = this.memberData.hashes || [];
        const steamAccounts = Object.values(steam);
        
        // Calculate security metrics
        const totalAccounts = steamAccounts.length;
        const cleanAccounts = steamAccounts.filter(acc => acc.clean).length;
        const vacBannedAccounts = steamAccounts.filter(acc => acc.vac_banned).length;
        const untrustedAccounts = steamAccounts.filter(acc => acc.untrusted).length;
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <!-- Security Summary -->
                <div class="security-info-card">
                    <h4 style="color: #4a9eff; margin-bottom: 15px;">📊 Security Summary</h4>
                    <div class="security-info-item">
                        <span class="security-label">Total Steam Accounts:</span>
                        <span class="security-value">${totalAccounts}</span>
                    </div>
                    <div class="security-info-item">
                        <span class="security-label">Clean Accounts:</span>
                        <span class="security-value" style="color: #4aff4a;">${cleanAccounts}</span>
                    </div>
                    <div class="security-info-item">
                        <span class="security-label">VAC Banned:</span>
                        <span class="security-value" style="color: ${vacBannedAccounts > 0 ? '#ff6666' : '#4aff4a'};">${vacBannedAccounts}</span>
                    </div>
                    <div class="security-info-item">
                        <span class="security-label">Untrusted:</span>
                        <span class="security-value" style="color: ${untrustedAccounts > 0 ? '#ff6666' : '#4aff4a'};">${untrustedAccounts}</span>
                    </div>
                    <div class="security-info-item">
                        <span class="security-label">Hash Records:</span>
                        <span class="security-value">${hashes.length}</span>
                    </div>
                </div>
                
                <!-- Steam Accounts Detail -->
                <div class="security-info-card">
                    <h4 style="color: #4a9eff; margin-bottom: 15px;">🎮 Steam Accounts</h4>
                    ${steamAccounts.length > 0 ? steamAccounts.map(account => `
                        <div class="steam-account-item ${account.clean ? 'clean' : 'flagged'}">
                            <div class="steam-account-header">
                                <span class="steam-persona">${account.persona}</span>
                                <span class="steam-status ${account.clean ? 'clean' : 'flagged'}">
                                    ${account.clean ? '✅' : (account.vac_banned ? '🚫' : '⚠️')}
                                </span>
                            </div>
                            <div class="steam-account-details">
                                <span class="steam-detail">👤 ${account.name}</span>
                                <span class="steam-detail">🆔 ${account.id}</span>
                                ${account.vac_banned ? `<span class="steam-detail steam-ban">🚫 VAC: ${account.days_since_last_ban} days ago</span>` : ''}
                                ${account.untrusted ? `<span class="steam-detail steam-ban">⚠️ Untrusted</span>` : ''}
                            </div>
                        </div>
                    `).join('') : '<p style="color: #888; font-style: italic;">No Steam accounts linked</p>'}
                </div>
                
                <!-- Hash History -->
                <div class="security-info-card">
                    <h4 style="color: #4a9eff; margin-bottom: 15px;">🔐 Hash Verification</h4>
                    ${hashes.length > 0 ? `
                        <div style="margin-bottom: 10px; color: #4aff4a; font-size: 14px;">
                            ✅ ${hashes.length} hash record${hashes.length !== 1 ? 's' : ''} on file
                        </div>
                        <div class="hash-list">
                            ${hashes.slice(0, 3).map(hash => `
                                <div class="hash-item">
                                    <code style="font-size: 11px; color: #888; word-break: break-all;">
                                        ${hash.substring(0, 16)}...${hash.substring(hash.length - 16)}
                                    </code>
                                </div>
                            `).join('')}
                            ${hashes.length > 3 ? `<div style="color: #888; font-size: 12px; text-align: center; margin-top: 8px;">... and ${hashes.length - 3} more</div>` : ''}
                        </div>
                    ` : '<p style="color: #888; font-style: italic;">No hash history available</p>'}
                </div>
            </div>
        `;
    },

    displayAccountActivity() {
        // Check if we already have an activity section
        let container = document.getElementById('accountActivityContainer');
        if (!container) {
            // Create new section
            const securityCard = document.querySelector('#detailedSecurityContainer').closest('.card');
            const newCard = document.createElement('div');
            newCard.className = 'card';
            newCard.innerHTML = `
                <h2>📈 Recent Account Activity</h2>
                <div id="accountActivityContainer"></div>
            `;
            securityCard.insertAdjacentElement('afterend', newCard);
            container = document.getElementById('accountActivityContainer');
        }
        
        const xpHistory = this.memberData.xp_history || [];
        const rolls = this.memberData.rolls || [];
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">
                <!-- XP History -->
                <div class="activity-info-card">
                    <h4 style="color: #4a9eff; margin-bottom: 15px;">💎 Recent XP Transactions</h4>
                    ${xpHistory.length > 0 ? `
                        <div class="activity-list">
                            ${xpHistory.slice(0, 10).map(xp => {
                                const timeStr = new Date(xp.time * 1000).toLocaleString();
                                const isGain = xp.amount > 0;
                                return `
                                    <div class="activity-item">
                                        <div class="activity-header">
                                            <span class="activity-type" style="color: ${isGain ? '#4aff4a' : '#ff6666'};">
                                                ${isGain ? '+' : ''}${xp.amount.toLocaleString()} XP
                                            </span>
                                            <span class="activity-time">${timeStr}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        ${xpHistory.length > 10 ? `
                            <div style="text-align: center; margin-top: 15px; color: #888; font-size: 12px;">
                                ... and ${xpHistory.length - 10} more transactions
                            </div>
                        ` : ''}
                    ` : '<p style="color: #888; font-style: italic;">No recent XP transactions</p>'}
                </div>
                
                <!-- Loot Roll History -->
                <div class="activity-info-card">
                    <h4 style="color: #4a9eff; margin-bottom: 15px;">🎲 Recent Loot Rolls</h4>
                    ${rolls.length > 0 ? `
                        <div class="activity-list">
                            ${rolls.slice(0, 10).map(roll => {
                                const outcomeColor = roll.outcome === 'XP' ? '#4aff4a' : 
                                                    roll.outcome === 'Supernova' ? '#ff6b35' : '#4a9eff';
                                return `
                                    <div class="activity-item">
                                        <div class="activity-header">
                                            <span class="activity-type" style="color: ${outcomeColor};">
                                                ${roll.outcome}${roll.amount > 0 ? ` (+${roll.amount})` : ''}
                                            </span>
                                            <span class="activity-time">${roll.elapsed}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        ${rolls.length > 10 ? `
                            <div style="text-align: center; margin-top: 15px; color: #888; font-size: 12px;">
                                ... and ${rolls.length - 10} more rolls
                            </div>
                        ` : ''}
                    ` : '<p style="color: #888; font-style: italic;">No recent loot rolls</p>'}
                </div>
            </div>
        `;
    },

    updatePersonalizedTerminal() {
        const username = this.memberData?.username || 'member';
        const terminalPrompt = document.getElementById('terminalPrompt');
        const terminalTitle = document.getElementById('terminalTitle');
        const terminalWelcome = document.getElementById('terminalWelcome');
        
        if (terminalPrompt) {
            terminalPrompt.textContent = `${username}@constelia:~$`;
        }
        
        if (terminalTitle) {
            terminalTitle.textContent = `${username}'s Member Panel`;
        }
        
        if (terminalWelcome && this.memberData) {
            terminalWelcome.innerHTML = `
                <div style="color: #4a9eff; font-weight: bold;">${username}'s Member Panel</div>
                <div style="color: #888; font-size: 14px;">Level ${this.memberData.level} • ${this.memberData.xp.toLocaleString()} XP • Type 'help' for commands</div>
            `;
        }
    },

    toggleCaching() {
        this.cachingEnabled = !this.cachingEnabled;
        this.saveCachingPreference();

        const toggle = document.getElementById('cachingToggle');
        const status = document.getElementById('cachingStatus');

        if (toggle) {
            if (this.cachingEnabled) {
                toggle.classList.add('active');
                if (status) {
                    status.textContent = 'Enabled';
                    status.style.color = '#4aff4a';
                }
                this.showMessage('💾 Data caching enabled', 'success');
            } else {
                toggle.classList.remove('active');
                if (status) {
                    status.textContent = 'Disabled';
                    status.style.color = '#ff6666';
                }
                this.showMessage('🔄 Data caching disabled - fresh data only', 'success');
            }
        }
    },

    highlightJSONEditor() {
        const jsonEditor = document.getElementById('configDisplay');
        if (!jsonEditor) return;
        
        
        // Get the plain text content
        const content = jsonEditor.textContent;
        
        // Don't highlight empty content
        if (!content || content.trim() === '') {
            return;
        }
        
        // Check if the JSON editor currently has focus
        const hadFocus = document.activeElement === jsonEditor;
        
        // Store cursor position only if JSON editor has focus
        let cursorOffset = 0;
        const selection = window.getSelection();
        
        try {
            if (hadFocus && selection.rangeCount > 0 && jsonEditor.contains(selection.anchorNode)) {
                cursorOffset = this.getJSONCaretPosition(jsonEditor);
            }
        } catch (e) {
            console.warn('Could not get JSON cursor position:', e);
        }
        
        // Validate JSON first
        try {
            JSON.parse(content);
        } catch (e) {
            // If JSON is invalid, don't highlight (but don't break either)
            return;
        }
        
        // Create a temporary element to highlight
        const tempDiv = document.createElement('div');
        tempDiv.textContent = content;
        tempDiv.className = 'hljs';
        tempDiv.setAttribute('data-language', 'json');
        
        // Highlight the temporary element
        hljs.highlightElement(tempDiv);
        
        // Replace content with highlighted version
        jsonEditor.innerHTML = tempDiv.innerHTML;
        jsonEditor.className = 'json-editor hljs';
        
        // Only restore cursor position if the JSON editor had focus originally
        if (hadFocus) {
            setTimeout(() => {
                try {
                    this.setJSONCaretPosition(jsonEditor, cursorOffset);
                } catch (e) {
                    console.warn('Could not restore JSON cursor position:', e);
                    // Only focus if it originally had focus and restoration failed
                    if (document.activeElement !== jsonEditor) {
                        jsonEditor.focus();
                    }
                }
            }, 10);
        }
        
    },

    getJSONCaretPosition(element) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return 0;
        
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    },

    setJSONCaretPosition(element, offset) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let currentOffset = 0;
        let node;
        
        while (node = walker.nextNode()) {
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= offset) {
                const range = document.createRange();
                const selection = window.getSelection();
                const targetOffset = offset - currentOffset;
                range.setStart(node, Math.min(targetOffset, nodeLength));
                range.setEnd(node, Math.min(targetOffset, nodeLength));
                selection.removeAllRanges();
                selection.addRange(range);
                return;
            }
            currentOffset += nodeLength;
        }
        
        element.focus();
    },

    setupJSONEditorFeatures() {
        const jsonEditor = document.getElementById('configDisplay');
        if (!jsonEditor) return;
        
        // Remove any existing listeners to avoid duplicates
        if (this.jsonEditorListenersAttached) {
            return; // Already attached
        }
        
        // Simple input handler - highlight after typing stops
        let typingTimer;
        
        jsonEditor.addEventListener('input', () => {
            // Clear the previous timer
            clearTimeout(typingTimer);
            
            // Set a new timer - highlight after 800ms of no typing
            typingTimer = setTimeout(() => {
                this.highlightJSONEditor();
            }, 800);
        });

        // Highlight immediately when clicking away
        jsonEditor.addEventListener('blur', () => {
            clearTimeout(typingTimer);
            this.highlightJSONEditor();
        });

        // Tab key support
        jsonEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertText', false, '  '); // 2 spaces for JSON
            }
        });
        
        // Mark listeners as attached
        this.jsonEditorListenersAttached = true;
        
    },
});