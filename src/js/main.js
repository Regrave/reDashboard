// Constelia Dashboard - Main Initialization
// Contains: Application initialization, event setup, and global exports

// ========================
// GLOBAL EXPORTS & DEBUG
// ========================

// Export debug function for console access
window.debugConstelia = () => window.app.debugHandshakeToken();

// ========================
// PROTOCOL & BROWSER CHECKS
// ========================

function checkBrowserCompatibility() {
    // Check for required APIs
    const requiredAPIs = [
        'fetch',
        'Promise', 
        'localStorage',
        'JSON'
    ];

    const missingAPIs = requiredAPIs.filter(api => !(api in window));

    if (missingAPIs.length > 0) {
        console.error('Missing required APIs:', missingAPIs);
        window.app.showMessage(`❌ Browser not supported. Missing: ${missingAPIs.join(', ')}`, 'error');
        return false;
    }

    return true;
}

// ========================
// EVENT LISTENERS SETUP
// ========================

function setupKeyboardListeners() {
    // Enter key support for API key input
    const apiKeyInput = document.getElementById('apiKey');
    if (apiKeyInput) {
        apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                window.app.connect();
            }
        });
    }

    // Enter key support for handshake token input
    const handshakeInput = document.getElementById('handshakeToken');
    if (handshakeInput) {
        handshakeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                window.app.connectWithHandshake();
            }
        });
    }

    // Enter key support for wipe handshake input
    const wipeInput = document.getElementById('wipeHandshakeKey');
    if (wipeInput) {
        wipeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                window.app.wipeHandshake();
            }
        });
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + / for terminal focus (when on overview tab)
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            const overviewSection = document.getElementById('overview-section');
            const terminalInput = document.getElementById('terminalInput');
            
            if (overviewSection && overviewSection.classList.contains('active') && terminalInput) {
                e.preventDefault();
                terminalInput.focus();
            }
        }

        // Escape key to close modals
        if (e.key === 'Escape') {
            // Close script editor if open
            if (document.getElementById('scriptEditorModal').classList.contains('active')) {
                window.app.closeScriptEditor();
            }
            
            // Close build preview if open
            if (document.getElementById('buildPreviewModal').classList.contains('active')) {
                window.app.closeBuildPreview();
            }
            
            // Close build details if open
            if (document.getElementById('buildDetailsModal').classList.contains('active')) {
                window.app.closeBuildDetails();
            }
            
            // Close roll result modal if open
            if (document.getElementById('rollResultModal').classList.contains('active')) {
                window.app.closeRollModal();
            }
            
            // Close omega modal if open
            if (document.getElementById('omegaModal').classList.contains('active')) {
                window.app.closeOmegaModal();
            }

            // Close settings modal if open
            if (document.getElementById('settingsModal').classList.contains('active')) {
                window.app.closeSettingsModal();
            }

            // Close script source modal if open
            if (document.getElementById('scriptSourceModal').classList.contains('active')) {
                window.app.closeScriptSource();
            }
        }
    });
}

function setupWindowListeners() {
    // Handle page unload for cleanup
    window.addEventListener('beforeunload', (e) => {
        // Check if there are unsaved changes in the script editor
        if (window.app.currentEditingScript && document.getElementById('scriptEditorModal').classList.contains('active')) {
            const currentCode = window.app.getCodeEditorContent();
            const currentNotes = document.getElementById('updateNotes').value;
            
            // Compare with original content
            const codeChanged = currentCode !== window.app.originalScriptContent;
            const notesChanged = currentNotes !== (window.app.originalNotesContent || '');
            
            if (codeChanged || notesChanged) {
                // Browser will show its own dialog, we just need to return a value
                e.preventDefault();
                e.returnValue = 'You have unsaved changes in the script editor.';
                return e.returnValue;
            }
        }
        
        // Note: We don't terminate handshake on unload as user might just be refreshing
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
        window.app.showMessage('Connection restored', 'success');
    });

    window.addEventListener('offline', () => {
        window.app.showMessage('Connection lost - working offline', 'error');
    });

    // Handle tab visibility for auto-save optimization
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Save any pending auto-saves immediately when tab becomes hidden
            if (window.app.autoSaveTimeout) {
                clearTimeout(window.app.autoSaveTimeout);
                if (window.app.autoSaveEnabled && window.app.currentScriptKey) {
                    window.app.saveScriptConfig(true, window.app.liveOmegaEnabled);
                }
            }
        }
    });
}

