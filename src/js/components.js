// FC2 Dashboard - Components
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
            4: 'FC2 Global',
            5: 'Universe4',
            6: 'Constellation4',
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
                            </div>
                            <div class="script-meta">
                                <span>Software: ${softwareName}</span>
                                <span>Updated: ${script.elapsed || 'Never'}</span>
                            </div>
                            ${script.forums ? `
                                <a href="${script.forums}" target="_blank" class="forum-link">
                                    💬 Forum Thread
                                </a>
                            ` : ''}
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div class="toggle-switch active" onclick="app.toggleScript(${script.id}, this)" title="Disable script">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                    <p style="margin-top: 8px; color: #4aff4a; font-size: 12px; font-weight: 500;">
                        ✅ Active${script.users ? ` • ${script.users} users` : ''}
                    </p>
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
                            </div>
                            ${script.category_names ? `
                                <div class="script-categories">
                                    ${script.category_names.map(cat => `<span class="category-badge">${cat}</span>`).join('')}
                                </div>
                            ` : ''}
                            ${script.forums ? `
                                <a href="${script.forums}" target="_blank" class="forum-link">
                                    💬 Forum Thread
                                </a>
                            ` : ''}
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="toggle-switch ${isActive ? 'active' : ''}" onclick="app.toggleScript(${script.id}, this)">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                    <p style="margin-top: 10px; color: #aaa; font-size: 14px;">
                        <strong>Last Updated:</strong> ${script.elapsed || 'Never'}
                        <br><strong>Status:</strong> ${isActive ? '✅ Active' : '❌ Inactive'}
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
                    <p style="margin-top: 8px; color: #4aff4a; font-size: 12px; font-weight: 500;">
                        ✅ Active
                    </p>
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
                        <br><strong>Status:</strong> ${isActive ? '✅ Active' : '❌ Inactive'}
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
        try {
            const autoSavePref = localStorage.getItem('fc2_auto_save');
            this.autoSaveEnabled = autoSavePref === 'true';

            const liveOmegaPref = localStorage.getItem('fc2_live_omega');
            this.liveOmegaEnabled = liveOmegaPref === 'true';

            // Use setTimeout to ensure DOM elements are available
            setTimeout(() => {
                const autoSaveToggle = document.getElementById('autoSaveToggle');
                const liveOmegaToggle = document.getElementById('liveOmegaToggle');
                const liveOmegaContainer = document.getElementById('liveOmegaContainer');

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

                // Show/hide Live Omega based on auto-save state
                if (liveOmegaContainer) {
                    if (this.autoSaveEnabled) {
                        liveOmegaContainer.classList.add('visible');
                    } else {
                        liveOmegaContainer.classList.remove('visible');
                        // Also disable Live Omega if auto-save is disabled
                        if (this.liveOmegaEnabled) {
                            this.liveOmegaEnabled = false;
                            this.saveAutoSavePreference();
                            if (liveOmegaToggle) {
                                liveOmegaToggle.classList.remove('active');
                            }
                        }
                    }
                }
            }, 100);
        } catch (error) {
            console.warn('Could not load preferences:', error);
        }
    },

    saveAutoSavePreference() {
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

    triggerAutoSave() {
        if (!this.autoSaveEnabled) {
            console.log('Auto-save not enabled, skipping');
            return;
        }

        console.log('Triggering auto-save...');

        // Clear any existing timeout
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }

        // Set a delay to avoid too many rapid saves
        this.autoSaveTimeout = setTimeout(() => {
            console.log('Executing delayed auto-save');
            // Use live Omega if enabled
            this.saveScriptConfig(true, this.liveOmegaEnabled);
        }, 500); // 500ms delay
    },

    // ========================
    // UTILITY METHODS
    // ========================

    populateFilterOptions() {
        const softwareNames = {
            4: 'FC2 Global',
            5: 'Universe4',
            6: 'Constellation4',
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

            // Check if user has Venus perk and load status
            const hasVenus = this.ownedPerks.some(perk =>
                this.allPerks.find(p => p.id === perk.id && p.name.toLowerCase().includes('venus'))
            );

            if (hasVenus) {
                await this.loadVenusStatus();
            }

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

            return `
                <div class="script-card ${isOwned ? 'owned' : ''}" 
                    data-perk-name="${perk.name.toLowerCase()}" 
                    data-perk-owned="${isOwned}"
                    data-perk-affordable="${canAfford}"
                    data-matches-search="true">
                    <div class="script-header">
                        <div class="script-info">
                            <div class="script-name" style="display: flex; align-items: center; gap: 10px;">
                                ${isVenus ? '💕' : '✨'} ${perk.name}
                                ${isOwned ? '<span style="color: #4aff4a; font-size: 12px; background: rgba(74, 255, 74, 0.2); padding: 2px 8px; border-radius: 12px;">OWNED</span>' : ''}
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
                            <button class="btn btn-small" onclick="app.showBuildDetails('${build.tag}')" style="margin-top: 8px; font-size: 12px; padding: 4px 8px;">
                                🔍 Inspect Build
                            </button>
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
        commandDiv.textContent = command;
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
                console.log('Auto-selected omega as default software');

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

        console.log('onSoftwareChange called with:', software);

        scriptSelect.value = '';
        document.getElementById('scriptConfigEditor').style.display = 'none';
        this.currentScriptKey = '';
        this.currentScriptConfig = {};

        if (software === 'bones') {
            console.log('Bones selected, loading bones config...');
            scriptSelect.disabled = true;
            scriptSelect.innerHTML = '<option value="">Bones uses special configuration</option>';
            this.showMessage('Loading bones configuration...', 'success');
            setTimeout(() => this.loadBonesConfig(), 100);
        } else if (software) {
            console.log('Regular software selected:', software);
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

        console.log(`Found ${allAvailableScripts.length} available scripts for ${software}:`, allAvailableScripts);
        console.log(`- ${configuredScripts.length} configured scripts:`, configuredScripts);
        console.log(`- ${builtInScripts.length} built-in scripts:`, builtInScripts);

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

        console.log('=== loadScriptConfig Debug ===');
        console.log('Software:', software);
        console.log('Script selection:', scriptSelection);
        console.log('Current script key:', this.currentScriptKey);
        console.log('===============================');

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
        console.log(`Loading config for script key: "${scriptKey}" in software: "${software}"`);

        let scriptConfig = this.currentConfig[software][scriptKey];

        // If no config exists but it's a built-in script, create it from the built-in defaults
        if (!scriptConfig && BUILTIN_SCRIPT_CONFIGS[software] && BUILTIN_SCRIPT_CONFIGS[software][scriptKey]) {
            console.log(`Creating built-in config for ${scriptKey}`);
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
                console.log(`Auto-saved built-in config for ${scriptKey}`);
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

        console.log('Loaded script config:', this.currentScriptConfig);

        this.renderConfigForm();
        this.showMessage(`Loaded configuration for ${scriptKey}`, 'success');
    },

    loadBonesConfig() {
        console.log('loadBonesConfig called');

        const editor = document.getElementById('scriptConfigEditor');
        const formContainer = document.getElementById('scriptConfigForm');

        if (!editor || !formContainer) {
            console.error('Could not find editor elements');
            this.showMessage('Error: Could not find configuration interface elements', 'error');
            return;
        }

        console.log('Showing bones config interface');
        editor.style.display = 'block';

        const bonesArray = this.currentConfig.bones || [];
        console.log('Current bones:', bonesArray);

        formContainer.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(74, 158, 255, 0.05)); border: 2px solid rgba(74, 158, 255, 0.3); border-radius: 12px; padding: 20px; margin: 10px 0;">
                <div class="config-group">
                    <h4 style="color: #4a9eff; margin-bottom: 15px; font-size: 18px;">🦴 Bones Configuration</h4>
                    <p style="color: #aaa; margin-bottom: 20px; font-size: 14px; line-height: 1.5;">
                        Configure which bone IDs to target. Common bones: Head (8), Chest (6), Stomach (3), Pelvis (1).<br>
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
                            <button class="btn btn-small" onclick="app.addBone(8)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Head (8)</button>
                            <button class="btn btn-small" onclick="app.addBone(6)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Chest (6)</button>
                            <button class="btn btn-small" onclick="app.addBone(3)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Stomach (3)</button>
                            <button class="btn btn-small" onclick="app.addBone(1)" style="background: linear-gradient(135deg, #ff6b35, #ff8e53);">Pelvis (1)</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.currentScriptConfig = bonesArray;
        this.currentScriptKey = 'bones';

        console.log('Bones interface created successfully');
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
            generateButton.textContent = '🔄 Generating...';

            this.showMessage('Analyzing enabled scripts and generating default configurations...', 'success');

            let generatedCount = 0;
            let totalScripts = (this.memberScripts?.length || 0);
            let errors = [];

            // First, add built-in script configurations
            for (const [softwareName, scripts] of Object.entries(BUILTIN_SCRIPT_CONFIGS)) {
                if (!this.currentConfig[softwareName]) {
                    this.currentConfig[softwareName] = {};
                }

                for (const [scriptKey, defaultConfig] of Object.entries(scripts)) {
                    // Check if config already exists
                    if (!this.currentConfig[softwareName][scriptKey]) {
                        this.currentConfig[softwareName][scriptKey] = { ...defaultConfig };
                        generatedCount++;
                        console.log(`Generated built-in config for ${scriptKey}:`, defaultConfig);
                    } else {
                        console.log(`Built-in config already exists for ${scriptKey}, skipping`);
                    }
                }
            }

            // Then process cloud scripts (existing logic)
            if (this.memberScripts && this.memberScripts.length > 0) {
                // Group scripts by software
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
                    console.log(`Processing ${scripts.length} cloud scripts for ${softwareName}`);
                    
                    if (!this.currentConfig[softwareName]) {
                        this.currentConfig[softwareName] = {};
                    }

                    for (const script of scripts) {
                        try {
                            console.log(`Generating config for script: ${script.name} (ID: ${script.id})`);
                            
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
                                    .replace(/\\n/g, '\n')
                                    .replace(/\\t/g, '\t')
                                    .replace(/\\"/g, '"')
                                    .replace(/\\'/g, "'")
                                    .replace(/\\\\/g, '\\');
                            }

                            // Parse the source code for default values
                            const defaultConfig = this.parseScriptForDefaults(sourceCode, script.name);
                            
                            if (defaultConfig && Object.keys(defaultConfig).length > 0) {
                                // Use script name as key (try both with and without .lua extension)
                                const scriptKey = script.name.endsWith('.lua') ? script.name : script.name + '.lua';
                                const scriptKeyNoExt = script.name.replace('.lua', '');
                                
                                // Check if config already exists under either name
                                if (!this.currentConfig[softwareName][scriptKey] && !this.currentConfig[softwareName][scriptKeyNoExt]) {
                                    this.currentConfig[softwareName][scriptKey] = defaultConfig;
                                    generatedCount++;
                                    console.log(`Generated config for ${scriptKey}:`, defaultConfig);
                                } else {
                                    console.log(`Config already exists for ${script.name}, skipping`);
                                }
                            } else {
                                console.log(`No configurable settings found in ${script.name}`);
                            }

                        } catch (error) {
                            console.error(`Error processing script ${script.name}:`, error);
                            errors.push(`${script.name}: ${error.message}`);
                        }
                    }
                }
            }

            // Save the updated configuration
            if (generatedCount > 0) {
                await this.apiPost('setConfiguration', {}, {
                    value: JSON.stringify(this.currentConfig)
                });

                // Update the display
                document.getElementById('configDisplay').textContent = JSON.stringify(this.currentConfig, null, 2);
                this.populateSoftwareDropdown();

                const builtInCount = Object.values(BUILTIN_SCRIPT_CONFIGS).reduce((total, scripts) => total + Object.keys(scripts).length, 0);
                const cloudCount = generatedCount - Math.min(generatedCount, builtInCount);
                
                let message = `✅ Generated ${generatedCount} configurations!`;
                if (builtInCount > 0 && cloudCount > 0) {
                    message += ` (${Math.min(generatedCount, builtInCount)} built-in + ${cloudCount} cloud scripts)`;
                } else if (builtInCount > 0) {
                    message += ` (${Math.min(generatedCount, builtInCount)} built-in scripts)`;
                }
                
                this.showMessage(message, 'success');
                
                if (errors.length > 0) {
                    console.warn('Some scripts had errors:', errors);
                    this.showMessage(`⚠️ ${errors.length} cloud scripts had parsing errors (check console for details)`, 'error');
                }
            } else {
                this.showMessage('No new configurations were generated (configs may already exist)', 'error');
            }

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

        console.log(`Parsing script source for ${scriptName}`);

        // Extract the base name without .lua extension
        const baseName = scriptName.replace('.lua', '').toLowerCase();
        
        // Find the start of our config object
        const objectPattern = new RegExp(`^\\s*(local\\s+)?${baseName}\\s*=\\s*\\{`, 'im');
        const lines = sourceCode.split('\n');
        
        let startLine = -1;
        for (let i = 0; i < lines.length; i++) {
            if (objectPattern.test(lines[i])) {
                startLine = i;
                break;
            }
        }

        if (startLine === -1) {
            console.log(`No config object found for ${scriptName}`);
            return {};
        }

        const defaults = {};
        let mainBraceLevel = 1; // We start inside the main object
        let skipUntilBraceLevel = null; // When we're skipping a nested object

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

            // Count braces
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            
            // Update main brace level
            mainBraceLevel += openBraces - closeBraces;

            // If we've exited the main object, stop
            if (mainBraceLevel <= 0) {
                console.log(`Exited main object at line ${i}`);
                break;
            }

            // If we're currently skipping a nested object
            if (skipUntilBraceLevel !== null) {
                skipUntilBraceLevel += openBraces - closeBraces;
                if (skipUntilBraceLevel <= 1) { // Back to main level
                    skipUntilBraceLevel = null;
                    console.log(`Finished skipping nested object at line ${i}`);
                }
                continue;
            }

            // Check if this line starts a nested object
            if (line.includes('=') && line.includes('{')) {
                console.log(`Starting to skip nested object at line ${i}: ${line}`);
                skipUntilBraceLevel = mainBraceLevel + openBraces - closeBraces;
                continue;
            }

            // Only parse simple assignments with NO braces
            if (!line.includes('{') && !line.includes('}') && line.includes('=')) {
                const settingMatch = line.match(/^(\w+)\s*=\s*(.+?)(?:,\s*)?$/);
                if (settingMatch) {
                    const [, settingName, settingValue] = settingMatch;
                    
                    const parsedValue = this.parseSettingValue(settingValue.trim().replace(/,$/, ''));
                    if (parsedValue !== null) {
                        defaults[settingName] = parsedValue;
                        console.log(`Found setting: ${settingName} = ${parsedValue}`);
                    }
                }
            }
        }

        console.log(`Parsed ${Object.keys(defaults).length} settings from ${scriptName}`);
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
        
        // Unquoted strings that are clearly meant to be strings (like "ALT", "F6", etc.)
        // These are common in Lua for key names and similar values
        if (/^[A-Z][A-Z0-9_]*$/i.test(trimmed) && trimmed.length <= 10) {
            return trimmed;
        }
        
        // Hex color values (common pattern in configs)
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

    getSoftwareNameFromId(softwareId) {
        const softwareMap = {
            4: 'omega',      // FC2 Global -> omega
            5: 'universe4',
            6: 'omega', // Also we're just getting rid of Conestellation4. Idk why this returns it still
            7: 'parallax2'
        };
        return softwareMap[softwareId] || `software_${softwareId}`;
    }
});