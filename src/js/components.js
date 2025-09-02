// Constelia Dashboard - Components
// Contains: UI components, color picker, displays, forms, and interactive elements

// ========================
// COLOR PICKER COMPONENT
// ========================
class ColorPicker {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            onChange: options.onChange || (() => {}),
            initialValue: options.initialValue || '#FFFFFF'
        };

        this.hue = 0;
        this.saturation = 0;
        this.value = 100;
        this.alpha = 1;

        this.isOpen = false;
        this.isDragging = false;

        this.init();
    }

    init() {
        this.parseInitialColor(this.options.initialValue);
        this.createElements();
        this.attachEvents();
        this.updateDisplay();
    }

    parseInitialColor(color) {
        let r, g, b, a = 1;

        if (color.startsWith('#')) {
            const hex = color.slice(1);

            if (hex.length === 6) {
                r = parseInt(hex.substr(0, 2), 16) / 255;
                g = parseInt(hex.substr(2, 2), 16) / 255;
                b = parseInt(hex.substr(4, 2), 16) / 255;
            } else if (hex.length === 8) {
                r = parseInt(hex.substr(0, 2), 16) / 255;
                g = parseInt(hex.substr(2, 2), 16) / 255;
                b = parseInt(hex.substr(4, 2), 16) / 255;
                a = parseInt(hex.substr(6, 2), 16) / 255;
            }

            const hsv = this.rgbToHsv(r, g, b);
            this.hue = hsv.h;
            this.saturation = hsv.s;
            this.value = hsv.v;
            this.alpha = a;
        }
    }

    createElements() {
        const wrapper = document.createElement('div');
        wrapper.className = 'color-picker-wrapper';

        const trigger = document.createElement('div');
        trigger.className = 'color-picker-trigger';
        trigger.innerHTML = `
            <div class="color-preview">
                <div class="color-preview-inner"></div>
            </div>
            <div class="color-value">#FFFFFF</div>
        `;

        const popup = document.createElement('div');
        popup.className = 'color-picker-popup';
        popup.style.position = 'fixed';
        popup.style.zIndex = '99999';
        popup.innerHTML = `
            <div class="color-picker-header">
                <div class="color-picker-title">Color Picker</div>
                <button class="color-picker-close">×</button>
            </div>
            
            <div class="color-canvas-wrapper">
                <canvas class="color-canvas" width="280" height="150"></canvas>
                <div class="color-cursor"></div>
            </div>
            
            <div class="hue-slider-wrapper">
                <div class="slider-label">Hue</div>
                <div class="hue-slider">
                    <div class="slider-thumb hue-thumb"></div>
                </div>
            </div>
            
            <div class="alpha-slider-wrapper">
                <div class="slider-label">Alpha</div>
                <div class="alpha-slider">
                    <div class="alpha-slider-gradient"></div>
                    <div class="slider-thumb alpha-thumb"></div>
                </div>
            </div>
            
            <div class="color-inputs">
                <div class="color-input-group" style="grid-column: 1 / -1;">
                    <label class="color-input-label">Hex (RRGGBBAA)</label>
                    <input type="text" class="color-input hex-input" maxlength="9" placeholder="#FFFFFFFF">
                </div>
                
                <div class="rgba-inputs" style="grid-column: 1 / -1;">
                    <div class="color-input-group">
                        <label class="color-input-label">R</label>
                        <input type="number" class="color-input r-input" min="0" max="255" value="255">
                    </div>
                    <div class="color-input-group">
                        <label class="color-input-label">G</label>
                        <input type="number" class="color-input g-input" min="0" max="255" value="255">
                    </div>
                    <div class="color-input-group">
                        <label class="color-input-label">B</label>
                        <input type="number" class="color-input b-input" min="0" max="255" value="255">
                    </div>
                    <div class="color-input-group">
                        <label class="color-input-label">A</label>
                        <input type="number" class="color-input a-input" min="0" max="100" value="100">
                    </div>
                </div>
            </div>
            
            <div class="color-actions">
                <button class="color-action-btn apply-btn">Apply</button>
                <button class="color-action-btn cancel">Cancel</button>
            </div>
        `;

        wrapper.appendChild(trigger);
        document.body.appendChild(popup);

        this.element.parentNode.replaceChild(wrapper, this.element);

        // Store references
        this.wrapper = wrapper;
        this.trigger = trigger;
        this.popup = popup;
        this.preview = trigger.querySelector('.color-preview-inner');
        this.valueDisplay = trigger.querySelector('.color-value');
        this.canvas = popup.querySelector('.color-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cursor = popup.querySelector('.color-cursor');
        this.hueSlider = popup.querySelector('.hue-slider');
        this.hueThumb = popup.querySelector('.hue-thumb');
        this.alphaSlider = popup.querySelector('.alpha-slider');
        this.alphaThumb = popup.querySelector('.alpha-thumb');
        this.alphaGradient = popup.querySelector('.alpha-slider-gradient');
        this.hexInput = popup.querySelector('.hex-input');
        this.rInput = popup.querySelector('.r-input');
        this.gInput = popup.querySelector('.g-input');
        this.bInput = popup.querySelector('.b-input');
        this.aInput = popup.querySelector('.a-input');
    }

    attachEvents() {
        // Trigger events
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.open();
        });

        // Close events
        this.popup.querySelector('.color-picker-close').addEventListener('click', () => this.close());
        this.popup.querySelector('.cancel').addEventListener('click', () => this.close());
        this.popup.querySelector('.apply-btn').addEventListener('click', () => this.apply());

        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.startCanvasDrag(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

        // Hue slider events
        this.hueSlider.addEventListener('mousedown', (e) => this.startHueDrag(e));
        this.hueSlider.addEventListener('click', (e) => this.handleHueClick(e));

        // Alpha slider events
        this.alphaSlider.addEventListener('mousedown', (e) => this.startAlphaDrag(e));
        this.alphaSlider.addEventListener('click', (e) => this.handleAlphaClick(e));

        // Input events
        this.hexInput.addEventListener('input', () => this.handleHexInput());
        this.rInput.addEventListener('input', () => this.handleRgbaInput());
        this.gInput.addEventListener('input', () => this.handleRgbaInput());
        this.bInput.addEventListener('input', () => this.handleRgbaInput());
        this.aInput.addEventListener('input', () => this.handleRgbaInput());

        // Global mouse events for dragging
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.popup.contains(e.target) && !this.trigger.contains(e.target)) {
                this.close();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.popup.classList.add('active');
        
        // Position the popup using fixed positioning
        const triggerRect = this.trigger.getBoundingClientRect();
        
        let left = triggerRect.left;
        let top = triggerRect.bottom + 8;
        
        // Keep popup within viewport
        if (left + 320 > window.innerWidth) {
            left = window.innerWidth - 320 - 10;
        }
        if (left < 10) {
            left = 10;
        }
        
        if (top + 450 > window.innerHeight) {
            top = triggerRect.top - 450 - 8;
        }
        if (top < 10) {
            top = 10;
        }
        
        this.popup.style.left = left + 'px';
        this.popup.style.top = top + 'px';
        
        this.updateCanvas();
        this.updateDisplay();
    }

    close() {
        this.isOpen = false;
        this.popup.classList.remove('active');
    }

    apply() {
        const hex8 = this.getHex8();
        this.options.onChange(hex8);
        this.close();
    }

    startCanvasDrag(e) {
        e.preventDefault();
        this.isDragging = 'canvas';
        this.handleCanvasClick(e);
    }

    startHueDrag(e) {
        e.preventDefault();
        this.isDragging = 'hue';
        this.handleHueClick(e);
    }

    startAlphaDrag(e) {
        e.preventDefault();
        this.isDragging = 'alpha';
        this.handleAlphaClick(e);
    }

    stopDrag() {
        this.isDragging = false;
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;

        if (this.isDragging === 'canvas') {
            this.handleCanvasClick(e);
        } else if (this.isDragging === 'hue') {
            this.handleHueClick(e);
        } else if (this.isDragging === 'alpha') {
            this.handleAlphaClick(e);
        }
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(280, e.clientX - rect.left));
        const y = Math.max(0, Math.min(150, e.clientY - rect.top));

        this.saturation = (x / 280) * 100;
        this.value = 100 - (y / 150) * 100;

        this.updateDisplay();
    }

    handleHueClick(e) {
        const rect = this.hueSlider.getBoundingClientRect();
        const x = Math.max(0, Math.min(280, e.clientX - rect.left));

        this.hue = (x / 280) * 360;
        this.updateCanvas();
        this.updateDisplay();
    }

    handleAlphaClick(e) {
        const rect = this.alphaSlider.getBoundingClientRect();
        const x = Math.max(0, Math.min(280, e.clientX - rect.left));

        this.alpha = x / 280;
        this.updateDisplay();
    }

    handleHexInput() {
        let hex = this.hexInput.value.replace('#', '');

        if (hex.length === 6 || hex.length === 8) {
            this.parseInitialColor('#' + hex);
            this.updateCanvas();
            this.updateDisplay(false);
        }
    }

    handleRgbaInput() {
        const r = parseInt(this.rInput.value) / 255;
        const g = parseInt(this.gInput.value) / 255;
        const b = parseInt(this.bInput.value) / 255;
        const a = parseInt(this.aInput.value) / 100;

        const hsv = this.rgbToHsv(r, g, b);
        this.hue = hsv.h;
        this.saturation = hsv.s;
        this.value = hsv.v;
        this.alpha = a;

        this.updateCanvas();
        this.updateDisplay(false);
    }

    updateCanvas() {
        const ctx = this.ctx;
        const width = 280;
        const height = 150;

        // Draw saturation/value gradient
        for (let x = 0; x < width; x++) {
            const saturation = (x / width) * 100;
            const gradient = ctx.createLinearGradient(0, 0, 0, height);

            const topColor = this.hsvToRgb(this.hue, saturation, 100);
            gradient.addColorStop(0, `rgb(${topColor.r * 255}, ${topColor.g * 255}, ${topColor.b * 255})`);
            gradient.addColorStop(1, 'black');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, 0, 1, height);
        }
    }

    updateDisplay(updateInputs = true) {
        const rgb = this.hsvToRgb(this.hue, this.saturation, this.value);
        const r = Math.round(rgb.r * 255);
        const g = Math.round(rgb.g * 255);
        const b = Math.round(rgb.b * 255);
        const a = Math.round(this.alpha * 255);

        // Update preview
        this.preview.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;

        // Update value display
        const hex8 = this.getHex8();
        this.valueDisplay.textContent = hex8;

        // Update cursor position
        const cursorX = (this.saturation / 100) * 280;
        const cursorY = ((100 - this.value) / 100) * 150;
        this.cursor.style.left = cursorX + 'px';
        this.cursor.style.top = cursorY + 'px';

        // Update hue thumb
        this.hueThumb.style.left = (this.hue / 360) * 280 + 'px';

        // Update alpha slider
        this.alphaGradient.style.background = `linear-gradient(to right, transparent, rgb(${r}, ${g}, ${b}))`;
        this.alphaThumb.style.left = this.alpha * 280 + 'px';

        // Update inputs
        if (updateInputs) {
            this.hexInput.value = hex8;
            this.rInput.value = r;
            this.gInput.value = g;
            this.bInput.value = b;
            this.aInput.value = Math.round(this.alpha * 100);
        }
    }

    getHex8() {
        const rgb = this.hsvToRgb(this.hue, this.saturation, this.value);
        const r = Math.round(rgb.r * 255);
        const g = Math.round(rgb.g * 255);
        const b = Math.round(rgb.b * 255);
        const a = Math.round(this.alpha * 255);

        const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
        return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
    }

    // Color conversion functions
    hsvToRgb(h, s, v) {
        h = h / 360;
        s = s / 100;
        v = v / 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = v;
        } else {
            const i = Math.floor(h * 6);
            const f = h * 6 - i;
            const p = v * (1 - s);
            const q = v * (1 - s * f);
            const t = v * (1 - s * (1 - f));

            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }
        }

        return { r, g, b };
    }

    rgbToHsv(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;

        let h, s, v = max;

        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: h * 360,
            s: s * 100,
            v: v * 100
        };
    }
}