// ========================
// INITIALIZATION HELPERS
// ========================

function initializeSyntaxHighlighting() {
    // Initialize syntax highlighting if hljs is available
    if (typeof hljs !== 'undefined') {
        try {
            hljs.highlightAll();
            console.log('✅ Syntax highlighting initialized');
        } catch (error) {
            console.warn('Could not initialize syntax highlighting:', error);
        }
    }
}

function initializeTooltips() {
    // Initialize any tooltips or help systems
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        // Add enhanced tooltip behavior if needed
        element.addEventListener('mouseenter', function() {
            // Could add custom tooltip styling here
        });
    });
}

function validateRequiredElements() {
    const requiredElements = [
        'loginSection',
        'connectedInfo', 
        'navTabs',
        'contentArea',
        'notificationContainer'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));

    if (missingElements.length > 0) {
        console.error('Missing required DOM elements:', missingElements);
        return false;
    }

    return true;
}

// ========================
// MAIN INITIALIZATION
// ========================

async function initializeApplication() {
    try {
        // Check browser compatibility
        if (!checkBrowserCompatibility()) {
            return;
        }

        // Validate required DOM elements
        if (!validateRequiredElements()) {
            window.app.showMessage('❌ Missing required page elements. Please refresh the page.', 'error');
            return;
        }

        if (typeof hljs !== 'undefined') {
            hljs.configure({
                languages: ['lua', 'json'],
                ignoreUnescapedHTML: true
            });
        }

        // Load caching preference first
        window.app.loadCachingPreference();
        
        // Load and setup Remember Me preference
        const rememberMeCheckbox = document.getElementById('rememberMe');
        if (rememberMeCheckbox) {
            // Load saved preference (default to true if not set)
            const savedPreference = localStorage.getItem('rememberMePreference');
            rememberMeCheckbox.checked = savedPreference === null ? true : savedPreference === 'true';
            
            // Save preference when changed
            rememberMeCheckbox.addEventListener('change', () => {
                localStorage.setItem('rememberMePreference', rememberMeCheckbox.checked);
            });
        }

        // Setup event listeners
        setupKeyboardListeners();
        setupWindowListeners();

        // Initialize components
        initializeSyntaxHighlighting();
        initializeTooltips();
        window.app.initializeTerminal();

        // Try to restore session using handshake
        const sessionRestored = await window.app.tryHandshakeLogin();

        // If session wasn't restored, show login form
        if (!sessionRestored) {
            // Hide loading screen since we're showing login
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            // Show main interface
            const mainInterface = document.getElementById('mainInterface');
            if (mainInterface) {
                mainInterface.style.display = '';
            }
            
            // Check if recovery section exists - if it does, don't show login section
            const recoverySection = document.getElementById('sessionRecovery');
            if (!recoverySection) {
                const loginSection = document.getElementById('loginSection');
                if (loginSection) {
                    loginSection.classList.add('active');
                }
            }
            
            // Initialize tutorial after UI is visible
            window.app.initTutorial();
        }

        
        // Override classList.add to prevent adding 'active' when logged in
        const loginSection = document.getElementById('loginSection');
        if (loginSection) {
            const originalAdd = loginSection.classList.add;
            loginSection.classList.add = function(...args) {
                if (args.includes('active') && window.app && (window.app.apiKey || window.app.sessionInitialized)) {
                    return;
                }
                return originalAdd.apply(this, args);
            };
        }

    } catch (error) {
        console.error('❌ Initialization failed:', error);
        window.app.showMessage('Failed to initialize application. Please refresh the page.', 'error');
    }
}

