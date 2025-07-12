// FC2 Dashboard - Core Module
// Contains: App foundation, API communication, authentication, and core utilities

// Main application object
const app = {
    // ========================
    // APPLICATION STATE
    // ========================
    apiKey: '',
    memberData: null,
    memberScripts: [],
    allScripts: [],
    memberProjects: [],
    allProjects: [],
    omegaVersion: 'Latest Version',
    omegaLastUpdate: 'Recently',
    currentConfig: {},
    currentScriptConfig: {},
    configMetadataCache: {},
    currentScriptKey: '',
    
    // Filters and language state
    availableFilters: {
        author: new Set(),
        software: new Set(),
        category: new Set()
    },
    availableProjectFilters: {
        author: new Set()
    },
    availableLanguages: {},
    currentLanguage: 'english',
    
    // Build system state
    allBuilds: [],
    myBuilds: [],
    availableBuildFilters: {
        author: new Set()
    },
    currentBuildToApply: null,
    
    // Perk system state
    allPerks: [],
    ownedPerks: [],
    venusStatus: null,
    
    // UI state
    rollCooldown: 0,
    autoSaveEnabled: false,
    autoSaveTimeout: null,
    liveOmegaEnabled: false,
    
    // Script editor state
    currentEditingScript: null,
    scriptEditorDraftTimeout: null,
    availableCategories: {
        0: 'Hub', 1: 'GUI', 2: 'CLI', 3: 'Humanizer Add-On', 4: 'Humanizer Alternative',
        5: 'Dependency / Library', 6: 'Core Script', 7: 'ESP', 8: 'ESP (No Drawing)',
        9: 'Parallax2 Exclusive', 10: 'Parallactic2 Exclusive', 11: 'Aurora2 Exclusive',
        12: 'Quality of Life', 13: 'Source Engine Exclusive', 14: 'Blender Exclusive',
        15: 'Configuration Management', 16: 'Alternative Cheating Software', 17: 'Constelia',
        18: 'Overlay Alternatives', 19: 'Utility', 20: 'Legacy (Never Updated)',
        21: 'CS2', 22: 'TF2', 23: 'CSS', 24: 'L4D2', 25: 'FC2T',
        26: 'Windows Only', 27: 'Linux Only', 28: 'Aurora2 Supported'
    },
    
    // Protection modes
    protectionModes: {
        0: 'Standard (usermode)',
        1: 'IPC/Zombie',
        2: 'Kernel Mode Protection (default)',
        3: 'Minimum (Usermode)',
        4: 'Minimum (Kernel)',
        5: 'Rootlink'
    },

    // ========================
    // API COMMUNICATION
    // ========================
    
    parseApiResponse(responseText) {
        // Check for common error messages first
        if (typeof responseText === 'string') {
            if (responseText.includes('You are not logged into the Member\'s Panel')) {
                throw new Error('You are not logged into the Member\'s Panel. Please log into the forums first.');
            }
            if (responseText.includes('invalid license key')) {
                throw new Error('Invalid license key');
            }
            if (responseText.includes('authorization denied')) {
                throw new Error('Authorization denied by server');
            }
            if (responseText.includes('enable 2-step')) {
                throw new Error('Two-step authorization must be enabled on your forum account');
            }
            if (responseText.includes('not an active Session')) {
                throw new Error('No active session found - please log into the forums');
            }
            if (responseText.includes('handshake expired')) {
                throw new Error('Session expired - please log in again');
            }
            if (responseText.includes('handshake invalid')) {
                throw new Error('Invalid session token');
            }
            if (responseText.includes('24 hours')) {
                throw new Error('Handshake system locked for 24 hours');
            }
        }

        let jsonData;

        if (responseText.includes('<pre>')) {
            const match = responseText.match(/<pre>([\s\S]*?)<\/pre>/);
            if (match && match[1]) {
                try {
                    jsonData = JSON.parse(match[1]);
                } catch (e) {
                    throw new Error('Failed to parse JSON from HTML wrapper');
                }
            } else {
                throw new Error('Could not extract JSON from response');
            }
        } else {
            try {
                jsonData = JSON.parse(responseText);
            } catch (e) {
                return responseText; // Raw response (like configuration)
            }
        }

        // For handshake responses, return the full object including status
        if (jsonData && jsonData.status !== undefined) {
            return jsonData;
        }

        // For regular API responses
        if (jsonData && jsonData.code && jsonData.code !== 200) {
            throw new Error(jsonData.message || 'API request failed');
        }

        return jsonData.message || jsonData;
    },

    async apiCall(cmd, params = {}) {
        const url = new URL('https://constelia.ai/api.php');
        url.searchParams.append('key', this.apiKey);
        url.searchParams.append('cmd', cmd);

        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined) {
                url.searchParams.append(key, value === '' ? '' : value);
            }
        }

        try {
            const response = await fetch(url);
            const text = await response.text();

            // Check for specific error messages
            if (text.includes('You are not logged into the Member\'s Panel')) {
                throw new Error('You are not logged into the Member\'s Panel. Please log into the forums at constelia.ai first, then try again.');
            } else if (text.includes('invalid license key')) {
                throw new Error('Invalid license key');
            } else if (text.includes('authorization denied')) {
                throw new Error('Authorization denied by server');
            } else if (text.includes('enable 2-step')) {
                throw new Error('Two-step authorization must be enabled on your forum account');
            } else if (text.includes('not an active Session')) {
                throw new Error('No active session found - please log into the forums');
            }

            return this.parseApiResponse(text);

        } catch (error) {
            this.showMessage(`API Error: ${error.message}`, 'error');
            throw error;
        }
    },

    async apiPost(cmd, params = {}, body = {}) {
        const url = new URL('https://constelia.ai/api.php');
        url.searchParams.append('key', this.apiKey);
        url.searchParams.append('cmd', cmd);

        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined) {
                url.searchParams.append(key, value);
            }
        }

        const formData = new FormData();
        for (const [key, value] of Object.entries(body)) {
            formData.append(key, value);
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            const text = await response.text();
            return this.parseApiResponse(text);

        } catch (error) {
            this.showMessage(`API Error: ${error.message}`, 'error');
            throw error;
        }
    },

    // ========================
    // AUTHENTICATION & HANDSHAKE SYSTEM
    // ========================
    
    async authorizeHandshake(licenseKey) {
        const url = new URL('https://constelia.ai/api.php');
        url.searchParams.append('key', licenseKey);
        url.searchParams.append('cmd', 'authorizeHandshake');

        try {
            const response = await fetch(url);
            const text = await response.text();

            // Check for specific error messages
            if (text.includes('You are not logged into the Member\'s Panel')) {
                throw new Error('You are not logged into the Member\'s Panel. Please log into the forums at constelia.ai first, then try again.');
            }

            const result = this.parseApiResponse(text);

            if (result.status !== 200) {
                throw new Error(result.message || 'Failed to authorize handshake');
            }

            return result.message; // This is the handshake token
        } catch (error) {
            console.error('Handshake authorization error:', error);
            throw error;
        }
    },

    async getHandshake(token) {
        const url = new URL('https://constelia.ai/api.php');
        url.searchParams.append('cmd', 'getHandshake');
        url.searchParams.append('token', token);

        try {
            const response = await fetch(url);
            const text = await response.text();
            const result = this.parseApiResponse(text);

            if (result.status !== 200) {
                throw new Error(result.message || 'Failed to get handshake');
            }

            return result.message; // This is the actual license key
        } catch (error) {
            console.error('Get handshake error:', error);
            throw error;
        }
    },

    async terminateHandshake(licenseKey) {
        try {
            await this.apiCall('terminateHandshake');
            this.showMessage('Session terminated successfully', 'success');
        } catch (error) {
            console.warn('Could not terminate handshake:', error);
            // Don't show error to user as this happens during logout
        }
    },

    async tryHandshakeLogin() {
        console.log('🔍 Checking for saved handshake...');
        const handshakeToken = this.debugHandshakeToken(); // Updated function name

        if (!handshakeToken) {
            console.log('❌ No handshake token found');
            return false;
        }

        try {
            console.log('🔄 Attempting to restore session with handshake...');
            this.showMessage('Attempting to restore session...', 'success');

            // Try to get the license key using the handshake token
            const licenseKey = await this.getHandshake(handshakeToken);

            if (licenseKey) {
                this.apiKey = licenseKey;
                console.log('✅ Handshake valid, got license key');

                // Verify the key works by getting member info
                const response = await this.apiCall('getMember', {
                    scripts: '',
                    bans: '',
                    fc2t: '',
                    beautify: ''
                });

                this.memberData = response;
                this.memberScripts = response.scripts || [];
                this.memberProjects = response.fc2t || [];

                console.log('✅ Session restored successfully');
                this.showMessage(`Welcome back, ${this.memberData.username}! Session restored successfully.`, 'success');

                // Update UI
                this.updateUIAfterLogin();

                // Load initial data
                await this.loadInitialData();

                return true;
            }
            } catch (error) {
                console.error('❌ Handshake login failed:', error);

                // If handshake failed, remove the invalid token
                this.deleteHandshakeToken();

            // Show login form with appropriate message
            if (error.message.includes('expired') || error.message.includes('invalid')) {
                this.showMessage('Session expired. Please log in again.', 'error');
            } else {
                this.showMessage('Could not restore session. Please log in.', 'error');
            }
        }

        console.log('❌ Auto-login failed, showing login form');
        return false;
    },

    async connect() {
        const apiKeyInput = document.getElementById('apiKey');
        const licenseKey = apiKeyInput.value.trim();

        if (!licenseKey) {
            this.showMessage('Please enter your license key', 'error');
            return;
        }

        // Disable connect button during attempt
        const connectButton = document.querySelector('#loginSection button');
        const originalText = connectButton.textContent;
        connectButton.disabled = true;
        connectButton.textContent = '🔄 Connecting...';

        try {
            const rememberMe = document.getElementById('rememberMe').checked;

            if (rememberMe) {
                // Use handshake system for persistent sessions
                this.showMessage('Authorizing secure session...', 'success');
                const handshakeToken = await this.authorizeHandshake(licenseKey);

                // Use handshake to get the actual key (verify it works)
                this.apiKey = await this.getHandshake(handshakeToken);

                // Verify connection by getting member info
                const response = await this.apiCall('getMember', {
                    scripts: '',
                    bans: '',
                    fc2t: '',
                    beautify: ''
                });

                this.memberData = response;
                this.memberScripts = response.scripts || [];
                this.memberProjects = response.fc2t || [];

                // Save handshake token for future use
                const tokenSaved = this.setHandshakeToken(handshakeToken);

                if (tokenSaved) {
                    this.showMessage(`Connected successfully! Welcome, ${this.memberData.username}! Session will be remembered.`, 'success');
                } else {
                    this.showMessage(`Connected successfully! Welcome, ${this.memberData.username}!`, 'success');
                }

            } else {
                // Direct connection without handshake for temporary sessions
                this.showMessage('Connecting for this session...', 'success');
                this.apiKey = licenseKey;

                // Verify connection by getting member info
                const response = await this.apiCall('getMember', {
                    scripts: '',
                    bans: '',
                    fc2t: '',
                    beautify: ''
                });

                this.memberData = response;
                this.memberScripts = response.scripts || [];
                this.memberProjects = response.fc2t || [];

                this.showMessage(`Connected successfully! Welcome, ${this.memberData.username}!`, 'success');
            }

            // Only update UI and load data if connection was successful
            this.updateUIAfterLogin();
            apiKeyInput.value = '';
            await this.loadInitialData();

        } catch (error) {
            console.error('Connection error:', error);
            this.apiKey = '';
            this.memberData = null; // Reset member data on error
            this.handleConnectionError(error);
        } finally {
            // Re-enable connect button
            connectButton.disabled = false;
            connectButton.textContent = originalText;
        }
    },

    async connectWithHandshake() {
        const handshakeInput = document.getElementById('handshakeToken');
        const handshakeToken = handshakeInput.value.trim();

        if (!handshakeToken) {
            this.showMessage('Please enter a handshake token', 'error');
            return;
        }

        // Disable connect button during attempt
        const connectButton = document.querySelector('#advancedLogin button');
        const originalText = connectButton.textContent;
        connectButton.disabled = true;
        connectButton.textContent = '🔄 Connecting...';

        try {
            // Try to get the license key using the handshake token
            this.showMessage('Verifying handshake token...', 'success');
            this.apiKey = await this.getHandshake(handshakeToken);

            // Verify connection by getting member info
            const response = await this.apiCall('getMember', {
                scripts: '',
                bans: '',
                fc2t: '',
                beautify: ''
            });

            this.memberData = response;
            this.memberScripts = response.scripts || [];
            this.memberProjects = response.fc2t || [];

            // Save handshake token only if "Remember me" is checked
            const rememberMe = document.getElementById('rememberMe').checked;
            if (rememberMe) {
                const tokenSaved = this.setHandshakeToken(handshakeToken);
                if (tokenSaved) {
                    this.showMessage(`Connected successfully with handshake! Welcome, ${this.memberData.username}! Session will be remembered.`, 'success');
                } else {
                    this.showMessage(`Connected successfully with handshake! Welcome, ${this.memberData.username}!`, 'success');
                }
            } else {
                this.showMessage(`Connected successfully with handshake! Welcome, ${this.memberData.username}!`, 'success');
            }

            // Only update UI and load data if connection was successful
            this.updateUIAfterLogin();
            handshakeInput.value = '';
            await this.loadInitialData();

        } catch (error) {
            console.error('Handshake connection error:', error);
            this.apiKey = '';
            this.memberData = null; // Reset member data on error
            this.handleConnectionError(error);
        } finally {
            // Re-enable connect button
            connectButton.disabled = false;
            connectButton.textContent = originalText;
        }
    },

    async disconnect() {
        // Only terminate handshake if we actually used the handshake system
        const hasHandshakeToken = this.getHandshakeToken(); // Updated function call
        if (hasHandshakeToken && this.apiKey) {
            await this.terminateHandshake(this.apiKey);
        }

        // Clear handshake token if it exists
        this.deleteHandshakeToken(); // Updated function call

        // Reset state
        this.resetAppState();

        // Reset UI
        this.resetUIAfterLogout();

        this.showMessage('Disconnected successfully', 'success');
    },

    // ========================
    // CORE UTILITIES
    // ========================
    
    showMessage(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        // Generate unique ID for this notification
        const notificationId = 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `message ${type === 'error' ? 'error' : 'success'}`;
        notification.id = notificationId;
        notification.innerHTML = `
            <div class="message-content">${message}</div>
            <button class="message-close" onclick="app.hideMessage('${notificationId}')" aria-label="Close">×</button>
        `;

        // Add to container
        container.appendChild(notification);

        // Auto-hide after 5 seconds with fade-out
        setTimeout(() => {
            this.hideMessage(notificationId);
        }, 5000);

        return notificationId;
    },

    hideMessage(notificationId) {
        const notification = document.getElementById(notificationId);
        if (!notification) return;

        // Add fade-out class to trigger CSS transition
        notification.classList.add('fade-out');

        // Remove from DOM after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500); // Match the CSS transition duration
    },

    // Handshake management
    setHandshakeToken(value) {
        const isOnline = this.isOnlineEnvironment();
        
        if (isOnline) {
            // Use cookies for online sessions (server can verify)
            try {
                // Set cookie with 30 day expiration
                const expires = new Date();
                expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
                
                let cookieString = `fc2_handshake=${value}; expires=${expires.toUTCString()}; path=/`;
                
                // Add secure flag if we're on HTTPS
                if (location.protocol === 'https:') {
                    cookieString += '; secure';
                }
                
                // Add SameSite for security
                cookieString += '; samesite=lax';
                
                document.cookie = cookieString;
                
                // Optional verification with delay (doesn't block success)
                setTimeout(() => {
                    const verification = this.getHandshakeToken();
                    if (verification === value) {
                        console.log(`✅ Handshake token cookie verified successfully`);
                    } else {
                        console.warn(`⚠️ Cookie verification failed, but cookie was set (timing issue)`);
                    }
                }, 10);
                
                console.log(`✅ Handshake token saved to cookie (online mode)`);
                return true;
                
            } catch (error) {
                console.warn('Could not save handshake token to cookie, falling back to localStorage:', error);
                // Fallback to localStorage if cookies fail
                try {
                    localStorage.setItem('fc2_handshake', value);
                    console.log(`✅ Handshake token saved to localStorage (fallback)`);
                    return true;
                } catch (localError) {
                    console.warn('Could not save handshake token to localStorage either:', localError);
                    return false;
                }
            }
        } else {
            // Use localStorage for offline sessions
            try {
                localStorage.setItem('fc2_handshake', value);
                console.log(`✅ Handshake token saved to localStorage (offline mode)`);
                return true;
            } catch (error) {
                console.warn('Could not save handshake token to localStorage:', error);
                return false;
            }
        }
    },

    getHandshakeToken() {
		const isOnline = this.isOnlineEnvironment();
		
		if (isOnline) {
			// Try cookies first for online sessions
			try {
				const cookies = document.cookie.split(';');
				for (let cookie of cookies) {
					const [name, value] = cookie.trim().split('=');
					if (name === 'fc2_handshake') {
						console.log(`📁 Retrieved handshake token from cookie (online mode)`);
						return value;
					}
				}
				
				// If no cookie found, check localStorage as fallback
				const localValue = localStorage.getItem('fc2_handshake');
				if (localValue) {
					console.log(`📁 Retrieved handshake token from localStorage (fallback from cookie)`);
					return localValue;
				}
				
				return null;
			} catch (error) {
				console.warn('Could not read handshake token from cookie, trying localStorage:', error);
				// Fallback to localStorage
				try {
					const value = localStorage.getItem('fc2_handshake');
					if (value) {
						console.log(`📁 Retrieved handshake token from localStorage (fallback)`);
						return value;
					}
					return null;
				} catch (localError) {
					console.warn('Could not read handshake token from localStorage either:', localError);
					return null;
				}
			}
		} else {
			// Use localStorage for offline sessions
			try {
				const value = localStorage.getItem('fc2_handshake');
				if (value) {
					console.log(`📁 Retrieved handshake token from localStorage (offline mode)`);
					return value;
				}
				return null;
			} catch (error) {
				console.warn('Could not read handshake token from localStorage:', error);
				return null;
			}
		}
	},

    deleteHandshakeToken() {
		const isOnline = this.isOnlineEnvironment();
		
		if (isOnline) {
			// Clear cookie for online sessions
			try {
				// Clear the cookie by setting it to expire in the past
				document.cookie = 'fc2_handshake=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
				console.log(`🗑️ Handshake token removed from cookie (online mode)`);
			} catch (error) {
				console.warn('Could not delete handshake token cookie:', error);
			}
			
			// Also clear localStorage as fallback cleanup
			try {
				localStorage.removeItem('fc2_handshake');
				console.log(`🗑️ Handshake token removed from localStorage (cleanup)`);
			} catch (error) {
				console.warn('Could not delete handshake token from localStorage:', error);
			}
		} else {
			// Clear localStorage for offline sessions
			try {
				localStorage.removeItem('fc2_handshake');
				console.log(`🗑️ Handshake token removed from localStorage (offline mode)`);
			} catch (error) {
				console.warn('Could not delete handshake token from localStorage:', error);
			}
		}
	},

    debugHandshakeToken() {
		const isOnline = this.isOnlineEnvironment();
		
		console.log('=== Handshake Debug ===');
		console.log('Environment:', isOnline ? 'Online (server)' : 'Offline (file/local)');
		console.log('Protocol:', location.protocol);
		console.log('Hostname:', location.hostname);
		
		if (isOnline) {
			console.log('Primary storage: Cookies');
			console.log('Fallback storage: localStorage');
			
			// Check cookie
			let cookieValue = null;
			try {
				const cookies = document.cookie.split(';');
				for (let cookie of cookies) {
					const [name, value] = cookie.trim().split('=');
					if (name === 'fc2_handshake') {
						cookieValue = value;
						break;
					}
				}
			} catch (error) {
				console.log('Cookie read error:', error);
			}
			
			console.log('fc2_handshake (cookie):', cookieValue ? `Found (${cookieValue.substring(0, 20)}...)` : 'Not found');
			
			// Check localStorage as fallback
			let localValue = null;
			try {
				localValue = localStorage.getItem('fc2_handshake');
			} catch (error) {
				console.log('localStorage read error:', error);
			}
			
			console.log('fc2_handshake (localStorage):', localValue ? `Found (${localValue.substring(0, 20)}...)` : 'Not found');
			console.log('All cookies:', document.cookie || 'None');
			
			return cookieValue || localValue;
		} else {
			console.log('Primary storage: localStorage');
			
			let localValue = null;
			try {
				localValue = localStorage.getItem('fc2_handshake');
			} catch (error) {
				console.log('localStorage read error:', error);
			}
			
			console.log('fc2_handshake (localStorage):', localValue ? `Found (${localValue.substring(0, 20)}...)` : 'Not found');
			console.log('All localStorage keys:', Object.keys(localStorage));
			
			return localValue;
		}
		
		console.log('=====================');
	},

    // ========================
    // UI HELPER METHODS
    // ========================
    
    updateUIAfterLogin() {
        // Hide login section and show main interface
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('advancedLogin').style.display = 'none';
        document.getElementById('connectedInfo').classList.add('active');
        document.getElementById('settingsButton').classList.add('active');
        document.getElementById('connectedUsername').textContent = this.memberData.username;
        document.getElementById('userLevel').textContent = this.memberData.level;
        document.getElementById('userXP').textContent = this.memberData.xp.toLocaleString();
        this.setUserAvatar(this.memberData);

        document.getElementById('navTabs').classList.add('active');
        document.getElementById('contentArea').classList.add('active');
        document.getElementById('rollButton').classList.add('active');
        document.getElementById('omegaButton').classList.add('active');
    },

    resetUIAfterLogout() {
        document.getElementById('apiKey').value = '';
        document.getElementById('handshakeToken').value = '';
        document.getElementById('rememberMe').checked = false;
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('advancedLogin').style.display = 'none';
        document.getElementById('connectedInfo').classList.remove('active');
        document.getElementById('navTabs').classList.remove('active');
        document.getElementById('contentArea').classList.remove('active');
        document.getElementById('rollButton').classList.remove('active');
        document.getElementById('omegaButton').classList.remove('active');
        document.getElementById('settingsButton').classList.remove('active');

        // Reset advanced button
        const advancedButton = document.querySelector('#loginSection button[onclick="app.toggleAdvanced()"]');
        if (advancedButton) {
            advancedButton.textContent = '⚙️ Advanced';
            advancedButton.style.background = 'linear-gradient(135deg, #666, #555)';
        }
    },

    resetAppState() {
        this.apiKey = '';
        this.memberData = null;
        this.memberScripts = [];
        this.memberProjects = [];
    },

    setUserAvatar(memberData) {
        const avatarElement = document.getElementById('userAvatar');
        if (!avatarElement || !memberData) return;

        const fallbackInitial = memberData.username ? memberData.username.charAt(0).toUpperCase() : '?';

        // Clear existing content
        avatarElement.innerHTML = '';

        // Try to use the avatar from API if available
        if (memberData.avatar && typeof memberData.avatar === 'string' && memberData.avatar.trim() !== '') {
            const avatarImg = document.createElement('img');
            avatarImg.src = memberData.avatar;
            avatarImg.alt = `${memberData.username}'s avatar`;
            
            // Handle successful image load
            avatarImg.onload = () => {
                console.log('✅ Avatar loaded successfully:', memberData.avatar);
            };
            
            // Handle image load errors - fall back to letter
            avatarImg.onerror = () => {
                console.warn('❌ Failed to load avatar, falling back to letter:', memberData.avatar);
                avatarElement.innerHTML = '';
                const fallback = document.createElement('div');
                fallback.className = 'avatar-fallback';
                fallback.textContent = fallbackInitial;
                avatarElement.appendChild(fallback);
            };
            
            avatarElement.appendChild(avatarImg);
        } else {
            // No avatar available, use fallback letter
            console.log('📝 No avatar available, using fallback letter for:', memberData.username);
            const fallback = document.createElement('div');
            fallback.className = 'avatar-fallback';
            fallback.textContent = fallbackInitial;
            avatarElement.appendChild(fallback);
        }
    },
	
	// Helper function to detect if we're in an online environment
	isOnlineEnvironment() {
		// Check if we're running from file:// protocol (offline)
		if (location.protocol === 'file:') {
			return false;
		}
		
		// Check if we're on localhost/127.0.0.1 without a proper server
		if ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') && 
			location.protocol === 'http:' && location.port === '') {
			return false;
		}
		
		// If we have a proper http/https server, we're online
		return location.protocol === 'http:' || location.protocol === 'https:';
	},

    handleConnectionError(error) {
        // Show appropriate error message
        if (error.message.includes('Failed to fetch') && location.protocol === 'file:') {
            this.showMessage('❌ CORS Error: Cannot make API calls from file://. Please serve this page over HTTP/HTTPS (e.g., use a local web server)', 'error');
        } else if (error.message.includes('24 hours')) {
            this.showMessage('Handshake system locked for 24 hours. Please try again later.', 'error');
        } else if (error.message.includes('expired')) {
            this.showMessage('Handshake token has expired. Please use your license key to generate a new one.', 'error');
        } else if (error.message.includes('invalid')) {
            this.showMessage('Invalid handshake token. Please check the token or use your license key.', 'error');
        } else if (error.message.includes('mismatch')) {
            this.showMessage('Handshake token was created on a different device/browser. Please use your license key.', 'error');
        } else {
            this.showMessage(`Connection failed: ${error.message}`, 'error');
        }
    },

    // Load initial data after successful login
    async loadInitialData() {
        // These methods will be defined in other modules
        await this.loadMemberInfo();
        await this.loadAllScripts();
        await this.loadAllProjects();
        await this.loadConfiguration();
        await this.loadOmegaInfo();
        await this.loadPerks();
        await this.loadLanguages();
        await this.loadBuilds();

        // Load preferences
        this.loadAutoSavePreference();
    }
};

// Make app available globally for HTML access
window.app = app;