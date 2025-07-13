// FC2 Dashboard - Main Initialization
// Contains: Application initialization, event setup, and global exports

// ========================
// GLOBAL EXPORTS & DEBUG
// ========================

// Make app available globally for HTML access
window.app = app;

// Export debug function for console access
window.debugFC2 = () => app.debugHandshakeToken();

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
        app.showMessage(`❌ Browser not supported. Missing: ${missingAPIs.join(', ')}`, 'error');
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
                app.connect();
            }
        });
    }

    // Enter key support for handshake token input
    const handshakeInput = document.getElementById('handshakeToken');
    if (handshakeInput) {
        handshakeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                app.connectWithHandshake();
            }
        });
    }

    // Enter key support for wipe handshake input
    const wipeInput = document.getElementById('wipeHandshakeKey');
    if (wipeInput) {
        wipeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                app.wipeHandshake();
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
                app.closeScriptEditor();
            }
            
            // Close build preview if open
            if (document.getElementById('buildPreviewModal').classList.contains('active')) {
                app.closeBuildPreview();
            }
            
            // Close build details if open
            if (document.getElementById('buildDetailsModal').classList.contains('active')) {
                app.closeBuildDetails();
            }
            
            // Close roll result modal if open
            if (document.getElementById('rollResultModal').classList.contains('active')) {
                app.closeRollModal();
            }
            
            // Close omega modal if open
            if (document.getElementById('omegaModal').classList.contains('active')) {
                app.closeOmegaModal();
            }

            // Close settings modal if open
            if (document.getElementById('settingsModal').classList.contains('active')) {
                app.closeSettingsModal();
            }

            // Close script source modal if open
            if (document.getElementById('scriptSourceModal').classList.contains('active')) {
                app.closeScriptSource();
            }
        }
    });
}

function setupWindowListeners() {
    // Handle page unload for cleanup
    window.addEventListener('beforeunload', (e) => {
        // Save any pending drafts
        if (app.currentEditingScript && document.getElementById('scriptEditorModal').classList.contains('active')) {
            app.saveDraft();
        }
        
        // Note: We don't terminate handshake on unload as user might just be refreshing
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
        app.showMessage('Connection restored', 'success');
    });

    window.addEventListener('offline', () => {
        app.showMessage('Connection lost - working offline', 'error');
    });

    // Handle tab visibility for auto-save optimization
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Save any pending auto-saves immediately when tab becomes hidden
            if (app.autoSaveTimeout) {
                clearTimeout(app.autoSaveTimeout);
                if (app.autoSaveEnabled && app.currentScriptKey) {
                    app.saveScriptConfig(true, app.liveOmegaEnabled);
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
    console.log('🚀 FC2 Dashboard initializing...');

    try {
        // Check browser compatibility
        if (!checkBrowserCompatibility()) {
            return;
        }

        // Validate required DOM elements
        if (!validateRequiredElements()) {
            app.showMessage('❌ Missing required page elements. Please refresh the page.', 'error');
            return;
        }

        if (typeof hljs !== 'undefined') {
            hljs.configure({
                languages: ['lua', 'json'],
                ignoreUnescapedHTML: true
            });
            console.log('✅ Syntax highlighting initialized');
        }

        // Load caching preference first
        app.loadCachingPreference();
        console.log('✅ Caching preference loaded');

        // Setup event listeners
        setupKeyboardListeners();
        setupWindowListeners();
        console.log('✅ Event listeners configured');

        // Initialize components
        initializeSyntaxHighlighting();
        initializeTooltips();
        app.initializeTerminal();
        console.log('✅ Components initialized');

        // Try to restore session using handshake
        console.log('🔍 Attempting session restoration...');
        const sessionRestored = await app.tryHandshakeLogin();

        // If session wasn't restored, show login form
        if (!sessionRestored) {
            console.log('📝 Showing login form');
            const loginSection = document.getElementById('loginSection');
            if (loginSection) {
                loginSection.style.display = 'flex';
            }
        }

        console.log('✅ FC2 Dashboard initialization complete');

    } catch (error) {
        console.error('❌ Initialization failed:', error);
        app.showMessage('Failed to initialize application. Please refresh the page.', 'error');
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
            app.showMessage('An unexpected error occurred. Please try again.', 'error');
            window.lastErrorTime = Date.now();
        }
    });

    // Handle general JavaScript errors
    window.addEventListener('error', (event) => {
        console.error('JavaScript error:', event.error);
        
        // Don't spam user with too many error messages
        if (!window.lastErrorTime || Date.now() - window.lastErrorTime > 5000) {
            app.showMessage('An unexpected error occurred. Please try again.', 'error');
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
        app.showMessage('⚠️ localStorage not available. Some features may not work properly.', 'error');
    }

    if (!features.cookies && location.protocol !== 'file:') {
        app.showMessage('⚠️ Cookies not available. Session persistence may not work.', 'error');
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
            app.showMessage(message, type);
        },
        logState: () => {
            console.log('📊 Application State:', {
                apiKey: app.apiKey ? 'SET' : 'NOT SET',
                memberData: !!app.memberData,
                memberScripts: app.memberScripts.length,
                memberProjects: app.memberProjects.length,
                autoSaveEnabled: app.autoSaveEnabled,
                liveOmegaEnabled: app.liveOmegaEnabled,
                hasHandshakeToken: !!app.getHandshakeToken()
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

console.log('📦 FC2 Dashboard modules loaded successfully');