// ========================
// BUILT-IN SCRIPT CONFIGURATIONS
// ========================
const BUILTIN_SCRIPT_CONFIGS = {
    omega: {
        'constellation.lua': {
            esp: true,
            esp_surround: true,
            esp_sonar: true,
            esp_fov: 16.0,
            humanizer: true,
            humanizer_debug: true,
            humanizer_smart_smooth: false,
            humanizer_smart_smooth_scale: 0.3,
            humanizer_smart_smooth_compensation_scale: 1.0,
            humanizer_mouse_threshold: 20,
            humanizer_range_min: 0.1,
            humanizer_range_max: 7.0,
            humanizer_dynamic_fov_percentage: 100
        },
        'aurora.lua': {
            enabled: false,
            hint: true,
            triggerbot: true,
            humanizer: true,
            key_hint: 18,
            key_triggerbot: 20,
            sens_hint: 35,
            sens_triggerbot: 3.5,
            hint_perpetual: true,
            hint_speed: 1,
            triggerbot_hitchance_min: 0,
            triggerbot_delay: 0,
            triggerbot_magnet: true,
            triggerbot_magnet_smoothness: 1.0,
            triggerbot_hitchance: true,
            triggerbot_automatic_scope: true,
            triggerbot_automatic_scope_delay: 100,
            humanizer_smart_smooth: true,
            humanizer_smart_smooth_scale: 0.3,
            humanizer_smart_smooth_compensation_scale: 1.0,
            humanizer_mouse_threshold: 20,
            humanizer_range_min: 0.1,
            humanizer_range_max: 7.0,
            standalone_rcs: false,
            standalone_rcs_block_humanizer: false,
            standalone_rcs_only_near_target: true,
            standalone_rcs_key_toggle: 0,
            standalone_rcs_sensitivity_x: 2,
            standalone_rcs_sensitivity_y: 2,
            standalone_rcs_smoothness: 0.5,
            standalone_rcs_threshold: 250,
            crosshair_esp: false,
            crosshair_esp_fov: 6.0,
            friendly_fire: false,
            team_safe_targeting: false,
            manual_calibration: false,
            fov: 16
        },
        'constelia.lua': {
            launch_voice: true
        },
        'who.lua': {
            enabled: false
        }
    }
};

