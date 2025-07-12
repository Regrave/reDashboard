// FC2 Dashboard - Modules
// Contains: Feature modules, data loading, and business logic

// Extend the app object with module functionality
Object.assign(app, {

    // ========================
    // DATA LOADING MODULES
    // ========================

    async loadMemberInfo() {
        const memberStatsEl = document.getElementById('memberStats');

        memberStatsEl.innerHTML = `
            <div class="stat-box">
                <div class="stat-label">Username</div>
                <div class="stat-value">${this.memberData.username}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Level</div>
                <div class="stat-value">${this.memberData.level}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">XP</div>
                <div class="stat-value">${this.memberData.xp.toLocaleString()}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Posts</div>
                <div class="stat-value">${this.memberData.posts || 0}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Score</div>
                <div class="stat-value">${this.memberData.score || 0}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Active Scripts</div>
                <div class="stat-value">${this.memberScripts.length}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Active Projects</div>
                <div class="stat-value">${this.memberProjects.length}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Protection Mode</div>
                <div class="stat-value">${this.protectionModes[this.memberData.protection] || 'Unknown'}</div>
            </div>
        `;

        // Populate protection mode dropdown
        this.populateProtectionModeDropdown();
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
        try {
            const response = await this.apiCall('getAllScripts');
            this.allScripts = response;

            this.displayMyScripts();
            this.displayAvailableScripts();
            this.populateScriptConfigSelect();

            // Apply default sorting (recently updated)
            setTimeout(() => {
                this.sortMyScripts();
                this.sortAvailableScripts();
            }, 100);

        } catch (error) {
            console.error('Error loading scripts:', error);
        }
    },

    async loadAllProjects() {
        try {
            const response = await this.apiCall('getFC2TProjects');
            this.allProjects = response;

            this.displayMyProjects();
            this.displayAvailableProjects();

            // Apply default sorting (recently updated)
            setTimeout(() => {
                this.sortMyProjects();
                this.sortAvailableProjects();
            }, 100);

        } catch (error) {
            console.error('Error loading projects:', error);
        }
    },

    async loadOmegaInfo() {
        try {
            // Try to get Omega version info
            const response = await this.apiCall('getSoftware', {
                name: 'omega'
            });
            this.omegaVersion = response.version || 'Latest Version';
            this.omegaLastUpdate = response.elapsed || 'Recently';

            document.getElementById('omegaInfo').innerHTML = `
                ${this.omegaVersion} • Last Updated: ${this.omegaLastUpdate}
            `;
        } catch (error) {
            // If omega software info isn't available, keep default text
            console.log('Could not load Omega version info, using defaults');
        }
    },

    // ========================
    // SCRIPT MANAGEMENT MODULE
    // ========================

    async toggleScript(scriptId, element) {
        try {
            await this.apiCall('toggleScriptStatus', {
                id: scriptId
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
                id: projectId
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
                // Configuration is truly empty/reset
                console.log('Configuration is empty/reset, using empty object');
                parsedConfig = {};
            } else if (typeof configText === 'string') {
                try {
                    parsedConfig = JSON.parse(configText);
                    console.log('Successfully parsed configuration JSON');
                } catch (parseError) {
                    console.error('Failed to parse configuration JSON:', parseError);
                    console.log('Using empty object due to parse error');
                    parsedConfig = {};
                }
            } else if (typeof configText === 'object' && configText !== null) {
                // Already an object
                parsedConfig = configText;
                console.log('Configuration is already an object');
            } else {
                console.log('Unknown configuration format, using empty object');
                parsedConfig = {};
            }

            // Update the current config (don't fall back to cached member data)
            this.currentConfig = parsedConfig;
            
            // Update the display
            document.getElementById('configDisplay').textContent = JSON.stringify(this.currentConfig, null, 2);

            // Update software dropdown after loading configuration
            this.populateSoftwareDropdown();

            // Load auto-save preference to update toggle state
            this.loadAutoSavePreference();

            console.log('Configuration loaded successfully:', this.currentConfig);

        } catch (error) {
            console.error('Error loading configuration:', error);
            
            // On API error, still use empty config instead of stale cache
            console.log('API error occurred, using empty configuration');
            this.currentConfig = {};
            
            // Update display with empty config
            document.getElementById('configDisplay').textContent = JSON.stringify(this.currentConfig, null, 2);
            this.populateSoftwareDropdown();
            this.loadAutoSavePreference();
            
            // Show user-friendly error message
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
            const configText = document.getElementById('configDisplay').textContent;
            const parsed = JSON.parse(configText);
            document.getElementById('configDisplay').textContent = JSON.stringify(parsed, null, 2);

            // Update current config and software dropdown in case structure changed
            this.currentConfig = parsed;
            this.populateSoftwareDropdown();

            this.showMessage('JSON formatted!', 'success');
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

            console.log('Extracted languages:', Object.keys(this.availableLanguages));
            console.log('Available languages:', this.availableLanguages);

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

    showOmegaModal() {
        document.getElementById('omegaModal').classList.add('active');
    },

    closeOmegaModal() {
        document.getElementById('omegaModal').classList.remove('active');
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
            this.deleteHandshakeToken(); // Updated function call

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
            this.deleteCookie('fc2_handshake');
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
});