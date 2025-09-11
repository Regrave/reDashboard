// Constelia Dashboard - Utils
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
                .replace(/\\\\/g, '\\')  // Process double backslashes first
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'");
        }
        
        // Store the original content for change detection
        this.originalScriptContent = sourceCode;
        this.originalNotesContent = draft ? draft.notes : '';

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

        // Remove auto-save draft functionality - we'll ask the user instead
        // Just track changes for the character counter
        updateNotes.addEventListener('input', (e) => {
            // Ensure the event isn't being prevented
            e.stopPropagation();
            this.updateNotesCharCounter();
        });

        // Enhanced code editor features
        this.setupCodeEditorFeatures(codeEditor);
        
        // Mark listeners as attached
        this.scriptEditorListenersAttached = true;
    },

    setupCodeEditorFeatures(editor) {
        // Check if features are already set up to prevent duplicate listeners
        if (editor.dataset.featuresSetup === 'true') {
            console.log('Code editor features already set up, skipping');
            return;
        }
        
        // Mark that features have been set up
        editor.dataset.featuresSetup = 'true';
        
        // Simple input handler - highlight after typing stops
        let typingTimer;
        let isHighlighting = false;
        
        const safeHighlight = () => {
            if (isHighlighting) {
                console.log('Skipping highlight - already in progress');
                return;
            }
            isHighlighting = true;
            this.highlightCodeEditor();
            // Reset flag after a short delay to ensure the highlight is complete
            setTimeout(() => {
                isHighlighting = false;
            }, 100);
        };
        
        editor.addEventListener('input', () => {
            // Clear the previous timer
            clearTimeout(typingTimer);
            
            // Set a new timer - highlight after 800ms of no typing
            typingTimer = setTimeout(() => {
                console.log('Highlighting after typing stopped');
                safeHighlight();
            }, 800);
        });

        // Highlight immediately when clicking away
        editor.addEventListener('blur', () => {
            console.log('Highlighting on blur');
            clearTimeout(typingTimer);
            safeHighlight();
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

            // Update the current editing script with the saved content
            this.currentEditingScript.script = code;
            this.currentEditingScript.source = code;
            this.currentEditingScript.content = code;
            
            // Update the original content to reflect what was just saved
            this.originalScriptContent = code;
            this.originalNotesContent = '';

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
        // Check for unsaved changes using the stored original content
        const currentCode = this.getCodeEditorContent();
        const currentNotes = document.getElementById('updateNotes').value;
        
        // Normalize content for comparison (trim whitespace and normalize line endings)
        const normalizeContent = (content) => {
            if (!content) return '';
            return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
        };
        
        // Compare normalized content
        const codeChanged = normalizeContent(currentCode) !== normalizeContent(this.originalScriptContent);
        const notesChanged = currentNotes.trim() !== (this.originalNotesContent || '').trim();
        const hasChanges = codeChanged || notesChanged;
        
        if (hasChanges) {
            // Ask user what to do with changes
            const result = confirm('You have unsaved changes.\n\nClick OK to save as draft, or Cancel to discard changes.');
            
            if (result) {
                // User wants to save draft
                this.saveDraft();
                this.showMessage('Draft saved successfully', 'success');
            }
        }

        // Clear state
        this.currentEditingScript = null;
        this.scriptEditorListenersAttached = false; // ADDED: Reset listeners flag
        clearTimeout(this.scriptEditorDraftTimeout);

        // Hide modal
        document.getElementById('scriptEditorModal').classList.remove('active');

        // Clear editor content and reset features flag
        const codeEditor = document.getElementById('scriptCodeEditor');
        if (codeEditor) {
            codeEditor.className = 'code-editor';
            codeEditor.innerHTML = '';
            codeEditor.removeAttribute('data-highlighted');
            codeEditor.dataset.featuresSetup = 'false'; // Reset the features setup flag
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

            // Show Venus card if it exists
            const venusCard = document.getElementById('venusCard');
            if (venusCard) {
                venusCard.style.display = 'block';
            }

        } catch (error) {
            console.error('Error loading Venus status:', error);
            // Set a default status if the API call fails
            this.venusStatus = {
                message: 'Unable to load Venus status',
                error: true
            };
            this.displayVenusStatus();
        }
    },

    displayVenusStatus() {
        const container = document.getElementById('venusStatus');
        
        if (!container) {
            console.log('Venus status container not found');
            return;
        }

        if (!this.venusStatus) {
            container.innerHTML = '<p style="color: #888;">Venus perk status unavailable</p>';
            return;
        }

        // Extract the message from the API response
        let statusMessage = 'Unknown status';
        if (typeof this.venusStatus === 'object') {
            // Handle the specific Venus API response format
            if (this.venusStatus.partner !== undefined) {
                const partner = this.venusStatus.partner;
                const timeYouBonded = this.venusStatus.time_you_bonded;
                const timeTheyBonded = this.venusStatus.time_they_bonded;
                const hasRing = this.venusStatus.special_ring_of_venus_perk;
                
                if (!partner || partner === '') {
                    statusMessage = "You're currently not partnered with anyone. Use the Request Partnership button to send a partnership request!";
                } else if (timeYouBonded > 0 || timeTheyBonded > 0) {
                    // If either timestamp is set, they are bonded
                    const bondTimestamp = timeYouBonded > 0 ? timeYouBonded : timeTheyBonded;
                    const bondedDate = new Date(bondTimestamp * 1000);
                    statusMessage = `💕 You're partnered with ${partner}! Bonded since ${bondedDate.toLocaleDateString()}`;
                    if (hasRing) {
                        statusMessage += ' 💍';
                    }
                } else {
                    // Both timestamps are 0 - this might be a pending request
                    statusMessage = `Partnership status with ${partner} is pending...`;
                }
            } else if (this.venusStatus.message) {
                statusMessage = this.venusStatus.message;
            }
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

    async requestVenusPartnership(partnerName) {
        // If called without parameter, show modal
        if (!partnerName) {
            this.showVenusPartnershipModal();
            return;
        }

        if (!partnerName.trim()) {
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
        
        // Check for invalid scripts
        const validScripts = [];
        const invalidScripts = [];
        
        buildScripts.forEach(id => {
            const script = this.allScripts.find(s => s.id == id || s.id === String(id) || s.id === Number(id));
            if (script) {
                validScripts.push({ id, name: script.name });
            } else {
                invalidScripts.push(id);
            }
        });

        let changesHTML = '';

        // Script changes - only show what will be enabled
        if (buildScripts.length > 0) {
            changesHTML += `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #4a9eff; margin-bottom: 10px;">📜 Scripts to Enable</h4>
            `;

            // Show warning if there are invalid scripts
            if (invalidScripts.length > 0) {
                changesHTML += `
                    <div style="margin-bottom: 15px; padding: 10px; background: rgba(255, 102, 102, 0.1); border: 1px solid rgba(255, 102, 102, 0.3); border-radius: 5px;">
                        <strong style="color: #ff6666;">⚠️ Warning: Invalid Scripts Detected</strong>
                        <p style="color: #ffaa66; margin: 5px 0; font-size: 13px;">
                            This build contains ${invalidScripts.length} script(s) that are no longer available or have been removed.
                            These will be skipped during application.
                        </p>
                        <div style="margin-top: 5px;">
                            ${invalidScripts.map(id => 
                                `<span style="color: #ff6666; font-size: 11px; background: rgba(255, 102, 102, 0.2); padding: 2px 6px; border-radius: 8px; margin: 2px; display: inline-block;">
                                    ❌ Unknown Script ID: ${id}
                                </span>`
                            ).join(' ')}
                        </div>
                    </div>
                `;
            }

            // Show valid scripts that will be enabled
            if (validScripts.length > 0) {
                changesHTML += `
                    <div style="margin-bottom: 10px;">
                        <strong style="color: #4aff4a;">Valid Scripts (${validScripts.length}):</strong>
                        <div style="margin-top: 5px;">
                            ${validScripts.map(script => 
                                `<span style="color: #4aff4a; font-size: 12px; background: rgba(74, 255, 74, 0.2); padding: 2px 6px; border-radius: 8px; margin: 2px; display: inline-block;">
                                    ✓ ${script.name}
                                </span>`
                            ).join(' ')}
                        </div>
                    </div>
                `;
            } else if (invalidScripts.length > 0) {
                changesHTML += `
                    <div style="margin-bottom: 10px;">
                        <p style="color: #ff9999; font-style: italic;">
                            ⚠️ No valid scripts found in this build. Only the configuration will be applied.
                        </p>
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

            let scriptsApplied = false;
            let configApplied = false;
            let scriptError = null;

            // Apply scripts (filter out invalid ones first)
            const buildScripts = JSON.parse(build.scripts || '[]');
            if (buildScripts.length > 0) {
                // Filter to only valid scripts that exist
                const validScriptIds = buildScripts.filter(id => {
                    const scriptExists = this.allScripts.find(s => s.id == id || s.id === String(id) || s.id === Number(id));
                    if (!scriptExists) {
                        console.warn(`Skipping invalid script ID: ${id}`);
                    }
                    return scriptExists;
                });
                
                const invalidCount = buildScripts.length - validScriptIds.length;
                
                if (validScriptIds.length > 0) {
                    try {
                        await this.apiCall('setMemberScripts', {
                            scripts: JSON.stringify(validScriptIds)
                        });
                        scriptsApplied = true;
                        
                        if (invalidCount > 0) {
                            scriptError = `${invalidCount} invalid script(s) were skipped`;
                        }
                    } catch (scriptErr) {
                        scriptError = scriptErr.message || 'Failed to apply scripts';
                        console.warn('Failed to apply build scripts:', scriptErr);
                        // Continue to apply configuration even if scripts fail
                    }
                } else {
                    scriptError = 'All scripts in this build are invalid or unavailable';
                }
            }


            // Apply configuration
            if (build.configuration) {
                // Check if configuration is already a string (from API) or an object
                const configValue = typeof build.configuration === 'string' 
                    ? build.configuration 
                    : JSON.stringify(build.configuration);
                    
                await this.apiPost('setConfiguration', {}, {
                    value: configValue
                });
                configApplied = true;
            }

            // Show appropriate success/warning message
            if (scriptError) {
                if (configApplied) {
                    this.showMessage(`Build "${build.tag}" partially applied. Configuration applied successfully, but some scripts may be unavailable: ${scriptError}`, 'warning');
                } else {
                    this.showMessage(`Build "${build.tag}" partially applied: ${scriptError}`, 'warning');
                }
            } else {
                this.showMessage(`Build "${build.tag}" applied successfully!`, 'success');
            }
            
            this.closeBuildPreview();

            // Refresh data
            await this.loadMemberInfo();
            await this.loadAllScripts();
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

        title.textContent = `"${build.tag}"`;

        // Get build data
        const buildScripts = JSON.parse(build.scripts || '[]').map(id => String(id));
        const currentScripts = this.memberScripts.map(s => String(s.id));

        // Calculate script differences
        const buildScriptsSet = new Set(buildScripts);
        const currentScriptsSet = new Set(currentScripts);
        const scriptsToAdd = buildScripts.filter(id => !currentScriptsSet.has(id));
        const scriptsToRemove = currentScripts.filter(id => !buildScriptsSet.has(id));

        // Parse build configuration for individual script configs
        let buildConfig = null;
        if (build.configuration) {
            try {
                buildConfig = typeof build.configuration === 'string' 
                    ? JSON.parse(build.configuration) 
                    : build.configuration;
            } catch (error) {
                console.error('Error parsing build configuration:', error);
            }
        }

        // Get all script names from the configuration to show both known and unknown scripts
        const allScriptNames = new Set();
        
        // Add scripts from the build's script IDs
        buildScripts.forEach(id => {
            const script = this.allScripts.find(s => s.id == id || s.id === String(id) || s.id === Number(id));
            if (script) {
                allScriptNames.add(script.name);
            }
        });
        
        // Add scripts from the configuration JSON (these might be default scripts not in allScripts)
        if (buildConfig?.omega) {
            Object.keys(buildConfig.omega).forEach(scriptName => {
                if (scriptName !== 'bones') { // Skip the bones array
                    allScriptNames.add(scriptName);
                }
            });
        }
        
        // Filter out library scripts and default system scripts
        const systemScripts = new Set([
            'achievements.lua', 'anticheat.lua', 'constelia.lua', 'io.lua', 
            'net.lua', 'os.lua', 'parallax.lua', 'sync.lua', 'system.lua', 
            'truobleshooter.lua', 'whitelist.lua', 'who.lua', 'workspace.lua'
        ]);
        
        // Categories that should not appear in build tags but can be used as fallback sections
        const hiddenCategories = new Set([
            'Aurora2 Supported', 'CLI', 'CS2', 'CSS', 'Configuration Management',
            'Constelia', 'Dependency / Library', 'FC2T', 'GUI', 'Source Engine Exclusive', 'TF2'
        ]);
        
        const filteredScriptNames = Array.from(allScriptNames).filter(scriptName => {
            // Filter out library scripts (start with "lib_")
            if (scriptName.toLowerCase().startsWith('lib_')) {
                return false;
            }
            // Filter out system scripts
            if (systemScripts.has(scriptName.toLowerCase())) {
                return false;
            }
            return true;
        });
        
        // Group scripts by category
        const scriptsByCategory = new Map();
        const buildCategories = new Set(); // Collect all categories for build tagging
        
        filteredScriptNames.forEach(scriptName => {
            const script = this.allScripts.find(s => s.name === scriptName);
            const allCategories = script?.category_names || [];
            
            // Separate meaningful categories from hidden ones
            const meaningfulCategories = allCategories.filter(cat => !hiddenCategories.has(cat));
            const hiddenCategoriesFound = allCategories.filter(cat => hiddenCategories.has(cat));
            
            let finalCategories;
            let primaryCategory;
            
            if (meaningfulCategories.length > 0) {
                // Has meaningful categories - use them and add to build tags
                finalCategories = meaningfulCategories;
                primaryCategory = meaningfulCategories[0];
                
                // Add meaningful categories to build categories set
                meaningfulCategories.forEach(cat => buildCategories.add(cat));
                
            } else if (hiddenCategoriesFound.length > 0) {
                // Only has hidden categories - use them as fallback but don't add to build tags
                finalCategories = hiddenCategoriesFound;
                primaryCategory = hiddenCategoriesFound[0];
                
            } else {
                // Truly has no categories
                finalCategories = ['Uncategorized'];
                primaryCategory = 'Uncategorized';
            }
            
            // Group script by its primary category
            if (!scriptsByCategory.has(primaryCategory)) {
                scriptsByCategory.set(primaryCategory, []);
            }
            scriptsByCategory.get(primaryCategory).push({
                name: scriptName,
                script: script,
                categories: finalCategories
            });
        });

        // Build HTML with categorized sections
        let detailsHTML = '';
        
        // Add build category tags at the top
        if (buildCategories.size > 0) {
            const categoryTags = Array.from(buildCategories).map(category => 
                `<span class="category-badge">${category}</span>`
            ).join('');
            detailsHTML += `
                <div style="margin-bottom: 20px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                    <h4 style="color: #4a9eff; margin: 0 0 12px 0; font-size: 14px;">📦 Build Categories</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">${categoryTags}</div>
                </div>
            `;
        }

        // Sort categories with priority: meaningful first, then hidden, then uncategorized
        const allCategories = Array.from(scriptsByCategory.keys());
        const meaningfulCats = allCategories.filter(cat => !hiddenCategories.has(cat) && cat !== 'Uncategorized').sort();
        const hiddenCats = allCategories.filter(cat => hiddenCategories.has(cat)).sort();
        const uncategorized = allCategories.filter(cat => cat === 'Uncategorized');
        
        const sortedCategories = [...meaningfulCats, ...hiddenCats, ...uncategorized];
        
        sortedCategories.forEach(category => {
            const scripts = scriptsByCategory.get(category);
            
            detailsHTML += `
                <div style="margin-bottom: 24px;">
                    <h4 style="color: #4a9eff; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px; font-size: 16px; border-bottom: 1px solid rgba(74, 158, 255, 0.2); padding-bottom: 8px;">
                        📁 ${category} <span style="color: #666; font-size: 12px; font-weight: normal;">(${scripts.length})</span>
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
            `;
            
            scripts.forEach(({ name: scriptName, script, categories }) => {
                const scriptId = script ? script.id : null;
                const isNewScript = scriptId ? !currentScripts.includes(String(scriptId)) : false;
                
                // Get script config from build if available
                const scriptConfig = buildConfig?.omega?.[scriptName] || null;
                const hasConfig = scriptConfig && Object.keys(scriptConfig).length > 0;
                
                const newBadge = isNewScript ? '<div style="position: absolute; top: -8px; right: -8px; background: #4aff4a; color: #000; font-size: 11px; padding: 3px 8px; border-radius: 12px; font-weight: bold; box-shadow: 0 2px 8px rgba(74, 255, 74, 0.3);">NEW</div>' : '';
                
                const isDefaultScript = !script; // No script found means it's a default script
                
                // Show all categories below the script name
                const allCategoryBadges = categories.length > 0 ? 
                    '<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">' + 
                    categories.map(cat => `<span class="category-badge" style="font-size: 10px;">${cat}</span>`).join('') + 
                    '</div>' : '';
                
                const configInfo = hasConfig ? 
                    '<div style="display: flex; align-items: center; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);"><span style="color: #4a9eff; font-size: 12px;">⚙️ ' + (isDefaultScript ? 'Configured' : 'Has custom config') + '</span><span style="color: #666; font-size: 11px;">Click to view</span></div>' :
                    '<div style="color: #666; font-size: 12px; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">✨ Default settings</div>';
                
                const clickHandler = hasConfig ? ' onclick="app.showScriptConfig(\'' + scriptName.replace(/'/g, "\\'") + '\', \'' + build.tag.replace(/'/g, "\\'") + '\')" onmouseover="this.style.background=\'rgba(74, 158, 255, 0.08)\'; this.style.borderColor=\'rgba(74, 158, 255, 0.3)\'" onmouseout="this.style.background=\'rgba(255, 255, 255, 0.03)\'; this.style.borderColor=\'rgba(255, 255, 255, 0.1)\'"' : '';
                
                detailsHTML += '<div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; position: relative; transition: all 0.2s; cursor: ' + (hasConfig ? 'pointer' : 'default') + ';"' + clickHandler + '>' + newBadge + '<div style="color: #fff; font-weight: 600; font-size: 16px; margin-bottom: 8px;">' + scriptName + '</div>' + allCategoryBadges + configInfo + '</div>';
            });
            
            detailsHTML += `
                    </div>
                </div>
            `;
        });

        content.innerHTML = detailsHTML;
        modal.classList.add('active');
    },

    closeBuildDetails() {
        document.getElementById('buildDetailsModal').classList.remove('active');
        this.currentBuildToApply = null;
    },

    showScriptConfig(scriptName, buildTag) {
        try {
            // Use the current build that's already loaded
            const build = this.currentBuildToApply;
            
            if (!build || !build.configuration) {
                console.log('No build or configuration found:', { buildTag, build: !!build, hasConfig: !!build?.configuration });
                return;
            }

        let buildConfig;
        try {
            buildConfig = typeof build.configuration === 'string' 
                ? JSON.parse(build.configuration) 
                : build.configuration;
        } catch (error) {
            this.showNotification('Error parsing build configuration', 'error');
            return;
        }

        const scriptConfig = buildConfig?.omega?.[scriptName];
        if (!scriptConfig) {
            this.showNotification('No configuration found for this script', 'warning');
            return;
        }

        // Create a mini modal to show script config
        const modalHTML = `
            <div class="script-config-overlay" id="scriptConfigOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.8); z-index: 1060; display: flex; align-items: center; justify-content: center; padding: 20px;" onclick="this.remove()">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 25px; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);" onclick="event.stopPropagation()">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <h3 style="color: #4a9eff; margin: 0; font-size: 18px;">⚙️ ${scriptName} Configuration</h3>
                        <button style="background: none; border: none; color: #aaa; font-size: 20px; cursor: pointer; padding: 5px;" onclick="this.closest('.script-config-overlay').remove()">✕</button>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.02); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px;">
                        ${this.renderScriptConfigSettings(scriptConfig, scriptName)}
                    </div>
                </div>
            </div>
        `;

        // Remove any existing script config overlay
        const existingOverlay = document.getElementById('scriptConfigOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Add the new overlay to the body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        } catch (error) {
            console.error('Error showing script config:', error);
        }
    },

    showRawBuildConfig(buildTag) {
        try {
            // Use the current build that's already loaded
            const build = this.currentBuildToApply || this.allBuilds?.find(b => b && b.tag === buildTag);
            
            if (!build || !build.configuration) {
                console.log('No build or configuration found for raw view');
                return;
            }

            let buildConfig;
            try {
                buildConfig = typeof build.configuration === 'string' 
                    ? JSON.parse(build.configuration) 
                    : build.configuration;
            } catch (error) {
                console.error('Error parsing build configuration:', error);
                return;
            }

            // Create a modal to show raw JSON
            const modalHTML = `
                <div class="raw-config-overlay" id="rawConfigOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.85); z-index: 1060; display: flex; align-items: center; justify-content: center; padding: 20px;" onclick="this.remove()">
                    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 25px; max-width: 800px; width: 100%; max-height: 85vh; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);" onclick="event.stopPropagation()">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <h3 style="color: #ff8c00; margin: 0; font-size: 18px;">📄 Raw Configuration - "${build.tag}"</h3>
                            <button style="background: none; border: none; color: #aaa; font-size: 20px; cursor: pointer; padding: 5px;" onclick="this.closest('.raw-config-overlay').remove()">✕</button>
                        </div>
                        <div style="height: 70vh; overflow: hidden; display: flex; flex-direction: column;">
                            <pre style="background: #0f0f0f; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; color: #4a9eff; font-family: 'Consolas', 'Monaco', monospace; font-size: 12px; overflow: auto; white-space: pre-wrap; word-wrap: break-word; line-height: 1.4; flex: 1; margin: 0;">${JSON.stringify(buildConfig, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            `;

            // Remove any existing overlay
            const existingOverlay = document.getElementById('rawConfigOverlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }

            // Add the new overlay to the body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
        } catch (error) {
            console.error('Error showing raw config:', error);
        }
    },

    renderScriptConfigSettings(config, scriptName) {
        if (!config || typeof config !== 'object') {
            return '<div style="color: #888; text-align: center; font-style: italic;">No configuration settings found</div>';
        }

        const settings = Object.entries(config).map(([key, value]) => {
            const formattedName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const valueDisplay = this.formatSettingValue(value);
            const typeColor = this.getTypeColor(this.getSettingType(value));
            
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    <span style="color: #fff; font-weight: 500; font-size: 14px;">${formattedName}</span>
                    <span style="color: ${typeColor}; font-size: 13px; background: rgba(255, 255, 255, 0.05); padding: 6px 10px; border-radius: 6px; font-family: 'Consolas', monospace;">${valueDisplay}</span>
                </div>
            `;
        });

        return settings.join('');
    },

    // ========================
    // CONFIGURATION FORM UTILITIES
    // ========================

    async renderConfigForm() {
        const formContainer = document.getElementById('scriptConfigForm');

        // Try to get configuration categories from script metadata
        let configMetadata = { categories: {}, dropdowns: {} };

        // Check if we're in preview mode
        if (this.currentScriptKey === '__preview__' && this.previewConfigMetadata) {
            configMetadata = this.previewConfigMetadata;
        } else {
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

            // Sort settings alphabetically if preference is enabled for this script
            const sortKey = `alphabeticalSort_${this.currentScriptKey}`;
            if (localStorage.getItem(sortKey) === 'true') {
                existingSettings.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            }
            
            existingSettings.forEach(settingName => {
                const value = this.currentScriptConfig[settingName];
                const dropdownOptions = configMetadata.dropdowns[settingName] || null;
                const metadata = {
                    dropdown: dropdownOptions,
                    range: configMetadata.ranges ? configMetadata.ranges[settingName] : null,
                    multiselect: configMetadata.multiselects ? configMetadata.multiselects[settingName] : null,
                    description: configMetadata.descriptions ? configMetadata.descriptions[settingName] : null,
                    requires: configMetadata.requires ? configMetadata.requires[settingName] : null
                };
                formHTML += this.createConfigField(settingName, value, dropdownOptions, metadata);
            });

            formHTML += '</div></div>';
        });

        formContainer.innerHTML = formHTML;

        // Update field visibility based on requires conditions
        this.updateFieldVisibility();
        
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

        // Remove empty groups, capitalize names, and sort settings within each group
        Object.keys(groups).forEach(groupName => {
            if (groups[groupName].length === 0) {
                delete groups[groupName];
            } else {
                // Sort settings alphabetically within each group if preference is enabled for this script
                const sortKey = `alphabeticalSort_${this.currentScriptKey}`;
                if (localStorage.getItem(sortKey) === 'true') {
                    groups[groupName].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                }
                
                const capitalizedName = groupName.charAt(0).toUpperCase() + groupName.slice(1);
                if (groupName !== capitalizedName) {
                    groups[capitalizedName] = groups[groupName];
                    delete groups[groupName];
                }
            }
        });

        return groups;
    },

    checkRequiresCondition(requiresString) {
        if (!requiresString || !this.currentScriptConfig) return true;
        
        // Parse requires string - format can be:
        // "field_name" - for boolean fields (must be true)
        // "field_name:value" - for specific value match (multiselect, dropdown)
        // "field_name:!value" - for NOT having specific value
        
        const parts = requiresString.split(':');
        const fieldName = parts[0].trim();
        const requiredValue = parts[1] ? parts[1].trim() : null;
        
        const currentValue = this.currentScriptConfig[fieldName];
        
        if (requiredValue === null) {
            // Boolean check - field must be truthy
            return !!currentValue;
        } else if (requiredValue.startsWith('!')) {
            // Negation check
            const checkValue = requiredValue.substring(1);
            if (typeof currentValue === 'string') {
                // For multiselect/string fields, check if value is NOT included
                // Handle both "a, b, c" and "[a, b, c]" formats
                const trimmed = currentValue.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                    // Parse bracket format
                    const values = trimmed.slice(1, -1).split(',').map(v => v.trim());
                    return !values.includes(checkValue);
                } else {
                    // Parse comma-separated format
                    const values = trimmed.split(',').map(v => v.trim());
                    return !values.includes(checkValue);
                }
            }
            return currentValue !== checkValue;
        } else {
            // Positive check
            if (typeof currentValue === 'string') {
                // For multiselect/string fields, check if value is included
                // Handle both "a, b, c" and "[a, b, c]" formats
                const trimmed = currentValue.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                    // Parse bracket format
                    const values = trimmed.slice(1, -1).split(',').map(v => v.trim());
                    return values.includes(requiredValue);
                } else {
                    // Parse comma-separated format
                    const values = trimmed.split(',').map(v => v.trim());
                    return values.includes(requiredValue);
                }
            }
            return currentValue === requiredValue;
        }
    },
    
    updateFieldVisibility() {
        // Update visibility of all fields with requires conditions
        document.querySelectorAll('[data-requires]').forEach(field => {
            const requiresCondition = field.getAttribute('data-requires');
            const isVisible = this.checkRequiresCondition(requiresCondition);
            field.style.display = isVisible ? '' : 'none';
        });
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

    createConfigField(key, value, dropdownOptions = null, metadata = null) {
        const fieldType = this.getFieldType(value);
        const fieldId = `config_${key}`.replace(/\./g, '_');
        
        // Check if field should be visible based on requires
        const hasRequires = metadata && metadata.requires;
        let isVisible = true;
        let requiresAttribute = '';
        
        if (hasRequires) {
            isVisible = this.checkRequiresCondition(metadata.requires);
            requiresAttribute = `data-requires="${metadata.requires}"`;
        }

        // Check for metadata
        const hasRange = metadata && metadata.range;
        const hasMultiselect = metadata && metadata.multiselect;
        const hasDescription = metadata && metadata.description;
        
        // Check if this is an array-like string
        const isArrayString = this.isArrayString(value);

        let fieldHTML = `<div class="config-field horizontal-layout" ${requiresAttribute} style="border: 1px solid #333; border-radius: 6px; padding: 12px; margin-bottom: 12px; background: rgba(255, 255, 255, 0.02); ${isVisible ? '' : 'display: none;'}">`;

        // Label and description container (flex: 1 to take remaining space)
        fieldHTML += `<div class="config-label" style="flex: 1;">`;
        
        if (hasDescription) {
            // Title and description on same line with separator
            fieldHTML += `<div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-weight: 500;">
                    ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div style="color: #666; margin: 0 8px;">•</div>
                <div class="config-description" style="font-size: 12px; color: #999; flex: 1;">
                    ${metadata.description}
                </div>
            </div>`;
        } else {
            // Just the title
            fieldHTML += `<div>
                ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>`;
        }
        
        fieldHTML += `</div>`; // Close config-label

        // Control wrapper (aligned to the right)
        fieldHTML += `<div class="config-control">`;
        
        // Add consistent wrapper for all control types
        fieldHTML += `<div class="config-control-inner" style="width: 200px; display: flex; justify-content: flex-end; align-items: center;">`;

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
        } else if (hasRange) {
            // Create range slider
            const { min, max, step } = metadata.range;
            fieldHTML += `
                <div class="range-slider-container" style="display: flex; align-items: center; gap: 10px; width: 100%;">
                    <input type="range" 
                        class="range-slider" 
                        id="${fieldId}_slider" 
                        min="${min}" 
                        max="${max}" 
                        step="${step}" 
                        value="${value}"
                        style="flex: 1; height: 6px; background: #333; outline: none; border-radius: 3px;"
                        oninput="app.updateRangeValue('${key}', this.value, '${fieldId}')">
                    <input type="number" 
                        class="range-input" 
                        id="${fieldId}_input" 
                        min="${min}" 
                        max="${max}" 
                        step="${step}" 
                        value="${value}"
                        style="width: 60px; padding: 4px 8px; background: #2a2a2a; border: 1px solid #555; border-radius: 4px; color: #fff; text-align: center;"
                        onchange="app.updateRangeValue('${key}', this.value, '${fieldId}')">
                </div>
            `;
        } else if (hasMultiselect) {
            // Create multiselect dropdown
            // Parse both formats: "a, b, c" and "[a, b, c]"
            let currentValues = [];
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                    // Handle bracket format: "[a, b, c]"
                    const inner = trimmed.slice(1, -1);
                    currentValues = inner.split(',').map(v => v.trim()).filter(v => v);
                } else {
                    // Handle comma-separated format: "a, b, c"
                    currentValues = trimmed.split(',').map(v => v.trim()).filter(v => v);
                }
            }
            
            fieldHTML += `
                <div class="multiselect-dropdown" style="position: relative; width: 100%;">
                    <div class="multiselect-display" 
                        id="${fieldId}_display"
                        onclick="app.toggleMultiselectDropdown('${fieldId}')"
                        style="padding: 6px 12px; background: #2a2a2a; border: 1px solid #555; border-radius: 4px; cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center;">
                        <span id="${fieldId}_selected">${currentValues.length > 0 ? currentValues.length + ' selected' : 'None selected'}</span>
                        <span style="font-size: 10px;">▼</span>
                    </div>
                    <div class="multiselect-options" 
                        id="${fieldId}_options"
                        style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: #1a1a1a; border: 1px solid #555; border-radius: 4px; margin-top: 2px; max-height: 200px; overflow-y: auto; z-index: 1000;">
            `;
            
            metadata.multiselect.forEach(option => {
                const isChecked = currentValues.includes(option);
                fieldHTML += `
                    <div class="multiselect-option" 
                        onclick="app.toggleMultiselectOption('${key}', '${fieldId}', '${option}')"
                        style="padding: 8px 12px; cursor: pointer; user-select: none; display: flex; align-items: center; gap: 8px; hover: background: #2a2a2a;"
                        onmouseover="this.style.background='#2a2a2a'" 
                        onmouseout="this.style.background='transparent'">
                        <input type="checkbox" 
                            id="${fieldId}_${option}"
                            value="${option}"
                            ${isChecked ? 'checked' : ''}
                            style="pointer-events: none;"
                            data-multiselect-key="${key}">
                        <label style="pointer-events: none; cursor: pointer; flex: 1;">${option}</label>
                    </div>
                `;
            });
            
            fieldHTML += `
                    </div>
                </div>
            `;
        } else if (dropdownOptions && dropdownOptions.length > 0) {
            // Create dropdown
            fieldHTML += `<select class="config-input" id="${fieldId}" onchange="app.updateConfigValue('${key}', this.value); app.triggerAutoSave();" style="width: 100%;">`;
            
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
        } else if (isArrayString) {
            // Handle array-like strings with a custom editor
            const arrayItems = this.parseArrayString(value);
            fieldHTML += `
                <div class="array-editor">
                    <div class="array-items" id="${fieldId}_items" style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px;">
            `;
            
            if (arrayItems.length > 0) {
                arrayItems.forEach((item, index) => {
                    fieldHTML += `
                        <div class="array-item" style="display: flex; gap: 4px; align-items: center;">
                            <input type="text" 
                                value="${item.replace(/"/g, '&quot;')}" 
                                style="flex: 1; padding: 4px 8px; background: #2a2a2a; border: 1px solid #555; border-radius: 4px; color: #fff;"
                                onchange="app.updateArrayItem('${key}', ${index}, this.value)">
                            <button onclick="app.removeArrayItem('${key}', ${index})" 
                                style="padding: 4px 8px; background: #ff4444; border: none; border-radius: 4px; color: white; cursor: pointer;"
                                title="Remove item">×</button>
                        </div>
                    `;
                });
            } else {
                fieldHTML += `<div style="color: #888; font-style: italic; padding: 4px;">Empty array</div>`;
            }
            
            fieldHTML += `
                    </div>
                    <div class="array-add" style="display: flex; gap: 4px;">
                        <input type="text" 
                            id="${fieldId}_new" 
                            placeholder="Add new item..."
                            style="flex: 1; padding: 4px 8px; background: #2a2a2a; border: 1px solid #555; border-radius: 4px; color: #fff;"
                            onkeypress="if(event.key==='Enter') app.addArrayItem('${key}')">
                        <button onclick="app.addArrayItem('${key}')" 
                            style="padding: 4px 12px; background: linear-gradient(135deg, #4aff4a, #357abd); border: none; border-radius: 4px; color: white; cursor: pointer;"
                            title="Add item">+</button>
                    </div>
                </div>
            `;
        } else {
            // Regular text input - display the actual value without quotes
            const displayValue = value;
            fieldHTML += `
                <input type="text" class="config-input" id="${fieldId}" value="${displayValue}" 
                    onchange="app.updateConfigValue('${key}', this.value); app.triggerAutoSave();" style="width: 100%;">
            `;
        }

        // Close the inner wrapper div
        fieldHTML += `</div>`; // Close config-control-inner
        
        // Close the control wrapper div
        fieldHTML += `</div>`; // Close config-control
        
        fieldHTML += `</div>`; // Close config-field
        return fieldHTML;
    },

    getFieldType(value) {
        if (typeof value === 'boolean') return 'boolean';
        // Check for 6 or 8 digit hex color (with or without #)
        if (typeof value === 'string' && /^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value)) return 'color';
        
        // Everything else is treated as text input to allow any value
        return 'text';
    },
    
    isArrayString(value) {
        // Check if a value looks like a JSON array string
        if (typeof value !== 'string') return false;
        const trimmed = value.trim();
        return trimmed.startsWith('[') && trimmed.endsWith(']');
    },
    
    parseArrayString(value) {
        // Parse a JSON array string into an array of items
        if (!this.isArrayString(value)) return [];
        
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.map(item => String(item));
            }
        } catch (e) {
            // If JSON parse fails, try to extract items manually
            const trimmed = value.trim();
            const inner = trimmed.slice(1, -1).trim();
            if (!inner) return [];
            
            // Handle quoted strings with commas
            const items = [];
            let current = '';
            let inQuotes = false;
            let quoteChar = null;
            
            for (let i = 0; i < inner.length; i++) {
                const char = inner[i];
                const nextChar = inner[i + 1];
                
                if (!inQuotes && (char === '"' || char === "'")) {
                    inQuotes = true;
                    quoteChar = char;
                } else if (inQuotes && char === quoteChar && inner[i - 1] !== '\\') {
                    inQuotes = false;
                    quoteChar = null;
                } else if (!inQuotes && char === ',') {
                    const item = current.trim();
                    if (item) {
                        // Remove surrounding quotes if present
                        if ((item.startsWith('"') && item.endsWith('"')) || 
                            (item.startsWith("'") && item.endsWith("'"))) {
                            items.push(item.slice(1, -1));
                        } else {
                            items.push(item);
                        }
                    }
                    current = '';
                } else {
                    current += char;
                }
            }
            
            // Add the last item
            const item = current.trim();
            if (item) {
                if ((item.startsWith('"') && item.endsWith('"')) || 
                    (item.startsWith("'") && item.endsWith("'"))) {
                    items.push(item.slice(1, -1));
                } else {
                    items.push(item);
                }
            }
            
            return items;
        }
        
        return [];
    },
    
    updateArrayItem(key, index, newValue) {
        const fieldId = `config_${key}`.replace(/\./g, '_');
        const currentValue = this.currentScriptConfig[key];
        const items = this.parseArrayString(currentValue);
        
        if (index >= 0 && index < items.length) {
            items[index] = newValue;
            const newArrayString = JSON.stringify(items);
            this.updateConfigValue(key, newArrayString);
            
            // Refresh the display
            this.renderConfigForm();
        }
    },
    
    removeArrayItem(key, index) {
        const currentValue = this.currentScriptConfig[key];
        const items = this.parseArrayString(currentValue);
        
        if (index >= 0 && index < items.length) {
            items.splice(index, 1);
            const newArrayString = JSON.stringify(items);
            this.updateConfigValue(key, newArrayString);
            
            // Refresh the display
            this.renderConfigForm();
        }
    },
    
    addArrayItem(key) {
        const fieldId = `config_${key}`.replace(/\./g, '_');
        const newItemInput = document.getElementById(`${fieldId}_new`);
        
        if (newItemInput && newItemInput.value.trim()) {
            const currentValue = this.currentScriptConfig[key];
            const items = this.parseArrayString(currentValue);
            items.push(newItemInput.value.trim());
            
            const newArrayString = JSON.stringify(items);
            this.updateConfigValue(key, newArrayString);
            
            // Clear the input
            newItemInput.value = '';
            
            // Refresh the display
            this.renderConfigForm();
        }
    },

    toggleMultiselectDropdown(fieldId) {
        const options = document.getElementById(`${fieldId}_options`);
        const isOpen = options.style.display === 'block';
        
        // Close all other multiselect dropdowns first
        document.querySelectorAll('.multiselect-options').forEach(el => {
            el.style.display = 'none';
        });
        
        // Toggle this dropdown
        options.style.display = isOpen ? 'none' : 'block';
        
        // Add click outside handler
        if (!isOpen) {
            const closeHandler = (e) => {
                if (!e.target.closest(`#${fieldId}_options`) && !e.target.closest(`#${fieldId}_display`)) {
                    options.style.display = 'none';
                    document.removeEventListener('click', closeHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', closeHandler), 0);
        }
    },

    toggleMultiselectOption(key, fieldId, option) {
        const checkbox = document.getElementById(`${fieldId}_${option}`);
        checkbox.checked = !checkbox.checked;
        
        // Update the value
        this.updateMultiselectValue(key, fieldId);
    },

    updateMultiselectValue(key, fieldId) {
        // Get all checkboxes for this multiselect
        const checkboxes = document.querySelectorAll(`[id^="${fieldId}_"][type="checkbox"][data-multiselect-key="${key}"]`);
        
        // Collect all checked values
        const selectedValues = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedValues.push(checkbox.value);
            }
        });
        
        // Update display text
        const display = document.getElementById(`${fieldId}_selected`);
        if (display) {
            display.textContent = selectedValues.length > 0 ? 
                `${selectedValues.length} selected` : 'None selected';
        }
        
        // Check original format - if it had brackets, keep brackets
        const originalValue = this.currentScriptConfig[key];
        let newValue;
        if (typeof originalValue === 'string' && originalValue.trim().startsWith('[')) {
            // Preserve bracket format
            newValue = `[${selectedValues.join(', ')}]`;
        } else {
            // Use comma-separated format
            newValue = selectedValues.join(', ');
        }
        
        // Update the config value
        this.updateConfigValue(key, newValue);
    },

    updateRangeValue(key, value, fieldId) {
        // Get the range metadata to get min, max, and step
        const slider = document.getElementById(`${fieldId}_slider`);
        const input = document.getElementById(`${fieldId}_input`);
        
        if (slider) {
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            const step = parseFloat(slider.step);
            
            // Parse the value
            let numValue = parseFloat(value);
            
            // Clamp to min/max
            numValue = Math.max(min, Math.min(max, numValue));
            
            // Round to nearest step
            numValue = Math.round(numValue / step) * step;
            
            // Handle floating point precision issues
            const decimals = (step.toString().split('.')[1] || '').length;
            numValue = parseFloat(numValue.toFixed(decimals));
            
            // Update both slider and input
            slider.value = numValue;
            if (input) input.value = numValue;
            
            // Update the config value
            this.updateConfigValue(key, numValue);
        } else {
            // Fallback if slider not found
            this.updateConfigValue(key, parseFloat(value));
        }
    },

    updateConfigValue(key, value) {
        // Mark configuration as unsaved
        this.markConfigUnsaved();
        
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
        
        // Update visibility of dependent fields
        this.updateFieldVisibility();
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
                
                // Mark configuration as saved
                this.markConfigSaved();
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
            
            // Mark configuration as saved
            this.markConfigSaved();

        } catch (error) {
            console.error('Error saving script config:', error);
            if (!isAutoSave) {
                this.showMessage('Error saving configuration', 'error');
            }
        }
    },

    async resetScriptConfig() {
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

        // Remove the script completely from the main config structure
        if (this.currentConfig[software] && this.currentConfig[software][scriptKey]) {
            delete this.currentConfig[software][scriptKey];
        }
        
        // Clear the current script config
        this.currentScriptConfig = {};
        
        // Update the raw JSON display immediately
        document.getElementById('configDisplay').textContent = JSON.stringify(this.currentConfig, null, 2);
        
        // Save to cloud
        await this.saveConfiguration();
        
        // Reload the script config UI after a short delay, then check for missing options
        setTimeout(() => {
            this.loadScriptConfig();
            // Check for missing options after reset - there probably will be some!
            this.checkAndShowConfigSyncButton();
        }, 1000);
        
        this.showMessage(`Configuration reset for ${scriptKey}! Check for "Merge Missing Options" button to restore defaults.`, 'success');
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
        if (!scriptSource) return { categories: {}, dropdowns: {}, ranges: {}, multiselects: {}, descriptions: {}, requires: {} };

        const categories = {};
        const dropdowns = {};
        const ranges = {};
        const multiselects = {};
        const descriptions = {};
        const requires = {};
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

                // Look backwards from current line to collect all metadata for this setting
                for (let j = i - 1; j >= 0; j--) {
                    const metaLine = lines[j].trim();
                    
                    // Stop if we hit another setting or non-comment line
                    if (!metaLine.startsWith('--') || metaLine.match(/^\s*\w+\s*=/)) {
                        break;
                    }
                    
                    // Parse different metadata types
                    const dropdownMatch = metaLine.match(/--\s*@dropdown:\s*(.+)/i);
                    if (dropdownMatch) {
                        const dropdownOptions = dropdownMatch[1]
                            .split(',')
                            .map(option => option.trim())
                            .filter(option => option.length > 0);
                        if (dropdownOptions.length > 0) {
                            dropdowns[settingName] = dropdownOptions;
                        }
                    }
                    
                    const rangeMatch = metaLine.match(/--\s*@range:\s*([^,]+),\s*([^,]+),\s*(.+)/i);
                    if (rangeMatch) {
                        ranges[settingName] = {
                            min: parseFloat(rangeMatch[1].trim()),
                            max: parseFloat(rangeMatch[2].trim()),
                            step: parseFloat(rangeMatch[3].trim())
                        };
                    }
                    
                    const multiselectMatch = metaLine.match(/--\s*@multiselect:\s*(.+)/i);
                    if (multiselectMatch) {
                        multiselects[settingName] = multiselectMatch[1]
                            .split(',')
                            .map(option => option.trim())
                            .filter(option => option.length > 0);
                    }
                    
                    const descMatch = metaLine.match(/--\s*@description:\s*(.+)/i);
                    if (descMatch) {
                        descriptions[settingName] = descMatch[1].trim();
                    }
                    
                    const requiresMatch = metaLine.match(/--\s*@requires:\s*(.+)/i);
                    if (requiresMatch) {
                        requires[settingName] = requiresMatch[1].trim();
                    }
                }
            }

            // Reset category when we hit end of a table or function
            if (line.includes('}') && line.match(/^\s*}\s*$/)) {
                currentCategory = null;
            }
        }

        return { categories, dropdowns, ranges, multiselects, descriptions, requires };
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
        
        // Group highlights by script for cleaner organization
        const groupedHighlights = {};
        highlights.forEach(highlight => {
            if (!groupedHighlights[highlight.script]) {
                groupedHighlights[highlight.script] = [];
            }
            groupedHighlights[highlight.script].push(highlight);
        });
        
        return Object.entries(groupedHighlights).map(([scriptName, scriptHighlights]) => {
            const settingsList = scriptHighlights.map(highlight => {
                const formattedName = highlight.setting.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const valueDisplay = this.formatSettingValue(highlight.value);
                const typeColor = this.getTypeColor(highlight.type);
                
                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                        <span style="color: #fff; font-weight: 500; font-size: 14px;">${formattedName}</span>
                        <span style="color: ${typeColor}; font-size: 13px; background: rgba(255, 255, 255, 0.05); padding: 4px 8px; border-radius: 6px;">${valueDisplay}</span>
                    </div>
                `;
            }).join('');
            
            return `
                <div style="margin-bottom: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;">
                    <div style="background: rgba(74, 158, 255, 0.1); padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <span style="color: #4a9eff; font-weight: 600; font-size: 15px;">${scriptName}</span>
                    </div>
                    <div style="padding: 12px 16px;">
                        ${settingsList}
                    </div>
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
                icon.textContent = '📋';
            } else {
                content.style.display = 'none';
                icon.textContent = '📄';
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
                .replace(/\\\\/g, '\\')  // Process double backslashes first
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'");
        }

        // Update source code display with highlighting
        const sourceElement = document.getElementById('scriptSourceCode');
        
        // Clear any previous highlighting
        sourceElement.textContent = sourceCode;
        sourceElement.className = 'language-lua source-code-highlighted';
        sourceElement.removeAttribute('data-highlighted');
        
        // Force highlight.js to re-process the element
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(sourceElement);
        }

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

    downloadScriptSource() {
        try {
            const sourceElement = document.getElementById('scriptSourceCode');
            const sourceCode = sourceElement.textContent;
            
            if (!sourceCode || sourceCode.trim() === '') {
                this.showMessage('No source code to download', 'error');
                return;
            }

            // Get the script name from the stored data or the title
            let filename = 'script.lua';
            if (this.currentSourceData && this.currentSourceData.name) {
                // Sanitize filename by removing invalid characters
                filename = this.currentSourceData.name.replace(/[^a-zA-Z0-9-_\.]/g, '_');
                // Add .lua extension if not already present
                if (!filename.endsWith('.lua')) {
                    filename += '.lua';
                }
            }

            // Create a blob with the script content
            const blob = new Blob([sourceCode], { type: 'text/plain' });
            
            // Create a temporary download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = filename;
            
            // Trigger the download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Clean up the object URL
            URL.revokeObjectURL(downloadLink.href);
            
            // Visual feedback
            const downloadBtn = document.getElementById('downloadSourceBtn');
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = '✅';
            downloadBtn.style.background = 'linear-gradient(135deg, #4aff4a, #357abd)';
            
            setTimeout(() => {
                downloadBtn.textContent = originalText;
                downloadBtn.style.background = '';
            }, 2000);
            
            this.showMessage(`Downloaded ${filename} successfully!`, 'success');
            
        } catch (error) {
            console.error('Error downloading script:', error);
            this.showMessage('Failed to download script', 'error');
        }
    },

    async downloadScript(scriptId) {
        try {
            // Use the existing API infrastructure
            const apiResponse = await this.apiCall('getScript', {
                id: scriptId
            });
            
            // Extract script data
            let scriptData;
            if (apiResponse && apiResponse.data) {
                if (Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
                    scriptData = apiResponse.data[0];
                } else if (typeof apiResponse.data === 'object' && apiResponse.data.id) {
                    scriptData = apiResponse.data;
                } else {
                    throw new Error('Invalid API response structure');
                }
            } else if (typeof apiResponse === 'object' && apiResponse.id) {
                scriptData = apiResponse;
            } else {
                throw new Error('Invalid API response structure for script data');
            }

            // Get the script name and content
            let filename = 'script.lua';
            if (scriptData.name) {
                // Sanitize filename by removing invalid characters
                filename = scriptData.name.replace(/[^a-zA-Z0-9-_\.]/g, '_');
                // Add .lua extension if not already present
                if (!filename.endsWith('.lua')) {
                    filename += '.lua';
                }
            }

            const sourceCode = scriptData.script || scriptData.code || scriptData.source || '';
            
            if (!sourceCode || sourceCode.trim() === '') {
                this.showMessage('No source code to download', 'error');
                return;
            }

            // Create a blob with the script content
            const blob = new Blob([sourceCode], { type: 'text/plain' });
            
            // Create a temporary download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = filename;
            
            // Trigger the download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Clean up the object URL
            URL.revokeObjectURL(downloadLink.href);
            
            this.showMessage(`Downloaded ${filename} successfully!`, 'success');
            
        } catch (error) {
            console.error('Error downloading script:', error);
            this.showMessage('Failed to download script', 'error');
        }
    },

    // Script Preview Functions
    showPreviewUploadModal() {
        document.getElementById('previewUploadModal').classList.add('active');
        this.setupModalPreviewUpload();
    },

    closePreviewUploadModal() {
        document.getElementById('previewUploadModal').classList.remove('active');
        document.getElementById('modalPreviewFileInput').value = '';
    },

    setupModalPreviewUpload() {
        const uploadArea = document.getElementById('modalPreviewUploadArea');
        const fileInput = document.getElementById('modalPreviewFileInput');
        
        // Remove existing listeners to prevent duplicates
        uploadArea.onclick = () => fileInput.click();
        
        uploadArea.ondragover = (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#4a9eff';
            uploadArea.style.background = 'rgba(74, 158, 255, 0.1)';
        };
        
        uploadArea.ondragleave = (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(74, 158, 255, 0.3)';
            uploadArea.style.background = 'rgba(74, 158, 255, 0.05)';
        };
        
        uploadArea.ondrop = (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(74, 158, 255, 0.3)';
            uploadArea.style.background = 'rgba(74, 158, 255, 0.05)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handlePreviewFile(files[0]);
            }
        };
    },

    handleModalPreviewFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.handlePreviewFile(file);
        }
    },

    handlePreviewFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.handlePreviewFile(file);
        }
    },

    handlePreviewFile(file) {
        if (!file.name.endsWith('.lua')) {
            this.showMessage('Please upload a .lua file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const scriptContent = e.target.result;
            this.parsePreviewScript(scriptContent, file.name);
        };
        reader.readAsText(file);
    },

    parsePreviewScript(scriptContent, fileName) {
        try {
            // Use the existing configuration parsing system
            const existingCategories = this.extractConfigCategories(scriptContent);
            
            if (!existingCategories || Object.keys(existingCategories.categories || {}).length === 0) {
                this.showMessage('No configuration found in script', 'warning');
                return;
            }

            // Store script content temporarily for default value extraction
            localStorage.setItem('preview_script_content', scriptContent);

            // Store preview data using existing format
            this.previewScriptData = {
                name: fileName.replace('.lua', ''),
                categories: existingCategories.categories,
                dropdowns: { ...existingCategories.dropdowns },
                ranges: existingCategories.ranges || {},
                multiselects: existingCategories.multiselects || {},
                descriptions: existingCategories.descriptions || {},
                requires: existingCategories.requires || {},
                fileName: fileName
            };

            // Add to script dropdown
            this.addPreviewToDropdown();
            
            // Show clear button
            document.getElementById('clearPreviewBtn').style.display = 'inline-block';
            
            // Close modal and switch to config tab
            this.closePreviewUploadModal();
            
            // Switch to config tab by simulating click
            const configTab = document.querySelector('.nav-tab[onclick*="config"]');
            if (configTab) {
                configTab.click();
            }
            
            this.showMessage(`Preview loaded: ${fileName}`, 'success');

        } catch (error) {
            console.error('Error parsing preview script:', error);
            this.showMessage('Failed to parse script configuration', 'error');
        }
    },

    addPreviewToDropdown() {
        const dropdown = document.getElementById('scriptConfigSelect');
        
        // Remove any existing preview option
        const existingPreview = dropdown.querySelector('option[value="__preview__"]');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Add new preview option at the top
        const option = document.createElement('option');
        option.value = '__preview__';
        option.textContent = `🧪 ${this.previewScriptData.name} (Preview)`;
        
        // Insert after the first option (which is usually "Select a software first...")
        if (dropdown.children.length > 1) {
            dropdown.insertBefore(option, dropdown.children[1]);
        } else {
            dropdown.appendChild(option);
        }
        
        // Auto-select the preview
        dropdown.value = '__preview__';
        
        // Trigger config load
        this.loadScriptConfig();
    },


    extractEnhancedMetadata(scriptContent) {
        const metadata = {};
        const lines = scriptContent.split('\n');
        
        let currentCategory = null;
        let currentGroup = null;
        let pendingMetadata = {};
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if this line has a configuration variable
            const configMatch = line.match(/(\w+)\s*=\s*(.+?)(?:,\s*(?:--.*)?)?$/);
            if (configMatch) {
                const varName = configMatch[1];
                
                // Apply any pending metadata to this variable
                if (Object.keys(pendingMetadata).length > 0 || currentCategory || currentGroup) {
                    metadata[varName] = { ...pendingMetadata };
                    
                    if (currentCategory && !metadata[varName].category) {
                        metadata[varName].category = currentCategory;
                    }
                    if (currentGroup && !metadata[varName].group) {
                        metadata[varName].group = currentGroup;
                    }
                    
                    // Clear pending metadata after applying it
                    pendingMetadata = {};
                }
                continue;
            }
            
            // Parse metadata from comment lines
            if (line.startsWith('--')) {
                if (line.includes('@category:')) {
                    const match = line.match(/--\s*@category:\s*(.+)/i);
                    if (match) {
                        currentCategory = match[1].trim();
                        currentGroup = null; // Reset group when category changes
                    }
                }
                
                if (line.includes('@group:')) {
                    const match = line.match(/--\s*@group:\s*(.+)/i);
                    if (match) currentGroup = match[1].trim();
                }
                
                if (line.includes('@multiselect:')) {
                    const match = line.match(/--\s*@multiselect:\s*(.+)/i);
                    if (match) {
                        pendingMetadata.multiselect = match[1].split(',').map(s => s.trim());
                    }
                }
                
                if (line.includes('@range:')) {
                    const match = line.match(/--\s*@range:\s*(.+)/i);
                    if (match) {
                        const parts = match[1].split(',').map(s => s.trim());
                        pendingMetadata.range = {
                            min: parseFloat(parts[0]),
                            max: parseFloat(parts[1]),
                            step: parseFloat(parts[2] || 1)
                        };
                    }
                }
                
                if (line.includes('@requires:')) {
                    const match = line.match(/--\s*@requires:\s*(.+)/i);
                    if (match) {
                        pendingMetadata.requires = match[1].split(',').map(s => s.trim());
                    }
                }
                
                if (line.includes('@description:')) {
                    const match = line.match(/--\s*@description:\s*(.+)/i);
                    if (match) pendingMetadata.description = match[1].trim();
                }
                
                if (line.includes('@dropdown:')) {
                    const match = line.match(/--\s*@dropdown:\s*(.+)/i);
                    if (match) {
                        pendingMetadata.dropdown = match[1].split(',').map(s => s.trim());
                    }
                }
            }
        }
        
        return metadata;
    },



    clearPreview() {
        // Clear preview data
        this.previewScriptData = null;
        this.previewConfigMetadata = null;
        
        // Clear stored script content
        localStorage.removeItem('preview_script_content');
        
        // Remove preview option from dropdown
        const dropdown = document.getElementById('scriptConfigSelect');
        const previewOption = dropdown.querySelector('option[value="__preview__"]');
        if (previewOption) {
            previewOption.remove();
        }
        
        // Reset dropdown selection
        dropdown.value = '';
        
        // Hide clear button
        document.getElementById('clearPreviewBtn').style.display = 'none';
        
        // Remove preview indicator from the DOM
        const previewIndicator = document.querySelector('.preview-indicator');
        if (previewIndicator) {
            previewIndicator.remove();
        }
        
        // Clear file inputs
        const modalInput = document.getElementById('modalPreviewFileInput');
        if (modalInput) modalInput.value = '';
        
        // Reload config to clear preview
        this.loadScriptConfig();
        
        this.showMessage('Preview cleared', 'info');
    },

    closeScriptSource() {
        // Clear stored data
        this.currentSourceData = null;

        // Hide modal
        document.getElementById('scriptSourceModal').classList.remove('active');

        // Clear content but preserve the element structure for highlight.js
        const codeElement = document.getElementById('scriptSourceCode');
        codeElement.textContent = '';
        // Remove highlight.js classes to ensure fresh highlighting next time
        codeElement.className = 'source-code-highlighted';
        codeElement.removeAttribute('data-highlighted');
        
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

    // ========================
    // TUTORIAL SYSTEM
    // ========================

    // Split tutorial into pre-login and post-login steps
    preLoginSteps: [
        {
            element: '#apiKey',
            title: '🔑 Welcome to Constelia Dashboard!',
            content: `
                <p>Welcome! This dashboard is your control center for managing Constelia scripts and configurations.</p>
                <p>To get started, you'll need your <strong>license key</strong>.</p>
                <ul>
                    <li>Your key should look like: <strong>XXXX-XXXX-XXXX-XXXX</strong></li>
                    <li>Enter it in the field below</li>
                    <li>Click <strong>Connect</strong> to log in</li>
                </ul>
                <p><em>After logging in, the tutorial will continue to show you around!</em></p>
            `,
            position: 'bottom'
        }
    ],
    
    postLoginSteps: [
        {
            element: '.nav-tabs',
            title: '📊 Navigation Tabs',
            content: `
                <p>Great! You're logged in. Let's explore the dashboard.</p>
                <p>Use these tabs to navigate between different sections:</p>
                <ul>
                    <li><strong>Overview</strong> - Your stats and terminal</li>
                    <li><strong>Scripts</strong> - Manage your scripts</li>
                    <li><strong>Configuration</strong> - Configure script settings</li>
                    <li>And many more features!</li>
                </ul>
            `,
            position: 'bottom'
        },
        {
            element: '#config-section',
            title: '⚙️ Script Configuration',
            content: `
                <p>This is where you configure your scripts. Here's what you need to know:</p>
                <ul>
                    <li>Choose a script to configure from the dropdown</li>
                    <li>Modify the settings as needed</li>
                    <li><strong>IMPORTANT: Always save your changes!</strong></li>
                </ul>
            `,
            position: 'top',
            onShow: () => app.switchTab('config')
        },
        {
            element: '#scriptConfigSelect',
            title: '📝 Selecting Scripts',
            content: `
                <p>Choose the script you want to configure from this dropdown.</p>
                <p>The configuration form will appear below once you select a script.</p>
                <p><strong>Note:</strong> The "bones" option lets you configure CS2 bone IDs for targeting.</p>
            `,
            position: 'bottom',
            onShow: () => {
                // Auto-select first available script for tutorial
                const scriptSelect = document.getElementById('scriptConfigSelect');
                if (scriptSelect && scriptSelect.options.length > 1) {
                    // Select first non-empty option
                    scriptSelect.selectedIndex = 1;
                    // Trigger change event to load config
                    const event = new Event('change', { bubbles: true });
                    scriptSelect.dispatchEvent(event);
                }
                
                // Also ensure the config editor is visible
                const editor = document.getElementById('scriptConfigEditor');
                if (editor) {
                    editor.style.display = 'block';
                }
            }
        },
        {
            element: '#autoSaveToggle',
            title: '💾 Auto-Save Feature',
            content: `
                <p>The <strong>Auto-Save</strong> toggle helps prevent losing changes:</p>
                <ul>
                    <li>Automatically saves your configuration as you type</li>
                    <li>No need to manually click Save Config</li>
                    <li>When enabled, it unlocks the <strong>Live Omega</strong> feature</li>
                </ul>
                <p>Enable this to see the Live Omega option appear!</p>
            `,
            position: 'left'
        },
        {
            element: '#liveOmegaContainer',
            title: '🚀 Live Omega Feature',
            content: `
                <p>The <strong>Live Omega</strong> toggle appears when Auto-save is enabled!</p>
                <ul>
                    <li>Configuration changes are pushed to Omega <strong>instantly</strong></li>
                    <li>No need to restart Omega when Live mode is on</li>
                    <li>Perfect for testing and quick adjustments</li>
                </ul>
                <p><strong>Note:</strong> You must have Auto-save enabled to use this feature!</p>
            `,
            position: 'left',
            onShow: () => {
                // Temporarily show Live Omega container for tutorial
                const liveOmegaContainer = document.getElementById('liveOmegaContainer');
                if (liveOmegaContainer) {
                    // Force immediate visibility
                    liveOmegaContainer.style.display = 'flex !important';
                    liveOmegaContainer.classList.add('visible');
                    liveOmegaContainer.style.opacity = '1';
                    
                    // Force layout recalculation
                    void liveOmegaContainer.offsetHeight;
                }
            },
            onHide: () => {
                // Hide it again if auto-save is not actually enabled
                const app = window.app;
                if (app && !app.autoSaveEnabled) {
                    const liveOmegaContainer = document.getElementById('liveOmegaContainer');
                    if (liveOmegaContainer) {
                        liveOmegaContainer.classList.remove('visible');
                        liveOmegaContainer.style.opacity = '';
                        liveOmegaContainer.style.display = '';
                    }
                }
            }
        },
        {
            element: '#omegaButton',
            title: '💾 Download Omega',
            content: `
                <p>Click this button to download the Omega launcher for your operating system.</p>
                <p>Omega is the client that runs your scripts and applies your configurations.</p>
                <p><strong>Tip:</strong> Make sure to start CS2 first, then launch Omega!</p>
            `,
            position: 'bottom'
        }
    ],
    
    tutorialSteps: [], // Will be set to either preLoginSteps or postLoginSteps

    currentTutorialStep: 0,
    tutorialPaused: false,

    initTutorial() {
        // Check if tutorial has been completed
        const tutorialCompleted = localStorage.getItem('fc2_tutorial_completed') === 'true';
        const tutorialDismissed = localStorage.getItem('fc2_tutorial_dismissed') === 'true';
        
        // Don't show tutorial if already completed or dismissed
        if (tutorialCompleted || tutorialDismissed) {
            return;
        }
        
        // Show tutorial on first visit if not dismissed or completed
        if (!this.isConnected) {
            // Start tutorial immediately with a minimal delay for DOM updates
            requestAnimationFrame(() => {
                this.startTutorial(false); // Start pre-login tutorial
            });
        }
    },

    restartTutorialFromBeginning() {
        // Close settings modal
        this.closeSettingsModal();
        
        // Clear tutorial completion status
        localStorage.removeItem('fc2_tutorial_completed');
        localStorage.removeItem('fc2_tutorial_dismissed');
        
        // Log out the user
        this.disconnect();
        
        // Start tutorial immediately
        requestAnimationFrame(() => {
            this.startTutorial(false);
        });
    },
    
    startTutorial(isPostLogin = false) {
        this.currentTutorialStep = 0;
        this.tutorialPaused = false;
        
        // Set the appropriate steps
        this.tutorialSteps = isPostLogin ? this.postLoginSteps : this.preLoginSteps;
        
        // Make sure the tutorial modal is visible
        const overlay = document.getElementById('tutorialOverlay');
        const tooltip = document.getElementById('tutorialTooltip');
        if (overlay) overlay.classList.add('active');
        if (tooltip) tooltip.style.display = 'block';
        
        // Add scroll and resize listeners to update highlight position
        this.tutorialScrollHandler = () => {
            if (this.tutorialSteps && this.tutorialSteps[this.currentTutorialStep]) {
                this.positionTutorialElements(this.tutorialSteps[this.currentTutorialStep]);
            }
        };
        window.addEventListener('scroll', this.tutorialScrollHandler, true);
        window.addEventListener('resize', this.tutorialScrollHandler);
        
        this.showTutorialStep(0);
    },
    
    resumeTutorial() {
        // Called after successful login to continue with post-login tutorial
        if (this.tutorialPaused && !localStorage.getItem('fc2_tutorial_completed')) {
            this.tutorialPaused = false;
            // Start post-login tutorial immediately
            requestAnimationFrame(() => {
                this.startTutorial(true); // Start post-login tutorial
            });
        }
    },

    showTutorialStep(stepIndex) {
        const step = this.tutorialSteps[stepIndex];
        if (!step) return;

        // Execute onShow callback if exists
        if (step.onShow) {
            step.onShow();
        }

        // Update content
        document.getElementById('tutorialTitle').innerHTML = step.title;
        document.getElementById('tutorialContent').innerHTML = step.content;
        document.getElementById('tutorialProgress').textContent = `Step ${stepIndex + 1} of ${this.tutorialSteps.length}`;
        
        // Update button text
        const nextBtn = document.getElementById('tutorialNextBtn');
        if (stepIndex === this.tutorialSteps.length - 1) {
            nextBtn.textContent = 'Finish';
            nextBtn.className = 'tutorial-btn tutorial-btn-finish';
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.className = 'tutorial-btn tutorial-btn-next';
        }

        // Position elements with retry for animations
        const attemptPosition = (attempts = 0) => {
            const element = document.querySelector(step.element);
            if (!element && attempts < 10) {
                // Retry after a short delay if element not found
                setTimeout(() => attemptPosition(attempts + 1), 100);
            } else {
                // Always try to position, even if element not found initially
                this.positionTutorialElements(step);
            }
        };
        attemptPosition();
    },

    positionTutorialElements(step) {
        const element = document.querySelector(step.element);
        const highlight = document.getElementById('tutorialHighlight');
        const tooltip = document.getElementById('tutorialTooltip');
        
        if (!element) {
            // If element doesn't exist, show tooltip in center
            tooltip.style.position = 'fixed';
            tooltip.style.left = '50%';
            tooltip.style.top = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            highlight.style.display = 'none';
            return;
        }

        // Scroll element into view first
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        
        // Update positioning on scroll complete
        const updatePosition = () => {
            const rect = element.getBoundingClientRect();
        
        // Show and position highlight
        highlight.style.display = 'block';
        highlight.style.position = 'fixed';
        highlight.style.left = `${rect.left - 10}px`;
        highlight.style.top = `${rect.top - 10}px`;
        highlight.style.width = `${rect.width + 20}px`;
        highlight.style.height = `${rect.height + 20}px`;

        // Position tooltip
        tooltip.style.position = 'fixed';
        const tooltipRect = tooltip.getBoundingClientRect();
        let left, top;

        switch (step.position) {
            case 'bottom':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.bottom + 20;
                break;
            case 'top':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.top - tooltipRect.height - 20;
                break;
            case 'left':
                left = rect.left - tooltipRect.width - 20;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'right':
                left = rect.right + 20;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            default:
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.bottom + 20;
        }

        // Keep tooltip within viewport
        left = Math.max(20, Math.min(left, window.innerWidth - tooltipRect.width - 20));
        top = Math.max(20, Math.min(top, window.innerHeight - tooltipRect.height - 20));

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.transform = 'none';
        };
        
        // Update position immediately and after scroll
        updatePosition();
        setTimeout(updatePosition, 300);
    },

    nextTutorialStep() {
        // Call onHide for current step if it exists
        const currentStep = this.tutorialSteps[this.currentTutorialStep];
        if (currentStep && currentStep.onHide) {
            currentStep.onHide();
        }
        
        this.currentTutorialStep++;
        
        if (this.currentTutorialStep >= this.tutorialSteps.length) {
            // Check if we're completing pre-login tutorial
            if (this.tutorialSteps === this.preLoginSteps) {
                // Pause tutorial and wait for login
                this.tutorialPaused = true;
                this.closeTutorial();
                this.showMessage('Tutorial paused. It will continue after you log in!', 'info');
            } else {
                // Completing post-login tutorial
                this.completeTutorial();
            }
        } else {
            this.showTutorialStep(this.currentTutorialStep);
        }
    },

    skipTutorial() {
        // Call onHide for current step if it exists
        const currentStep = this.tutorialSteps[this.currentTutorialStep];
        if (currentStep && currentStep.onHide) {
            currentStep.onHide();
        }
        
        localStorage.setItem('fc2_tutorial_dismissed', 'true');
        this.closeTutorial();
        this.showMessage('Tutorial skipped. You can restart it anytime from Settings > Tutorial.', 'info');
    },

    completeTutorial() {
        // Call onHide for current step if it exists
        const currentStep = this.tutorialSteps[this.currentTutorialStep];
        if (currentStep && currentStep.onHide) {
            currentStep.onHide();
        }
        
        localStorage.setItem('fc2_tutorial_completed', 'true');
        this.closeTutorial();
        this.showMessage('🎉 Tutorial completed! You\'re ready to use the dashboard.', 'success');
    },

    closeTutorial() {
        const overlay = document.getElementById('tutorialOverlay');
        const highlight = document.getElementById('tutorialHighlight');
        const tooltip = document.getElementById('tutorialTooltip');
        
        if (overlay) overlay.classList.remove('active');
        if (highlight) highlight.style.display = 'none';
        if (tooltip) tooltip.style.display = 'none';
        
        // Remove scroll and resize listeners
        if (this.tutorialScrollHandler) {
            window.removeEventListener('scroll', this.tutorialScrollHandler, true);
            window.removeEventListener('resize', this.tutorialScrollHandler);
            this.tutorialScrollHandler = null;
        }
        
        this.currentTutorialStep = 0;
    },

    // Track unsaved configuration changes
    markConfigUnsaved() {
        const badge = document.getElementById('configUnsavedBadge');
        if (badge) {
            badge.classList.add('active');
        }
    },

    markConfigSaved() {
        const badge = document.getElementById('configUnsavedBadge');
        if (badge) {
            badge.classList.remove('active');
        }
    },

    // ========================
    // CONFIG SYNC FUNCTIONS
    // ========================

    getScriptDefaultConfig(scriptSource) {
        const config = {};
        const lines = scriptSource.split('\n');
        
        let inConfigTable = false;
        let inFunction = false;
        let inNestedTable = false;
        let braceCount = 0;
        let nestedBraces = 0;
        let functionDepth = 0;
        let scriptTableName = '';
        let foundMainTable = false;
        
        // First pass: find the main script table name
        for (let i = 0; i < lines.length; i++) {
            const trimmed = lines[i].trim();
            if (trimmed.startsWith('--')) continue;
            
            // Check for single-line table declaration: local name = {
            const singleLineMatch = trimmed.match(/^(?:local\s+)?(\w+)\s*=\s*{/);
            if (singleLineMatch) {
                scriptTableName = singleLineMatch[1];
                break;
            }
            
            // Check for multi-line table declaration: local name = (followed by { on next line)
            const multiLineMatch = trimmed.match(/^(?:local\s+)?(\w+)\s*=\s*$/);
            if (multiLineMatch && i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                if (nextLine === '{') {
                    scriptTableName = multiLineMatch[1];
                    break;
                }
            }
        }
        
        // If no main script table found, this is likely a library script - return empty config
        if (!scriptTableName) {
            return config;
        }
        
        // Skip library scripts (lib_*) - they typically don't have user config
        if (scriptTableName.startsWith('lib_')) {
            return config;
        }
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            // Skip comments and empty lines
            if (trimmed.startsWith('--') || trimmed === '') continue;
            
            // Track if we're inside a function
            if (trimmed.includes('function ') && trimmed.includes('(')) {
                inFunction = true;
                functionDepth = 0;
            }
            
            if (inFunction) {
                // Count braces/ends to track function scope
                if (trimmed.includes('function') || trimmed.includes('if ') || 
                    trimmed.includes('for ') || trimmed.includes('while ')) {
                    functionDepth++;
                }
                if (trimmed === 'end' || trimmed.startsWith('end ')) {
                    functionDepth--;
                    if (functionDepth <= 0) {
                        inFunction = false;
                    }
                }
                continue; // Skip everything inside functions
            }
            
            // Method 1: Direct assignments like "scriptName.enabled = true" (only outside functions)
            if (scriptTableName && !inFunction) {
                const directMatch = trimmed.match(new RegExp(`^${scriptTableName}\\.(\\w+)\\s*=\\s*(.+?)(?:,\\s*(?:--.*)?)?$`));
                if (directMatch) {
                    const key = directMatch[1];
                    let value = directMatch[2].trim();
                    
                    // Skip if value is complex
                    if (value.startsWith('{') || value.includes('function')) {
                        continue;
                    }
                    
                    const parsedValue = this.parseConfigValue(value);
                    if (parsedValue !== null) {
                        config[key] = parsedValue;
                    }
                    continue;
                }
            }
            
            // Method 2: Table definitions (only the main script table)
            // Single-line: local name = {
            const singleLineTableMatch = trimmed.match(/^(?:local\s+)?(\w+)\s*=\s*{/);
            if (singleLineTableMatch && singleLineTableMatch[1] === scriptTableName && !foundMainTable) {
                inConfigTable = true;
                foundMainTable = true;
                braceCount = 1;
                continue;
            }
            
            // Multi-line: local name = (then { on current line)
            if (trimmed === '{' && !foundMainTable && i > 0) {
                const prevLine = lines[i - 1].trim();
                const multiLineTableMatch = prevLine.match(/^(?:local\s+)?(\w+)\s*=\s*$/);
                if (multiLineTableMatch && multiLineTableMatch[1] === scriptTableName) {
                    inConfigTable = true;
                    foundMainTable = true;
                    braceCount = 1;
                    continue;
                }
            }
            
            if (inConfigTable && foundMainTable) {
                // Count braces to know when main table ends
                braceCount += (line.match(/{/g) || []).length;
                braceCount -= (line.match(/}/g) || []).length;
                
                // If we've closed all braces, we're done with the main table
                if (braceCount <= 0) {
                    inConfigTable = false;
                    break; // Stop parsing after main table
                }
                
                // Handle nested tables - skip over them but continue parsing after
                if (!inNestedTable) {
                    // Check if this line starts a nested table
                    if (trimmed.match(/^(\w+)\s*=\s*{/)) {
                        inNestedTable = true;
                        nestedBraces = 1; // We just opened one brace for the nested table
                        continue; // Skip the opening line of the nested table
                    }
                } else {
                    // We're inside a nested table, count braces to know when it ends
                    nestedBraces += (line.match(/{/g) || []).length;
                    nestedBraces -= (line.match(/}/g) || []).length;
                    
                    // If nested table is closed, exit nested mode and continue parsing
                    if (nestedBraces <= 0) {
                        inNestedTable = false;
                    }
                    continue; // Skip all lines while in nested table
                }
                
                // Parse simple variable assignments (only when not in nested table)
                if (!inNestedTable) {
                    const assignmentMatch = trimmed.match(/^(\w+)\s*=\s*(.+?)(?:,\s*(?:--.*)?)?$/);
                    if (assignmentMatch) {
                        const key = assignmentMatch[1];
                        let value = assignmentMatch[2].trim();
                        
                        // Skip if value is complex (table, function, etc.)
                        if (value.startsWith('{') || 
                            value.startsWith('[') ||
                            value.includes('function') ||
                            value.includes('require(') ||
                            value.includes('setmetatable') ||
                            trimmed.includes('= {}')) {
                            continue;
                        }
                        
                        const parsedValue = this.parseConfigValue(value);
                        if (parsedValue !== null) {
                            config[key] = parsedValue;
                        }
                    }
                }
            }
        }
        
        return config;
    },

    parseConfigValue(value) {
        // Remove trailing comma and comments
        value = value.replace(/,?\s*--.*$/, '').replace(/,$/, '').trim();
        
        // Skip if value contains complex expressions or is empty
        if (!value || 
            value.includes('function') || 
            value.includes('setmetatable') || 
            value.includes('entity:') || 
            value.includes('valve_source') ||
            value.includes('fantasy.') ||
            value.includes('require(') ||
            value.includes('{}') ||
            value.length > 100) { // Skip very long values (likely not config)
            return null;
        }
        
        // Parse the value
        try {
            if (value === 'true' || value === 'false') {
                return value === 'true';
            } else if (value.match(/^-?\d+$/) && Math.abs(parseInt(value)) < 1000000) {
                return parseInt(value);
            } else if (value.match(/^-?\d+\.\d+$/) && Math.abs(parseFloat(value)) < 1000000) {
                return parseFloat(value);
            } else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                return value.slice(1, -1);
            } else {
                // For other values, store as string without quotes
                return value.replace(/^["']|["']$/g, '');
            }
        } catch (e) {
            return null;
        }
    },

    findScriptsWithMissingOptions() {
        const scriptsWithMissing = [];
        
        if (!this.memberScripts || !Array.isArray(this.memberScripts) || this.memberScripts.length === 0) {
            return scriptsWithMissing;
        }
        
        // Get the script IDs that are active/enabled
        const activeScriptIds = this.memberScripts.map(s => s.id);
        
        if (!this.allScripts || !Array.isArray(this.allScripts)) {
            return scriptsWithMissing;
        }
        
        for (const script of this.allScripts) {
            // Only process scripts that are active/enabled
            if (!activeScriptIds.includes(script.id)) continue;
            
            // Skip if script has no source code
            if (!script.script) continue;
            
            // Get script name and software
            const scriptName = script.name;
            const softwareId = script.software;
            const softwareName = this.getSoftwareNameById(softwareId);
            
            if (!softwareName) continue;
            
            // Skip library scripts - they typically don't have user configuration
            if (scriptName.startsWith('lib_')) continue;
            
            // Get default config from script source
            const defaultConfig = this.getScriptDefaultConfig(script.script);
            const defaultKeys = Object.keys(defaultConfig);
            
            if (defaultKeys.length === 0) continue;
            
            // Check current config
            const currentScriptConfig = this.currentConfig[softwareName] && this.currentConfig[softwareName][scriptName];
            const currentKeys = currentScriptConfig ? Object.keys(currentScriptConfig) : [];
            
            // Find missing keys
            const missingKeys = defaultKeys.filter(key => !currentKeys.includes(key));
            
            if (missingKeys.length > 0) {
                const missingOptions = {};
                for (const key of missingKeys) {
                    missingOptions[key] = defaultConfig[key];
                }
                
                scriptsWithMissing.push({
                    name: scriptName,
                    software: softwareName,
                    softwareId: softwareId,
                    missingKeys: missingKeys,
                    missingOptions: missingOptions,
                    defaultConfig: defaultConfig
                });
            }
        }
        
        return scriptsWithMissing;
    },

    getSoftwareNameById(softwareId) {
        const softwareMap = {
            '4': 'omega',
            '5': 'universe4', 
            '6': 'omega',
            '7': 'parallax2'
        };
        return softwareMap[softwareId.toString()];
    },

    checkAndShowConfigSyncButton() {
        const scriptsWithMissing = this.findScriptsWithMissingOptions();
        const syncBtn = document.getElementById('syncConfigOptionsBtn');
        
        if (syncBtn) {
            if (scriptsWithMissing.length > 0) {
                syncBtn.style.display = 'block';
                syncBtn.textContent = `🔄 Sync Config Options (${scriptsWithMissing.length})`;
            } else {
                syncBtn.style.display = 'none';
            }
        }
    },

    showConfigSyncModal() {
        const scriptsWithMissing = this.findScriptsWithMissingOptions();
        const modal = document.getElementById('configSyncModal');
        const listContainer = document.getElementById('configSyncList');
        
        if (scriptsWithMissing.length === 0) {
            this.showMessage('All configuration options are up to date!', 'success');
            return;
        }
        
        // Build the checklist
        let listHTML = '';
        for (const script of scriptsWithMissing) {
            listHTML += `
                <div class="config-sync-item" style="display: flex; align-items: flex-start; gap: 12px; padding: 15px; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; margin-bottom: 10px; background: rgba(0, 0, 0, 0.2);">
                    <div class="filter-checkbox" data-script="${script.name}" data-software="${script.software}" onclick="app.toggleConfigSyncItem(this)" style="margin-top: 2px; cursor: pointer;"></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #4a9eff; margin-bottom: 5px;">
                            ${script.name} <span style="color: #888; font-weight: normal; font-size: 12px;">(${script.software})</span>
                        </div>
                        <div style="color: #ccc; font-size: 14px; margin-bottom: 8px;">
                            Missing ${script.missingKeys.length} option${script.missingKeys.length > 1 ? 's' : ''}:
                        </div>
                        <div style="color: #aaa; font-size: 12px; font-family: monospace;">
                            ${script.missingKeys.map(key => `${key}: ${JSON.stringify(script.missingOptions[key])}`).join(', ')}
                        </div>
                    </div>
                    <div class="sync-action-dropdown" style="position: relative;">
                        <select class="form-select" style="font-size: 12px; padding: 4px 8px; min-width: 120px;" data-script="${script.name}" data-software="${script.software}">
                            <option value="merge">Add missing options</option>
                            <option value="reset">Reset to defaults</option>
                        </select>
                    </div>
                </div>
            `;
        }
        
        listContainer.innerHTML = listHTML;
        modal.classList.add('active');
    },

    closeConfigSyncModal() {
        const modal = document.getElementById('configSyncModal');
        modal.classList.remove('active');
    },

    toggleConfigSyncItem(checkbox) {
        checkbox.classList.toggle('checked');
        this.updateConfigSyncButtonState();
    },

    selectAllConfigSync(selectAll) {
        const checkboxes = document.querySelectorAll('#configSyncList .filter-checkbox');
        for (const checkbox of checkboxes) {
            if (selectAll) {
                checkbox.classList.add('checked');
            } else {
                checkbox.classList.remove('checked');
            }
        }
        this.updateConfigSyncButtonState();
    },

    updateConfigSyncButtonState() {
        const selectedItems = document.querySelectorAll('#configSyncList .filter-checkbox.checked');
        const syncBtn = document.getElementById('performSyncBtn');
        
        if (syncBtn) {
            if (selectedItems.length > 0) {
                syncBtn.disabled = false;
                syncBtn.textContent = `🔄 Sync Selected (${selectedItems.length})`;
            } else {
                syncBtn.disabled = false;
                syncBtn.textContent = '🔄 Sync Selected';
            }
        }
    },

    async performConfigSync() {
        const selectedItems = document.querySelectorAll('#configSyncList .filter-checkbox.checked');
        
        if (selectedItems.length === 0) {
            this.showMessage('Please select at least one script to sync.', 'warning');
            return;
        }
        
        const results = {
            synced: [],
            failed: [],
            newOptions: 0,
            removedScripts: []
        };
        
        for (const checkbox of selectedItems) {
            const scriptName = checkbox.dataset.script;
            const software = checkbox.dataset.software;
            const actionSelect = document.querySelector(`select[data-script="${scriptName}"][data-software="${software}"]`);
            const action = actionSelect ? actionSelect.value : 'merge';
            
            try {
                const script = this.allScripts.find(s => s.name === scriptName);
                if (!script) {
                    results.failed.push(`${scriptName}: Script not found`);
                    continue;
                }
                
                const defaultConfig = this.getScriptDefaultConfig(script.script);
                
                // Ensure software config exists
                if (!this.currentConfig[software]) {
                    this.currentConfig[software] = {};
                }
                
                if (action === 'reset') {
                    // Reset entire script config to defaults
                    this.currentConfig[software][scriptName] = { ...defaultConfig };
                    results.synced.push(`${scriptName}: Reset to defaults`);
                    results.newOptions += Object.keys(defaultConfig).length;
                } else {
                    // Merge missing options
                    const currentConfig = this.currentConfig[software][scriptName] || {};
                    const missingKeys = Object.keys(defaultConfig).filter(key => !(key in currentConfig));
                    
                    for (const key of missingKeys) {
                        currentConfig[key] = defaultConfig[key];
                    }
                    
                    this.currentConfig[software][scriptName] = currentConfig;
                    results.synced.push(`${scriptName}: Added ${missingKeys.length} options`);
                    results.newOptions += missingKeys.length;
                }
                
            } catch (error) {
                console.error(`Error syncing ${scriptName}:`, error);
                results.failed.push(`${scriptName}: ${error.message}`);
            }
        }
        
        // Save the updated configuration
        try {
            await this.apiPost('setConfiguration', {}, {
                value: JSON.stringify(this.currentConfig)
            });
            
            // Update displays
            const configDisplay = document.getElementById('configDisplay');
            if (configDisplay) {
                configDisplay.textContent = JSON.stringify(this.currentConfig, null, 2);
                this.highlightJSONEditor();
            }
            
            // Close modal and refresh UI
            this.closeConfigSyncModal();
            this.checkAndShowConfigSyncButton();
            this.populateSoftwareDropdown();
            
            // Show summary
            let message = `✅ Sync completed! Added ${results.newOptions} new configuration options.`;
            if (results.failed.length > 0) {
                message += `\n❌ ${results.failed.length} scripts failed to sync.`;
            }
            this.showMessage(message, results.failed.length > 0 ? 'warning' : 'success');
            
        } catch (error) {
            console.error('Error saving configuration:', error);
            this.showMessage('Failed to save synchronized configuration.', 'error');
        }
    },

    // Venus Partnership Modal Functions
    showVenusPartnershipModal() {
        const modal = document.getElementById('venusPartnershipModal');
        const input = document.getElementById('venusPartnerInput');
        
        input.value = '';
        modal.classList.add('active');
        
        // Focus the input after animation
        setTimeout(() => {
            input.focus();
        }, 100);
    },

    closeVenusPartnershipModal() {
        const modal = document.getElementById('venusPartnershipModal');
        modal.classList.remove('active');
    },

    async submitVenusPartnership() {
        const input = document.getElementById('venusPartnerInput');
        const username = input.value.trim();
        
        if (!username) {
            this.showMessage('Please enter a username.', 'warning');
            return;
        }
        
        this.closeVenusPartnershipModal();
        await this.requestVenusPartnership(username);
    },
});