// ========================
// EXTEND APP WITH COMPONENTS
// ========================
Object.assign(app, {

    // ========================
    // DISPLAY COMPONENTS
    // ========================

    displayMyScripts() {
        const container = document.getElementById('myScriptsGrid');

        if (this.memberScripts.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">You don\'t have any active scripts</p>';
            return;
        }

        const softwareNames = {
            4: 'Omega', // FC2 Global is pretty much just Omega at this point
            5: 'Universe4',
            6: 'Omega', // Constellation4 no longer exists
            7: 'Parallax2'
        };

        container.innerHTML = this.memberScripts.map(script => {
            const softwareName = softwareNames[script.software] || `Software ${script.software}`;
            const isOwned = script.author === this.memberData.username ||
                (script.team && script.team.includes(this.memberData.username));

            return `
                <div class="script-card compact ${isOwned ? 'owned' : ''}" 
                    data-script-name="${script.name.toLowerCase()}" 
                    data-script-author="${script.author.toLowerCase()}" 
                    data-script-author-display="${script.author}"
                    data-script-updated="${script.last_update || 0}" 
                    data-script-software="${script.software}"
                    data-script-software-name="${softwareName}">
                    <div class="script-header">
                        <div class="script-info">
                            <div class="script-name" style="display: flex; align-items: center; gap: 10px;">
                                ${script.name}
                                ${isOwned ? `<button class="btn btn-small" onclick="app.editScript(${script.id})" style="font-size: 12px; padding: 4px 8px;">✏️ Edit</button>` : ''}
                            </div>
                            <div class="script-meta">
                                <span class="script-author">by ${script.author}</span>
                                <span>ID: ${script.id}</span>
                                ${script.users !== undefined ? `<span title="All-Seeing Eye: Active users">👁️ ${script.users} users</span>` : ''}
                            </div>
                            <div class="script-meta">
                                <span>Software: ${softwareName}</span>
                                <span>Updated: ${script.elapsed || 'Never'}</span>
                            </div>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                                ${script.forums ? `
                                    <a href="${script.forums}" target="_blank" class="forum-link">
                                        💬 Forum Thread
                                    </a>
                                ` : ''}
                                <div class="script-link" onclick="app.showScriptSource(${script.id})" style="color: #4aff4a; border-color: rgba(74, 255, 74, 0.3); background: rgba(74, 255, 74, 0.1);">
                                    📜 Script Source
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div class="toggle-switch active" onclick="app.toggleScript(${script.id}, this)" title="Disable script">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    displayAvailableScripts() {
        const container = document.getElementById('availableScriptsGrid');
        const activeScriptIds = this.memberScripts.map(s => String(s.id));

        const softwareNames = {
            4: 'Omega', // FC2 Global is pretty much just Omega at this point
            5: 'Universe4',
            6: 'Omega', // Constellation4 no longer exists
            7: 'Parallax2'
        };

        // Populate filter options
        this.populateFilterOptions();

        container.innerHTML = this.allScripts.map(script => {
            const isActive = activeScriptIds.includes(String(script.id));
            const isOwned = script.author === this.memberData.username ||
                (script.team && script.team.includes(this.memberData.username));
            const softwareName = softwareNames[script.software] || `Software ${script.software}`;

            return `
                <div class="script-card ${isOwned ? 'owned' : ''}" 
                    data-script-name="${script.name.toLowerCase()}" 
                    data-script-author="${script.author.toLowerCase()}"
                    data-script-author-display="${script.author}"
                    data-script-software-name="${softwareName}"
                    data-script-categories="${(script.category_names || []).join(',')}"
                    data-script-updated="${script.last_update || 0}"
                    data-matches-search="true">
                    <div class="script-header">
                        <div class="script-info">
                            <div class="script-name" style="display: flex; align-items: center; gap: 10px;">
                                ${script.name}
                                ${isOwned ? `<button class="btn btn-small" onclick="app.editScript(${script.id})" style="font-size: 12px; padding: 4px 8px;">✏️ Edit</button>` : ''}
                            </div>
                            <div class="script-meta">
                                <span class="script-author">by ${script.author}</span>
                                <span>ID: ${script.id}</span>
                                ${script.users !== undefined ? `<span title="All-Seeing Eye: Active users">👁️ ${script.users} users</span>` : ''}
                            </div>
                            ${script.category_names ? `
                                <div class="script-categories">
                                    ${script.category_names.map(cat => `<span class="category-badge">${cat}</span>`).join('')}
                                </div>
                            ` : ''}
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                                ${script.forums ? `
                                    <a href="${script.forums}" target="_blank" class="forum-link">
                                        💬 Forum Thread
                                    </a>
                                ` : ''}
                                <div class="script-link" onclick="app.showScriptSource(${script.id})" style="color: #4aff4a; border-color: rgba(74, 255, 74, 0.3); background: rgba(74, 255, 74, 0.1);">
                                    📜 Script Source
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="toggle-switch ${isActive ? 'active' : ''}" onclick="app.toggleScript(${script.id}, this)">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                    <p style="margin-top: 10px; color: #aaa; font-size: 14px;">
                        <strong>Last Updated:</strong> ${script.elapsed || 'Never'}
                    </p>
                </div>
            `;
        }).join('');
    },

    displayMyProjects() {
        const container = document.getElementById('myProjectsGrid');

        if (this.memberProjects.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">You don\'t have any active projects</p>';
            return;
        }

        container.innerHTML = this.memberProjects.map(project => {
            const isOwned = project.author === this.memberData.username;

            return `
                <div class="project-card compact ${isOwned ? 'owned' : ''}" 
                     data-project-name="${project.name.toLowerCase()}" 
                     data-project-author="${project.author.toLowerCase()}" 
                     data-project-author-display="${project.author}"
                     data-project-updated="${project.last_update || 0}">
                    <div class="project-header">
                        <div class="project-info">
                            <div class="project-name">${project.name}</div>
                            <div class="project-meta">
                                <span class="project-author">by ${project.author}</span>
                                <span>ID: ${project.id}</span>
                            </div>
                            <div class="project-meta">
                                <span>Updated: ${this.getElapsedTime(project.last_update) || 'Never'}</span>
                            </div>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                                ${project.thread ? `
                                    <a href="${project.thread}" target="_blank" class="forum-link">
                                        💬 Forum Thread
                                    </a>
                                ` : ''}
                                ${project.assoc_script ? `
                                    <div class="script-link" onclick="app.jumpToScript(${project.assoc_script})">
                                        📜 Related Script
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="toggle-switch active" onclick="app.toggleProject(${project.id}, this)" title="Disable project">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    displayAvailableProjects() {
        const container = document.getElementById('availableProjectsGrid');
        const activeProjectIds = this.memberProjects.map(p => String(p.id));

        // Populate filter options
        this.populateProjectFilterOptions();

        container.innerHTML = this.allProjects.map(project => {
            const isActive = activeProjectIds.includes(String(project.id));
            const isOwned = project.author === this.memberData.username;

            return `
                <div class="project-card ${isOwned ? 'owned' : ''}" 
                     data-project-name="${project.name.toLowerCase()}" 
                     data-project-author="${project.author.toLowerCase()}"
                     data-project-author-display="${project.author}"
                     data-project-updated="${project.last_update || 0}"
                     data-matches-search="true">
                    <div class="project-header">
                        <div class="project-info">
                            <div class="project-name">${project.name}</div>
                            <div class="project-meta">
                                <span class="project-author">by ${project.author}</span>
                                <span>ID: ${project.id}</span>
                            </div>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                                ${project.thread ? `
                                    <a href="${project.thread}" target="_blank" class="forum-link">
                                        💬 Forum Thread
                                    </a>
                                ` : ''}
                                ${project.assoc_script ? `
                                    <div class="script-link" onclick="app.jumpToScript(${project.assoc_script})">
                                        📜 Related Script
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="toggle-switch ${isActive ? 'active' : ''}" onclick="app.toggleProject(${project.id}, this)">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                    <p style="margin-top: 10px; color: #aaa; font-size: 14px;">
                        <strong>Last Updated:</strong> ${this.getElapsedTime(project.last_update) || 'Never'}
                    </p>
                </div>
            `;
        }).join('');
    },

    getElapsedTime(timestamp) {
        if (!timestamp) return 'Never';

        const updateTime = parseInt(timestamp) * 1000;
        const now = Date.now();
        const diffMs = now - updateTime;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return '1 day ago';
        } else if (diffDays < 30) {
            return `${diffDays} days ago`;
        } else if (diffDays < 365) {
            const diffMonths = Math.floor(diffDays / 30);
            return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
        } else {
            const diffYears = Math.floor(diffDays / 365);
            return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
        }
    },

    // ========================
    // AUTO-SAVE & PREFERENCES
    // ========================

    loadAutoSavePreference() {
        if (!this.cachingEnabled) {
            // Use defaults when caching is disabled
            this.autoSaveEnabled = false;
            this.liveOmegaEnabled = false;
        } else {
            try {
                const autoSavePref = localStorage.getItem('fc2_auto_save');
                this.autoSaveEnabled = autoSavePref === 'true';

                const liveOmegaPref = localStorage.getItem('fc2_live_omega');
                this.liveOmegaEnabled = liveOmegaPref === 'true';
                
            } catch (error) {
                console.warn('Could not load preferences:', error);
                this.autoSaveEnabled = false;
                this.liveOmegaEnabled = false;
            }
        }

        // Update UI
        setTimeout(() => {
            const autoSaveToggle = document.getElementById('autoSaveToggle');
            const liveOmegaToggle = document.getElementById('liveOmegaToggle');
            const liveOmegaContainer = document.getElementById('liveOmegaContainer');
            const alphabeticalToggle = document.getElementById('alphabeticalToggle');

            if (autoSaveToggle) {
                if (this.autoSaveEnabled) {
                    autoSaveToggle.classList.add('active');
                } else {
                    autoSaveToggle.classList.remove('active');
                }
            }

            if (liveOmegaToggle) {
                if (this.liveOmegaEnabled) {
                    liveOmegaToggle.classList.add('active');
                } else {
                    liveOmegaToggle.classList.remove('active');
                }
            }

            if (liveOmegaContainer) {
                if (this.autoSaveEnabled) {
                    liveOmegaContainer.classList.add('visible');
                } else {
                    liveOmegaContainer.classList.remove('visible');
                }
            }

            // Initialize alphabetical toggle state (will be updated when a script is selected)
            if (alphabeticalToggle) {
                alphabeticalToggle.classList.remove('active');
            }
        }, 100);
    },

    saveAutoSavePreference() {
        if (!this.cachingEnabled) {
            return;
        }
        
        try {
            localStorage.setItem('fc2_auto_save', this.autoSaveEnabled.toString());
            localStorage.setItem('fc2_live_omega', this.liveOmegaEnabled.toString());
        } catch (error) {
            console.warn('Could not save preferences:', error);
        }
    },

    toggleAutoSave() {
        this.autoSaveEnabled = !this.autoSaveEnabled;
        this.saveAutoSavePreference();

        const toggle = document.getElementById('autoSaveToggle');
        const liveOmegaContainer = document.getElementById('liveOmegaContainer');

        if (toggle) {
            if (this.autoSaveEnabled) {
                toggle.classList.add('active');
                this.showMessage('Auto-save enabled', 'success');

                // Show Live Omega option
                if (liveOmegaContainer) {
                    liveOmegaContainer.classList.add('visible');
                }
            } else {
                toggle.classList.remove('active');
                this.showMessage('Auto-save disabled', 'success');

                // Hide Live Omega option and disable it
                if (liveOmegaContainer) {
                    liveOmegaContainer.classList.remove('visible');
                }

                // Also disable Live Omega if it was enabled
                if (this.liveOmegaEnabled) {
                    this.liveOmegaEnabled = false;
                    this.saveAutoSavePreference();
                    const liveOmegaToggle = document.getElementById('liveOmegaToggle');
                    if (liveOmegaToggle) {
                        liveOmegaToggle.classList.remove('active');
                    }
                }
            }
        }
    },

    toggleLiveOmega() {
        this.liveOmegaEnabled = !this.liveOmegaEnabled;
        this.saveAutoSavePreference();

        const toggle = document.getElementById('liveOmegaToggle');
        if (toggle) {
            if (this.liveOmegaEnabled) {
                toggle.classList.add('active');
                this.showMessage('🚀 Live Omega updates enabled! Changes will be pushed to Omega automatically.', 'success');
            } else {
                toggle.classList.remove('active');
                this.showMessage('Live Omega updates disabled', 'success');
            }
        }
    },

    toggleAlphabeticalSort() {
        if (!this.currentScriptKey) {
            this.showMessage('Please select a script first', 'error');
            return;
        }

        // Create a unique key for this script's sorting preference
        const sortKey = `alphabeticalSort_${this.currentScriptKey}`;
        const currentState = localStorage.getItem(sortKey) === 'true';
        const newState = !currentState;
        localStorage.setItem(sortKey, newState.toString());

        const toggle = document.getElementById('alphabeticalToggle');
        if (toggle) {
            if (newState) {
                toggle.classList.add('active');
                this.showMessage(`🔤 Alphabetical sorting enabled for ${this.currentScriptKey}`, 'success');
            } else {
                toggle.classList.remove('active');
                this.showMessage(`Settings will display in original order for ${this.currentScriptKey}`, 'success');
            }
        }

        // Reload the current script config to apply the sorting preference
        this.loadScriptConfig();
    },

    loadPreviewScriptConfig() {
        const editor = document.getElementById('scriptConfigEditor');
        
        if (!this.previewScriptData) {
            editor.style.display = 'none';
            return;
        }

        editor.style.display = 'block';
        this.currentScriptKey = '__preview__';

        // Extract default configuration values from the script using existing parser
        const scriptContent = localStorage.getItem(`preview_script_content`);
        if (scriptContent) {
            this.currentScriptConfig = this.parseScriptForDefaults(scriptContent, this.previewScriptData.name);
            console.log('Parsed config values:', Object.keys(this.currentScriptConfig));
            console.log('Full config:', this.currentScriptConfig);
        } else {
            this.currentScriptConfig = {};
        }
        
        // Store preview metadata temporarily for renderConfigForm to use
        this.previewConfigMetadata = {
            categories: this.previewScriptData.categories,
            dropdowns: this.previewScriptData.dropdowns,
            ranges: this.previewScriptData.ranges,
            multiselects: this.previewScriptData.multiselects,
            descriptions: this.previewScriptData.descriptions,
            requires: this.previewScriptData.requires
        };
        
        // Use the existing renderConfigForm system
        this.renderConfigForm();

        // Add preview indicator
        const existingIndicator = editor.querySelector('.preview-indicator');
        if (!existingIndicator) {
            const indicator = document.createElement('div');
            indicator.className = 'preview-indicator';
            indicator.innerHTML = `
                <div style="background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 8px; padding: 10px; margin-bottom: 20px;">
                    <div style="color: #ffc107; font-weight: bold; margin-bottom: 5px;">🧪 Preview Mode</div>
                    <div style="color: #aaa; font-size: 14px;">
                        Viewing configuration preview for "${this.previewScriptData.fileName}". 
                        This is for testing purposes only and will not be saved.
                    </div>
                </div>
            `;
            editor.insertBefore(indicator, editor.firstChild);
        }
    },


    triggerAutoSave() {
        if (!this.autoSaveEnabled) {
            return;
        }


        // Clear any existing timeout
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }

        // Set a delay to avoid too many rapid saves
        this.autoSaveTimeout = setTimeout(() => {
            // Use live Omega if enabled
            this.saveScriptConfig(true, this.liveOmegaEnabled);
        }, 500); // 500ms delay
    },

    // ========================
    // UTILITY METHODS
    // ========================

    populateFilterOptions() {
        const softwareNames = {
            4: 'Omega', // FC2 Global is pretty much just Omega at this point
            5: 'Universe4',
            6: 'Omega', // Constellation4 no longer exists
            7: 'Parallax2'
        };

        const uniqueAuthors = [...new Set(this.allScripts.map(s => s.author))].sort();
        const uniqueSoftware = [...new Set(this.allScripts.map(s => softwareNames[s.software] || `Software ${s.software}`))].sort();
        const uniqueCategories = [...new Set(this.allScripts.flatMap(s => s.category_names || []))].sort();

        // Author filters
        document.getElementById('authorFilters').innerHTML = uniqueAuthors.map(author => `
            <div class="filter-option" onclick="app.toggleFilter('author', '${author}')">
                <div class="filter-checkbox" data-type="author" data-value="${author}"></div>
                <div class="filter-label">${author}</div>
            </div>
        `).join('');

        // Software filters
        document.getElementById('softwareFilters').innerHTML = uniqueSoftware.map(software => `
            <div class="filter-option" onclick="app.toggleFilter('software', '${software}')">
                <div class="filter-checkbox" data-type="software" data-value="${software}"></div>
                <div class="filter-label">${software}</div>
            </div>
        `).join('');

        // Category filters
        document.getElementById('categoryFilters').innerHTML = uniqueCategories.map(category => `
            <div class="filter-option" onclick="app.toggleFilter('category', '${category}')">
                <div class="filter-checkbox" data-type="category" data-value="${category}"></div>
                <div class="filter-label">${category}</div>
            </div>
        `).join('');
    },

    populateProjectFilterOptions() {
        const uniqueAuthors = [...new Set(this.allProjects.map(p => p.author))].sort();

        // Project author filters
        document.getElementById('projectAuthorFilters').innerHTML = uniqueAuthors.map(author => `
            <div class="filter-option" onclick="app.toggleProjectFilter('author', '${author}')">
                <div class="filter-checkbox" data-type="author" data-value="${author}"></div>
                <div class="filter-label">${author}</div>
            </div>
        `).join('');
    },

    populateScriptConfigSelect() {
        const select = document.getElementById('scriptConfigSelect');

        // Don't populate if a software is already selected - let onSoftwareChange handle it
        const currentSoftware = document.getElementById('softwareSelect').value;
        if (currentSoftware) {
            return; // Let the software-specific logic handle script population
        }

        if (this.memberScripts.length === 0) {
            select.innerHTML = '<option value="">No active scripts</option>';
            select.disabled = true;
        } else {
            select.disabled = false;
            select.innerHTML = '<option value="">Select a software first...</option>';
        }
    },

    // ========================
    // PERKS SYSTEM COMPONENTS
    // ========================

    async loadPerks() {
        try {
            const perks = await this.apiCall('listPerks');
            this.allPerks = perks;

            // memberData is already loaded, just extract the perks array
            this.ownedPerks = this.memberData.perks || [];

            this.displayPerks();
            this.updatePerkStats();
            
            // Venus status will be loaded when the perks tab is actually shown

        } catch (error) {
            console.error('Error loading perks:', error);
            this.showMessage('Failed to load perks', 'error');
        }
    },

    updatePerkStats() {
        if (!this.memberData) return;

        const perkPoints = this.memberData.perk_points || 0;
        const totalXP = this.memberData.xp || 0;
        const activePerksCount = this.ownedPerks.length;

        document.getElementById('perkPoints').textContent = perkPoints;
        document.getElementById('totalXP').textContent = totalXP.toLocaleString();
        document.getElementById('activePerks').textContent = activePerksCount;
    },
    
    getPerkIcon(perkId) {
        const iconMap = {
            1: '🎨',   // Artist
            2: '👥',   // Squad
            3: '🤖',   // Bond Between Human and AI
            4: '💕',   // Venus
            5: '🩸',   // Blood of Mars
            6: '✍️',   // Autograph
            7: '🌍',   // World Within Us
            8: '🌌',   // Different Dimension Traveler
            9: '🚀',   // Space Crew
            10: '🌟',  // Supernova
            11: '🎁',  // Abundance of Jupiter
            12: '🔧',  // Space Engineer
            13: '🌠',  // Galactic Team (discontinued)
            14: '✨',  // Astrotheology
            15: '❄️',  // Arctic of Uranus
            16: '📊',  // Star Registry
            17: '🛡️',  // Spacesuit
            18: '📸',  // Universe Photographer
            19: '⏰',  // Chronograph
            20: '📜',  // Spacecraft Historian
            21: '🧮',  // Mathematician
            22: '👁️',  // All-Seeing Eye
            23: '🌀',  // Astral Voyager
            24: '💫',  // Galactic Altruist
            25: '🪐',  // Saturn's Favor
            26: '🌙'   // Lunar Rhythm
        };
        return iconMap[perkId] || '✨';
    },

    displayPerks() {
        const container = document.getElementById('perksGrid');

        if (!this.allPerks || this.allPerks.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">No perks available</p>';
            return;
        }

        const ownedPerkIds = this.ownedPerks.map(perk => perk.id);
        const perkPoints = this.memberData?.perk_points || 0;
        const nonPurchasablePerks = [10, 13, 23, 24];

        container.innerHTML = this.allPerks.map(perk => {
            const isOwned = ownedPerkIds.includes(perk.id);
            const isPurchasable = !nonPurchasablePerks.includes(perk.id);
            const canAfford = isPurchasable && perkPoints >= 1;
            const isVenus = perk.name.toLowerCase().includes('venus');

            let buttonHTML = '';
            if (isOwned) {
                buttonHTML = `
                    <div style="color: #4aff4a; font-size: 12px; text-align: center; font-weight: 600;">
                        ✅ ACTIVE
                    </div>
                `;
            } else if (!isPurchasable) {
                buttonHTML = `
                    <div style="color: #888; font-size: 12px; text-align: center; font-weight: 600;">
                        🚫 NOT PURCHASABLE
                    </div>
                `;
            } else if (canAfford) {
                buttonHTML = `
                    <button class="btn btn-small" onclick="app.buyPerk(${perk.id})">
                        💎 Buy (1 point)
                    </button>
                `;
            } else {
                buttonHTML = `
                    <button class="btn btn-small btn-danger" disabled title="Not enough perk points">
                        ❌ Need 1 Point
                    </button>
                `;
            }

            // Calculate bonus for specific perks
            let bonusBadge = '';
            if (isOwned) {
                switch(perk.id) {
                    case 4: // Venus
                        bonusBadge = '<span style="color: #ff69b4; font-size: 12px; background: rgba(255, 105, 180, 0.2); padding: 2px 8px; border-radius: 12px; margin-left: 5px;">25% XP Share</span>';
                        break;
                    case 5: // Blood of Mars
                        bonusBadge = '<span style="color: #ff4a4a; font-size: 12px; background: rgba(255, 74, 74, 0.2); padding: 2px 8px; border-radius: 12px; margin-left: 5px;">10% Daily Chance</span>';
                        break;
                    case 14: // Astrotheology
                        const tarotCount = this.memberData?.achievements?.length || 0;
                        const tarotBonus = tarotCount;
                        bonusBadge = `<span style="color: #9b59b6; font-size: 12px; background: rgba(155, 89, 182, 0.2); padding: 2px 8px; border-radius: 12px; margin-left: 5px;">+${tarotBonus}% XP</span>`;
                        break;
                    case 17: // Spacesuit
                        const reduction = this.memberData?.groups?.includes('60') ? 20 : 10; // Check if VIP/Veteran
                        bonusBadge = `<span style="color: #00bfff; font-size: 12px; background: rgba(0, 191, 255, 0.2); padding: 2px 8px; border-radius: 12px; margin-left: 5px;">-${reduction}% XP Loss</span>`;
                        break;
                    case 25: // Saturn's Favor
                        const isTop50 = false; // You'd need to check leaderboard position
                        const saturnBonus = isTop50 ? '-10%' : '+10%';
                        const saturnColor = isTop50 ? '#ff4a4a' : '#4aff4a';
                        bonusBadge = `<span style="color: ${saturnColor}; font-size: 12px; background: rgba(255, 215, 0, 0.2); padding: 2px 8px; border-radius: 12px; margin-left: 5px;">${saturnBonus} XP</span>`;
                        break;
                    case 21: // Mathematician
                        bonusBadge = '<span style="color: #8a2be2; font-size: 12px; background: rgba(138, 43, 226, 0.2); padding: 2px 8px; border-radius: 12px; margin-left: 5px;">XP Bonus Tracking</span>';
                        break;
                }
            }

            return `
                <div class="script-card ${isOwned ? 'owned' : ''}" 
                    data-perk-name="${perk.name.toLowerCase()}" 
                    data-perk-owned="${isOwned}"
                    data-perk-affordable="${canAfford}"
                    data-matches-search="true">
                    <div class="script-header">
                        <div class="script-info">
                            <div class="script-name" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                ${this.getPerkIcon(perk.id)} ${perk.name}
                                ${isOwned ? '<span style="color: #4aff4a; font-size: 12px; background: rgba(74, 255, 74, 0.2); padding: 2px 8px; border-radius: 12px;">OWNED</span>' : ''}
                                ${bonusBadge}
                            </div>
                            <div class="script-meta">
                                <span>Cost: ${isPurchasable ? '1 perk point' : 'Not purchasable'}</span>
                                <span>ID: ${perk.id}</span>
                            </div>
                            ${perk.description ? `
                                <p style="margin-top: 10px; color: #ccc; font-size: 14px; line-height: 1.4;">
                                    ${perk.description}
                                </p>
                            ` : ''}
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                            ${buttonHTML}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    async buyPerk(perkId) {
        const perk = this.allPerks.find(p => p.id === perkId);
        if (!perk) return;

        if (!confirm(`Are you sure you want to buy "${perk.name}" for ${perk.cost} perk point${perk.cost !== 1 ? 's' : ''}?`)) {
            return;
        }

        try {
            await this.apiCall('buyPerk', {
                id: perkId
            });
            this.showMessage(`Successfully purchased "${perk.name}"!`, 'success');
            await this.loadPerks();
        } catch (error) {
            console.error('Error buying perk:', error);
            this.showMessage(`Failed to buy perk: ${error.message}`, 'error');
        }
    },

    async refreshPerks() {
        await this.loadPerks();
        this.showMessage('Perks refreshed!', 'success');
    },

    async respecPerks() {
        if (!confirm('Are you sure you want to respec all perks? This will cost 3000 XP and cannot be undone!')) {
            return;
        }

        if (!confirm('This will remove ALL purchased perks and cost 3000 XP. Are you absolutely sure?')) {
            return;
        }

        try {
            await this.apiCall('respecPerks');
            this.showMessage('All perks have been reset! You lost 3000 XP but gained back your perk points.', 'success');
            await this.loadPerks();
            await this.loadMemberInfo();
        } catch (error) {
            console.error('Error respeccing perks:', error);
            this.showMessage(`Failed to respec perks: ${error.message}`, 'error');
        }
    },

    async setForumBackground() {
        const urlInput = document.getElementById('forumBackgroundUrl');
        const statusDiv = document.getElementById('forumBackgroundStatus');
        
        if (!urlInput || !urlInput.value.trim()) {
            this.showMessage('Please enter a valid image URL', 'error');
            return;
        }
        
        const url = urlInput.value.trim();
        if (url.length > 256) {
            this.showMessage('URL must be 256 characters or less', 'error');
            return;
        }
        
        try {
            statusDiv.innerHTML = '<div class="spinner"></div>';
            
            const result = await this.apiPost('setForumBackground', {}, { url: url });
            
            // The API returns "updated to '[url]'" on success
            if (result.success || (result.message && result.message.includes('updated to'))) {
                this.showMessage('Forum background updated successfully!', 'success');
                statusDiv.innerHTML = '<span style="color: #4CAF50;">✅ Background set successfully!</span>';
                
                // Update member data
                if (this.memberData) {
                    this.memberData.forum_background = url;
                }
                
                // Update the display
                this.updateMemberInfoDisplay();
            } else {
                throw new Error(result.message || 'Failed to set forum background');
            }
        } catch (error) {
            console.error('Error setting forum background:', error);
            this.showMessage(`Failed to set background: ${error.message}`, 'error');
            statusDiv.innerHTML = `<span style="color: #f44336;">❌ ${error.message}</span>`;
        }
    },
    
    async clearForumBackground() {
        const statusDiv = document.getElementById('forumBackgroundStatus');
        const urlInput = document.getElementById('forumBackgroundUrl');
        
        try {
            statusDiv.innerHTML = '<div class="spinner"></div>';
            
            const result = await this.apiPost('setForumBackground', {}, { url: '' });
            
            // The API returns "updated to ''" or similar on success
            if (result.success || (result.message && (result.message.includes('updated to') || result.message.includes('cleared')))) {
                this.showMessage('Forum background cleared!', 'success');
                statusDiv.innerHTML = '<span style="color: #4CAF50;">✅ Background cleared!</span>';
                if (urlInput) urlInput.value = '';
                
                // Update member data
                if (this.memberData) {
                    this.memberData.forum_background = null;
                }
                
                // Update the display
                this.updateMemberInfoDisplay();
            } else {
                throw new Error(result.message || 'Failed to clear forum background');
            }
        } catch (error) {
            console.error('Error clearing forum background:', error);
            this.showMessage(`Failed to clear background: ${error.message}`, 'error');
            statusDiv.innerHTML = `<span style="color: #f44336;">❌ ${error.message}</span>`;
        }
    },

    filterPerks() {
        const searchInput = document.getElementById('perkSearch');
        const filterSelect = document.getElementById('perkFilter');
        const perkCards = document.querySelectorAll('#perksGrid .script-card');

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const filterType = filterSelect ? filterSelect.value : 'all';

        const nonPurchasablePerks = [10, 13, 23, 24];
        const perkPoints = this.memberData?.perk_points || 0;

        perkCards.forEach(card => {
            const name = card.dataset.perkName || '';
            const isOwned = card.dataset.perkOwned === 'true';

            const perkId = parseInt(card.querySelector('.script-meta span:last-child').textContent.replace('ID: ', ''));
            const isPurchasable = !nonPurchasablePerks.includes(perkId);
            const isAffordable = isPurchasable && perkPoints >= 1;

            let showCard = true;

            if (searchTerm && !name.includes(searchTerm)) {
                showCard = false;
            }

            switch (filterType) {
                case 'available':
                    if (isOwned || !isPurchasable) showCard = false;
                    break;
                case 'owned':
                    if (!isOwned) showCard = false;
                    break;
                case 'affordable':
                    if (isOwned || !isAffordable) showCard = false;
                    break;
            }

            card.style.display = showCard ? 'block' : 'none';
        });
    },

    // ========================
    // BUILD SYSTEM COMPONENTS
    // ========================

    async loadBuilds() {
        try {
            const response = await this.apiCall('getBuilds');
            this.allBuilds = response || [];

            this.myBuilds = this.allBuilds.filter(build =>
                build.author === this.memberData.username &&
                (build.private !== 1 || build.author === this.memberData.username)
            );

            this.displayMyBuilds();
            this.displayAvailableBuilds();

            setTimeout(() => {
                this.sortMyBuilds();
                this.sortAvailableBuilds();
            }, 100);

        } catch (error) {
            console.error('Error loading builds:', error);
            this.showMessage('Failed to load builds', 'error');
        }
    },

    displayMyBuilds() {
        const container = document.getElementById('myBuildsGrid');

        if (this.myBuilds.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">You haven\'t created any builds yet</p>';
            return;
        }

        container.innerHTML = this.myBuilds.map(build => {
            const scriptIds = JSON.parse(build.scripts || '[]');
            const projectIds = JSON.parse(build.projects || '[]');
            const isPrivate = build.private === 1;

            return `
                <div class="script-card compact owned" 
                    data-build-tag="${build.tag.toLowerCase()}" 
                    data-build-author="${build.author.toLowerCase()}" 
                    data-build-author-display="${build.author}"
                    data-build-popularity="${build.popularity || 0}">
                    <div class="script-header">
                        <div class="script-info">
                            <div class="script-name" style="display: flex; align-items: center; gap: 10px;">
                                ${isPrivate ? '🔒 ' : ''}${build.tag}
                                <span style="color: #4aff4a; font-size: 12px; background: rgba(74, 255, 74, 0.2); padding: 2px 8px; border-radius: 12px;">MINE</span>
                            </div>
                            <div class="script-meta">
                                <span>by ${build.author}</span>
                                <span>Popularity: ${build.popularity || 0}</span>
                            </div>
                            <div class="script-meta">
                                <span>${scriptIds.length} script${scriptIds.length !== 1 ? 's' : ''}</span>
                                <span>${projectIds.length} project${projectIds.length !== 1 ? 's' : ''}</span>
                                ${build.configuration ? '<span>✅ Config</span>' : '<span>❌ No Config</span>'}
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                            <button class="btn btn-small" onclick="app.previewBuild('${build.tag}')" title="Apply this build">
                                🚀 Apply
                            </button>
                            <button class="btn btn-small btn-danger" onclick="app.deleteBuild('${build.tag}')" title="Delete this build">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    displayAvailableBuilds() {
        const container = document.getElementById('availableBuildsGrid');

        const availableBuilds = this.allBuilds.filter(build =>
            build.private !== 1 || build.author === this.memberData.username
        );

        this.populateBuildFilterOptions();

        container.innerHTML = availableBuilds.map(build => {
            const scriptIds = JSON.parse(build.scripts || '[]');
            const projectIds = JSON.parse(build.projects || '[]');
            const isOwned = build.author === this.memberData.username;
            const isPrivate = build.private === 1;

            return `
                <div class="script-card ${isOwned ? 'owned' : ''}" 
                    data-build-tag="${build.tag.toLowerCase()}" 
                    data-build-author="${build.author.toLowerCase()}"
                    data-build-author-display="${build.author}"
                    data-build-popularity="${build.popularity || 0}"
                    data-matches-search="true">
                    <div class="script-header">
                        <div class="script-info">
                            <div class="script-name" style="display: flex; align-items: center; gap: 10px;">
                                ${isPrivate ? '🔒 ' : ''}${build.tag}
                                ${isOwned ? '<span style="color: #4aff4a; font-size: 12px; background: rgba(74, 255, 74, 0.2); padding: 2px 8px; border-radius: 12px;">MINE</span>' : ''}
                            </div>
                            <div class="script-meta">
                                <span class="script-author">by ${build.author}</span>
                                <span>Popularity: ${build.popularity || 0}</span>
                            </div>
                            <div class="script-meta">
                                <span>${scriptIds.length} script${scriptIds.length !== 1 ? 's' : ''}</span>
                                <span>${projectIds.length} project${projectIds.length !== 1 ? 's' : ''}</span>
                                ${build.configuration ? '<span style="color: #4aff4a;">✅ Config</span>' : '<span style="color: #888;">❌ No Config</span>'}
                            </div>
                            <div style="display: flex; gap: 6px; margin-top: 8px;">
                                <button class="btn btn-small" onclick="app.showBuildDetails('${build.tag}')" style="font-size: 12px; padding: 4px 8px;">
                                    🔍 Inspect Build
                                </button>
                                ${build.configuration ? `<button class="btn btn-small" onclick="app.showRawBuildConfig('${build.tag}')" style="font-size: 12px; padding: 4px 8px; background: rgba(255, 140, 0, 0.2); border-color: rgba(255, 140, 0, 0.3);" title="View raw JSON configuration">
                                    📄 Raw JSON
                                </button>` : ''}
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button class="btn btn-small" onclick="app.previewBuild('${build.tag}')" title="Apply this build">
                                🚀 Apply Build
                            </button>
                            ${isOwned ? `
                                <button class="btn btn-small btn-danger" onclick="app.deleteBuild('${build.tag}')" title="Delete this build">
                                    🗑️
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    populateBuildFilterOptions() {
        const uniqueAuthors = [...new Set(this.allBuilds
            .filter(build => build.private !== 1 || build.author === this.memberData.username)
            .map(b => b.author)
        )].sort();

        document.getElementById('buildAuthorFilters').innerHTML = uniqueAuthors.map(author => `
            <div class="filter-option" onclick="app.toggleBuildFilter('author', '${author}')">
                <div class="filter-checkbox" data-type="author" data-value="${author}"></div>
                <div class="filter-label">${author}</div>
            </div>
        `).join('');
    },

    // ========================
    // TERMINAL COMPONENT
    // ========================

    initializeTerminal() {
        const terminalInput = document.getElementById('terminalInput');
        if (!terminalInput) return;

        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                if (command) {
                    this.executeTerminalCommand(command);
                    terminalInput.value = '';
                }
            }
        });

        terminalInput.addEventListener('focus', () => {
            terminalInput.style.outline = 'none';
        });
    },

    async executeTerminalCommand(command) {
        const output = document.getElementById('terminalOutput');

        output.innerHTML = '';

        const commandDiv = document.createElement('div');
        commandDiv.className = 'terminal-command';
        const username = this.memberData?.username || 'member';
        commandDiv.innerHTML = `<span style="color: #4aff4a;">${username}@constelia:~$</span> ${command}`;
        output.appendChild(commandDiv);

        if (command.toLowerCase() === 'help') {
            this.showTerminalHelp();
            return;
        }

        if (command.toLowerCase() === 'clear') {
            output.innerHTML = '';
            return;
        }

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'terminal-result';
        loadingDiv.textContent = 'Executing command...';
        output.appendChild(loadingDiv);

        try {
            const url = new URL('https://constelia.ai/api.php');
            url.searchParams.append('key', this.apiKey);
            url.searchParams.append('cmd', 'sendCommand');
            url.searchParams.append('command', command);
            url.searchParams.append('style', '');

            const response = await fetch(url);
            const responseText = await response.text();

            output.removeChild(loadingDiv);

            let displayText = '';

            try {
                const jsonResponse = JSON.parse(responseText);
                if (jsonResponse.status === 200 && jsonResponse.message) {
                    displayText = jsonResponse.message;

                    if (displayText.startsWith('print|')) {
                        displayText = displayText.substring(6);
                    }
                } else {
                    displayText = `Error: ${jsonResponse.message || 'Unknown error'}`;
                }
            } catch (e) {
                displayText = responseText;

                if (displayText.startsWith('print|')) {
                    displayText = displayText.substring(6);
                }
            }

            const resultDiv = document.createElement('div');
            resultDiv.className = 'terminal-result';

            if (displayText.includes('<') && displayText.includes('>')) {
                resultDiv.innerHTML = displayText;
            } else {
                resultDiv.textContent = displayText;
            }

            output.appendChild(resultDiv);

        } catch (error) {
            if (loadingDiv.parentNode) {
                output.removeChild(loadingDiv);
            }

            const errorDiv = document.createElement('div');
            errorDiv.className = 'terminal-result terminal-error';
            errorDiv.textContent = `Error: ${error.message}`;
            output.appendChild(errorDiv);
        }

        output.scrollTop = 0;
    },

    showTerminalHelp() {
        const output = document.getElementById('terminalOutput');

        const helpDiv = document.createElement('div');
        helpDiv.className = 'terminal-result';
        helpDiv.innerHTML = `<strong>Available Commands:</strong>

            <strong style="color: #4aff4a;">Built-in Commands:</strong>
            help          - Show this help message
            clear         - Clear the terminal screen

            <strong style="color: #4aff4a;">Member's Panel Commands:</strong>
            session       - Show current session information
            scripts       - List all active scripts
            status        - Show account status
            perks         - List owned perks
            builds        - List your builds
            projects      - List active projects
            xp            - Show XP and level information
            steam         - Show linked Steam accounts
            configuration - Show configuration status
            
            <strong style="color: #4aff4a;">Advanced Commands:</strong>
            logs          - Show recent logs
            errors        - Show error information
            debug         - Show debug information
            version       - Show software versions

            <strong style="color: #ffcc00;">Note:</strong> These commands mirror the Member's Panel interface.
            The '&style' option is enabled by default to preserve formatting.

            <strong style="color: #888;">Examples:</strong>
            session
            scripts
            status`;

        output.appendChild(helpDiv);
        output.scrollTop = output.scrollHeight;
    },

    // ========================
    // CONFIGURATION COMPONENTS  
    // ========================

    populateSoftwareDropdown() {
        const softwareSelect = document.getElementById('softwareSelect');

        const allConfigKeys = Object.keys(this.currentConfig || {});

        const regularSoftware = allConfigKeys.filter(key =>
            typeof this.currentConfig[key] === 'object' &&
            this.currentConfig[key] !== null &&
            !Array.isArray(this.currentConfig[key]) &&
            key !== 'bones'
        ).sort();

        const specialConfigs = [];
        if (allConfigKeys.includes('bones') && Array.isArray(this.currentConfig.bones)) {
            specialConfigs.push('bones');
        }

        const totalConfigs = regularSoftware.length + specialConfigs.length;
        let hasOmega = false;

        if (totalConfigs === 0) {
            softwareSelect.innerHTML = '<option value="">No configurations found</option>';
            softwareSelect.disabled = true;
        } else {
            softwareSelect.disabled = false;

            let optionsHTML = '<option value="">Select software...</option>';

            regularSoftware.forEach(software => {
                const displayName = software.charAt(0).toUpperCase() + software.slice(1);
                optionsHTML += `<option value="${software}">${displayName}</option>`;

                if (software.toLowerCase() === 'omega') {
                    hasOmega = true;
                }
            });

            specialConfigs.forEach(special => {
                if (special === 'bones') {
                    optionsHTML += `<option value="bones">Bones (Special)</option>`;
                }
            });

            softwareSelect.innerHTML = optionsHTML;

            if (hasOmega) {
                softwareSelect.value = 'omega';

                setTimeout(() => {
                    this.onSoftwareChange();
                }, 100);
            }
        }

        if (!hasOmega) {
            document.getElementById('scriptConfigEditor').style.display = 'none';
            document.getElementById('scriptConfigSelect').value = '';
        }
    },

    onSoftwareChange() {
        const software = document.getElementById('softwareSelect').value;
        const scriptSelect = document.getElementById('scriptConfigSelect');


        scriptSelect.value = '';
        document.getElementById('scriptConfigEditor').style.display = 'none';
        this.currentScriptKey = '';
        this.currentScriptConfig = {};

        if (software === 'bones') {
            scriptSelect.disabled = true;
            scriptSelect.innerHTML = '<option value="">Bones uses special configuration</option>';
            this.showMessage('Loading bones configuration...', 'success');
            setTimeout(() => this.loadBonesConfig(), 100);
        } else if (software) {
            scriptSelect.disabled = false;
            this.populateScriptDropdownForSoftware(software);
        } else {
            scriptSelect.disabled = true;
            scriptSelect.innerHTML = '<option value="">Select a software first...</option>';
        }
    },

    populateScriptDropdownForSoftware(software) {
        const scriptSelect = document.getElementById('scriptConfigSelect');

        const configuredScripts = Object.keys(this.currentConfig[software] || {});
        const builtInScripts = Object.keys(BUILTIN_SCRIPT_CONFIGS[software] || {});
        
        // Combine configured and built-in scripts, removing duplicates
        const allAvailableScripts = [...new Set([...configuredScripts, ...builtInScripts])];


        if (allAvailableScripts.length === 0) {
            scriptSelect.innerHTML = '<option value="">No script configurations available</option>';
            scriptSelect.disabled = true;
            return;
        }

        let optionsHTML = '<option value="">Select a script...</option>';

        allAvailableScripts.sort().forEach(scriptKey => {
            const isConfigured = configuredScripts.includes(scriptKey);
            const isBuiltIn = builtInScripts.includes(scriptKey);
            
            // Try to match with active scripts
            const matchedScript = this.memberScripts?.find(script => {
                const scriptName = script.name.endsWith('.lua') ? script.name : script.name + '.lua';
                const scriptBaseName = script.name.replace('.lua', '');
                return scriptKey === scriptName ||
                    scriptKey === scriptBaseName ||
                    scriptKey.toLowerCase().includes(script.name.toLowerCase()) ||
                    script.name.toLowerCase().includes(scriptKey.toLowerCase().replace('.lua', ''));
            });

            let statusInfo = '';
            if (matchedScript) {
                statusInfo = ` (ID: ${matchedScript.id}, Active)`;
            } else if (isBuiltIn && !isConfigured) {
                statusInfo = ' (Built-in, Available)';
            } else if (isBuiltIn && isConfigured) {
                statusInfo = ' (Built-in, Configured)';
            } else {
                statusInfo = ' (Configured)';
            }

            const displayName = scriptKey;
            optionsHTML += `<option value="${scriptKey}">${displayName}${statusInfo}</option>`;
        });

        scriptSelect.innerHTML = optionsHTML;
        scriptSelect.disabled = false;
    },

    loadScriptConfig() {
        const scriptSelection = document.getElementById('scriptConfigSelect').value;
        const software = document.getElementById('softwareSelect').value;
        const editor = document.getElementById('scriptConfigEditor');

        // Handle preview script
        if (scriptSelection === '__preview__' && this.previewScriptData) {
            this.loadPreviewScriptConfig();
            return;
        }

        // Remove any existing preview indicator when loading a non-preview script
        const previewIndicator = document.querySelector('.preview-indicator');
        if (previewIndicator) {
            previewIndicator.remove();
        }

        if (!software) {
            editor.style.display = 'none';
            this.currentScriptKey = '';
            return;
        }

        if (software === 'bones') {
            this.loadBonesConfig();
            return;
        }

        if (!scriptSelection) {
            editor.style.display = 'none';
            this.currentScriptKey = '';
            return;
        }

        if (!this.currentConfig[software]) {
            editor.style.display = 'none';
            this.currentScriptKey = '';
            this.showMessage(`No configuration found for ${software}`, 'error');
            return;
        }

        editor.style.display = 'block';

        const scriptKey = scriptSelection;

        let scriptConfig = this.currentConfig[software][scriptKey];

        // If no config exists but it's a built-in script, create it from the built-in defaults
        if (!scriptConfig && BUILTIN_SCRIPT_CONFIGS[software] && BUILTIN_SCRIPT_CONFIGS[software][scriptKey]) {
            scriptConfig = { ...BUILTIN_SCRIPT_CONFIGS[software][scriptKey] };
            
            // Add it to current config
            if (!this.currentConfig[software]) {
                this.currentConfig[software] = {};
            }
            this.currentConfig[software][scriptKey] = scriptConfig;
            
            // Auto-save the new built-in config
            try {
                this.apiPost('setConfiguration', {}, {
                    value: JSON.stringify(this.currentConfig)
                });
            } catch (error) {
                console.warn(`Could not auto-save built-in config for ${scriptKey}:`, error);
            }
        }

        if (!scriptConfig) {
            const formContainer = document.getElementById('scriptConfigForm');
            formContainer.innerHTML = `
                <p style="text-align: center; color: #888; padding: 40px;">
                    Configuration not found for "${scriptKey}" in ${software}<br>
                    <small style="color: #666;">Available keys: ${Object.keys(this.currentConfig[software] || {}).join(', ')}</small>
                </p>
            `;
            return;
        }

        this.currentScriptConfig = scriptConfig;
        this.currentScriptKey = scriptKey;

        // Update alphabetical toggle state for this script
        const alphabeticalToggle = document.getElementById('alphabeticalToggle');
        if (alphabeticalToggle) {
            const sortKey = `alphabeticalSort_${scriptKey}`;
            const alphabeticalSort = localStorage.getItem(sortKey) === 'true';
            if (alphabeticalSort) {
                alphabeticalToggle.classList.add('active');
            } else {
                alphabeticalToggle.classList.remove('active');
            }
        }

        this.renderConfigForm();
        this.showMessage(`Loaded configuration for ${scriptKey}`, 'success');
    },

    loadBonesConfig() {

        const editor = document.getElementById('scriptConfigEditor');
        const formContainer = document.getElementById('scriptConfigForm');

        if (!editor || !formContainer) {
            console.error('Could not find editor elements');
            this.showMessage('Error: Could not find configuration interface elements', 'error');
            return;
        }

        editor.style.display = 'block';

        const bonesArray = this.currentConfig.bones || [];

        formContainer.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(74, 158, 255, 0.05)); border: 2px solid rgba(74, 158, 255, 0.3); border-radius: 12px; padding: 20px; margin: 10px 0;">
                <div class="config-group">
                    <h4 style="color: #4a9eff; margin-bottom: 15px; font-size: 18px;">🦴 Bones Configuration</h4>
                    <p style="color: #aaa; margin-bottom: 20px; font-size: 14px; line-height: 1.5;">
                        Configure which bone IDs to target. CS2 bones: Head (6), Neck (5), Upper Chest (4), Lower Chest (3), Stomach (2), Pelvis (0).<br>
                        <strong>Current configuration has ${bonesArray.length} bone(s).</strong>
                    </p>
                    
                    <div class="config-field" style="margin-bottom: 20px;">
                        <div class="config-label" style="margin-bottom: 10px;">
                            <strong>Current Bones:</strong>
                        </div>
                        <div class="config-control">
                            <div id="bonesDisplay" style="display: flex; gap: 8px; flex-wrap: wrap; min-height: 40px; align-items: center;">
                                ${bonesArray.length > 0 ? bonesArray.map(bone => `
                                    <div class="bone-tag">
                                        ${bone}
                                        <button onclick="app.removeBone(${bone})" title="Remove bone ${bone}" aria-label="Remove bone ${bone}">×</button>
                                    </div>
                                `).join('') : '<span style="color: #888; font-style: italic;">No bones configured yet</span>'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="config-field" style="margin-bottom: 20px;">
                        <div class="config-label" style="margin-bottom: 10px;">
                            <strong>Add New Bone ID:</strong>
                        </div>
                        <div class="config-control" style="display: flex; gap: 10px; align-items: center;">
                            <input type="number" id="newBoneInput" class="config-input" placeholder="Enter bone ID (0-255)..." min="0" max="255" style="width: 160px;" onkeypress="if(event.key==='Enter') app.addBone()">
                            <button class="btn btn-small" onclick="app.addBone()" style="background: linear-gradient(135deg, #4aff4a, #357abd);">➕ Add Bone</button>
                        </div>
                    </div>
                    
                    <div class="config-field">
                        <div class="config-label" style="margin-bottom: 10px;">
                            <strong>Quick Add Common Bones:</strong>
                        </div>
                        <div class="config-control" style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <button class="btn btn-small" onclick="app.addBone(6)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Head (6)</button>
                            <button class="btn btn-small" onclick="app.addBone(5)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Neck (5)</button>
                            <button class="btn btn-small" onclick="app.addBone(4)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Upper Chest (4)</button>
                            <button class="btn btn-small" onclick="app.addBone(3)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Lower Chest (3)</button>
                            <button class="btn btn-small" onclick="app.addBone(2)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Stomach (2)</button>
                            <button class="btn btn-small" onclick="app.addBone(0)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Pelvis (0)</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.currentScriptConfig = bonesArray;
        this.currentScriptKey = 'bones';

        // Update alphabetical toggle state for bones config
        const alphabeticalToggle = document.getElementById('alphabeticalToggle');
        if (alphabeticalToggle) {
            const sortKey = `alphabeticalSort_bones`;
            const alphabeticalSort = localStorage.getItem(sortKey) === 'true';
            if (alphabeticalSort) {
                alphabeticalToggle.classList.add('active');
            } else {
                alphabeticalToggle.classList.remove('active');
            }
        }

        this.showMessage(`Bones configuration loaded (${bonesArray.length} bones)`, 'success');
    },

    addBone(boneId = null) {
        const newBoneInput = document.getElementById('newBoneInput');
        const boneToAdd = boneId !== null ? boneId : parseInt(newBoneInput.value);

        if (isNaN(boneToAdd) || boneToAdd < 0 || boneToAdd > 255) {
            this.showMessage('Please enter a valid bone ID (0-255)', 'error');
            return;
        }

        const currentBones = this.currentConfig.bones || [];

        if (currentBones.includes(boneToAdd)) {
            this.showMessage(`Bone ID ${boneToAdd} is already configured`, 'error');
            return;
        }

        const newBones = [...currentBones, boneToAdd].sort((a, b) => a - b);
        this.currentConfig.bones = newBones;
        this.currentScriptConfig = newBones;

        if (newBoneInput) newBoneInput.value = '';

        this.loadBonesConfig();
        this.showMessage(`Added bone ID ${boneToAdd}`, 'success');

        this.triggerAutoSave();
    },

    removeBone(boneId) {
        const currentBones = this.currentConfig.bones || [];
        const newBones = currentBones.filter(bone => bone !== boneId);

        this.currentConfig.bones = newBones;
        this.currentScriptConfig = newBones;

        this.loadBonesConfig();
        this.showMessage(`Removed bone ID ${boneId}`, 'success');

        this.triggerAutoSave();
    },

    async generateDefaultConfigs() {
        if (!this.memberScripts || this.memberScripts.length === 0) {
            // Even if no cloud scripts, we can still generate built-in configs
            if (Object.keys(BUILTIN_SCRIPT_CONFIGS).length === 0) {
                this.showMessage('No active scripts found to generate configurations for', 'error');
                return;
            }
        }

        const generateButton = document.querySelector('button[onclick="app.generateDefaultConfigs()"]');
        const originalText = generateButton.textContent;
        
        try {
            generateButton.disabled = true;
            generateButton.textContent = '🔄 Scanning for missing configs...';

            // Track what we're doing for better user feedback
            const report = {
                newBuiltInConfigs: [],
                newCloudConfigs: [],
                existingConfigs: [],
                removedOptions: [],
                typeChanges: [],
                errors: []
            };

            this.showMessage('Scanning for missing script configurations...', 'success');

            // First, add built-in script configurations
            for (const [softwareName, scripts] of Object.entries(BUILTIN_SCRIPT_CONFIGS)) {
                if (!this.currentConfig[softwareName]) {
                    this.currentConfig[softwareName] = {};
                }

                for (const [scriptKey, defaultConfig] of Object.entries(scripts)) {
                    // Check if config already exists
                    if (!this.currentConfig[softwareName][scriptKey]) {
                        this.currentConfig[softwareName][scriptKey] = { ...defaultConfig };
                        report.newBuiltInConfigs.push({ software: softwareName, script: scriptKey });
                    } else {
                        // Existing config - check for outdated options and type mismatches
                        const existingConfig = this.currentConfig[softwareName][scriptKey];
                        const updatedConfig = { ...existingConfig };
                        let hasChanges = false;
                        
                        // Remove options that don't exist in the default config
                        for (const option in existingConfig) {
                            if (!defaultConfig.hasOwnProperty(option)) {
                                delete updatedConfig[option];
                                report.removedOptions.push({
                                    software: softwareName,
                                    script: scriptKey,
                                    option: option,
                                    oldValue: existingConfig[option]
                                });
                                hasChanges = true;
                            }
                        }
                        
                        // Check for type mismatches and add missing options
                        for (const option in defaultConfig) {
                            if (!updatedConfig.hasOwnProperty(option)) {
                                // Missing option - add it
                                updatedConfig[option] = defaultConfig[option];
                                report.newBuiltInConfigs.push({
                                    software: softwareName,
                                    script: scriptKey,
                                    option: option,
                                    value: defaultConfig[option]
                                });
                                hasChanges = true;
                            } else {
                                // Check for type mismatch
                                const existingType = this.getValueType(updatedConfig[option]);
                                const defaultType = this.getValueType(defaultConfig[option]);
                                
                                if (existingType !== defaultType) {
                                    report.typeChanges.push({
                                        software: softwareName,
                                        script: scriptKey,
                                        option: option,
                                        oldType: existingType,
                                        newType: defaultType,
                                        oldValue: updatedConfig[option],
                                        newValue: defaultConfig[option]
                                    });
                                    updatedConfig[option] = defaultConfig[option];
                                    hasChanges = true;
                                }
                            }
                        }
                        
                        // Update the config if there were changes
                        if (hasChanges) {
                            this.currentConfig[softwareName][scriptKey] = updatedConfig;
                        } else {
                            report.existingConfigs.push({ software: softwareName, script: scriptKey, type: 'built-in' });
                        }
                    }
                }
            }

            // Then process cloud scripts
            if (this.memberScripts && this.memberScripts.length > 0) {
                generateButton.textContent = '🔄 Processing cloud scripts...';

                // Group scripts by software for better organization
                const scriptsBySoftware = {};
                this.memberScripts.forEach(script => {
                    const softwareName = this.getSoftwareNameFromId(script.software);
                    if (!scriptsBySoftware[softwareName]) {
                        scriptsBySoftware[softwareName] = [];
                    }
                    scriptsBySoftware[softwareName].push(script);
                });

                // Generate configs for each software
                for (const [softwareName, scripts] of Object.entries(scriptsBySoftware)) {
                    
                    if (!this.currentConfig[softwareName]) {
                        this.currentConfig[softwareName] = {};
                    }

                    for (const script of scripts) {
                        try {
                            console.log(`Checking config for script: ${script.name} (ID: ${script.id})`);
                            
                            // More robust script key matching
                            const possibleKeys = [
                                script.name,
                                script.name.endsWith('.lua') ? script.name : script.name + '.lua',
                                script.name.replace('.lua', ''),
                                script.name.toLowerCase(),
                                script.name.toLowerCase().endsWith('.lua') ? script.name.toLowerCase() : script.name.toLowerCase() + '.lua'
                            ];

                            // Check if ANY of these keys already exist
                            const existingKey = possibleKeys.find(key => this.currentConfig[softwareName][key]);

                            // Fetch script source
                            const apiResponse = await this.apiCall('getScript', {
                                id: script.id,
                                beautify: ''
                            });

                            let scriptData;
                            if (apiResponse && apiResponse.response && apiResponse.response._raw_response) {
                                try {
                                    scriptData = JSON.parse(apiResponse.response._raw_response);
                                } catch (e) {
                                    scriptData = apiResponse;
                                }
                            } else if (typeof apiResponse === 'object' && apiResponse.id) {
                                scriptData = apiResponse;
                            } else {
                                throw new Error('Invalid API response structure');
                            }

                            // Get script source
                            let sourceCode = '';
                            if (scriptData.script) {
                                sourceCode = scriptData.script;
                            } else if (scriptData.source) {
                                sourceCode = scriptData.source;
                            } else {
                                throw new Error('No source code found');
                            }

                            // Decode escaped characters
                            if (sourceCode && typeof sourceCode === 'string') {
                                sourceCode = sourceCode
                                    .replace(/\\\\/g, '\\')  // Process double backslashes first
                                    .replace(/\\n/g, '\n')
                                    .replace(/\\t/g, '\t')
                                    .replace(/\\"/g, '"')
                                    .replace(/\\'/g, "'");
                            }

                            // Parse the source code for default values
                            const defaultConfig = this.parseScriptForDefaults(sourceCode, script.name);
                            
                            // Use the primary script key (with .lua extension if not present)
                            const scriptKey = script.name.endsWith('.lua') ? script.name : script.name + '.lua';
                            
                            if (existingKey) {
                                // We have an existing config - check for outdated options and type mismatches
                                const existingConfig = this.currentConfig[softwareName][existingKey];
                                const updatedConfig = { ...existingConfig };
                                let hasChanges = false;
                                
                                // Remove options that don't exist in the script anymore
                                for (const option in existingConfig) {
                                    if (defaultConfig && !defaultConfig.hasOwnProperty(option)) {
                                        delete updatedConfig[option];
                                        report.removedOptions.push({
                                            software: softwareName,
                                            script: script.name,
                                            option: option,
                                            oldValue: existingConfig[option]
                                        });
                                        hasChanges = true;
                                    }
                                }
                                
                                // Check for type mismatches and add missing options
                                if (defaultConfig) {
                                    for (const option in defaultConfig) {
                                        if (!updatedConfig.hasOwnProperty(option)) {
                                            // Missing option - add it
                                            updatedConfig[option] = defaultConfig[option];
                                            report.newCloudConfigs.push({
                                                software: softwareName,
                                                script: script.name,
                                                option: option,
                                                value: defaultConfig[option]
                                            });
                                            hasChanges = true;
                                        } else {
                                            // Check for type mismatch
                                            const existingType = this.getValueType(updatedConfig[option]);
                                            const defaultType = this.getValueType(defaultConfig[option]);
                                            
                                            if (existingType !== defaultType && defaultType !== 'null' && defaultType !== 'unknown') {
                                                report.typeChanges.push({
                                                    software: softwareName,
                                                    script: script.name,
                                                    option: option,
                                                    oldType: existingType,
                                                    newType: defaultType,
                                                    oldValue: updatedConfig[option],
                                                    newValue: defaultConfig[option]
                                                });
                                                updatedConfig[option] = defaultConfig[option];
                                                hasChanges = true;
                                            }
                                        }
                                    }
                                }
                                
                                // Update the config if there were changes
                                if (hasChanges) {
                                    this.currentConfig[softwareName][existingKey] = updatedConfig;
                                }
                            } else if (defaultConfig && Object.keys(defaultConfig).length > 0) {
                                // No existing config - create new one
                                this.currentConfig[softwareName][scriptKey] = defaultConfig;
                                report.newCloudConfigs.push({ 
                                    software: softwareName, 
                                    script: script.name, 
                                    scriptKey: scriptKey,
                                    settingsCount: Object.keys(defaultConfig).length
                                });
                            } else {
                                report.existingConfigs.push({ 
                                    software: softwareName, 
                                    script: script.name, 
                                    type: 'no-settings' 
                                });
                            }

                        } catch (error) {
                            console.error(`Error processing script ${script.name}:`, error);
                            report.errors.push({
                                script: script.name,
                                error: error.message
                            });
                        }
                    }
                }
            }

            // Add default CS2 bones configuration if missing
            if (!this.currentConfig.bones || !Array.isArray(this.currentConfig.bones) || this.currentConfig.bones.length === 0) {
                // CS2 default bones: 6=head, 5=neck, 4=upper chest, 3=lower chest, 2=stomach, 0=pelvis
                this.currentConfig.bones = [6, 5, 4, 3, 2, 0];
                report.newBuiltInConfigs.push({ software: 'bones', script: 'default CS2 bones' });
                this.showMessage('Added default CS2 bones configuration', 'success');
            }

            // Save the updated configuration if we have any changes
            const totalNewConfigs = report.newBuiltInConfigs.length + report.newCloudConfigs.length;
            const totalRemovedOptions = report.removedOptions.length;
            const totalTypeChanges = report.typeChanges.length;
            const hasChanges = totalNewConfigs > 0 || totalRemovedOptions > 0 || totalTypeChanges > 0;
            
            if (hasChanges) {
                generateButton.textContent = '🔄 Saving configuration...';
                
                await this.apiPost('setConfiguration', {}, {
                    value: JSON.stringify(this.currentConfig)
                });

                // Update the display
                document.getElementById('configDisplay').textContent = JSON.stringify(this.currentConfig, null, 2);
                this.populateSoftwareDropdown();

                // Create detailed success message
                let successMessage = `✅ Configuration update complete!\n`;
                
                if (totalNewConfigs > 0) {
                    successMessage += `➕ Added ${totalNewConfigs} new configurations\n`;
                    if (report.newBuiltInConfigs.length > 0) {
                        successMessage += `  📦 Built-in: ${report.newBuiltInConfigs.length} scripts\n`;
                    }
                    if (report.newCloudConfigs.length > 0) {
                        successMessage += `  ☁️ Cloud: ${report.newCloudConfigs.length} options\n`;
                    }
                }
                
                if (totalRemovedOptions > 0) {
                    successMessage += `🗑️ Removed ${totalRemovedOptions} outdated options\n`;
                }
                
                if (totalTypeChanges > 0) {
                    successMessage += `🔄 Updated ${totalTypeChanges} options with type changes\n`;
                }
                
                if (report.existingConfigs.length > 0) {
                    successMessage += `⚡ Unchanged: ${report.existingConfigs.length} configs`;
                }
                
                this.showMessage(successMessage, 'success');
                
                // Log detailed changes for debugging
                if (report.removedOptions.length > 0) {
                    console.log('Removed options:', report.removedOptions);
                }
                if (report.typeChanges.length > 0) {
                    console.log('Type changes:', report.typeChanges);
                }
                
                if (report.errors.length > 0) {
                    console.warn('Some scripts had errors:', report.errors);
                    this.showMessage(`⚠️ ${report.errors.length} scripts had parsing errors (check console for details)`, 'error');
                }
                
            } else {
                // No new configs generated - provide better feedback
                let statusMessage = '✅ Configuration scan complete!\n';
                
                if (report.existingConfigs.length > 0) {
                    const builtInCount = report.existingConfigs.filter(c => c.type === 'built-in').length;
                    const cloudCount = report.existingConfigs.filter(c => c.type === 'cloud').length;
                    const noSettingsCount = report.existingConfigs.filter(c => c.type === 'no-settings').length;
                    
                    statusMessage += `📋 Found ${report.existingConfigs.length} scripts already configured:\n`;
                    if (builtInCount > 0) statusMessage += `  📦 ${builtInCount} built-in configs\n`;
                    if (cloudCount > 0) statusMessage += `  ☁️ ${cloudCount} cloud script configs\n`;
                    if (noSettingsCount > 0) statusMessage += `  🔧 ${noSettingsCount} scripts with no configurable settings\n`;
                    statusMessage += 'All your active scripts already have configurations! 🎉';
                } else {
                    statusMessage += 'No configurable scripts found.';
                }
                
                this.showMessage(statusMessage, 'success');
            }

            // Save configuration after generating

        } catch (error) {
            console.error('Error generating default configs:', error);
            this.showMessage(`Failed to generate configurations: ${error.message}`, 'error');
        } finally {
            generateButton.disabled = false;
            generateButton.textContent = originalText;
        }
    },

    parseScriptForDefaults(sourceCode, scriptName) {
        if (!sourceCode || typeof sourceCode !== 'string') {
            return {};
        }


        // Extract the base name without .lua extension
        const baseName = scriptName.replace('.lua', '').toLowerCase();
        const lines = sourceCode.split('\n');
        
        // Try both parsing approaches and merge results
        const tableDefaults = this.parseTableDefaults(lines, baseName, scriptName);
        const propertyDefaults = this.parsePropertyDefaults(lines, baseName, scriptName);
        
        // Merge both approaches (property assignments take precedence over table defaults)
        const defaults = { ...tableDefaults, ...propertyDefaults };
        
        
        return defaults;
    },

    parseSettingValue(valueString) {
        const trimmed = valueString.trim();
        
        // Boolean values
        if (trimmed === 'true') return true;
        if (trimmed === 'false') return false;
        
        // Numbers (including decimals and scientific notation)
        const numberMatch = trimmed.match(/^-?(\d+\.?\d*([eE][+-]?\d+)?|\d*\.\d+([eE][+-]?\d+)?)$/);
        if (numberMatch) {
            const num = parseFloat(trimmed);
            return isNaN(num) ? null : num;
        }
        
        // Strings (quoted with single or double quotes)
        const stringMatch = trimmed.match(/^(["'])((?:\\.|(?!\1)[^\\])*)\1$/);
        if (stringMatch) {
            return stringMatch[2]; // Return the content inside quotes
        }
        
        // Unquoted strings that are clearly meant to be strings (like "TAB", "END", etc.)
        if (/^[A-Z][A-Z0-9_]*$/i.test(trimmed) && trimmed.length <= 20) {
            return trimmed;
        }
        
        // Hex color values (6 or 8 character hex strings)
        if (/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(trimmed)) {
            return trimmed;
        }
        
        // Reject anything that looks like it contains braces, brackets, or function calls
        if (trimmed.includes('{') || trimmed.includes('}') || 
            trimmed.includes('[') || trimmed.includes(']') || 
            trimmed.includes('(') || trimmed.includes(')')) {
            return null;
        }
        
        // Reject anything that looks like a variable reference or expression
        if (trimmed.includes('.') && !numberMatch) {
            return null;
        }
        
        // Return null for anything else we don't recognize
        return null;
    },

    getValueType(value) {
        // Determine the type of a value
        if (value === null || value === undefined) return 'null';
        if (typeof value === 'boolean') return 'boolean';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'string') return 'string';
        if (Array.isArray(value)) return 'array';
        if (typeof value === 'object') return 'object';
        return 'unknown';
    },

    parseTableDefaults(lines, baseName, scriptName) {
        // This is the existing approach for: local config = { ... }
        const defaults = {};
        
        let startLine = -1;
        
        // Find the table declaration
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Look for: local baseName = or baseName =
            const declarationPattern = new RegExp(`^\\s*(local\\s+)?${baseName}\\s*=\\s*$`, 'i');
            const sameLinePattern = new RegExp(`^\\s*(local\\s+)?${baseName}\\s*=\\s*\\{`, 'i');
            
            if (declarationPattern.test(line)) {
                // Found declaration, look for opening brace on next lines
                for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                    if (lines[j].trim().startsWith('{')) {
                        startLine = j;
                        break;
                    }
                }
                break;
            } else if (sameLinePattern.test(line)) {
                // Found same-line declaration
                startLine = i;
                break;
            }
        }

        if (startLine === -1) {
            return {};
        }


        let braceLevel = 1; // We start inside the main object
        let skipUntilBraceLevel = null;
        let inFunction = false;
        let functionBraceLevel = 0;

        for (let i = startLine + 1; i < lines.length; i++) {
            let line = lines[i].trim();

            // Skip empty lines and comments
            if (!line || line.startsWith('--')) {
                continue;
            }

            // Remove inline comments
            const commentIndex = line.indexOf('--');
            if (commentIndex !== -1) {
                line = line.substring(0, commentIndex).trim();
                if (!line) continue;
            }

            // Count braces for overall structure
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            
            // Update main brace level
            braceLevel += openBraces - closeBraces;

            // If we've exited the main object, stop
            if (braceLevel <= 0) {
                console.log(`Exited main table at line ${i}`);
                break;
            }

            // Handle function detection
            if (line.includes('function') && (line.includes('=') || line.includes(':'))) {
                console.log(`Found function at line ${i}: ${line}`);
                inFunction = true;
                functionBraceLevel = braceLevel;
                continue;
            }

            // If we're in a function, skip until we exit it
            if (inFunction) {
                if (braceLevel <= functionBraceLevel - 1) {
                    console.log(`Exited function at line ${i}`);
                    inFunction = false;
                    functionBraceLevel = 0;
                }
                continue;
            }

            // If we're currently skipping a nested object
            if (skipUntilBraceLevel !== null) {
                if (braceLevel <= skipUntilBraceLevel) {
                    skipUntilBraceLevel = null;
                }
                continue;
            }

            // Check if this line starts a nested object (like cache = {} or multiline objects)
            // Don't skip single-line array assignments like detection_types = {"movement", "shooting"}
            if (line.includes('=') && line.includes('{')) {
                // If it's just an empty object assignment like cache = {}, skip it
                if (line.trim().endsWith('{}') || line.trim().endsWith('{},')) {
                    skipUntilBraceLevel = braceLevel - 1;
                    continue;
                }
                // If opening brace is on this line but closing brace is NOT, it's a multiline object
                if (!line.includes('}')) {
                    skipUntilBraceLevel = braceLevel - 1;
                    continue;
                }
                // Otherwise it's a single-line assignment with braces (like an array), let it through
            }
            // Check if next line starts a multiline object
            else if (line.includes('=') && i + 1 < lines.length && lines[i + 1].trim().startsWith('{')) {
                skipUntilBraceLevel = braceLevel - 1;
                continue;
            }

            // Parse simple assignments and single-line array assignments
            // Allow lines with both { and } (single-line arrays) but not just { or just }
            if (line.includes('=') && !line.includes('function') && 
                (!line.includes('{') && !line.includes('}') || // Simple assignments
                 (line.includes('{') && line.includes('}')))) { // Single-line arrays
                // Handle both regular assignments and trailing commas
                const settingMatch = line.match(/^(\w+)\s*=\s*(.+?)(?:,\s*)?$/);
                if (settingMatch) {
                    const [, settingName, settingValue] = settingMatch;
                    
                    const parsedValue = this.parseSettingValue(settingValue.trim().replace(/,$/, ''));
                    if (parsedValue !== null) {
                        defaults[settingName] = parsedValue;
                    }
                }
            }
        }

        return defaults;
    },

    parsePropertyDefaults(lines, baseName, scriptName) {
        // This handles: local config = {} followed by config.property = value
        const defaults = {};
        
        let foundEmptyTable = false;
        
        // First, look for empty table declaration
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Look for: local baseName = {} or baseName = {}
            const emptyTablePattern = new RegExp(`^\\s*(local\\s+)?${baseName}\\s*=\\s*\\{\\s*\\}`, 'i');
            
            if (emptyTablePattern.test(line)) {
                console.log(`Found empty table declaration at line ${i}: ${line}`);
                foundEmptyTable = true;
                break;
            }
        }
        
        if (!foundEmptyTable) {
            return {};
        }
        
        // Now look for property assignments: baseName.property = value
        const propertyPattern = new RegExp(`^\\s*${baseName}\\.(\\w+)\\s*=\\s*(.+?)\\s*$`, 'i');
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            
            // Skip empty lines and comments
            if (!line || line.startsWith('--')) {
                continue;
            }

            // Remove inline comments
            const commentIndex = line.indexOf('--');
            if (commentIndex !== -1) {
                line = line.substring(0, commentIndex).trim();
                if (!line) continue;
            }
            
            const match = line.match(propertyPattern);
            if (match) {
                const [, propertyName, propertyValue] = match;
                
                const parsedValue = this.parseSettingValue(propertyValue.trim());
                if (parsedValue !== null) {
                    defaults[propertyName] = parsedValue;
                }
            }
        }
        
        return defaults;
    },

    getSoftwareNameFromId(softwareId) {
        const softwareMap = {
            4: 'omega',      // FC2 Global -> omega
            5: 'universe4',
            6: 'omega', // Also we're just getting rid of Conestellation4. Idk why this returns it still
            7: 'parallax2'
        };
        return softwareMap[softwareId] || `software_${softwareId}`;
    },

    async loadDivinityChart() {
        try {
            // Use API to get divinity chart data
            const data = await this.apiCall('getDivinityChart');
            
            // Update totals
            document.getElementById('airTotal').textContent = data.totals.Air.toLocaleString();
            document.getElementById('fireTotal').textContent = data.totals.Fire.toLocaleString();
            document.getElementById('waterTotal').textContent = data.totals.Water.toLocaleString();
            document.getElementById('earthTotal').textContent = data.totals.Earth.toLocaleString();
            
            // Store data for filtering
            this.divinityData = data;
            this.displayDivinityMembers(data.members);
            
            // Set up filters only once
            const searchInput = document.getElementById('divinitySearchInput');
            const signFilter = document.getElementById('divinitySignFilter');
            
            if (!searchInput.hasAttribute('data-listener-attached')) {
                searchInput.addEventListener('input', () => this.filterDivinityMembers());
                searchInput.setAttribute('data-listener-attached', 'true');
            }
            
            if (!signFilter.hasAttribute('data-listener-attached')) {
                signFilter.addEventListener('change', () => this.filterDivinityMembers());
                signFilter.setAttribute('data-listener-attached', 'true');
            }
            
        } catch (error) {
            console.error('Error loading divinity chart:', error);
            document.getElementById('divinityGrid').innerHTML = '<p style="text-align: center; color: #888;">Failed to load divinity chart data</p>';
        }
    },

    displayDivinityMembers(members) {
        const container = document.getElementById('divinityGrid');
        
        const zodiacSymbols = {
            'Aries': '♈',
            'Taurus': '♉',
            'Gemini': '♊',
            'Cancer': '♋',
            'Leo': '♌',
            'Virgo': '♍',
            'Libra': '♎',
            'Scorpio': '♏',
            'Sagittarius': '♐',
            'Capricorn': '♑',
            'Aquarius': '♒',
            'Pisces': '♓'
        };
        
        container.innerHTML = members.map(member => this.createDivinityMemberCard(member, zodiacSymbols)).join('');
    },


    createDivinityMemberCard(member, zodiacSymbols) {
        const gainClass = member.gain > 0 ? 'gain-positive' : (member.gain < 0 ? 'gain-negative' : '');
        const gainSymbol = member.gain > 0 ? '▲' : (member.gain < 0 ? '▼' : '');
        const profileUrl = `https://constelia.ai/forums/index.php?members/${member.forum_username}.${member.forum_uid}/`;
        const firstLetter = member.forum_username.charAt(0).toUpperCase();
        
        // Determine element based on zodiac sign
        const elementMap = {
            'Aries': { element: 'Fire', emoji: '🔥', bgColor: '#ff4444', textColor: '#fff' },
            'Leo': { element: 'Fire', emoji: '🔥', bgColor: '#ff4444', textColor: '#fff' },
            'Sagittarius': { element: 'Fire', emoji: '🔥', bgColor: '#ff4444', textColor: '#fff' },
            'Taurus': { element: 'Earth', emoji: '🌍', bgColor: '#8b6914', textColor: '#fff' },
            'Virgo': { element: 'Earth', emoji: '🌍', bgColor: '#8b6914', textColor: '#fff' },
            'Capricorn': { element: 'Earth', emoji: '🌍', bgColor: '#8b6914', textColor: '#fff' },
            'Gemini': { element: 'Air', emoji: '🌬️', bgColor: '#e0e0e0', textColor: '#333' },
            'Libra': { element: 'Air', emoji: '🌬️', bgColor: '#e0e0e0', textColor: '#333' },
            'Aquarius': { element: 'Air', emoji: '🌬️', bgColor: '#e0e0e0', textColor: '#333' },
            'Cancer': { element: 'Water', emoji: '💧', bgColor: '#4682b4', textColor: '#fff' },
            'Scorpio': { element: 'Water', emoji: '💧', bgColor: '#4682b4', textColor: '#fff' },
            'Pisces': { element: 'Water', emoji: '💧', bgColor: '#4682b4', textColor: '#fff' }
        };
        
        const elementInfo = elementMap[member.sign] || { element: 'Unknown', emoji: '❓', bgColor: '#666', textColor: '#fff' };
        
        // Try to construct avatar URL using forum_uid
        // For UIDs like 17146, use 17; for 1, use 0; for 16601, use 16
        const uidPrefix = member.forum_uid < 1000 ? 0 : Math.floor(member.forum_uid / 1000);
        const avatarUrl = `https://constelia.ai/forums/data/avatars/l/${uidPrefix}/${member.forum_uid}.jpg`;
        
        // Create URL-encoded SVG for fallback
        const fallbackSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='20' cy='20' r='20' fill='#444'/><text x='20' y='20' text-anchor='middle' dominant-baseline='middle' fill='#aaa' font-size='16'>${firstLetter}</text></svg>`;
        const fallbackDataUrl = 'data:image/svg+xml,' + encodeURIComponent(fallbackSvg);
        
        return `
            <div class="script-card compact" data-username="${member.forum_username.toLowerCase()}" data-sign="${member.sign}">
                <div class="script-header">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="font-size: 24px; font-weight: bold; color: #4a9eff;">#${member.rank}</div>
                        <img src="${avatarUrl}" alt="${member.forum_username}" 
                             style="width: 40px; height: 40px; border-radius: 50%; background: #444; object-fit: cover;"
                             onerror="this.onerror=null; this.src='${fallbackDataUrl}'">
                        <div class="script-info">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <a href="${profileUrl}" target="_blank" style="text-decoration: none;">
                                    <div class="script-name" style="color: #4a9eff; cursor: pointer;">${member.forum_username}</div>
                                </a>
                                <span style="background: ${elementInfo.bgColor}; color: ${elementInfo.textColor}; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">
                                    ${elementInfo.emoji} ${elementInfo.element}
                                </span>
                            </div>
                            <div class="script-meta">
                                ${zodiacSymbols[member.sign] || ''} ${member.sign} • ${member.xp.toLocaleString()} XP
                                <span class="${gainClass}" style="margin-left: 10px;">
                                    ${gainSymbol} ${Math.abs(member.gain).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 12px; color: #888;">Perks</div>
                        <div style="font-size: 20px; font-weight: bold; color: #4aff4a;">${member.perks.length}</div>
                    </div>
                </div>
            </div>
        `;
    },

    filterDivinityMembers() {
        const searchTerm = document.getElementById('divinitySearchInput').value.toLowerCase();
        const selectedSign = document.getElementById('divinitySignFilter').value;
        
        let filteredMembers = this.divinityData.members.filter(member => {
            const matchesSearch = member.forum_username.toLowerCase().includes(searchTerm);
            const matchesSign = !selectedSign || member.sign === selectedSign;
            return matchesSearch && matchesSign;
        });
        
        this.displayDivinityMembers(filteredMembers);
    },

    async loadAchievements() {
        try {
            // Get all available achievements
            const allAchievements = await this.apiCall('getAchievements');
            this.allAchievements = allAchievements;
            
            // Get user's unlocked achievements from member data
            const memberAchievements = this.memberData.achievements || [];
            
            // Calculate stats
            const totalAchievements = allAchievements.length;
            const unlockedCount = memberAchievements.length;
            const lockedCount = totalAchievements - unlockedCount;
            
            // Update stats
            document.getElementById('totalAchievements').textContent = totalAchievements;
            document.getElementById('unlockedAchievements').textContent = unlockedCount;
            document.getElementById('lockedAchievements').textContent = lockedCount;
            
            // Update progress bar
            const progressPercentage = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;
            const progressBar = document.getElementById('achievementProgressBar');
            if (progressBar) {
                progressBar.style.width = progressPercentage + '%';
            }
            
            // Display achievements
            this.displayAchievements(allAchievements, memberAchievements);
            
        } catch (error) {
            console.error('Error loading achievements:', error);
            document.getElementById('achievementsGrid').innerHTML = '<p style="text-align: center; color: #888;">Failed to load achievements</p>';
        }
    },

    displayAchievements(allAchievements, userAchievements) {
        const container = document.getElementById('achievementsGrid');
        
        // Tarot card names mapping - dynamically generate based on available achievements
        const baseTarotNames = [
            "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
            "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
            "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
            "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
            "Judgement", "The World",
            // Wands cards (22-34)
            "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands",
            "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands",
            "Page of Wands", "Knight of Wands", "Queen of Wands"
        ];
        
        // Generate tarot names for all achievements
        const tarotNames = [];
        for (let i = 0; i < allAchievements.length; i++) {
            if (i < baseTarotNames.length) {
                tarotNames.push(baseTarotNames[i]);
            } else {
                // For additional cards beyond the standard 27 defined
                tarotNames.push(`Arcana ${i}`);
            }
        }
        
        // Achievement descriptions mapping
        const descriptions = {
            0: "The Fool is young and vulnerable. Unlocked for triggering an error in the FC2 engine.",
            1: "The Magician card is a reminder that you are unique. Unlocked for being a SDK Contributor or Media member.",
            2: "The High Priestess is a card of awareness. Unlocked for heavy participation in XP/Perk system and reaching top 50.",
            3: "The Empress is the most feminine card. Unlocked when Steam recognizes your display name as stereotypically feminine.",
            4: "The Emperor is a card of leadership and power. Unlocked for launching Universe4 for the first time.",
            5: "The Hierophant is a messenger from the heavens. Unlocked for having an HTTP client communicate with FC2's HTTP module.",
            6: "The Lovers represents close relationships. Unlocked by running a team script, owning a team script, or having Venus perk.",
            7: "The Chariot indicates determination and victory. Unlocked for successful IPC connection with Kernel Driver.",
            8: "Strength represents courage and fortitude. Unlocked for purchasing any perk.",
            9: "The Hermit yearns to be alone. Unlocked for launching FC2 without any cloud community scripts.",
            10: "Wheel of Fortune is constantly revolving. Unlocked for running Constellation4 with more than 1 iteration counter.",
            11: "Justice reminds that every action has consequences. Unlocked for using i.constelia.ai at least 50 times.",
            12: "The Hanged Man teaches about necessary sacrifices. Unlocked for purchasing the Galactic Team perk for FC2T access.",
            13: "Death represents transformation and renewal. Achievement details not specified.",
            14: "Temperance is a master of moderation. Unlocked for being a buddy.",
            15: "The Devil represents restraint and powerlessness. Unlocked when Humanizer4 RNG rolls lowest assistance strength.",
            16: "The Tower represents necessary destruction. Unlocked for using a Minecraft FC2 solution.",
            17: "The Star embodies hope and healing. Unlocked for launching Constellation4 for the first time.",
            18: "The Moon represents hidden thoughts and fears. Unlocked for running FC2 on Linux.",
            19: "The Sun represents happiness and vitality. Unlocked for running FC2 on Windows.",
            20: "Judgement is where past and future meet. Unlocked for completing Constelia's Humanizer test.",
            21: "The World is about completion. Unlocked for having The Star, Moon, and Sun achievements.",
            22: "Ace of Wands represents new beginnings. Unlocked for being a member for at least 1 year (FC2.5/Omega only).",
            23: "Two of Wands represents vision and progress. Unlocked for being a member for at least 2 years (FC2.5/Omega only).",
            24: "Three of Wands represents foresight and expansion. Unlocked for being a member for at least 3 years (FC2.5/Omega only).",
            25: "Four of Wands represents celebration and stability. Unlocked for being a member for at least 4 years (FC2.5/Omega only).",
            26: "Five of Wands represents competition and challenge. Unlocked for being a member for at least 5 years (FC2.5/Omega only).",
            27: "Six of Wands represents public recognition. Unlocked for being a member for at least 6 years (FC2.5/Omega only).",
            28: "Seven of Wands represents perseverance and defense. Unlocked for being a member for at least 7 years (FC2.5/Omega only).",
            29: "Eight of Wands represents momentum and progress. Unlocked for being a member for at least 8 years (FC2.5/Omega only).",
            30: "Nine of Wands represents resilience and inner strength. Unlocked for being a member for at least 9 years (FC2.5/Omega only).",
            31: "Ten of Wands represents burdens and responsibility. Unlocked for being a member for at least 10 years (FC2.5/Omega only).",
            32: "The Page of Wands represents pursuit and adventure. Unlocked for having a Session older than 30 days.",
            33: "The Knight of Wands generally signifies action and go-getter energy. Unlocked for having over 100 successful Humanizer4 operations in a single Omega launch.",
            34: "The Queen of Wands is said by some to represent one's basic instinct. Her strength and task are providing initial inputs. Unlocked for being a Translator."
        };
        
        // Generate descriptions for additional achievements
        const getDescription = (index, achievement) => {
            if (descriptions[index]) {
                return descriptions[index];
            }
            // Use the achievement data if available, otherwise generic description
            return typeof achievement === 'string' ? achievement : `Unlock the secrets of Arcana ${index}`;
        };
        
        container.innerHTML = allAchievements.map((achievement, index) => {
            const cardName = tarotNames[index];
            // Check if the achievement name is in the user's achievements array
            const isUnlocked = userAchievements.includes(cardName);
            const description = getDescription(index, achievement);
            const imageUrl = `https://gfx.tarot.com/images/site/decks/universal-waite/full_size/${index}.jpg`;
            
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}" 
                     onclick="app.showAchievementDetail(${index}, '${cardName.replace(/'/g, "\\'")}', '${description.replace(/'/g, "\\'")}', ${isUnlocked})">
                    <img src="${imageUrl}" alt="${cardName}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI0MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2NjYiIGZvbnQtc2l6ZT0iMTQiPj88L3RleHQ+PC9zdmc+'">
                    <h4 class="achievement-name">${cardName}</h4>
                </div>
            `;
        }).join('');
    },

    showAchievementDetail(id, name, description, isUnlocked) {
        document.getElementById('achievementModalTitle').textContent = isUnlocked ? '🏆 Achievement Unlocked!' : '🔒 Achievement Locked';
        document.getElementById('achievementImage').src = `https://gfx.tarot.com/images/site/decks/universal-waite/full_size/${id}.jpg`;
        document.getElementById('achievementName').textContent = name;
        document.getElementById('achievementDescription').textContent = description;
        
        const statusDiv = document.getElementById('achievementStatus');
        if (isUnlocked) {
            statusDiv.innerHTML = '<div style="color: #4aff4a; font-size: 18px;">✅ You have unlocked this achievement!</div>';
        } else {
            statusDiv.innerHTML = '<div style="color: #ff8c00; font-size: 18px;">🔒 This achievement is still locked</div>';
        }
        
        document.getElementById('achievementModal').classList.add('active');
    },

    closeAchievementModal() {
        document.getElementById('achievementModal').classList.remove('active');
    },

    showRedeemAchievementsModal() {
        document.getElementById('redeemAchievementsModal').classList.add('active');
    },

    closeRedeemAchievementsModal() {
        document.getElementById('redeemAchievementsModal').classList.remove('active');
        document.getElementById('achievementsDataInput').value = '';
    },

    async redeemAchievements() {
        const achievementsData = document.getElementById('achievementsDataInput').value.trim();
        
        if (!achievementsData) {
            this.showMessage('Please paste your achievements.dat file content', 'error');
            return;
        }
        
        try {
            // Use apiPost for POST request with 'value' parameter
            const result = await this.apiPost('redeemAchievements', {}, { value: achievementsData });
            
            this.showMessage('Achievements redeemed successfully!', 'success');
            this.closeRedeemAchievementsModal();
            
            // Refresh achievements after successful redemption
            if (this.modules && this.modules.refreshAchievements) {
                await this.modules.refreshAchievements();
            } else {
                // Fallback to reloading member info and achievements
                await this.loadMemberInfo();
                await this.loadAchievements();
            }
            
        } catch (error) {
            console.error('Error redeeming achievements:', error);
            this.showMessage(`Failed to redeem achievements: ${error.message}`, 'error');
        }
    },
});