// ========================
// PERFORMANCE MONITORING
// ========================

function logPerformanceMetrics() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('📊 Performance Metrics:');
                    console.log(`   • DOM Ready: ${Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart)}ms`);
                    console.log(`   • Page Load: ${Math.round(perfData.loadEventEnd - perfData.navigationStart)}ms`);
                }
            }, 0);
        });
    }
}

// ========================
// ERROR HANDLING
// ========================

function setupGlobalErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        
        // Don't spam user with too many error messages
        if (!window.lastErrorTime || Date.now() - window.lastErrorTime > 5000) {
            window.app.showMessage('An unexpected error occurred. Please try again.', 'error');
            window.lastErrorTime = Date.now();
        }
    });

    // Handle general JavaScript errors
    window.addEventListener('error', (event) => {
        console.error('JavaScript error:', event.error);
        
        // Don't spam user with too many error messages
        if (!window.lastErrorTime || Date.now() - window.lastErrorTime > 5000) {
            window.app.showMessage('An unexpected error occurred. Please try again.', 'error');
            window.lastErrorTime = Date.now();
        }
    });
}

// ========================
// FEATURE DETECTION
// ========================

function detectFeatures() {
    const features = {
        cookies: (function() {
            try {
                document.cookie = 'test=1';
                const result = document.cookie.indexOf('test=1') !== -1;
                document.cookie = 'test=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                return result;
            } catch (e) {
                return false;
            }
        })(),
        localStorage: (function() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        })(),
        fetch: 'fetch' in window,
        websockets: 'WebSocket' in window
    };

    console.log('🔍 Feature Detection:');
    Object.entries(features).forEach(([feature, supported]) => {
        console.log(`   • ${feature}: ${supported ? '✅' : '❌'}`);
    });

    // Warn about missing critical features
    if (!features.localStorage) {
        window.app.showMessage('⚠️ localStorage not available. Some features may not work properly.', 'error');
    }

    if (!features.cookies && location.protocol !== 'file:') {
        window.app.showMessage('⚠️ Cookies not available. Session persistence may not work.', 'error');
    }

    return features;
}

// ========================
// STARTUP SEQUENCE
// ========================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Setup error handling early
    setupGlobalErrorHandling();
    
    // Detect browser features
    detectFeatures();
    
    // Start performance monitoring
    logPerformanceMetrics();
    
    // Initialize the application
    await initializeApplication();
});

// ========================
// DEVELOPMENT HELPERS
// ========================

// Development mode detection
const isDevelopment = location.hostname === 'localhost' || 
                     location.hostname === '127.0.0.1' || 
                     location.protocol === 'file:';

if (isDevelopment) {
    console.log('🔧 Development mode detected');
    
    // Add development helpers to window for console access
    window.dev = {
        app: app,
        clearStorage: () => {
            localStorage.clear();
            console.log('🗑️ localStorage cleared');
        },

        testNotification: (message = 'Test notification', type = 'success') => {
            window.app.showMessage(message, type);
        },
        logState: () => {
            console.log('📊 Application State:', {
                apiKey: window.app.apiKey ? 'SET' : 'NOT SET',
                memberData: !!window.app.memberData,
                memberScripts: window.app.memberScripts.length,
                memberProjects: window.app.memberProjects.length,
                autoSaveEnabled: window.app.autoSaveEnabled,
                liveOmegaEnabled: window.app.liveOmegaEnabled,
                hasHandshakeToken: !!window.app.getHandshakeToken()
            });
        }
    };
    
    console.log('💡 Development helpers available in window.dev');
}

// ========================
// EXPORT FOR MODULE SYSTEMS
// ========================

// Support for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = app;
}

if (typeof define === 'function' && define.amd) {
    define([], function() {
        return app;
    });
}

