// FC2 Dashboard - Utils
// Contains: Sorting/filtering, script editor, Venus perks, build system, advanced utilities

// Extend the app object with utility functionality
Object.assign(app, {

    // ========================
    // SORTING & FILTERING UTILITIES
    // ========================

    sortMyScripts() {
        const sortSelect = document.getElementById('myScriptSort');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;
        const grid = document.getElementById('myScriptsGrid');
        if (!grid) return;

        const scriptCards = Array.from(grid.children);

        scriptCards.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return a.dataset.scriptName.localeCompare(b.dataset.scriptName);
                case 'name_desc':
                    return b.dataset.scriptName.localeCompare(a.dataset.scriptName);
                case 'author':
                    return (a.dataset.scriptAuthorDisplay || '').localeCompare(b.dataset.scriptAuthorDisplay || '');
                case 'updated':
                    return parseInt(b.dataset.scriptUpdated || 0) - parseInt(a.dataset.scriptUpdated || 0);
                case 'software':
                    return (a.dataset.scriptSoftwareName || '').localeCompare(b.dataset.scriptSoftwareName || '');
                default:
                    return 0;
            }
        });

        grid.innerHTML = '';
        scriptCards.forEach(card => grid.appendChild(card));
    },

    sortMyProjects() {
        const sortSelect = document.getElementById('myProjectSort');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;
        const grid = document.getElementById('myProjectsGrid');
        if (!grid) return;

        const projectCards = Array.from(grid.children);

        projectCards.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return a.dataset.projectName.localeCompare(b.dataset.projectName);
                case 'name_desc':
                    return b.dataset.projectName.localeCompare(a.dataset.projectName);
                case 'author':
                    return (a.dataset.projectAuthorDisplay || '').localeCompare(b.dataset.projectAuthorDisplay || '');
                case 'updated':
                    return parseInt(b.dataset.projectUpdated || 0) - parseInt(a.dataset.projectUpdated || 0);
                default:
                    return 0;
            }
        });

        grid.innerHTML = '';
        projectCards.forEach(card => grid.appendChild(card));
    },

    sortMyBuilds() {
        const sortSelect = document.getElementById('myBuildSort');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;
        const grid = document.getElementById('myBuildsGrid');
        if (!grid) return;

        const buildCards = Array.from(grid.children);

        buildCards.sort((a, b) => {
            switch (sortValue) {
                case 'tag':
                    return a.dataset.buildTag.localeCompare(b.dataset.buildTag);
                case 'tag_desc':
                    return b.dataset.buildTag.localeCompare(a.dataset.buildTag);
                case 'popularity':
                    return parseInt(b.dataset.buildPopularity || 0) - parseInt(a.dataset.buildPopularity || 0);
                default:
                    return 0;
            }
        });

        grid.innerHTML = '';
        buildCards.forEach(card => grid.appendChild(card));
    },

    handleAvailableSortChange() {
        const sortSelect = document.getElementById('availableScriptSort');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;

        // Hide all filter panels
        document.querySelectorAll('.filter-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Show relevant filter panel
        if (sortValue === 'author') {
            document.getElementById('availableAuthorFilter').classList.add('active');
        } else if (sortValue === 'software') {
            document.getElementById('availableSoftwareFilter').classList.add('active');
        } else if (sortValue === 'categories') {
            document.getElementById('availableCategoryFilter').classList.add('active');
        }

        this.sortAvailableScripts();
    },

    handleAvailableProjectSortChange() {
        const sortSelect = document.getElementById('availableProjectSort');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;

        // Hide all filter panels
        document.querySelectorAll('.filter-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Show relevant filter panel
        if (sortValue === 'author') {
            document.getElementById('availableProjectAuthorFilter').classList.add('active');
        }

        this.sortAvailableProjects();
    },

    handleAvailableBuildSortChange() {
        const sortSelect = document.getElementById('availableBuildSort');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;

        // Hide all filter panels
        document.querySelectorAll('.filter-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Show relevant filter panel
        if (sortValue === 'author') {
            document.getElementById('availableBuildAuthorFilter').classList.add('active');
        }

        this.sortAvailableBuilds();
    },

    sortAvailableScripts() {
        const sortSelect = document.getElementById('availableScriptSort');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;
        const grid = document.getElementById('availableScriptsGrid');
        if (!grid) return;

        const scriptCards = Array.from(grid.children);

        scriptCards.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return a.dataset.scriptName.localeCompare(b.dataset.scriptName);
                case 'name_desc':
                    return b.dataset.scriptName.localeCompare(a.dataset.scriptName);
                case 'author':
                    return (a.dataset.scriptAuthorDisplay || '').localeCompare(b.dataset.scriptAuthorDisplay || '');
                case 'updated':
                    return parseInt(b.dataset.scriptUpdated || 0) - parseInt(a.dataset.scriptUpdated || 0);
                case 'software':
                    return (a.dataset.scriptSoftwareName || '').localeCompare(b.dataset.scriptSoftwareName || '');
                case 'categories':
                    const aCats = a.dataset.scriptCategories || '';
                    const bCats = b.dataset.scriptCategories || '';
                    return aCats.localeCompare(bCats);
                default:
                    return 0;
            }
        });

        grid.innerHTML = '';
        scriptCards.forEach(card => grid.appendChild(card));

        this.applyFilters();
    },

    sortAvailableProjects() {
        const sortSelect = document.getElementById('availableProjectSort');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;
        const grid = document.getElementById('availableProjectsGrid');
        if (!grid) return;

        const projectCards = Array.from(grid.children);

        projectCards.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return a.dataset.projectName.localeCompare(b.dataset.projectName);
                case 'name_desc':
                    return b.dataset.projectName.localeCompare(a.dataset.projectName);
                case 'author':
                    return (a.dataset.projectAuthorDisplay || '').localeCompare(b.dataset.projectAuthorDisplay || '');
                case 'updated':
                    return parseInt(b.dataset.projectUpdated || 0) - parseInt(a.dataset.projectUpdated || 0);
                default:
                    return 0;
            }
        });

        grid.innerHTML = '';
        projectCards.forEach(card => grid.appendChild(card));

        this.applyProjectFilters();
    },

    sortAvailableBuilds() {
        const sortSelect = document.getElementById('availableBuildSort');
        if (!sortSelect) return;

        const sortValue = sortSelect.value;
        const grid = document.getElementById('availableBuildsGrid');
        if (!grid) return;

        const buildCards = Array.from(grid.children);

        buildCards.sort((a, b) => {
            switch (sortValue) {
                case 'tag':
                    return a.dataset.buildTag.localeCompare(b.dataset.buildTag);
                case 'tag_desc':
                    return b.dataset.buildTag.localeCompare(a.dataset.buildTag);
                case 'author':
                    return (a.dataset.buildAuthorDisplay || '').localeCompare(b.dataset.buildAuthorDisplay || '');
                case 'popularity':
                    return parseInt(b.dataset.buildPopularity || 0) - parseInt(a.dataset.buildPopularity || 0);
                default:
                    return 0;
            }
        });

        grid.innerHTML = '';
        buildCards.forEach(card => grid.appendChild(card));

        this.applyBuildFilters();
    },

    // ========================
    // FILTERING UTILITIES
    // ========================

    toggleFilter(type, value) {
        if (!this.availableFilters[type]) return;

        if (this.availableFilters[type].has(value)) {
            this.availableFilters[type].delete(value);
        } else {
            this.availableFilters[type].add(value);
        }

        // Update checkbox visual
        const checkbox = document.querySelector(`.filter-checkbox[data-type="${type}"][data-value="${value}"]`);
        if (checkbox) {
            checkbox.classList.toggle('checked');
        }

        this.applyFilters();
    },

    toggleProjectFilter(type, value) {
        if (!this.availableProjectFilters[type]) return;

        if (this.availableProjectFilters[type].has(value)) {
            this.availableProjectFilters[type].delete(value);
        } else {
            this.availableProjectFilters[type].add(value);
        }

        // Update checkbox visual
        const checkbox = document.querySelector(`#availableProjectAuthorFilter .filter-checkbox[data-type="${type}"][data-value="${value}"]`);
        if (checkbox) {
            checkbox.classList.toggle('checked');
        }

        this.applyProjectFilters();
    },

    toggleBuildFilter(type, value) {
        if (!this.availableBuildFilters[type]) return;

        if (this.availableBuildFilters[type].has(value)) {
            this.availableBuildFilters[type].delete(value);
        } else {
            this.availableBuildFilters[type].add(value);
        }

        // Update checkbox visual
        const checkbox = document.querySelector(`#availableBuildAuthorFilter .filter-checkbox[data-type="${type}"][data-value="${value}"]`);
        if (checkbox) {
            checkbox.classList.toggle('checked');
        }

        this.applyBuildFilters();
    },

    applyFilters() {
        const grid = document.getElementById('availableScriptsGrid');
        if (!grid) return;

        const scriptCards = grid.children;

        Array.from(scriptCards).forEach(card => {
            let showCard = true;

            // Check search results first
            if (card.dataset.matchesSearch === 'false') {
                showCard = false;
            }

            // Check author filter
            if (showCard && this.availableFilters.author.size > 0) {
                const author = card.dataset.scriptAuthorDisplay || '';
                if (!this.availableFilters.author.has(author)) {
                    showCard = false;
                }
            }

            // Check software filter
            if (showCard && this.availableFilters.software.size > 0) {
                const software = card.dataset.scriptSoftwareName || '';
                if (!this.availableFilters.software.has(software)) {
                    showCard = false;
                }
            }

            // Check category filter
            if (showCard && this.availableFilters.category.size > 0) {
                const categories = (card.dataset.scriptCategories || '').split(',').filter(c => c.trim());
                const hasMatchingCategory = categories.some(cat => this.availableFilters.category.has(cat.trim()));
                if (!hasMatchingCategory) {
                    showCard = false;
                }
            }

            card.style.display = showCard ? 'block' : 'none';
        });
    },

    applyProjectFilters() {
        const grid = document.getElementById('availableProjectsGrid');
        if (!grid) return;

        const projectCards = grid.children;

        Array.from(projectCards).forEach(card => {
            let showCard = true;

            // Check search results first
            if (card.dataset.matchesSearch === 'false') {
                showCard = false;
            }

            // Check author filter
            if (showCard && this.availableProjectFilters.author.size > 0) {
                const author = card.dataset.projectAuthorDisplay || '';
                if (!this.availableProjectFilters.author.has(author)) {
                    showCard = false;
                }
            }

            card.style.display = showCard ? 'block' : 'none';
        });
    },

    applyBuildFilters() {
        const grid = document.getElementById('availableBuildsGrid');
        if (!grid) return;

        const buildCards = grid.children;

        Array.from(buildCards).forEach(card => {
            let showCard = true;

            // Check search results first
            if (card.dataset.matchesSearch === 'false') {
                showCard = false;
            }

            // Check author filter
            if (showCard && this.availableBuildFilters.author.size > 0) {
                const author = card.dataset.buildAuthorDisplay || '';
                if (!this.availableBuildFilters.author.has(author)) {
                    showCard = false;
                }
            }

            card.style.display = showCard ? 'block' : 'none';
        });
    },

    // Clear filter functions
    clearAvailableFilters() {
        // Clear all active filters
        this.availableFilters.author.clear();
        this.availableFilters.software.clear();
        this.availableFilters.category.clear();

        // Update all checkboxes
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.classList.remove('checked');
        });

        // Reset search state for all cards
        const grid = document.getElementById('availableScriptsGrid');
        if (grid) {
            Array.from(grid.children).forEach(card => {
                card.style.display = 'block';
                card.dataset.matchesSearch = 'true';
            });
        }

        // Hide all filter panels
        document.querySelectorAll('.filter-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Reset sort dropdown
        const sortSelect = document.getElementById('availableScriptSort');
        if (sortSelect) {
            sortSelect.value = 'updated';
        }

        // Clear search
        const searchInput = document.getElementById('scriptSearch');
        if (searchInput) {
            searchInput.value = '';
        }

        // Apply default sorting
        setTimeout(() => {
            this.sortAvailableScripts();
        }, 100);

        this.showMessage('All filters and search cleared!', 'success');
    },

    clearAvailableProjectFilters() {
        // Clear all active filters
        this.availableProjectFilters.author.clear();

        // Update all checkboxes
        document.querySelectorAll('#availableProjectAuthorFilter .filter-checkbox').forEach(checkbox => {
            checkbox.classList.remove('checked');
        });

        // Reset search state for all cards
        const grid = document.getElementById('availableProjectsGrid');
        if (grid) {
            Array.from(grid.children).forEach(card => {
                card.style.display = 'block';
                card.dataset.matchesSearch = 'true';
            });
        }

        // Hide all filter panels
        document.querySelectorAll('.filter-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Reset sort dropdown
        const sortSelect = document.getElementById('availableProjectSort');
        if (sortSelect) {
            sortSelect.value = 'updated';
        }

        // Clear search
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.value = '';
        }

        // Apply default sorting
        setTimeout(() => {
            this.sortAvailableProjects();
        }, 100);

        this.showMessage('All project filters and search cleared!', 'success');
    },

    clearAvailableBuildFilters() {
        // Clear all active filters
        this.availableBuildFilters.author.clear();

        // Update all checkboxes
        document.querySelectorAll('#availableBuildAuthorFilter .filter-checkbox').forEach(checkbox => {
            checkbox.classList.remove('checked');
        });

        // Reset search state for all cards
        const grid = document.getElementById('availableBuildsGrid');
        if (grid) {
            Array.from(grid.children).forEach(card => {
                card.style.display = 'block';
                card.dataset.matchesSearch = 'true';
            });
        }

        // Hide all filter panels
        document.querySelectorAll('.filter-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Reset sort dropdown
        const sortSelect = document.getElementById('availableBuildSort');
        if (sortSelect) {
            sortSelect.value = 'popularity';
        }

        // Clear search
        const searchInput = document.getElementById('buildSearch');
        if (searchInput) {
            searchInput.value = '';
        }

        // Apply default sorting
        setTimeout(() => {
            this.sortAvailableBuilds();
        }, 100);

        this.showMessage('All build filters and search cleared!', 'success');
    },

    // Search functions
    filterScripts() {
        const searchInput = document.getElementById('scriptSearch');
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase();
        const scriptCards = document.querySelectorAll('#availableScriptsGrid .script-card');

        scriptCards.forEach(card => {
            const name = card.dataset.scriptName || '';
            const author = card.dataset.scriptAuthor || '';
            const categories = card.dataset.scriptCategories || '';

            const matchesSearch = !searchTerm ||
                name.includes(searchTerm) ||
                author.includes(searchTerm) ||
                categories.toLowerCase().includes(searchTerm);

            // Set a temporary attribute to track search results
            card.dataset.matchesSearch = matchesSearch;
        });

        // Apply combined search and filters
        this.applyFilters();
    },

    filterProjects() {
        const searchInput = document.getElementById('projectSearch');
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase();
        const projectCards = document.querySelectorAll('#availableProjectsGrid .project-card');

        projectCards.forEach(card => {
            const name = card.dataset.projectName || '';
            const author = card.dataset.projectAuthor || '';

            const matchesSearch = !searchTerm ||
                name.includes(searchTerm) ||
                author.includes(searchTerm);

            // Set a temporary attribute to track search results
            card.dataset.matchesSearch = matchesSearch;
        });

        // Apply combined search and filters
        this.applyProjectFilters();
    },

    filterBuilds() {
        const searchInput = document.getElementById('buildSearch');
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase();
        const buildCards = document.querySelectorAll('#availableBuildsGrid .script-card');

        buildCards.forEach(card => {
            const tag = card.dataset.buildTag || '';
            const author = card.dataset.buildAuthor || '';

            const matchesSearch = !searchTerm ||
                tag.includes(searchTerm) ||
                author.includes(searchTerm);

            // Set a temporary attribute to track search results
            card.dataset.matchesSearch = matchesSearch;
        });

        // Apply combined search and filters
        this.applyBuildFilters();
    },

    // ========================
    // SCRIPT EDITOR UTILITIES
    // ========================

    async editScript(scriptId) {
        try {
            // Show the modal and loading overlay
            const modal = document.getElementById('scriptEditorModal');
            const loading = document.getElementById('scriptEditorLoading');

            modal.classList.add('active');
            loading.classList.remove('hidden');

            console.log(`Fetching script data for ID: ${scriptId}`);

            // Fetch script data - FIXED: Use correct parameters from documentation
            const apiResponse = await this.apiCall('getScript', {
                id: scriptId,
                beautify: '' // This is the correct parameter from the API docs
            });

            console.log('API response received:', apiResponse);

            // Parse the nested response structure based on the documentation
            let scriptData;
            if (apiResponse && apiResponse.response && apiResponse.response._raw_response) {
                // The actual script data is in _raw_response as a JSON string
                try {
                    scriptData = JSON.parse(apiResponse.response._raw_response);
                    console.log('Parsed script data from _raw_response:', scriptData);
                } catch (e) {
                    console.error('Failed to parse _raw_response as JSON:', e);
                    throw new Error('Failed to parse script data from API response');
                }
            } else if (typeof apiResponse === 'object' && apiResponse.id) {
                // Fallback: maybe the data is directly in the response
                scriptData = apiResponse;
                console.log('Using direct API response as script data:', scriptData);
            } else {
                console.error('Unexpected API response structure:', apiResponse);
                throw new Error('Invalid API response structure for script data');
            }

            // Store current editing script
            this.currentEditingScript = scriptData;

            // Check for existing draft
            const draft = this.loadDraft(scriptId);
            if (draft && confirm('A draft was found for this script. Do you want to load it?')) {
                this.populateScriptEditor(scriptData, draft);
            } else {
                this.populateScriptEditor(scriptData);
            }

            // Setup event listeners
            this.setupScriptEditorListeners();

            // Hide loading overlay
            loading.classList.add('hidden');

            this.showMessage(`Opened script editor for "${scriptData.name}"`, 'success');

        } catch (error) {
            console.error('Error opening script editor:', error);
            this.showMessage(`Failed to open script editor: ${error.message}`, 'error');
            this.closeScriptEditor();
        }
    },

    populateScriptEditor(scriptData, draft = null) {
        console.log('Populating script editor with data:', scriptData);
        console.log('Using draft:', draft);

        // Populate script info
        document.getElementById('scriptInfoName').textContent = scriptData.name || 'Unknown';
        document.getElementById('scriptInfoId').textContent = scriptData.id || '-';
        document.getElementById('scriptInfoAuthor').textContent = scriptData.author || '-';

        // Map software ID to name
        const softwareNames = {
            4: 'Omega',
            5: 'Universe4',
            6: 'Omega',
            7: 'Parallax2'
        };
        document.getElementById('scriptInfoSoftware').textContent =
            softwareNames[scriptData.software] || `Software ${scriptData.software || 'Unknown'}`;

        // Calculate elapsed time
        let elapsedText = 'Never';
        if (scriptData.last_update) {
            elapsedText = this.getElapsedTime(scriptData.last_update);
        }
        document.getElementById('scriptInfoUpdated').textContent = elapsedText;

        // Get source code
        let sourceCode = '';
        if (draft && draft.code) {
            sourceCode = draft.code;
            console.log('Using draft source code');
        } else if (scriptData.script) {
            sourceCode = scriptData.script;
            console.log('Using scriptData.script (main property)');
        } else if (scriptData.source) {
            sourceCode = scriptData.source;
            console.log('Using scriptData.source');
        } else if (scriptData.content) {
            sourceCode = scriptData.content;
            console.log('Using scriptData.content');
        } else {
            sourceCode = '-- No source code available\n-- This might be an empty script or there was an error loading the source';
            console.warn('No source code found in script data. Available properties:', Object.keys(scriptData));
        }

        // Decode any escaped characters
        if (sourceCode && typeof sourceCode === 'string') {
            sourceCode = sourceCode
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'")
                .replace(/\\\\/g, '\\');
        }

        // Set content and apply syntax highlighting
        const codeEditor = document.getElementById('scriptCodeEditor');
        // Reset the element completely first
        codeEditor.className = 'code-editor';
        codeEditor.innerHTML = '';
        codeEditor.removeAttribute('data-highlighted');
        codeEditor.textContent = sourceCode;
        this.highlightCodeEditor();
        
        console.log('Set code editor value, length:', sourceCode.length);

        // FIXED: Only focus the editor if no other element is currently focused
        setTimeout(() => {
            const activeElement = document.activeElement;
            if (!activeElement || activeElement === document.body || activeElement.tagName === 'BUTTON') {
                codeEditor.focus();
            }
        }, 200);

        // Update notes
        const initialNotes = draft ? draft.notes : '';
        document.getElementById('updateNotes').value = initialNotes;
        this.updateNotesCharCounter();

        // Populate categories
        const selectedCategories = draft ? draft.categories : (scriptData.categories || scriptData.category_ids || []);
        this.populateCategories(selectedCategories);

        // Show/hide draft indicator
        if (draft) {
            this.showDraftIndicator();
        } else {
            this.hideDraftIndicator();
        }

        this.updateSaveIndicator('');
    },

    highlightCodeEditor() {
        const codeEditor = document.getElementById('scriptCodeEditor');
        if (!codeEditor) return;
        
        console.log('highlightCodeEditor called');
        
        // Get the plain text content
        const content = codeEditor.textContent;
        
        // Don't highlight empty content
        if (!content || content.trim() === '') {
            return;
        }
        
        // Check if the code editor currently has focus
        const hadFocus = document.activeElement === codeEditor;
        
        // Store cursor position only if code editor has focus
        let cursorOffset = 0;
        const selection = window.getSelection();
        
        try {
            if (hadFocus && selection.rangeCount > 0 && codeEditor.contains(selection.anchorNode)) {
                cursorOffset = this.getCaretPosition(codeEditor);
            }
        } catch (e) {
            console.warn('Could not get cursor position:', e);
        }
        
        // Create a temporary element to highlight
        const tempDiv = document.createElement('div');
        tempDiv.textContent = content;
        tempDiv.className = 'hljs';
        tempDiv.setAttribute('data-language', 'lua');
        
        // Highlight the temporary element
        hljs.highlightElement(tempDiv);
        
        // Replace content with highlighted version
        codeEditor.innerHTML = tempDiv.innerHTML;
        codeEditor.className = 'code-editor hljs';
        
        // Only restore cursor position if the code editor had focus originally
        if (hadFocus) {
            setTimeout(() => {
                try {
                    this.setCaretPosition(codeEditor, cursorOffset);
                } catch (e) {
                    console.warn('Could not restore cursor position:', e);
                    // FIXED: Only focus if it originally had focus and restoration failed
                    if (document.activeElement !== codeEditor) {
                        codeEditor.focus();
                    }
                }
            }, 10);
        }
        
        console.log('Highlighting completed');
    },

    getCaretPosition(element) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return 0;
        
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    },

    setCaretPosition(element, offset) {
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
        
        // FIXED: Don't force focus - let the calling function handle it
        // The calling function now checks if focus should be restored
    },

    getCodeEditorContent() {
        const codeEditor = document.getElementById('scriptCodeEditor');
        return codeEditor ? codeEditor.textContent : '';
    },

    populateCategories(selectedCategories = []) {
        const container = document.getElementById('categoriesGrid');

        container.innerHTML = Object.entries(this.availableCategories).map(([id, name]) => {
            const isChecked = selectedCategories.includes(parseInt(id));
            return `
                <div class="category-item" onclick="app.toggleCategory(${id})">
                    <div class="category-checkbox ${isChecked ? 'checked' : ''}" data-category-id="${id}"></div>
                    <div class="category-label">${name}</div>
                </div>
            `;
        }).join('');
    },

    toggleCategory(categoryId) {
        const checkbox = document.querySelector(`[data-category-id="${categoryId}"]`);
        if (checkbox) {
            checkbox.classList.toggle('checked');
            this.saveDraft();
        }
    },

    getSelectedCategories() {
        const checkedBoxes = document.querySelectorAll('.category-checkbox.checked');
        return Array.from(checkedBoxes).map(box => parseInt(box.dataset.categoryId));
    },

    setupScriptEditorListeners() {
        const codeEditor = document.getElementById('scriptCodeEditor');
        const updateNotes = document.getElementById('updateNotes');

        // Remove any existing listeners to avoid duplicates
        if (this.scriptEditorListenersAttached) {
            return; // Already attached
        }

        // Auto-save draft as user types
        const draftSave = () => {
            this.saveDraft();
        };

        // Debounced draft saving  
        const debouncedDraftSave = () => {
            clearTimeout(this.scriptEditorDraftTimeout);
            this.scriptEditorDraftTimeout = setTimeout(draftSave, 1000);
        };

        // Use 'input' event for contenteditable
        codeEditor.addEventListener('input', debouncedDraftSave);
        updateNotes.addEventListener('input', (e) => {
            // Ensure the event isn't being prevented
            e.stopPropagation();
            this.updateNotesCharCounter();
            debouncedDraftSave();
        });

        // Enhanced code editor features
        this.setupCodeEditorFeatures(codeEditor);
        
        // Mark listeners as attached
        this.scriptEditorListenersAttached = true;
    },

    setupCodeEditorFeatures(editor) {
        // Simple input handler - highlight after typing stops
        let typingTimer;
        
        editor.addEventListener('input', () => {
            // Clear the previous timer
            clearTimeout(typingTimer);
            
            // Set a new timer - highlight after 800ms of no typing
            typingTimer = setTimeout(() => {
                console.log('Highlighting after typing stopped');
                this.highlightCodeEditor();
            }, 800);
        });

        // Highlight immediately when clicking away
        editor.addEventListener('blur', () => {
            console.log('Highlighting on blur');
            clearTimeout(typingTimer);
            this.highlightCodeEditor();
        });

        // Tab key support
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertText', false, '    ');
            }
        });
        
        // Handle paste event to convert to plain text
        editor.addEventListener('paste', (e) => {
            e.preventDefault();
            
            // Get the plain text from clipboard
            const text = (e.clipboardData || window.clipboardData).getData('text/plain');
            
            // Insert the plain text at the current cursor position
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            
            selection.deleteFromDocument();
            const range = selection.getRangeAt(0);
            const textNode = document.createTextNode(text);
            range.insertNode(textNode);
            
            // Move cursor to end of inserted text
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Trigger input event for draft saving
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        });
        
    },

    updateNotesCharCounter() {
        const textarea = document.getElementById('updateNotes');
        const counter = document.getElementById('notesCharCounter');
        const length = textarea.value.length;

        counter.textContent = `${length} / 5 minimum`;

        if (length < 5) {
            counter.className = 'char-counter error';
        } else {
            counter.className = 'char-counter good';
        }
    },

    saveDraft() {
        try {
            const draftData = {
                scriptId: this.currentEditingScript?.id,
                code: this.getCodeEditorContent(),
                notes: document.getElementById('updateNotes').value,
                categories: this.getSelectedCategories(),
                timestamp: Date.now()
            };

            localStorage.setItem(`script_draft_${draftData.scriptId}`, JSON.stringify(draftData));
            this.showDraftIndicator();
        } catch (error) {
            console.warn('Could not save draft:', error);
        }
    },

    loadDraft(scriptId) {
        try {
            const draftData = localStorage.getItem(`script_draft_${scriptId}`);
            if (draftData) {
                const draft = JSON.parse(draftData);
                // Only load draft if it's less than 24 hours old
                if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
                    return draft;
                }
            }
        } catch (error) {
            console.warn('Could not load draft:', error);
        }
        return null;
    },

    clearDraft(scriptId) {
        try {
            localStorage.removeItem(`script_draft_${scriptId}`);
            this.hideDraftIndicator();
        } catch (error) {
            console.warn('Could not clear draft:', error);
        }
    },

    showDraftIndicator() {
        document.getElementById('draftIndicator').classList.add('active');
    },

    hideDraftIndicator() {
        document.getElementById('draftIndicator').classList.remove('active');
    },

    updateSaveIndicator(state) {
        const indicator = document.getElementById('saveIndicator');
        const saveBtn = document.getElementById('saveScriptBtn');

        indicator.className = 'save-indicator';

        switch (state) {
            case 'saving':
                indicator.classList.add('saving');
                indicator.textContent = '💾 Saving...';
                saveBtn.disabled = true;
                break;
            case 'saved':
                indicator.classList.add('saved');
                indicator.textContent = '✅ Saved';
                saveBtn.disabled = false;
                setTimeout(() => this.updateSaveIndicator(''), 3000);
                break;
            case 'error':
                indicator.classList.add('error');
                indicator.textContent = '❌ Error';
                saveBtn.disabled = false;
                setTimeout(() => this.updateSaveIndicator(''), 5000);
                break;
            default:
                indicator.style.display = 'none';
                saveBtn.disabled = false;
        }
    },

    async saveScript() {
        if (!this.currentEditingScript) {
            this.showMessage('No script is currently being edited', 'error');
            return;
        }

        const code = this.getCodeEditorContent().trim();
        const notes = document.getElementById('updateNotes').value.trim();
        const categories = this.getSelectedCategories();

        // Validation
        if (!code) {
            this.showMessage('Script content cannot be empty', 'error');
            return;
        }

        if (notes.length < 5) {
            this.showMessage('Update notes must be at least 5 characters long', 'error');
            document.getElementById('updateNotes').focus();
            return;
        }

        try {
            this.updateSaveIndicator('saving');

            const requestBody = {
                script: this.currentEditingScript.id,
                content: code,
                notes: notes
            };

            // Add categories if any are selected
            if (categories.length > 0) {
                requestBody.categories = JSON.stringify(categories);
            }

            await this.apiPost('updateScript', {}, requestBody);

            this.updateSaveIndicator('saved');
            this.showMessage(`Script "${this.currentEditingScript.name}" updated successfully!`, 'success');

            // Clear draft after successful save
            this.clearDraft(this.currentEditingScript.id);

            // Clear the update notes for next edit
            document.getElementById('updateNotes').value = '';
            this.updateNotesCharCounter();

            // Refresh script data in the main view
            await this.refreshScripts();

        } catch (error) {
            console.error('Error saving script:', error);
            this.updateSaveIndicator('error');
        }
    },

    closeScriptEditor() {
        // Ask about unsaved changes if there's content
        const code = this.getCodeEditorContent();
        const notes = document.getElementById('updateNotes').value;

        if ((code.trim() || notes.trim()) && !confirm('You have unsaved changes. Are you sure you want to close the editor?')) {
            return;
        }

        // Clear state
        this.currentEditingScript = null;
        this.scriptEditorListenersAttached = false; // ADDED: Reset listeners flag
        clearTimeout(this.scriptEditorDraftTimeout);

        // Hide modal
        document.getElementById('scriptEditorModal').classList.remove('active');

        // Clear editor content
        const codeEditor = document.getElementById('scriptCodeEditor');
        if (codeEditor) {
            codeEditor.className = 'code-editor';
            codeEditor.innerHTML = '';
            codeEditor.removeAttribute('data-highlighted');
        }
        document.getElementById('updateNotes').value = '';
        this.hideDraftIndicator();
        this.updateSaveIndicator('');
    },

    // ========================
    // VENUS PERK UTILITIES
    // ========================

    async loadVenusStatus() {
        try {
            const status = await this.apiCall('changeVenus', {
                status: ''
            });
            this.venusStatus = status;
            this.displayVenusStatus();

            // Show Venus card
            document.getElementById('venusCard').style.display = 'block';

        } catch (error) {
            console.error('Error loading Venus status:', error);
            // Don't show error for Venus - user might not have the perk
            document.getElementById('venusCard').style.display = 'none';
        }
    },

    displayVenusStatus() {
        const container = document.getElementById('venusStatus');

        if (!this.venusStatus) {
            container.innerHTML = '<p style="color: #888;">Venus perk status unavailable</p>';
            return;
        }

        // Extract the message from the API response
        let statusMessage = 'Unknown status';
        if (typeof this.venusStatus === 'object' && this.venusStatus.message) {
            statusMessage = this.venusStatus.message;
        } else if (typeof this.venusStatus === 'string') {
            statusMessage = this.venusStatus;
        }

        container.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(255, 20, 147, 0.1)); border: 1px solid rgba(255, 105, 180, 0.3); border-radius: 12px; padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #ff69b4; margin-bottom: 10px;">💕 Partnership Status</h4>
                    <div style="color: #fff; font-size: 16px; line-height: 1.4;">
                        ${statusMessage}
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-small" onclick="app.refreshVenusStatus()" style="background: linear-gradient(135deg, #ff69b4, #ff1493);">
                        🔄 Refresh Status
                    </button>
                    <button class="btn btn-small" onclick="app.requestVenusPartnership()" style="background: linear-gradient(135deg, #ff69b4, #ff1493);">
                        💌 Request Partnership
                    </button>
                    <button class="btn btn-small btn-danger" onclick="app.withdrawVenusPartnership()">
                        💔 Withdraw/End Partnership
                    </button>
                </div>
            </div>
        `;
    },

    async refreshVenusStatus() {
        await this.loadVenusStatus();
        this.showMessage('Venus status refreshed', 'success');
    },

    async requestVenusPartnership() {
        const partnerName = prompt('Enter the username of the person you want to partner with:');
        if (!partnerName || !partnerName.trim()) {
            return;
        }

        try {
            await this.apiCall('changeVenus', {
                request: partnerName.trim()
            });
            this.showMessage(`Partnership request sent to ${partnerName}!`, 'success');
            await this.loadVenusStatus();

        } catch (error) {
            console.error('Error requesting Venus partnership:', error);
            this.showMessage(`Failed to send partnership request: ${error.message}`, 'error');
        }
    },

    async withdrawVenusPartnership() {
        if (!confirm('Are you sure you want to withdraw your partnership request or end your current partnership?')) {
            return;
        }

        try {
            await this.apiCall('changeVenus', {
                withdraw: ''
            });
            this.showMessage('Partnership request withdrawn/partnership ended', 'success');
            await this.loadVenusStatus();

        } catch (error) {
            console.error('Error withdrawing Venus partnership:', error);
            this.showMessage(`Failed to withdraw partnership: ${error.message}`, 'error');
        }
    },

    // ========================
    // BUILD SYSTEM UTILITIES
    // ========================

    async createBuild() {
        const tag = prompt('Enter a tag for your build (max 16 characters, A-Z/0-9 only):');
        if (!tag || !tag.trim()) {
            return;
        }

        // Validate tag format
        if (tag.length > 16 || !/^[A-Z0-9]+$/i.test(tag)) {
            this.showMessage('Tag must be max 16 characters and contain only A-Z/0-9', 'error');
            return;
        }

        try {
            await this.apiCall('createBuild', {
                tag: tag.trim()
            });
            this.showMessage(`Build "${tag}" created successfully!`, 'success');

            // Refresh builds
            await this.loadBuilds();

        } catch (error) {
            console.error('Error creating build:', error);
            this.showMessage(`Failed to create build: ${error.message}`, 'error');
        }
    },

    async deleteBuild(tag) {
        if (!confirm(`Are you sure you want to delete the build "${tag}"? This cannot be undone.`)) {
            return;
        }

        try {
            await this.apiCall('deleteBuild', {
                tag: tag
            });
            this.showMessage(`Build "${tag}" deleted successfully!`, 'success');

            // Refresh builds
            await this.loadBuilds();

        } catch (error) {
            console.error('Error deleting build:', error);
            this.showMessage(`Failed to delete build: ${error.message}`, 'error');
        }
    },

    previewBuild(tag) {
        const build = this.allBuilds.find(b => b.tag === tag);
        if (!build) {
            this.showMessage('Build not found', 'error');
            return;
        }

        this.currentBuildToApply = build;
        this.showBuildPreview(build);
    },

    showBuildPreview(build) {
        const modal = document.getElementById('buildPreviewModal');
        const title = document.getElementById('buildPreviewTitle');
        const content = document.getElementById('buildPreviewContent');

        title.textContent = `Apply "${build.tag}" by ${build.author}`;

        // Get build data
        const buildScripts = JSON.parse(build.scripts || '[]');
        const buildProjects = JSON.parse(build.projects || '[]');
        const currentScripts = this.memberScripts.map(s => s.id);
        const currentProjects = this.memberProjects.map(p => p.id);

        // Calculate differences
        const scriptsToAdd = buildScripts.filter(id => !currentScripts.includes(id));
        const scriptsToRemove = currentScripts.filter(id => !buildScripts.includes(id));
        const projectsToAdd = buildProjects.filter(id => !currentProjects.includes(id));
        const projectsToRemove = currentProjects.filter(id => !buildProjects.includes(id));

        let changesHTML = '';

        // Script changes
        if (scriptsToAdd.length > 0 || scriptsToRemove.length > 0) {
            changesHTML += `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #4a9eff; margin-bottom: 10px;">📜 Script Changes</h4>
            `;

            if (scriptsToAdd.length > 0) {
                changesHTML += `
                    <div style="margin-bottom: 10px;">
                        <strong style="color: #4aff4a;">Scripts to Enable (${scriptsToAdd.length}):</strong>
                        <div style="margin-top: 5px;">
                            ${scriptsToAdd.map(id => {
                                const script = this.allScripts.find(s => s.id == id || s.id === String(id) || s.id === Number(id));
                                const scriptName = script ? script.name : `Unknown Script (ID: ${id})`;
                                return `<span style="color: #4aff4a; font-size: 12px; background: rgba(74, 255, 74, 0.2); padding: 2px 6px; border-radius: 8px; margin: 2px;">${scriptName}</span>`;
                            }).join(' ')}
                        </div>
                    </div>
                `;
            }

            if (scriptsToRemove.length > 0) {
                changesHTML += `
                    <div style="margin-bottom: 10px;">
                        <strong style="color: #ff6666;">Scripts to Disable (${scriptsToRemove.length}):</strong>
                        <div style="margin-top: 5px;">
                            ${scriptsToRemove.map(id => {
                                const script = this.allScripts.find(s => s.id == id || s.id === String(id) || s.id === Number(id));
                                const scriptName = script ? script.name : `Unknown Script (ID: ${id})`;
                                return `<span style="color: #ff6666; font-size: 12px; background: rgba(255, 102, 102, 0.2); padding: 2px 6px; border-radius: 8px; margin: 2px;">${script ? script.name : `ID: ${id}`}</span>`;
                            }).join(' ')}
                        </div>
                    </div>
                `;
            }

            changesHTML += '</div>';
        }

        // Project changes
        if (projectsToAdd.length > 0 || projectsToRemove.length > 0) {
            changesHTML += `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #4a9eff; margin-bottom: 10px;">👥 Project Changes</h4>
            `;

            if (projectsToAdd.length > 0) {
                changesHTML += `
                    <div style="margin-bottom: 10px;">
                        <strong style="color: #4aff4a;">Projects to Enable (${projectsToAdd.length}):</strong>
                        <div style="margin-top: 5px;">
                            ${projectsToAdd.map(id => {
                                const project = this.allProjects.find(p => p.id == id || p.id === String(id) || p.id === Number(id));
                                const projectName = project ? project.name : `Unknown Project (ID: ${id})`;
                                return `<span style="background: rgba(74, 255, 74, 0.2); color: #4aff4a; padding: 4px 8px; border-radius: 6px; font-size: 12px; border: 1px solid rgba(74, 255, 74, 0.4);">${projectName}</span>`;
                            }).join('')}
                        </div>
                    </div>
                `;
            }

            if (projectsToRemove.length > 0) {
                changesHTML += `
                    <div style="margin-bottom: 10px;">
                        <strong style="color: #ff6666;">Projects to Disable (${projectsToRemove.length}):</strong>
                        <div style="margin-top: 5px;">
                            ${projectsToRemove.map(id => {
                                const project = this.allProjects.find(p => p.id === id);
                                const projectName = project ? project.name : `Unknown Project (ID: ${id})`;
                                return `<span style="color: #ff6666; font-size: 12px; background: rgba(255, 102, 102, 0.2); padding: 2px 6px; border-radius: 8px; margin: 2px;">${projectName}</span>`;
                            }).join(' ')}
                        </div>
                    </div>
                `;
            }

            changesHTML += '</div>';
        }

        // Configuration changes
        if (build.configuration) {
            changesHTML += `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #4a9eff; margin-bottom: 10px;">⚙️ Configuration</h4>
                    <p style="color: #ffcc00;">⚠️ Your entire configuration will be overwritten with the build's configuration.</p>
                </div>
            `;
        }

        if (!changesHTML) {
            changesHTML = '<p style="color: #888; text-align: center; padding: 20px;">No changes detected. This build matches your current setup.</p>';
        }

        content.innerHTML = changesHTML;
        modal.classList.add('active');
    },

    async confirmApplyBuild() {
        if (!this.currentBuildToApply) {
            this.showMessage('No build selected', 'error');
            return;
        }

        const build = this.currentBuildToApply;
        const confirmBtn = document.getElementById('confirmApplyBtn');

        try {
            confirmBtn.disabled = true;
            confirmBtn.textContent = '🔄 Applying...';

            // Apply scripts
            const buildScripts = JSON.parse(build.scripts || '[]');
            if (buildScripts.length > 0) {
                await this.apiCall('setMemberScripts', {
                    scripts: JSON.stringify(buildScripts)
                });
            }

            // Apply projects
            const buildProjects = JSON.parse(build.projects || '[]');
            if (buildProjects.length > 0) {
                await this.apiCall('setMemberProjects', {
                    projects: JSON.stringify(buildProjects)
                });
            }

            // Apply configuration
            if (build.configuration) {
                await this.apiPost('setConfiguration', {}, {
                    value: JSON.stringify(build.configuration)
                });
            }

            this.showMessage(`Build "${build.tag}" applied successfully!`, 'success');
            this.closeBuildPreview();

            // Refresh data
            await this.loadMemberInfo();
            await this.loadAllScripts();
            await this.loadAllProjects();
            await this.loadConfiguration();

        } catch (error) {
            console.error('Error applying build:', error);
            this.showMessage(`Failed to apply build: ${error.message}`, 'error');
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.textContent = '🚀 Apply Build';
        }
    },

    closeBuildPreview() {
        document.getElementById('buildPreviewModal').classList.remove('active');
        this.currentBuildToApply = null;
    },

    showBuildDetails(tag) {
        const build = this.allBuilds.find(b => b.tag === tag);
        if (!build) {
            this.showMessage('Build not found', 'error');
            return;
        }

        this.currentBuildToApply = build;
        this.displayBuildDetails(build);
    },

    displayBuildDetails(build) {
        const modal = document.getElementById('buildDetailsModal');
        const title = document.getElementById('buildDetailsTitle');
        const content = document.getElementById('buildDetailsContent');

        title.textContent = `"${build.tag}" by ${build.author}`;

        // Get build data
        const buildScripts = JSON.parse(build.scripts || '[]').map(id => String(id));
        const buildProjects = JSON.parse(build.projects || '[]').map(id => String(id));
        const currentScripts = this.memberScripts.map(s => String(s.id));
        const currentProjects = this.memberProjects.map(p => String(p.id));

        // Calculate differences (ensure no duplicates by converting to Sets)
        const buildScriptsSet = new Set(buildScripts);
        const currentScriptsSet = new Set(currentScripts);
        const buildProjectsSet = new Set(buildProjects);
        const currentProjectsSet = new Set(currentProjects);

        const scriptsToAdd = buildScripts.filter(id => !currentScriptsSet.has(id));
        const scriptsToRemove = currentScripts.filter(id => !buildScriptsSet.has(id));
        const projectsToAdd = buildProjects.filter(id => !currentProjectsSet.has(id));
        const projectsToRemove = currentProjects.filter(id => !buildProjectsSet.has(id));

        let detailsHTML = `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #4a9eff; margin-bottom: 15px;">📋 Build Overview</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div style="background: rgba(74, 158, 255, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #4a9eff;">${buildScripts.length}</div>
                        <div style="color: #aaa; font-size: 14px;">Scripts</div>
                    </div>
                    <div style="background: rgba(74, 158, 255, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #4a9eff;">${buildProjects.length}</div>
                        <div style="color: #aaa; font-size: 14px;">Projects</div>
                    </div>
                    <div style="background: rgba(74, 158, 255, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: ${build.configuration ? '#4aff4a' : '#ff6666'};">${build.configuration ? 'YES' : 'NO'}</div>
                        <div style="color: #aaa; font-size: 14px;">Configuration</div>
                    </div>
                </div>
            </div>
        `;

        // Configuration Preview Section  
        if (build.configuration) {
            try {
                const buildConfig = typeof build.configuration === 'string' 
                    ? JSON.parse(build.configuration) 
                    : build.configuration;
                
                const configSummary = this.getConfigurationSummary(buildConfig);
                
                detailsHTML += `
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #ff8c00; margin-bottom: 15px;">⚙️ Configuration Override</h3>
                        <div style="background: rgba(255, 140, 0, 0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 140, 0, 0.3);">
                            <p style="color: #ffcc00; margin-bottom: 10px;"><strong>⚠️ Warning:</strong> This build includes a configuration file.</p>
                            <p style="color: #aaa; font-size: 14px; margin-bottom: 15px;">Your entire current configuration will be replaced with the build's configuration. Make sure to backup your current settings if needed.</p>
                            
                            ${configSummary.hasCustomSettings ? `
                                <div style="background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 6px; margin-bottom: 15px;">
                                    <h4 style="color: #4a9eff; margin-bottom: 10px; font-size: 14px;">📋 Key Configuration Highlights:</h4>
                                    ${this.renderConfigHighlights(configSummary.highlights)}
                                </div>
                            ` : ''}
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 15px;">
                                <div style="text-align: center; background: rgba(255, 255, 255, 0.03); padding: 10px; border-radius: 6px;">
                                    <div style="font-size: 18px; font-weight: bold; color: #4a9eff;">${configSummary.softwareCount}</div>
                                    <div style="color: #aaa; font-size: 12px;">Software</div>
                                </div>
                                <div style="text-align: center; background: rgba(255, 255, 255, 0.03); padding: 10px; border-radius: 6px;">
                                    <div style="font-size: 18px; font-weight: bold; color: #4a9eff;">${configSummary.scriptCount}</div>
                                    <div style="color: #aaa; font-size: 12px;">Scripts</div>
                                </div>
                                <div style="text-align: center; background: rgba(255, 255, 255, 0.03); padding: 10px; border-radius: 6px;">
                                    <div style="font-size: 18px; font-weight: bold; color: #4a9eff;">${configSummary.customSettingsCount}</div>
                                    <div style="color: #aaa; font-size: 12px;">Custom Settings</div>
                                </div>
                            </div>
                            
                            <!-- Collapsible detailed view -->
                            <div style="text-align: center;">
                                <button style="background: none; border: 1px solid rgba(255, 140, 0, 0.5); color: #ff8c00; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s;" onclick="app.toggleBuildConfigPreview('${build.tag}')">
                                    <span id="config-preview-icon-${build.tag}">📁</span> View Detailed Configuration
                                </button>
                            </div>
                            
                            <div id="config-preview-content-${build.tag}" style="display: none; margin-top: 15px;">
                                <pre style="background: #0a0a0a; border: 1px solid #444; border-radius: 6px; padding: 15px; color: #0f0; font-family: 'Consolas', 'Monaco', monospace; font-size: 11px; max-height: 250px; overflow: auto; white-space: pre-wrap; word-wrap: break-word;">${JSON.stringify(buildConfig, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                `;
                
            } catch (error) {
                console.error('Error parsing build configuration:', error);
                detailsHTML += `
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #ff6666; margin-bottom: 15px;">⚠️ Configuration Error</h3>
                        <div style="background: rgba(255, 102, 102, 0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 102, 102, 0.3);">
                            <p style="color: #ff6666;">Could not parse configuration data for this build.</p>
                        </div>
                    </div>
                `;
            }
        }

        // Show changes that would be made
        if (scriptsToAdd.length > 0 || scriptsToRemove.length > 0 || projectsToAdd.length > 0 || projectsToRemove.length > 0) {
            detailsHTML += `
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #ff8c00; margin-bottom: 15px;">⚠️ Changes Required</h3>
                    <p style="color: #aaa; margin-bottom: 20px;">Applying this build will make the following changes to your current setup:</p>
            `;

            // Script changes
            if (scriptsToAdd.length > 0 || scriptsToRemove.length > 0) {
                detailsHTML += `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #4a9eff; margin-bottom: 10px;">📜 Script Changes</h4>
                `;

                if (scriptsToAdd.length > 0) {
                    detailsHTML += `
                        <div style="margin-bottom: 15px;">
                            <h5 style="color: #4aff4a; margin-bottom: 8px;">✅ Scripts to Enable (${scriptsToAdd.length}):</h5>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${scriptsToAdd.map(id => {
                                    const script = this.allScripts.find(s => s.id == id || s.id === String(id) || s.id === Number(id));
                                    const scriptName = script ? script.name : `Unknown Script (ID: ${id})`;
                                    return `<span style="background: rgba(74, 255, 74, 0.2); color: #4aff4a; padding: 4px 8px; border-radius: 6px; font-size: 12px; border: 1px solid rgba(74, 255, 74, 0.4);">${scriptName}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }

                if (scriptsToRemove.length > 0) {
                    detailsHTML += `
                        <div style="margin-bottom: 15px;">
                            <h5 style="color: #ff6666; margin-bottom: 8px;">❌ Scripts to Disable (${scriptsToRemove.length}):</h5>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${scriptsToRemove.map(id => {
                                    const script = this.allScripts.find(s => s.id == id || s.id === String(id) || s.id === Number(id));
                                    const scriptName = script ? script.name : `Unknown Script (ID: ${id})`;
                                    return `<span style="background: rgba(255, 102, 102, 0.2); color: #ff6666; padding: 4px 8px; border-radius: 6px; font-size: 12px; border: 1px solid rgba(255, 102, 102, 0.4);">${scriptName}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }

                detailsHTML += '</div>';
            }

            // Project changes
            if (projectsToAdd.length > 0 || projectsToRemove.length > 0) {
                detailsHTML += `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #4a9eff; margin-bottom: 10px;">👥 Project Changes</h4>
                `;

                if (projectsToAdd.length > 0) {
                    detailsHTML += `
                        <div style="margin-bottom: 15px;">
                            <h5 style="color: #4aff4a; margin-bottom: 8px;">✅ Projects to Enable (${projectsToAdd.length}):</h5>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${scriptsToAdd.map(id => {
                                    const script = this.allScripts.find(s => s.id == id || s.id === String(id) || s.id === Number(id));
                                    const scriptName = script ? script.name : `Unknown Script (ID: ${id})`;
                                    return `<span style="background: rgba(74, 255, 74, 0.2); color: #4aff4a; padding: 4px 8px; border-radius: 6px; font-size: 12px; border: 1px solid rgba(74, 255, 74, 0.4);">${scriptName}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }

                if (projectsToRemove.length > 0) {
                    detailsHTML += `
                        <div style="margin-bottom: 15px;">
                            <h5 style="color: #ff6666; margin-bottom: 8px;">❌ Projects to Disable (${projectsToRemove.length}):</h5>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${projectsToRemove.map(id => {
                                    const project = this.allProjects.find(p => p.id == id || p.id === String(id) || p.id === Number(id));
                                    const projectName = project ? project.name : `Unknown Project (ID: ${id})`;
                                    return `<span style="background: rgba(255, 102, 102, 0.2); color: #ff6666; padding: 4px 8px; border-radius: 6px; font-size: 12px; border: 1px solid rgba(255, 102, 102, 0.4);">${projectName}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }

                detailsHTML += '</div>';
            }

            detailsHTML += '</div>';

        } else {
            detailsHTML += `
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #4aff4a; margin-bottom: 15px;">✅ Perfect Match</h3>
                    <p style="color: #4aff4a; text-align: center; padding: 20px; background: rgba(74, 255, 74, 0.1); border-radius: 8px; border: 1px solid rgba(74, 255, 74, 0.3);">
                        🎉 This build matches your current setup perfectly! No changes are needed.
                    </p>
                </div>
            `;
        }

        // Configuration section
        if (build.configuration) {
            detailsHTML += `
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #ff8c00; margin-bottom: 15px;">⚙️ Configuration Override</h3>
                    <div style="background: rgba(255, 140, 0, 0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 140, 0, 0.3);">
                        <p style="color: #ffcc00; margin-bottom: 10px;"><strong>⚠️ Warning:</strong> This build includes a configuration file.</p>
                        <p style="color: #aaa; font-size: 14px;">Your entire current configuration will be replaced with the build's configuration. Make sure to backup your current settings if needed.</p>
                    </div>
                </div>
            `;
        }

        // Build metadata
        detailsHTML += `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #4a9eff; margin-bottom: 15px;">📊 Build Information</h3>
                <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <strong style="color: #aaa;">Author:</strong><br>
                            <span style="color: #fff;">${build.author}</span>
                        </div>
                        <div>
                            <strong style="color: #aaa;">Popularity:</strong><br>
                            <span style="color: #fff;">${build.popularity || 0} users</span>
                        </div>
                        <div>
                            <strong style="color: #aaa;">Privacy:</strong><br>
                            <span style="color: #fff;">${build.private === 1 ? '🔒 Private' : '🌐 Public'}</span>
                        </div>
                        <div>
                            <strong style="color: #aaa;">Type:</strong><br>
                            <span style="color: #fff;">${build.configuration ? '📦 Full Build' : '📜 Scripts Only'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = detailsHTML;
        modal.classList.add('active');
    },

    closeBuildDetails() {
        document.getElementById('buildDetailsModal').classList.remove('active');
        this.currentBuildToApply = null;
    },

    // ========================
    // CONFIGURATION FORM UTILITIES
    // ========================

    async renderConfigForm() {
        const formContainer = document.getElementById('scriptConfigForm');

        // Try to get configuration categories from script metadata
        let configMetadata = { categories: {}, dropdowns: {} };

        // Get the current script being edited
        const currentScript = this.memberScripts.find(script => {
            const scriptName = script.name.endsWith('.lua') ? script.name : script.name + '.lua';
            const scriptBaseName = script.name.replace('.lua', '');
            return this.currentScriptKey === scriptName ||
                this.currentScriptKey === scriptBaseName ||
                this.currentScriptKey.toLowerCase().includes(script.name.toLowerCase()) ||
                script.name.toLowerCase().includes(this.currentScriptKey.toLowerCase().replace('.lua', ''));
        });

        if (currentScript) {
            try {
                configMetadata = await this.parseConfigurationMetadata(currentScript.id);
            } catch (error) {
                console.error('Error loading config metadata:', error);
                configMetadata = { categories: {}, dropdowns: {} };
            }
        }

        // If no categories found, fall back to automatic grouping
        if (Object.keys(configMetadata.categories).length === 0) {
            configMetadata.categories = this.autoGroupSettings();
        }

        // Render categorized form
        let formHTML = '';

        Object.entries(configMetadata.categories).forEach(([categoryName, settingNames]) => {
            // Filter settings that actually exist in current config
            const existingSettings = settingNames.filter(settingName =>
                this.currentScriptConfig.hasOwnProperty(settingName)
            );

            if (existingSettings.length === 0) return;

            formHTML += `
                <div class="config-group">
                    <h4 style="display: flex; align-items: center; gap: 8px; cursor: pointer;" onclick="app.toggleConfigCategory('${categoryName}')">
                        <span id="category-icon-${categoryName}">📁</span>
                        ${categoryName} Settings (${existingSettings.length})
                    </h4>
                    <div id="category-${categoryName}" class="config-category-content">
            `;

            existingSettings.forEach(settingName => {
                const value = this.currentScriptConfig[settingName];
                const dropdownOptions = configMetadata.dropdowns[settingName] || null;
                formHTML += this.createConfigField(settingName, value, dropdownOptions);
            });

            formHTML += '</div></div>';
        });

        formContainer.innerHTML = formHTML;

        // Initialize color pickers
        setTimeout(() => {
            document.querySelectorAll('.color-picker-placeholder').forEach(placeholder => {
                const key = placeholder.dataset.key;
                const value = placeholder.dataset.value;

                let initialValue = value;
                if (value.startsWith('#') && value.length === 7) {
                    initialValue = value + 'FF';
                } else if (value.length === 6) {
                    initialValue = '#' + value + 'FF';
                } else if (value.length === 8 && !value.startsWith('#')) {
                    initialValue = '#' + value;
                }

                new ColorPicker(placeholder, {
                    initialValue: initialValue,
                    onChange: (hex8) => {
                        this.updateConfigValue(key, hex8.slice(1));
                        this.triggerAutoSave();
                    }
                });
            });
        }, 0);
    },

    autoGroupSettings() {
        // Fallback automatic grouping based on setting names
        const groups = {
            general: [],
            colors: [],
            keys: [],
            esp: [],
            aim: [],
            trigger: [],
            movement: [],
            humanizer: [],
            performance: [],
            other: []
        };

        Object.keys(this.currentScriptConfig).forEach(key => {
            const lowerKey = key.toLowerCase();

            if (lowerKey.includes('color')) groups.colors.push(key);
            else if (lowerKey.includes('key') || lowerKey.includes('bind')) groups.keys.push(key);
            else if (lowerKey.includes('esp')) groups.esp.push(key);
            else if (lowerKey.includes('aim')) groups.aim.push(key);
            else if (lowerKey.includes('trigger')) groups.trigger.push(key);
            else if (lowerKey.includes('bhop') || lowerKey.includes('jump') || lowerKey.includes('movement')) groups.movement.push(key);
            else if (lowerKey.includes('humanizer')) groups.humanizer.push(key);
            else if (lowerKey.includes('performance') || lowerKey.includes('fps') || lowerKey.includes('interval')) groups.performance.push(key);
            else if (['enabled', 'debug', 'verbose'].includes(lowerKey)) groups.general.push(key);
            else groups.other.push(key);
        });

        // Remove empty groups and capitalize names
        Object.keys(groups).forEach(groupName => {
            if (groups[groupName].length === 0) {
                delete groups[groupName];
            } else {
                const capitalizedName = groupName.charAt(0).toUpperCase() + groupName.slice(1);
                if (groupName !== capitalizedName) {
                    groups[capitalizedName] = groups[groupName];
                    delete groups[groupName];
                }
            }
        });

        return groups;
    },

    toggleConfigCategory(categoryName) {
        const content = document.getElementById(`category-${categoryName}`);
        const icon = document.getElementById(`category-icon-${categoryName}`);

        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.textContent = '📂';
        } else {
            content.style.display = 'none';
            icon.textContent = '📁';
        }
    },

    createConfigField(key, value, dropdownOptions = null) {
        const fieldType = this.getFieldType(value);
        const fieldId = `config_${key}`.replace(/\./g, '_');

        let fieldHTML = `<div class="config-field">`;

        fieldHTML += `<div class="config-label">
            ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            ${fieldType === 'color' ? '<code style="background: rgba(74, 158, 255, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #4a9eff;">Color</code>' : ''}
            ${dropdownOptions ? '<code style="background: rgba(255, 140, 0, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #ff8c00;">Dropdown</code>' : ''}
        </div>`;

        fieldHTML += `<div class="config-control">`;

        if (fieldType === 'boolean') {
            fieldHTML += `
                <div class="toggle-switch ${value ? 'active' : ''}" 
                    data-config-key="${key}" 
                    onclick="app.handleToggleClick(this, '${key}');">
                    <div class="toggle-slider"></div>
                </div>
            `;
        } else if (fieldType === 'color') {
            fieldHTML += `
                <div class="color-picker-placeholder" id="${fieldId}" data-key="${key}" data-value="${value}"></div>
            `;
        } else if (dropdownOptions && dropdownOptions.length > 0) {
            // Create dropdown
            fieldHTML += `<select class="config-input" id="${fieldId}" onchange="app.updateConfigValue('${key}', this.value); app.triggerAutoSave();" style="width: 200px;">`;
            
            // Add current value if it's not in the dropdown options
            let hasCurrentValue = dropdownOptions.includes(String(value));
            if (!hasCurrentValue && value !== null && value !== undefined && value !== '') {
                fieldHTML += `<option value="${value}" selected>${value}</option>`;
            }
            
            // Add dropdown options
            dropdownOptions.forEach(option => {
                const selected = String(option) === String(value) ? 'selected' : '';
                fieldHTML += `<option value="${option}" ${selected}>${option}</option>`;
            });
            
            fieldHTML += `</select>`;
        } else {
            // Regular text input - display the actual value without quotes
            const displayValue = value;
            fieldHTML += `
                <input type="text" class="config-input" id="${fieldId}" value="${displayValue}" 
                    onchange="app.updateConfigValue('${key}', this.value); app.triggerAutoSave();">
            `;
        }

        fieldHTML += `</div></div>`;
        return fieldHTML;
    },

    getFieldType(value) {
        if (typeof value === 'boolean') return 'boolean';
        // Check for 6 or 8 digit hex color (with or without #)
        if (typeof value === 'string' && /^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value)) return 'color';
        
        // Everything else is treated as text input to allow any value
        return 'text';
    },

    updateConfigValue(key, value) {
        // Smart type conversion - try to parse to appropriate type
        let parsedValue = value;
        
        // Don't convert if it's already the right type from a toggle or color picker
        if (typeof value === 'boolean' || (typeof value === 'string' && value.match(/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/))) {
            parsedValue = value;
        } else if (typeof value === 'string') {
            const trimmed = value.trim();
            
            // Try to parse as boolean
            if (trimmed.toLowerCase() === 'true') {
                parsedValue = true;
            } else if (trimmed.toLowerCase() === 'false') {
                parsedValue = false;
            }
            // Try to parse as number (int or float)
            else if (/^-?(\d+\.?\d*|\d*\.\d+)$/.test(trimmed)) {
                const num = parseFloat(trimmed);
                // Use integer if it's a whole number, otherwise use float
                parsedValue = Number.isInteger(num) ? parseInt(trimmed) : num;
            }
            // Keep as string for everything else (including keys like "HOME", "E", etc.)
            else {
                parsedValue = value;
            }
        } else {
            // For non-string inputs, keep as-is
            parsedValue = value;
        }
        
        this.currentScriptConfig[key] = parsedValue;
    },

    updateMainConfigDisplay() {
        try {
            // Update the main configuration JSON display
            document.getElementById('configDisplay').textContent = JSON.stringify(this.currentConfig, null, 2);
            console.log('Updated main config display with current script config');
        } catch (error) {
            console.error('Error updating main config display:', error);
        }
    },

    handleToggleClick(element, key) {
        // Check cooldown to prevent spam
        const now = Date.now();
        const lastToggle = element.dataset.lastToggle || 0;
        const cooldownMs = 200; // 200ms cooldown

        if (now - lastToggle < cooldownMs) {
            console.log(`Toggle cooldown active for ${key}, ignoring click`);

            // Visual feedback for ignored click
            element.style.borderColor = '#ff6666';
            setTimeout(() => {
                element.style.borderColor = '';
            }, 200);

            return;
        }

        // Set last toggle time and add cooldown class
        element.dataset.lastToggle = now;
        element.classList.add('cooldown');

        // Get current value from our config (not from DOM)
        const currentValue = this.currentScriptConfig[key];
        const newValue = !currentValue;

        console.log(`Toggle ${key}: ${currentValue} -> ${newValue}`);

        // Update the config
        this.updateConfigValue(key, newValue);

        // Update visual state
        if (newValue) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }

        // Update the main JSON display
        this.updateMainConfigDisplay();

        // Trigger auto-save
        this.triggerAutoSave();

        // Provide visual feedback
        element.style.transform = 'scale(0.95)';

        // Remove cooldown and reset visual feedback
        setTimeout(() => {
            element.style.transform = '';
            element.classList.remove('cooldown');
        }, cooldownMs);

        // Success feedback
        element.style.borderColor = '#4aff4a';
        setTimeout(() => {
            element.style.borderColor = '';
        }, 300);
    },

    async saveScriptConfig(isAutoSave = false, pushToOmega = false) {
        const software = document.getElementById('softwareSelect').value;
        const scriptKey = this.currentScriptKey;

        if (!software) return;

        try {
            // Handle special case: bones
            if (software === 'bones') {
                // For bones, currentScriptConfig is the array itself
                this.currentConfig.bones = this.currentScriptConfig;

                // Use needs_update flag if pushing to Omega
                const params = pushToOmega ? {
                    needs_update: ''
                } : {};

                await this.apiPost('setConfiguration', params, {
                    value: JSON.stringify(this.currentConfig)
                });

                let message = isAutoSave ? 'Bones auto-saved!' : 'Bones configuration saved!';
                if (pushToOmega) {
                    message += ' 🚀 Pushed to Omega!';
                }
                this.showMessage(message, 'success');
                document.getElementById('configDisplay').textContent = JSON.stringify(this.currentConfig, null, 2);
                return;
            }

            // Handle regular script configurations
            if (!scriptKey) {
                if (!isAutoSave) {
                    this.showMessage('No script configuration selected', 'error');
                }
                return;
            }

            // Update the configuration
            if (!this.currentConfig[software]) this.currentConfig[software] = {};
            this.currentConfig[software][scriptKey] = this.currentScriptConfig;

            // Update the main config display immediately
            this.updateMainConfigDisplay();

            // Use needs_update flag if pushing to Omega
            const params = pushToOmega ? {
                needs_update: ''
            } : {};

            await this.apiPost('setConfiguration', params, {
                value: JSON.stringify(this.currentConfig)
            });

            let message;
            if (isAutoSave) {
                message = `Auto-saved ${scriptKey}`;
                if (pushToOmega) {
                    message += ' 🚀 (Live Omega)';
                }
            } else {
                message = `Configuration saved for ${scriptKey}!`;
                if (pushToOmega) {
                    message += ' 🚀 Pushed to Omega!';
                }
            }

            this.showMessage(message, 'success');

        } catch (error) {
            console.error('Error saving script config:', error);
            if (!isAutoSave) {
                this.showMessage('Error saving configuration', 'error');
            }
        }
    },

    resetScriptConfig() {
        const software = document.getElementById('softwareSelect').value;

        if (software === 'bones') {
            if (!confirm('Are you sure you want to reset the bones configuration? This will remove all bone IDs.')) {
                return;
            }

            this.currentConfig.bones = [];
            this.currentScriptConfig = [];
            this.loadBonesConfig();
            this.showMessage('Bones configuration reset!', 'success');
            return;
        }

        const scriptKey = this.currentScriptKey;
        if (!scriptKey) {
            this.showMessage('No script configuration selected to reset', 'error');
            return;
        }

        if (!confirm(`Are you sure you want to reset the configuration for "${scriptKey}"? This cannot be undone.`)) {
            return;
        }

        this.currentScriptConfig = {};
        this.loadScriptConfig();
        this.showMessage(`Configuration reset for ${scriptKey}!`, 'success');
    },

    // ========================
    // CONFIGURATION METADATA UTILITIES
    // ========================

    async parseConfigurationMetadata(scriptId) {
        // Always check caching preference and session state
        const useCache = this.cachingEnabled && this.sessionInitialized;
        const cacheKey = `config_metadata_${scriptId}`;
        
        if (useCache) {
            const cached = this.getCachedConfigMetadata(cacheKey);
            if (cached) {
                console.log(`💾 Using cached config metadata for script ${scriptId}`);
                return cached;
            }
        } else {
            console.log(`🔄 Fetching fresh config metadata for script ${scriptId} (caching: ${this.cachingEnabled ? 'enabled but session not initialized' : 'disabled'})`);
        }

        try {
            const apiResponse = await this.apiCall('getScript', {
                id: scriptId,
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
                return { categories: {}, dropdowns: {} };
            }

            let scriptSource = '';
            if (scriptData.script) {
                scriptSource = scriptData.script;
            } else if (scriptData.source) {
                scriptSource = scriptData.source;
            } else {
                return { categories: {}, dropdowns: {} };
            }

            // Decode any escaped characters
            if (scriptSource && typeof scriptSource === 'string') {
                scriptSource = scriptSource
                    .replace(/\\n/g, '\n')
                    .replace(/\\t/g, '\t')
                    .replace(/\\"/g, '"')
                    .replace(/\\'/g, "'")
                    .replace(/\\\\/g, '\\');
            }

            // Parse configuration metadata from source
            const metadata = this.extractConfigCategories(scriptSource);

            // Cache the result if caching is enabled
            if (this.cachingEnabled) {
                this.setCachedConfigMetadata(cacheKey, metadata);
                console.log(`💾 Cached config metadata for script ${scriptId}`);
            }

            return metadata;

        } catch (error) {
            console.error(`Error loading config metadata for script ${scriptId}:`, error);
            return { categories: {}, dropdowns: {} };
        }
    },

    extractConfigCategories(scriptSource) {
        if (!scriptSource) return { categories: {}, dropdowns: {} };

        const categories = {};
        const dropdowns = {};
        const lines = scriptSource.split('\n');
        let currentCategory = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Look for category comments: -- @category: CategoryName
            const categoryMatch = line.match(/--\s*@category:\s*(.+)/i);
            if (categoryMatch) {
                currentCategory = categoryMatch[1].trim();
                continue;
            }

            // Look for setting assignments inside configuration tables
            const settingMatch = line.match(/^\s*(\w+)\s*=\s*.+[,]?\s*$/);
            if (settingMatch && currentCategory) {
                const settingName = settingMatch[1];

                // Skip certain internal/cache variables
                if (settingName === 'cache' || settingName === 'runtime' || settingName === 'internal') {
                    continue;
                }

                if (!categories[currentCategory]) {
                    categories[currentCategory] = [];
                }

                if (!categories[currentCategory].includes(settingName)) {
                    categories[currentCategory].push(settingName);
                }

                // Look for dropdown metadata in the same line or nearby lines
                const currentLineWithComment = lines[i];
                const dropdownMatch = currentLineWithComment.match(/--.*@dropdown:\s*(.+)/i);
                if (dropdownMatch) {
                    const dropdownOptions = dropdownMatch[1]
                        .split(',')
                        .map(option => option.trim())
                        .filter(option => option.length > 0);
                    if (dropdownOptions.length > 0) {
                        dropdowns[settingName] = dropdownOptions;
                    }
                }
            }

            // Reset category when we hit end of a table or function
            if (line.includes('}') && line.match(/^\s*}\s*$/)) {
                currentCategory = null;
            }
        }

        return { categories, dropdowns };
    },

    // Helper function to analyze configuration structure
    analyzeConfiguration(config) {
        const summary = {
            softwareCount: 0,
            scriptCount: 0,
            settingCount: 0,
            softwareList: []
        };
        
        if (!config || typeof config !== 'object') {
            return summary;
        }
        
        Object.entries(config).forEach(([softwareName, softwareConfig]) => {
            if (typeof softwareConfig === 'object' && softwareConfig !== null && !Array.isArray(softwareConfig)) {
                summary.softwareCount++;
                let scriptCountForSoftware = 0;
                let settingCountForSoftware = 0;
                
                Object.entries(softwareConfig).forEach(([scriptName, scriptConfig]) => {
                    if (typeof scriptConfig === 'object' && scriptConfig !== null) {
                        scriptCountForSoftware++;
                        settingCountForSoftware += Object.keys(scriptConfig).length;
                    }
                });
                
                summary.scriptCount += scriptCountForSoftware;
                summary.settingCount += settingCountForSoftware;
                
                summary.softwareList.push({
                    name: softwareName.charAt(0).toUpperCase() + softwareName.slice(1),
                    scriptCount: scriptCountForSoftware
                });
            } else if (Array.isArray(softwareConfig)) {
                // Handle special cases like bones
                summary.softwareCount++;
                summary.settingCount += softwareConfig.length;
                
                summary.softwareList.push({
                    name: softwareName.charAt(0).toUpperCase() + softwareName.slice(1),
                    scriptCount: softwareConfig.length > 0 ? 1 : 0
                });
            }
        });
        
        return summary;
    },

    // Helper function to compare configurations
    compareConfigurations(currentConfig, buildConfig) {
        if (!currentConfig || Object.keys(currentConfig).length === 0) {
            return '<span style="color: #4aff4a;">No current configuration - build config will be applied fresh.</span>';
        }
        
        const changes = [];
        const currentSoftware = new Set(Object.keys(currentConfig));
        const buildSoftware = new Set(Object.keys(buildConfig));
        
        // New software
        const newSoftware = [...buildSoftware].filter(sw => !currentSoftware.has(sw));
        if (newSoftware.length > 0) {
            changes.push(`<span style="color: #4aff4a;">✅ New software: ${newSoftware.join(', ')}</span>`);
        }
        
        // Removed software
        const removedSoftware = [...currentSoftware].filter(sw => !buildSoftware.has(sw));
        if (removedSoftware.length > 0) {
            changes.push(`<span style="color: #ff6666;">❌ Removed software: ${removedSoftware.join(', ')}</span>`);
        }
        
        // Modified software
        const commonSoftware = [...buildSoftware].filter(sw => currentSoftware.has(sw));
        if (commonSoftware.length > 0) {
            changes.push(`<span style="color: #ff8c00;">🔄 Modified software: ${commonSoftware.join(', ')}</span>`);
        }
        
        if (changes.length === 0) {
            return '<span style="color: #888;">No significant changes detected.</span>';
        }
        
        return changes.join('<br>');
    },

    // Helper function to get configuration summary with filtered highlights
    getConfigurationSummary(config) {
        const summary = {
            softwareCount: 0,
            scriptCount: 0,
            customSettingsCount: 0,
            hasCustomSettings: false,
            highlights: []
        };
        
        if (!config || typeof config !== 'object') {
            return summary;
        }
        
        Object.entries(config).forEach(([softwareName, softwareConfig]) => {
            if (typeof softwareConfig === 'object' && softwareConfig !== null) {
                summary.softwareCount++;
                
                if (Array.isArray(softwareConfig)) {
                    // Handle special cases like bones
                    if (softwareConfig.length > 0) {
                        summary.customSettingsCount += softwareConfig.length;
                        summary.highlights.push({
                            software: softwareName,
                            script: softwareName,
                            setting: 'values',
                            value: `[${softwareConfig.join(', ')}]`,
                            type: 'array'
                        });
                        summary.hasCustomSettings = true;
                    }
                } else {
                    // Handle regular script configurations
                    Object.entries(softwareConfig).forEach(([scriptName, scriptConfig]) => {
                        if (typeof scriptConfig === 'object' && scriptConfig !== null) {
                            summary.scriptCount++;
                            
                            // Filter out likely default values and only show interesting settings
                            const customSettings = this.filterCustomSettings(scriptConfig);
                            summary.customSettingsCount += customSettings.length;
                            
                            // Add highlights for the most important settings
                            customSettings.slice(0, 3).forEach(setting => {
                                summary.highlights.push({
                                    software: softwareName,
                                    script: scriptName,
                                    setting: setting.name,
                                    value: setting.value,
                                    type: setting.type
                                });
                                summary.hasCustomSettings = true;
                            });
                        }
                    });
                }
            }
        });
        
        return summary;
    },

    // Helper function to filter out default/uninteresting values
    filterCustomSettings(scriptConfig) {
        const customSettings = [];
        
        Object.entries(scriptConfig).forEach(([settingName, settingValue]) => {
            // Skip likely default values
            if (this.isLikelyCustomValue(settingName, settingValue)) {
                customSettings.push({
                    name: settingName,
                    value: settingValue,
                    type: this.getSettingType(settingValue)
                });
            }
        });
        
        return customSettings;
    },

    // Helper function to determine if a value is likely customized (not default)
    isLikelyCustomValue(settingName, settingValue) {
        const name = settingName.toLowerCase();
        
        // Always skip these common defaults
        if (settingValue === false || settingValue === 0 || settingValue === '' || settingValue === 'false') {
            return false;
        }
        
        // Skip common default strings
        if (typeof settingValue === 'string') {
            const commonDefaults = ['default', 'none', 'auto', 'off', 'disabled'];
            if (commonDefaults.includes(settingValue.toLowerCase())) {
                return false;
            }
        }
        
        // Skip likely default numbers
        if (typeof settingValue === 'number') {
            // Skip very common default values
            if ([1, 100, 1000, 0.5, 1.0].includes(settingValue)) {
                return false;
            }
        }
        
        // Skip debug/verbose type settings that are false
        if ((name.includes('debug') || name.includes('verbose') || name.includes('log')) && settingValue === false) {
            return false;
        }
        
        // Always include these important setting types
        const importantKeywords = ['key', 'bind', 'color', 'speed', 'fov', 'smooth', 'aim', 'trigger', 'esp'];
        if (importantKeywords.some(keyword => name.includes(keyword))) {
            return true;
        }
        
        // Include enabled booleans
        if (settingValue === true) {
            return true;
        }
        
        // Include non-default numbers
        if (typeof settingValue === 'number' && settingValue !== 0 && settingValue !== 1) {
            return true;
        }
        
        // Include non-empty strings that aren't common defaults
        if (typeof settingValue === 'string' && settingValue.length > 0) {
            return true;
        }
        
        return false;
    },

    // Helper function to render configuration highlights
    renderConfigHighlights(highlights) {
        if (highlights.length === 0) {
            return '<p style="color: #888; font-style: italic; text-align: center;">No significant custom settings detected.</p>';
        }
        
        return highlights.map(highlight => {
            const formattedName = highlight.setting.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const valueDisplay = this.formatSettingValue(highlight.value);
            const typeColor = this.getTypeColor(highlight.type);
            
            return `
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.03); padding: 6px 10px; border-radius: 4px; margin: 2px 4px; border-left: 3px solid ${typeColor};">
                    <span style="color: #ccc; font-size: 11px;">${highlight.script}:</span>
                    <span style="color: #fff; font-size: 12px; font-weight: 500;"> ${formattedName}</span>
                    <span style="color: #aaa;">:</span> ${valueDisplay}
                </div>
            `;
        }).join('');
    },

    // Keep the existing helper functions for formatting and types
    formatSettingValue(value) {
        if (typeof value === 'boolean') {
            return `<span style="color: ${value ? '#4aff4a' : '#ff6666'};">${value ? 'ON' : 'OFF'}</span>`;
        } else if (typeof value === 'number') {
            return `<span style="color: #4a9eff;">${value}</span>`;
        } else if (typeof value === 'string') {
            if (/^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value)) {
                return `<span style="color: #ff8c00;">${value}</span>`;
            } else if (value.length <= 3 && value.match(/^[A-Z0-9]+$/)) {
                return `<span style="color: #ff8c00;">${value}</span>`;
            } else {
                return `<span style="color: #4aff4a;">${value}</span>`;
            }
        } else if (Array.isArray(value)) {
            return `<span style="color: #ff8c00;">[${value.join(', ')}]</span>`;
        }
        return `<span style="color: #888;">${String(value)}</span>`;
    },

    getSettingType(value) {
        if (typeof value === 'boolean') return 'bool';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'string') {
            if (/^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value)) return 'color';
            if (value.length <= 3 && value.match(/^[A-Z0-9]+$/)) return 'key';
            return 'text';
        }
        if (Array.isArray(value)) return 'array';
        return 'unknown';
    },

    getTypeColor(type) {
        const colors = {
            'bool': '#4aff4a',
            'number': '#4a9eff', 
            'color': '#ff69b4',
            'key': '#ff8c00',
            'text': '#4aff4a',
            'array': '#ff8c00',
            'unknown': '#888'
        };
        return colors[type] || '#888';
    },

    // Updated toggle function
    toggleBuildConfigPreview(buildTag) {
        const content = document.getElementById(`config-preview-content-${buildTag}`);
        const icon = document.getElementById(`config-preview-icon-${buildTag}`);
        
        if (content && icon) {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.textContent = '📂';
            } else {
                content.style.display = 'none';
                icon.textContent = '📁';
            }
        }
    },

    getCachedConfigMetadata(key) {
        if (!this.cachingEnabled) {
            return null;
        }
        
        try {
            const cached = localStorage.getItem(key);
            if (cached) {
                const data = JSON.parse(cached);
                // Check if cache is still valid (24 hours)
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    return data.metadata || { categories: data.categories || {}, dropdowns: {} };
                } else {
                    // Remove expired cache
                    localStorage.removeItem(key);
                    console.log(`🗑️ Removed expired cache: ${key}`);
                }
            }
        } catch (e) {
            console.warn('Error reading config metadata cache:', e);
        }
        return null;
    },

    setCachedConfigMetadata(key, metadata) {
        if (!this.cachingEnabled) {
            return;
        }
        
        try {
            localStorage.setItem(key, JSON.stringify({
                metadata: metadata,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Error writing config metadata cache:', e);
        }
    },

    // ========================
    // SCRIPT SOURCE VIEWER UTILITIES
    // ========================

    async showScriptSource(scriptId) {
        try {
            // Show the modal and loading overlay
            const modal = document.getElementById('scriptSourceModal');
            const loading = document.getElementById('scriptSourceLoading');

            modal.classList.add('active');
            loading.classList.remove('hidden');

            console.log(`Fetching script source for ID: ${scriptId}`);

            // FIXED: Use the same API call pattern as configuration metadata (remove source parameter)
            const apiResponse = await this.apiCall('getScript', {
                id: scriptId,
                beautify: '' // Remove the 'source' parameter that requires forum login
            });

            console.log('Script source API response received:', apiResponse);

            // Parse the nested response structure
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
                throw new Error('Invalid API response structure for script data');
            }

            // Store for clipboard functionality
            this.currentSourceData = scriptData;

            // Populate the modal
            this.populateSourceModal(scriptData);

            // Hide loading overlay
            loading.classList.add('hidden');

            this.showMessage(`Loaded source for "${scriptData.name}"`, 'success');

        } catch (error) {
            console.error('Error loading script source:', error);
            this.showMessage(`Failed to load script source: ${error.message}`, 'error');
            this.closeScriptSource();
        }
    },

    populateSourceModal(scriptData) {
        console.log('Populating source modal with data:', scriptData);

        // Update title and info
        document.getElementById('scriptSourceTitle').textContent = `- ${scriptData.name}`;
        document.getElementById('sourceScriptName').textContent = scriptData.name || 'Unknown';
        document.getElementById('sourceScriptAuthor').textContent = scriptData.author || 'Unknown';

        // Map software ID to name
        const softwareNames = {
            4: 'FC2 Global',
            5: 'Universe4', 
            6: 'Constellation4',
            7: 'Parallax2'
        };
        document.getElementById('sourceScriptSoftware').textContent = 
            softwareNames[scriptData.software] || `Software ${scriptData.software || 'Unknown'}`;

        // Calculate elapsed time
        let elapsedText = 'Never';
        if (scriptData.last_update) {
            elapsedText = this.getElapsedTime(scriptData.last_update);
        }
        document.getElementById('sourceScriptUpdated').textContent = elapsedText;

        // Get source code
        let sourceCode = '';
        if (scriptData.script) {
            sourceCode = scriptData.script;
        } else if (scriptData.source) {
            sourceCode = scriptData.source;
        } else if (scriptData.content) {
            sourceCode = scriptData.content;
        } else {
            sourceCode = '-- No source code available\n-- This script may be empty or there was an error loading the source';
        }

        // Decode any escaped characters
        if (sourceCode && typeof sourceCode === 'string') {
            sourceCode = sourceCode
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'")
                .replace(/\\\\/g, '\\');
        }

        // Update source code display with highlighting
        const sourceElement = document.getElementById('scriptSourceCode');
        sourceElement.textContent = sourceCode;
        sourceElement.className = 'source-code-highlighted';
        
        // Apply syntax highlighting
        hljs.highlightElement(sourceElement);

        // Update line count
        const lineCount = sourceCode.split('\n').length;
        document.getElementById('sourceScriptLines').textContent = `Lines: ${lineCount.toLocaleString()}`;
    },

    async copySourceToClipboard() {
        try {
            const sourceElement = document.getElementById('scriptSourceCode');
            const sourceCode = sourceElement.textContent;
            
            if (!sourceCode || sourceCode.trim() === '') {
                this.showMessage('No source code to copy', 'error');
                return;
            }

            await navigator.clipboard.writeText(sourceCode);
            
            // Visual feedback
            const copyBtn = document.getElementById('copySourceBtn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ Copied!';
            copyBtn.style.background = 'linear-gradient(135deg, #4aff4a, #357abd)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
            
            this.showMessage('Source code copied to clipboard!', 'success');
            
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            
            // Fallback: select the text
            try {
                const sourceElement = document.getElementById('scriptSourceCode');
                const range = document.createRange();
                range.selectNodeContents(sourceElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                this.showMessage('Source code selected - press Ctrl+C to copy', 'success');
            } catch (fallbackError) {
                this.showMessage('Could not copy to clipboard', 'error');
            }
        }
    },

    closeScriptSource() {
        // Clear stored data
        this.currentSourceData = null;

        // Hide modal
        document.getElementById('scriptSourceModal').classList.remove('active');

        // Clear content
        document.getElementById('scriptSourceCode').textContent = '';
        document.getElementById('scriptSourceTitle').textContent = 'Loading...';
        document.getElementById('sourceScriptName').textContent = 'Script Name';
        document.getElementById('sourceScriptAuthor').textContent = 'Author';
        document.getElementById('sourceScriptSoftware').textContent = 'Software';
        document.getElementById('sourceScriptUpdated').textContent = 'Last Updated';
        document.getElementById('sourceScriptLines').textContent = 'Lines: Loading...';
    },

    // ========================
    // CACHE MANAGEMENT UTILITIES
    // ========================

    clearAllCaches() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (
                    // key.startsWith('script_draft_') || // Idk why I wanted to do this
                    key.startsWith('config_metadata_')
                )) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            this.showMessage(`🗑️ Cleared ${keysToRemove.length} cached items`, 'success');
            console.log(`✅ Cache clearing complete. Removed ${keysToRemove.length} items.`);
            
        } catch (error) {
            console.error('Error clearing cache:', error);
            this.showMessage('Error clearing cache', 'error');
        }
    },

    debugCacheContents() {
        console.log('🔍 Current Cache Contents:');
        const cacheItems = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
                key.startsWith('script_draft_') || 
                key.startsWith('config_metadata_') ||
                key.startsWith('fc2_')
            )) {
                try {
                    const value = localStorage.getItem(key);
                    cacheItems.push({
                        key: key,
                        size: value ? value.length : 0,
                        type: key.includes('draft') ? 'Draft' : 
                            key.includes('metadata') ? 'Metadata' : 
                            key.includes('fc2_') ? 'Setting' : 'Unknown'
                    });
                } catch (e) {
                    console.warn(`Could not read cache item: ${key}`);
                }
            }
        }
        
        console.log(`💾 Caching currently: ${this.cachingEnabled ? 'ENABLED' : 'DISABLED'}`);
        console.log(`🔄 Session initialized: ${this.sessionInitialized ? 'YES' : 'NO'}`);
        
        if (cacheItems.length === 0) {
            console.log('✅ No cached items found');
        } else {
            console.table(cacheItems);
        }
        
        return cacheItems;
    },

    async refreshBuilds() {
        try {
            // Show loading state
            const myBuildsGrid = document.getElementById('myBuildsGrid');
            const availableBuildsGrid = document.getElementById('availableBuildsGrid');
            
            if (myBuildsGrid) myBuildsGrid.innerHTML = '<div class="spinner"></div>';
            if (availableBuildsGrid) availableBuildsGrid.innerHTML = '<div class="spinner"></div>';
            
            // Add a small delay to help with session state
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Try to load builds
            await this.loadBuilds();
            
            this.showMessage('Builds refreshed successfully!', 'success');
        } catch (error) {
            console.error('Error refreshing builds:', error);
            this.showMessage('Failed to refresh builds. Please try again later.', 'error');
        }
    },
});