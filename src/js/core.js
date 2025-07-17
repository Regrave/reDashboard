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
    currentScriptKey: '',

        // Caching settings
    cachingEnabled: true, // Default to enabled
    sessionInitialized: false, // Track if we've done initial fresh load
    
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
        // Try to parse as JSON first
        try {
            const jsonData = JSON.parse(responseText);
            
            // For handshake responses, return the full object including status
            if (jsonData && jsonData.status !== undefined) {
                return jsonData;
            }

            // For regular API responses
            if (jsonData && jsonData.code && jsonData.code !== 200) {
                throw new Error(jsonData.message || 'API request failed');
            }

            return jsonData.message || jsonData;
        } catch (e) {
            // If JSON parsing fails, check for HTML wrapper
            if (responseText.includes('<pre>')) {
                const match = responseText.match(/<pre>([\s\S]*?)<\/pre>/);
                if (match && match[1]) {
                    try {
                        const jsonData = JSON.parse(match[1]);
                        
                        if (jsonData && jsonData.code && jsonData.code !== 200) {
                            throw new Error(jsonData.message || 'API request failed');
                        }
                        
                        return jsonData.message || jsonData;
                    } catch (parseError) {
                        // If we can't parse the JSON inside the HTML, just throw the raw response
                        throw new Error(responseText);
                    }
                }
            }
            
            // For anything else that's not JSON, just throw the raw response
            throw new Error(responseText);
        }
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

        // Create a sanitized version ONLY for logging
        const urlString = url.toString();
        const sanitizedUrlForLogging = urlString.replace(this.apiKey, '***REDACTED***');
        
        console.log('🔗 Making API call:', {
            cmd: cmd,
            url: sanitizedUrlForLogging,
            protocol: location.protocol,
            params: params
        });

        try {
            const response = await fetch(urlString);
            
            console.log('📡 API Response received:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                ok: response.ok
            });
            
            const text = await response.text();
            
            // Sanitize response text preview
            const sanitizedText = text.replace(new RegExp(this.apiKey, 'g'), '***REDACTED***');
            console.log('📄 Raw API Response Text:', {
                length: text.length,
                preview: sanitizedText.substring(0, 500) + (sanitizedText.length > 500 ? '...' : ''),
            });

            const parsedResponse = this.parseApiResponse(text);
            
            // Check for invalid license key error
            if (parsedResponse.message && parsedResponse.message === 'invalid license key') {
                const error = new Error('INVALID_LICENSE_KEY');
                error.details = parsedResponse;
                throw error;
            }
            
            // Check for hash mismatch error
            if (response.status === 401 && parsedResponse.message && 
                parsedResponse.message === 'this license key cannot authorize due to the hash not matching the current Web API requester.') {
                // This is a critical error - the session is invalid
                const error = new Error('HASH_MISMATCH');
                error.details = parsedResponse;
                throw error;
            }
            
            // Sanitize API key from parsed response debug output
            const sanitizedResponse = JSON.stringify(parsedResponse, (key, value) => {
                if (typeof value === 'string' && value.includes(this.apiKey)) {
                    return value.replace(new RegExp(this.apiKey, 'g'), '***REDACTED***');
                }
                return value;
            });
            
            return parsedResponse;

        } catch (error) {
            // Sanitize API key from error output
            const sanitizedUrl = url.toString().replace(this.apiKey, '***REDACTED***');
            console.error('❌ API Call Error Details:', {
                message: error.message,
                stack: error.stack,
                cmd: cmd,
                url: sanitizedUrl,
                protocol: location.protocol
            });
            
            // Better CORS detection for file:// protocol
            if (location.protocol === 'file:' && (
                error.message.includes('Failed to fetch') ||
                error.message.includes('CORS') ||
                error.message.includes('Cross-Origin') ||
                error.name === 'TypeError'
            )) {
                throw new Error('CORS_ERROR_FILE_PROTOCOL');
            }
            
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

            
            // console.log('🔐 getHandshake result:', result); // Debug

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

    async verifySessionBeforeUI() {
        // Make a quick API call to check if session is valid
        try {
            const response = await this.apiCall('getMember', { beautify: '' });
            // If we get here, the session is valid
            return true;
        } catch (error) {
            if (error.message === 'HASH_MISMATCH') {
                // Session has hash mismatch
                return false;
            }
            // Other errors might be network issues, let them through
            throw error;
        }
    },

    async tryHandshakeLogin() {
        console.log('🔍 Checking for saved handshake...');
        const handshakeToken = this.debugHandshakeToken();

        if (!handshakeToken) {
            console.log('❌ No handshake token found');
            return false;
        }

        try {
            console.log('🔄 Attempting to restore session with handshake...');
            this.showMessage('Attempting to restore session...', 'success');

            const licenseKey = await this.getHandshake(handshakeToken);
            
            if (licenseKey) {
                this.apiKey = licenseKey;

                // Verify session before updating UI
                const isValidSession = await this.verifySessionBeforeUI();
                if (!isValidSession) {
                    // Hash mismatch detected
                    this.deleteHandshakeToken();
                    this.apiKey = '';
                    this.showHashMismatchScreen();
                    return false;
                }

                // Skip the getMember call here - we'll do it in loadInitialData
                this.showMessage('Session restored, loading data...', 'success');
                this.updateUIAfterLogin();
                await this.loadInitialData();
                return true;
            }
        } catch (error) {
            console.error('❌ Handshake login failed:', error);

            const errorMessage = error.message.toLowerCase();
            
            if (errorMessage.includes('expired') || 
                errorMessage.includes('invalid') || 
                errorMessage.includes('handshake') ||
                errorMessage.includes('encoding') ||
                errorMessage.includes('forum') ||
                errorMessage.includes('session')) {
                
                console.log('🔄 Invalid handshake detected, showing recovery interface...');
                this.deleteHandshakeToken();
                this.showInlineSessionRecovery();
                return false;
                
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

            // Check if we already have a working handshake for this key
            const existingHandshake = this.getHandshakeToken();
            if (existingHandshake) {
                console.log('🔍 Found existing handshake, testing it first...');
                try {
                    // Try to use existing handshake
                    this.apiKey = await this.getHandshake(existingHandshake);
                    
                    // Verify session before updating UI
                    const isValidSession = await this.verifySessionBeforeUI();
                    if (!isValidSession) {
                        // Hash mismatch detected
                        this.deleteHandshakeToken();
                        this.apiKey = '';
                        this.showHashMismatchScreen();
                        return;
                    }
                    
                    // If we got a key, assume it works and let loadInitialData verify
                    this.showMessage('Connected successfully, loading data...', 'success');
                    this.updateUIAfterLogin();
                    apiKeyInput.value = '';
                    await this.loadInitialData();
                    return;
                } catch (existingError) {
                    console.log('❌ Existing handshake failed, will create new one:', existingError.message);
                    // Clear the invalid handshake and continue with new auth
                    this.deleteHandshakeToken();
                }
            }

            // No existing handshake OR existing one failed, create new one
            if (rememberMe) {
                try {
                    // Use handshake system for persistent sessions
                    this.showMessage('Creating secure session...', 'success');
                    const handshakeToken = await this.authorizeHandshake(licenseKey);

                    // Use handshake to get the actual key (verify it works)
                    this.apiKey = await this.getHandshake(handshakeToken);

                    // Verify session before updating UI
                    const isValidSession = await this.verifySessionBeforeUI();
                    if (!isValidSession) {
                        // Hash mismatch detected
                        this.deleteHandshakeToken();
                        this.apiKey = '';
                        this.showHashMismatchScreen();
                        return;
                    }

                    // Save handshake token for future use
                    const tokenSaved = this.setHandshakeToken(handshakeToken);

                    if (tokenSaved) {
                        this.showMessage('Connected successfully, loading data... Session will be remembered.', 'success');
                    } else {
                        this.showMessage('Connected successfully, loading data...', 'success');
                    }

                } catch (handshakeError) {
                    // Handle handshake conflicts with auto-regeneration
                    if (handshakeError.message.includes('handshake already exists')) {
                        try {
                            this.showMessage('🔄 Session conflict detected, regenerating...', 'success');
                            
                            // Auto-wipe the existing handshake using the provided license key
                            await this.autoWipeAndRegenerateHandshake(licenseKey);
                            
                            // Clear any stored handshake
                            this.deleteHandshakeToken();
                            
                            // Now try to create a new handshake
                            const newHandshakeToken = await this.authorizeHandshake(licenseKey);
                            this.apiKey = await this.getHandshake(newHandshakeToken);

                            // Verify session before updating UI
                            const isValidSession = await this.verifySessionBeforeUI();
                            if (!isValidSession) {
                                // Hash mismatch detected
                                this.deleteHandshakeToken();
                                this.apiKey = '';
                                this.showHashMismatchScreen();
                                return;
                            }

                            // Save new handshake token
                            const tokenSaved = this.setHandshakeToken(newHandshakeToken);
                            
                            this.showMessage('✅ Session regenerated successfully, loading data...', 'success');
                            
                        } catch (regenerationError) {
                            console.error('Failed to auto-regenerate handshake:', regenerationError);
                            this.showMessage('⚠️ Session conflict detected. Please try again or clear your browser data.', 'error');
                            return;
                        }
                    } else {
                        throw handshakeError; // Re-throw other errors
                    }
                }

            } else {
                // Direct connection without handshake for temporary sessions
                this.showMessage('Connecting for this session...', 'success');
                this.apiKey = licenseKey;

                // Verify session before updating UI
                const isValidSession = await this.verifySessionBeforeUI();
                if (!isValidSession) {
                    // Hash mismatch detected
                    this.apiKey = '';
                    this.showHashMismatchScreen();
                    return;
                }

                this.showMessage('Connected successfully, loading data...', 'success');
            }

            // Only update UI and load data if connection was successful
            this.updateUIAfterLogin();
            apiKeyInput.value = '';
            await this.loadInitialData();

        } catch (error) {
            console.error('Connection error:', error);
            this.apiKey = '';
            this.memberData = null;
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

            // Verify session before updating UI
            const isValidSession = await this.verifySessionBeforeUI();
            if (!isValidSession) {
                // Hash mismatch detected
                this.deleteHandshakeToken();
                this.apiKey = '';
                this.showHashMismatchScreen();
                return;
            }

            // Save handshake token only if "Remember me" is checked
            const rememberMe = document.getElementById('rememberMe').checked;
            if (rememberMe) {
                const tokenSaved = this.setHandshakeToken(handshakeToken);
                if (tokenSaved) {
                    this.showMessage('Connected successfully with handshake, loading data... Session will be remembered.', 'success');
                } else {
                    this.showMessage('Connected successfully with handshake, loading data...', 'success');
                }
            } else {
                this.showMessage('Connected successfully with handshake, loading data...', 'success');
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
                    } else {
                        console.warn(`⚠️ Cookie verification failed, but cookie was set (timing issue)`);
                    }
                }, 10);
                
                return true;
                
            } catch (error) {
                console.warn('Could not save handshake token to cookie, falling back to localStorage:', error);
                // Fallback to localStorage if cookies fail
                try {
                    localStorage.setItem('fc2_handshake', value);
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
        document.getElementById('loginSection').classList.remove('active');
        document.getElementById('advancedLogin').style.display = 'none';
        document.getElementById('connectedInfo').classList.add('active');
        document.getElementById('settingsButton').classList.add('active');
        
        // Only update member info if we have memberData
        if (this.memberData) {
            document.getElementById('connectedUsername').textContent = this.memberData.username || 'Unknown';
            document.getElementById('userLevel').textContent = this.memberData.level || '0';
            
            // Add defensive check for XP
            const xpValue = this.memberData.xp || 0;
            document.getElementById('userXP').textContent = xpValue.toLocaleString();
            
            this.setUserAvatar(this.memberData);
        } else {
            // Show loading state
            document.getElementById('connectedUsername').textContent = 'Loading...';
            document.getElementById('userLevel').textContent = '...';
            document.getElementById('userXP').textContent = '...';
        }

        document.getElementById('navTabs').classList.add('active');
        document.getElementById('contentArea').classList.add('active');
        document.getElementById('rollButton').classList.add('active');
        document.getElementById('omegaButton').classList.add('active');
    },

    resetUIAfterLogout() {
        document.getElementById('apiKey').value = '';
        document.getElementById('handshakeToken').value = '';
        document.getElementById('rememberMe').checked = false;
        document.getElementById('loginSection').classList.add('active');
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
        this.sessionInitialized = false;
        this.allScripts = [];
        this.allProjects = [];
        this.allBuilds = [];
        this.myBuilds = [];
        this.allPerks = [];
        this.ownedPerks = [];
        this.currentConfig = {};
        this.currentScriptConfig = {};
        this.currentScriptKey = '';
        // Reset omega verification cache
        if (this.modules) {
            this.modules.omegaVerified = false;
        }
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
        // Handle CORS errors specifically
        if (error.message === 'CORS_ERROR_FILE_PROTOCOL') {
            this.showMessage('❌ CORS Error: Cannot make API calls from file:// protocol.\n\nSolutions:\n• Serve this page over HTTP/HTTPS using a local web server\n• Use Python: python -m http.server 8000\n• Use Node.js: npx serve\n• Use VS Code Live Server extension', 'error');
            return;
        }
        
        // For everything else, just show the actual error message
        this.showMessage(`API Error: ${error.message}`, 'error');
        
        // Only clean up session on specific authentication-related errors
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('expired') || 
            errorMessage.includes('invalid') || 
            errorMessage.includes('session') ||
            errorMessage.includes('handshake') ||
            errorMessage.includes('encoding')) {
            this.cleanupInvalidSession();
        }
    },

    // ========================
    // CACHING PREFERENCE MANAGEMENT
    // ========================
    
    loadCachingPreference() {
        try {
            const cachingPref = localStorage.getItem('fc2_caching_enabled');
            this.cachingEnabled = cachingPref !== 'false'; // Default to true unless explicitly disabled
            
            
            // Update UI if available
            setTimeout(() => {
                const cachingToggle = document.getElementById('cachingToggle');
                const cachingStatus = document.getElementById('cachingStatus');
                
                if (cachingToggle) {
                    if (this.cachingEnabled) {
                        cachingToggle.classList.add('active');
                    } else {
                        cachingToggle.classList.remove('active');
                    }
                }
                
                if (cachingStatus) {
                    cachingStatus.textContent = this.cachingEnabled ? 'Enabled' : 'Disabled';
                    cachingStatus.style.color = this.cachingEnabled ? '#4aff4a' : '#ff6666';
                }
            }, 100);
            
        } catch (error) {
            console.warn('Could not load caching preference:', error);
            this.cachingEnabled = true; // Default to enabled on error
        }
    },

    saveCachingPreference() {
        try {
            localStorage.setItem('fc2_caching_enabled', this.cachingEnabled.toString());
            console.log(`💾 Caching preference saved: ${this.cachingEnabled}`);
        } catch (error) {
            console.warn('Could not save caching preference:', error);
        }
    },

    // Load initial data after successful login
    async loadInitialData() {
        this.sessionInitialized = false;
        
        try {
            // Execute ALL API calls in parallel for maximum speed
            const allDataPromises = [
                // Member data - comprehensive call (critical)
                this.apiCall('getMember', {
                    scripts: '',
                    bans: '',
                    history: '',
                    fc2t: '',
                    xp: '',
                    rolls: '',
                    hashes: '',
                    achievements: '',
                    beautify: ''
                }),
                // All other data calls
                this.apiCall('getAllScripts').catch(e => { console.warn('getAllScripts failed:', e); return []; }),
                this.apiCall('getFC2TProjects').catch(e => { console.warn('getFC2TProjects failed:', e); return []; }),
                this.apiCall('getConfiguration').catch(e => { console.warn('getConfiguration failed:', e); return '{}'; }),
                this.apiCall('listPerks').catch(e => { console.warn('listPerks failed:', e); return []; }),
                this.apiCall('getTranslations').catch(e => { console.warn('getTranslations failed:', e); return {}; }),
                this.apiCall('getSoftware', { name: 'omega' }).catch(e => { console.warn('getSoftware failed:', e); return {}; }),
                this.loadBuildsWithRetry()
            ];
            
            // Start processing member data as soon as it arrives (don't wait for other calls)
            allDataPromises[0].then(memberResponse => {
                this.memberData = memberResponse;
                this.memberScripts = memberResponse.scripts || [];
                this.memberProjects = memberResponse.fc2t || [];
                this.ownedPerks = memberResponse.perks || [];
                
                // Update the header with actual member info immediately
                document.getElementById('connectedUsername').textContent = this.memberData.username || 'Unknown';
                document.getElementById('userLevel').textContent = this.memberData.level || '0';
                const xpValue = this.memberData.xp || 0;
                document.getElementById('userXP').textContent = xpValue.toLocaleString();
                this.setUserAvatar(this.memberData);
                
                // Show welcome message immediately when member data arrives
                this.showMessage(`Welcome, ${this.memberData.username}!`, 'success');
                
                // Update member-specific displays immediately
                try {
                    this.updateMemberInfoDisplay();
                    this.displayMyScripts();
                    this.displayMyProjects();
                    this.updatePersonalizedTerminal();
                } catch (e) {
                    console.warn('Some displays could not be updated immediately:', e);
                }
            }).catch(e => {
                console.error('Failed to load member data:', e);
                // Don't show generic error for hash mismatch - it will be handled by the main catch
                if (e.message !== 'HASH_MISMATCH') {
                    this.showMessage('Failed to load member data', 'error');
                }
            });
            
            // Wait for all calls to complete
            const results = await Promise.allSettled(allDataPromises);
            
            // Verify member data loaded successfully
            if (results[0].status !== 'fulfilled') {
                // Check if it was a hash mismatch error
                if (results[0].reason && results[0].reason.message === 'HASH_MISMATCH') {
                    throw results[0].reason;
                }
                throw new Error('Failed to load member data');
            }
            
            // Process other results
            this.processDataResults(results.slice(1)); // Skip first result (member data)
            
            // Update displays
            this.updateAllDisplays();
            
            // Load preferences
            this.loadCachingPreference();
            this.loadAutoSavePreference();
            
            this.sessionInitialized = true;
            
            // Ensure login section stays hidden after successful data load
            const loginSection = document.getElementById('loginSection');
            if (loginSection) {
                loginSection.classList.remove('active');
                loginSection.style.display = '';
            }
            
        } catch (error) {
            console.error('❌ Error during optimized data loading:', error);
            
            // Check if this is an invalid license key error
            if (error.message === 'INVALID_LICENSE_KEY') {
                // Clear any stored handshake token since it's invalid
                this.deleteHandshakeToken();
                
                // Reset state
                this.apiKey = '';
                this.memberData = null;
                
                // Show error and return to login
                this.showMessage('❌ Invalid license key. Please check your key and try again.', 'error');
                
                // Return to login screen
                const loginSection = document.getElementById('loginSection');
                const mainInterface = document.getElementById('mainInterface');
                if (loginSection) {
                    loginSection.style.display = '';
                    loginSection.classList.add('active');
                }
                if (mainInterface) {
                    mainInterface.style.display = 'none';
                }
                
                // Focus on API key input
                const apiKeyInput = document.getElementById('apiKey');
                if (apiKeyInput) {
                    apiKeyInput.focus();
                }
                
                // Don't attempt fallback loading
                return;
            }
            
            // Check if this is a hash mismatch error
            if (error.message === 'HASH_MISMATCH') {
                // Clear any stored handshake token since it's invalid
                this.deleteHandshakeToken();
                
                // Reset state
                this.apiKey = '';
                this.memberData = null;
                
                // Show the hash mismatch screen
                this.showHashMismatchScreen();
                
                // Don't attempt fallback loading for hash mismatch
                return;
            }
            
            // Instead of throwing, try fallback loading
            console.log('🔄 Attempting fallback data loading...');
            await this.fallbackDataLoading();
            
            this.sessionInitialized = true;
        }
    },

    async loadDataInParallel() {
        const dataPromises = [
            this.apiCall('getAllScripts').catch(e => { console.warn('getAllScripts failed:', e); return []; }),
            this.apiCall('getFC2TProjects').catch(e => { console.warn('getFC2TProjects failed:', e); return []; }),
            this.apiCall('getConfiguration').catch(e => { console.warn('getConfiguration failed:', e); return '{}'; }),
            this.apiCall('listPerks').catch(e => { console.warn('listPerks failed:', e); return []; }),
            this.apiCall('getTranslations').catch(e => { console.warn('getTranslations failed:', e); return {}; }),
            this.apiCall('getSoftware', { name: 'omega' }).catch(e => { console.warn('getSoftware failed:', e); return {}; }),
            this.loadBuildsWithRetry()
        ];
        
        return await Promise.allSettled(dataPromises);
    },

    async loadBuildsWithRetry() {
        try {
            return await this.apiCall('getBuilds');
        } catch (buildError) {
            console.warn('Initial getBuilds failed:', buildError.message);
            
            if (buildError.message.includes('hash mismatch') || buildError.message.includes('Security hash')) {
                console.log('🔄 Retrying getBuilds after hash mismatch...');
                // Reduced delay from 500ms to 100ms for faster retry
                await new Promise(resolve => setTimeout(resolve, 100));
                
                try {
                    const result = await this.apiCall('getBuilds');
                    return result;
                } catch (retryError) {
                    console.warn('getBuilds retry also failed:', retryError.message);
                    return [];
                }
            }
            return [];
        }
    },

    processDataResults(results) {
        const [allScripts, allProjects, configuration, allPerks, translations, omegaInfo, allBuilds] = results;
        
        // Process each result, handling failures gracefully
        this.allScripts = allScripts.status === 'fulfilled' ? allScripts.value : [];
        this.allProjects = allProjects.status === 'fulfilled' ? allProjects.value : [];
        this.allPerks = allPerks.status === 'fulfilled' ? allPerks.value : [];
        this.allBuilds = allBuilds.status === 'fulfilled' ? allBuilds.value : [];
        
        if (configuration.status === 'fulfilled') {
            this.processConfigurationData(configuration.value);
        } else {
            this.currentConfig = {};
        }
        
        if (translations.status === 'fulfilled') {
            this.processLanguageData(translations.value);
        } else {
            this.availableLanguages = {};
        }
        
        if (omegaInfo.status === 'fulfilled') {
            this.processOmegaInfo(omegaInfo.value);
        } else {
            this.omegaVersion = 'Latest Version';
            this.omegaLastUpdate = 'Recently';
        }
        
        this.processBuildsData(this.allBuilds);
    },

    async fallbackDataLoading() {
        console.log('🔄 Using fallback data loading with minimal requirements...');
        
        try {
            // Load only essential data
            this.allScripts = [];
            this.allProjects = [];
            this.allPerks = [];
            this.allBuilds = [];
            this.currentConfig = {};
            this.availableLanguages = {};
            
            // At minimum, try to load scripts since that's most important
            try {
                this.allScripts = await this.apiCall('getAllScripts');
            } catch (e) {
                console.warn('Fallback: Could not load scripts');
            }
            
            // Try configuration
            try {
                const config = await this.apiCall('getConfiguration');
                this.processConfigurationData(config);
            } catch (e) {
                console.warn('Fallback: Could not load configuration');
            }
            
            this.updateAllDisplays();
            this.showMessage('⚠️ Some features may be limited due to connection issues. Core functionality is available.', 'warning');
            
        } catch (error) {
            console.error('❌ Even fallback loading failed:', error);
            this.showBasicInterface();
            this.showMessage('⚠️ Limited offline mode. Some features unavailable.', 'error');
        }
    },

    showBasicInterface() {
        // Show minimal interface even if data loading completely fails
        this.displayMyScripts();
        this.updateMemberInfoDisplay();
        
        // Show helpful message
        const overviewSection = document.getElementById('overview-section');
        if (overviewSection) {
            const existingCards = overviewSection.querySelectorAll('.card');
            if (existingCards.length > 0) {
                const helpCard = document.createElement('div');
                helpCard.className = 'card';
                helpCard.innerHTML = `
                    <h2>⚠️ Limited Mode</h2>
                    <p style="color: #aaa; margin-bottom: 15px;">
                        The dashboard is running in limited mode due to connection issues. 
                        Try refreshing the page or check your internet connection.
                    </p>
                    <button class="btn" onclick="window.location.reload()">🔄 Refresh Page</button>
                `;
                existingCards[existingCards.length - 1].parentNode.insertBefore(helpCard, existingCards[existingCards.length - 1].nextSibling);
            }
        }
    },
    
    processConfigurationData(configText) {
        try {
            console.log('Processing configuration data...');
            
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
            
            
        } catch (error) {
            console.error('Error processing configuration:', error);
            this.currentConfig = {};
        }
    },

    processLanguageData(translations) {
        try {
            console.log('Processing language data...');
            
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

            
        } catch (error) {
            console.error('Error processing languages:', error);
            
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
        }
    },

    processOmegaInfo(omegaInfo) {
        try {
            console.log('Processing Omega info...');
            
            this.omegaVersion = omegaInfo.version || 'Latest Version';
            this.omegaLastUpdate = omegaInfo.elapsed || 'Recently';
            
            
        } catch (error) {
            console.error('Error processing Omega info:', error);
            // Keep defaults
            this.omegaVersion = 'Latest Version';
            this.omegaLastUpdate = 'Recently';
        }
    },

    processBuildsData(allBuilds) {
        try {
            console.log('Processing builds data...');
            
            this.allBuilds = allBuilds || [];

            this.myBuilds = this.allBuilds.filter(build =>
                build.author === this.memberData.username &&
                (build.private !== 1 || build.author === this.memberData.username)
            );
            
            console.log(`✅ Processed ${this.allBuilds.length} builds (${this.myBuilds.length} mine)`);
            
        } catch (error) {
            console.error('Error processing builds:', error);
            this.allBuilds = [];
            this.myBuilds = [];
        }
    },

    updateAllDisplays() {
        console.log('🎨 Updating all UI displays...');
        
        const updates = [
            { name: 'Member Info', fn: () => this.updateMemberInfoDisplay() },
            { name: 'My Scripts', fn: () => this.displayMyScripts() },
            { name: 'Available Scripts', fn: () => this.displayAvailableScripts() },
            { name: 'Script Config', fn: () => this.populateScriptConfigSelect() },
            { name: 'My Projects', fn: () => this.displayMyProjects() },
            { name: 'Available Projects', fn: () => this.displayAvailableProjects() },
            { name: 'My Builds', fn: () => this.displayMyBuilds() },
            { name: 'Available Builds', fn: () => this.displayAvailableBuilds() },
            { name: 'Configuration', fn: () => this.updateConfigurationDisplay() },
            { name: 'Software Dropdown', fn: () => this.populateSoftwareDropdown() },
            { name: 'Perk Stats', fn: () => this.updatePerkStats() },
            { name: 'Perks Display', fn: () => this.displayPerks() },
            { name: 'Language Dropdown', fn: () => this.populateLanguageDropdown() },
            { name: 'Omega Info', fn: () => this.updateOmegaInfoDisplay() },
            { name: 'Session Info', fn: () => this.displayCurrentSessionInfo() },
            { name: 'Session Stats', fn: () => this.displaySessionStats() },
            { name: 'Session History', fn: () => this.displaySessionHistory() },
            { name: 'Terminal', fn: () => this.updatePersonalizedTerminal() }
        ];
        
        const failed = [];
        let successCount = 0;
        
        updates.forEach(update => {
            try {
                update.fn();
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to update ${update.name}:`, error);
                failed.push(update.name);
            }
        });
        
        console.log(`✅ Display update complete: ${successCount}/${updates.length} successful`);
        
        if (failed.length > 0) {
            console.warn('❌ Failed updates:', failed);
            
            if (failed.length < updates.length / 2) {
                // Less than half failed - show warning but don't break
                this.showMessage(`⚠️ Some sections failed to load: ${failed.join(', ')}. Most features are working.`, 'warning');
            } else {
                // More than half failed - something is seriously wrong
                this.showMessage('⚠️ Multiple sections failed to load. Try refreshing individual tabs instead of the whole page.', 'error');
            }
        }
        
        // Apply default sorting (with error handling)
        setTimeout(() => {
            try {
                this.sortMyScripts();
                this.sortAvailableScripts();
                this.sortMyProjects();
                this.sortAvailableProjects();
                this.sortMyBuilds();
                this.sortAvailableBuilds();
            } catch (error) {
                console.warn('❌ Error during sorting:', error);
            }
        }, 100);
    },
    
    updateMemberInfoDisplay() {
        const memberStatsEl = document.getElementById('memberStats');
        if (!memberStatsEl) return;

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

    updateConfigurationDisplay() {
        const configDisplay = document.getElementById('configDisplay');
        if (configDisplay) {
            configDisplay.textContent = JSON.stringify(this.currentConfig, null, 2);
            this.highlightJSONEditor();
            this.setupJSONEditorFeatures();
        }
    },

    updateOmegaInfoDisplay() {
        const omegaInfoEl = document.getElementById('omegaInfo');
        if (omegaInfoEl) {
            omegaInfoEl.innerHTML = `
                ${this.omegaVersion} • Last Updated: ${this.omegaLastUpdate}
            `;
        }
    },

    // Defensive coding jutsu
    cleanupInvalidSession() {
        console.log('🧹 Cleaning up invalid session data...');
        
        // Clear handshake token
        this.deleteHandshakeToken();
        
        // Reset application state
        this.resetAppState();
        
        // Clear any cached authentication data
        try {
            // Clear any auth-related localStorage items
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('fc2_') && (key.includes('auth') || key.includes('session') || key.includes('handshake'))) {
                    localStorage.removeItem(key);
                    console.log(`🗑️ Cleared cached item: ${key}`);
                }
            });
        } catch (error) {
            console.warn('Could not clear cached auth data:', error);
        }
        
        console.log('✅ Session cleanup complete');
    },

    async autoWipeAndRegenerateHandshake(licenseKey) {
        console.log('🗑️ Auto-wiping existing handshake for regeneration...');
        
        try {
            // Use the provided license key to call terminateHandshake
            const url = new URL('https://constelia.ai/api.php');
            url.searchParams.append('key', licenseKey);
            url.searchParams.append('cmd', 'terminateHandshake');

            const response = await fetch(url);
            const text = await response.text();

            // Parse the response (don't throw on errors here, just log)
            try {
                const result = this.parseApiResponse(text);
                console.log('✅ Auto-wipe handshake result:', result);
            } catch (parseError) {
                console.log('⚠️ Auto-wipe completed (parse error expected):', parseError.message);
            }

            // Always clear local storage regardless of API result
            this.deleteHandshakeToken();
            
            console.log('✅ Auto-wipe handshake completed successfully');

        } catch (error) {
            console.warn('⚠️ Auto-wipe handshake had an error, but continuing:', error.message);
            
            // Still clear local storage even if API call failed
            this.deleteHandshakeToken();
        }
    },
    
    showInlineSessionRecovery() {
        const loginSection = document.getElementById('loginSection');
        const recoverySection = document.createElement('div');
        recoverySection.id = 'sessionRecovery';
        recoverySection.className = 'session-recovery';
        recoverySection.innerHTML = `
            <div style="background: rgba(255, 140, 0, 0.1); border: 1px solid rgba(255, 140, 0, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #ff8c00; margin-bottom: 15px;">🔄 Session Expired</h3>
                <p style="color: #aaa; margin-bottom: 15px;">
                    Your saved session has expired due to recent system updates. 
                    Enter your license key below to create a new secure session.
                </p>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="password" class="api-key-input" id="recoveryApiKey" placeholder="Enter your license key..." style="flex: 1;">
                    <button class="btn" onclick="app.recoverSession()">🔄 Recover Session</button>
                    <button class="btn btn-small" onclick="app.cancelRecovery()" style="background: #666;">Cancel</button>
                </div>
            </div>
        `;
        
        loginSection.classList.remove('active');
        loginSection.parentNode.insertBefore(recoverySection, loginSection);
    },

    showHashMismatchScreen() {
        // Ensure we're not on the dashboard
        const mainInterface = document.getElementById('mainInterface');
        if (mainInterface) {
            mainInterface.style.display = 'none';
        }
        
        // Remove any existing hash mismatch or recovery screens
        const existingHashScreen = document.getElementById('hashMismatchScreen');
        if (existingHashScreen) {
            existingHashScreen.remove();
        }
        const existingRecovery = document.getElementById('sessionRecovery');
        if (existingRecovery) {
            existingRecovery.remove();
        }
        
        const loginSection = document.getElementById('loginSection');
        const hashMismatchSection = document.createElement('div');
        hashMismatchSection.id = 'hashMismatchScreen';
        hashMismatchSection.className = 'session-recovery';
        hashMismatchSection.innerHTML = `
            <div style="background: rgba(255, 60, 60, 0.1); border: 1px solid rgba(255, 60, 60, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #ff3c3c; margin-bottom: 15px;">⚠️ Hash Mismatch</h3>
                <p style="color: #aaa; margin-bottom: 15px;">
                    Your Web API session cannot be authorized due to a hash mismatch. This typically occurs when:
                </p>
                <ul style="color: #999; margin-bottom: 15px; padding-left: 20px;">
                    <li>You're using a VPN or your network configuration has changed</li>
                    <li>You haven't been active on the forum recently</li>
                    <li>Your session needs to be refreshed</li>
                </ul>
                <div style="background: rgba(74, 158, 255, 0.1); border: 1px solid rgba(74, 158, 255, 0.3); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <strong style="color: #4a9eff;">How to fix this:</strong>
                    <ol style="color: #aaa; margin: 10px 0 0 20px;">
                        <li>Visit the fantasy.cat forum and browse/post for a few minutes</li>
                        <li>Wait a short while for your session to update</li>
                        <li>Try logging in again</li>
                    </ol>
                </div>
                <button class="btn" onclick="app.dismissHashMismatch()" style="width: 100%;">
                    Back to Login
                </button>
            </div>
        `;
        
        // Show the hash mismatch screen before the login section
        loginSection.style.display = 'none';
        loginSection.parentNode.insertBefore(hashMismatchSection, loginSection);
    },

    dismissHashMismatch() {
        const hashMismatchScreen = document.getElementById('hashMismatchScreen');
        if (hashMismatchScreen) {
            hashMismatchScreen.remove();
        }
        
        const loginSection = document.getElementById('loginSection');
        if (loginSection) {
            // Remove display style to let CSS handle it
            loginSection.style.display = '';
            loginSection.classList.add('active');
            
            // Focus on the API key input
            const apiKeyInput = document.getElementById('apiKey');
            if (apiKeyInput) {
                apiKeyInput.focus();
            }
        }
    },

    async recoverSession() {
        const recoveryInput = document.getElementById('recoveryApiKey');
        const licenseKey = recoveryInput.value.trim();
        
        if (!licenseKey) {
            this.showMessage('Please enter your license key', 'error');
            return;
        }
        
        try {
            const success = await this.regenerateHandshakeWithKey(licenseKey);
            if (success) {
                this.cancelRecovery();
            }
        } catch (error) {
            console.error('Recovery failed:', error);
            this.showMessage('Session recovery failed. Please try again.', 'error');
        }
    },

    async regenerateHandshakeWithKey(licenseKey) {
        try {
            console.log('🔄 Regenerating handshake with license key...');
            
            const recoveryButton = document.querySelector('#sessionRecovery button');
            if (recoveryButton) {
                recoveryButton.disabled = true;
                recoveryButton.textContent = '🔄 Regenerating...';
            }
            
            await this.autoWipeAndRegenerateHandshake(licenseKey);
            this.deleteHandshakeToken();
            
            const newHandshakeToken = await this.authorizeHandshake(licenseKey);
            this.apiKey = await this.getHandshake(newHandshakeToken);

            // Verify session before updating UI
            const isValidSession = await this.verifySessionBeforeUI();
            if (!isValidSession) {
                // Hash mismatch detected
                this.deleteHandshakeToken();
                this.apiKey = '';
                
                // Remove the session recovery section if it exists
                const existingRecoverySection = document.getElementById('sessionRecovery');
                if (existingRecoverySection) {
                    existingRecoverySection.remove();
                }
                
                this.showHashMismatchScreen();
                return false;
            }

            this.setHandshakeToken(newHandshakeToken);
            
            console.log('✅ Handshake regenerated successfully');
            this.showMessage('🎉 Session renewed successfully, loading data...', 'success');
            
            // Remove the session recovery section if it exists
            const recoverySection = document.getElementById('sessionRecovery');
            if (recoverySection) {
                recoverySection.remove();
            }
            
            // Ensure login section is hidden before updating UI
            const loginSection = document.getElementById('loginSection');
            if (loginSection) {
                loginSection.classList.remove('active');
                loginSection.style.display = '';
            }
            
            this.updateUIAfterLogin();
            await this.loadInitialData();
            
            return true;
            
        } catch (error) {
            console.error('❌ Handshake regeneration with key failed:', error);
            this.showMessage(`Session recovery failed: ${error.message}`, 'error');
            return false;
        } finally {
            const recoveryButton = document.querySelector('#sessionRecovery button');
            if (recoveryButton) {
                recoveryButton.disabled = false;
                recoveryButton.textContent = '🔄 Recover Session';
            }
        }
    },

    cancelRecovery() {
        const recoverySection = document.getElementById('sessionRecovery');
        const loginSection = document.getElementById('loginSection');
        
        if (recoverySection) {
            recoverySection.remove();
        }
        if (loginSection) {
            loginSection.classList.add('active');
        }
    }
};

// Make app available globally for HTML access
window.app = app;