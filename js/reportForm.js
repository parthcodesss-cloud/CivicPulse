/* ============================================
   CivicPulse — Report Form Controller
   Submit new civic issue with validation +
   duplicate detection.
   ============================================ */

const ReportFormPage = (() => {
    'use strict';

    let selectedSeverity = null;
    let imageData = null;

    function init() {
        renderForm();
    }

    function renderForm() {
        const container = document.getElementById('reportFormContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="report-form animate-fade-in">
                <h1 class="report-form__title">
                    <i class="fa-solid fa-bullhorn" style="color: var(--color-accent);"></i>
                    Report a Civic Issue
                </h1>
                <p class="report-form__subtitle">Help your community by documenting civic problems. All fields marked with * are required.</p>

                <!-- Duplicate Warning Area -->
                <div id="duplicateWarning"></div>

                <form id="reportForm" novalidate>
                    <!-- Category & Location -->
                    <div class="report-form__row">
                        <div class="form-group">
                            <label for="category" class="form-label form-label--required">Issue Category</label>
                            <select id="category" class="form-select" required>
                                <option value="">Select a category</option>
                                ${CivicUtils.CATEGORIES.map(c =>
                                    `<option value="${c.id}">${c.emoji} ${c.label}</option>`
                                ).join('')}
                            </select>
                            <div class="form-error hidden" id="categoryError"><i class="fa-solid fa-circle-exclamation"></i> <span></span></div>
                        </div>
                        <div class="form-group">
                            <label for="location" class="form-label form-label--required">Area / Location</label>
                            <select id="location" class="form-select" required>
                                <option value="">Select an area</option>
                                ${CivicUtils.AREAS.map(a =>
                                    `<option value="${a}">${a}</option>`
                                ).join('')}
                            </select>
                            <div class="form-error hidden" id="locationError"><i class="fa-solid fa-circle-exclamation"></i> <span></span></div>
                        </div>
                    </div>

                    <!-- Title -->
                    <div class="form-group">
                        <label for="title" class="form-label form-label--required">Issue Title</label>
                        <input type="text" id="title" class="form-input" placeholder="e.g., Large pothole near main crossing" maxlength="150" required>
                        <span class="form-hint">Brief, descriptive title (5-150 characters)</span>
                        <div class="form-error hidden" id="titleError"><i class="fa-solid fa-circle-exclamation"></i> <span></span></div>
                    </div>

                    <!-- Severity -->
                    <div class="form-group">
                        <label class="form-label form-label--required">Severity Level</label>
                        <div class="severity-selector" id="severitySelector">
                            ${CivicUtils.SEVERITY_LEVELS.map(s => `
                                <label class="severity-option" data-severity="${s.id}" tabindex="0" role="radio" aria-checked="false" aria-label="${s.label}: ${s.description}">
                                    <input type="radio" name="severity" value="${s.id}">
                                    <div class="severity-option__icon"><i class="fa-solid ${s.icon}" style="color: ${s.color};"></i></div>
                                    <div class="severity-option__label">${s.label}</div>
                                </label>
                            `).join('')}
                        </div>
                        <div class="form-error hidden" id="severityError"><i class="fa-solid fa-circle-exclamation"></i> <span></span></div>
                    </div>

                    <!-- Description -->
                    <div class="form-group">
                        <label for="description" class="form-label form-label--required">Description</label>
                        <textarea id="description" class="form-textarea" placeholder="Describe the problem in detail. Include specifics like size, extent, when you noticed it, and how it affects the community..." maxlength="2000" required></textarea>
                        <span class="form-hint"><span id="charCount">0</span>/2000 characters</span>
                        <div class="form-error hidden" id="descriptionError"><i class="fa-solid fa-circle-exclamation"></i> <span></span></div>
                    </div>

                    <!-- Image Upload -->
                    <div class="form-group">
                        <label class="form-label">Photo (Optional)</label>
                        <div class="file-upload" id="fileUpload">
                            <div class="file-upload__icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                            <p class="file-upload__text">Click to upload or drag and drop</p>
                            <p class="file-upload__hint">PNG, JPG up to 2MB. Do not upload images containing personal information.</p>
                            <div class="file-upload__preview hidden" id="imagePreview"></div>
                        </div>
                        <input type="file" id="imageInput" accept="image/png,image/jpeg,image/jpg" class="hidden">
                    </div>

                    <div class="report-form__divider"></div>

                    <!-- Privacy Notice -->
                    <div class="report-form__privacy">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>Your report is submitted anonymously. We do not collect personal information. Only the area/locality is recorded, not your exact address.</span>
                    </div>

                    <!-- Submit -->
                    <div class="report-form__submit">
                        <button type="submit" class="btn btn--primary btn--lg btn--block" id="submitBtn">
                            <i class="fa-solid fa-paper-plane"></i>
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        `;

        attachFormListeners();
    }

    function attachFormListeners() {
        const form = document.getElementById('reportForm');
        if (!form) return;

        // Severity selector
        const severityOptions = document.querySelectorAll('.severity-option');
        severityOptions.forEach(option => {
            option.addEventListener('click', () => {
                severityOptions.forEach(o => {
                    o.classList.remove('selected--low', 'selected--medium', 'selected--high', 'selected--critical');
                    o.setAttribute('aria-checked', 'false');
                });
                const value = option.dataset.severity;
                option.classList.add(`selected--${value}`);
                option.setAttribute('aria-checked', 'true');
                option.querySelector('input').checked = true;
                selectedSeverity = value;
                clearFieldError('severity');
            });

            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
            });
        });

        // Character count
        const desc = document.getElementById('description');
        const charCount = document.getElementById('charCount');
        desc.addEventListener('input', () => {
            charCount.textContent = desc.value.length;
        });

        // Image upload
        const fileUpload = document.getElementById('fileUpload');
        const imageInput = document.getElementById('imageInput');

        fileUpload.addEventListener('click', () => imageInput.click());

        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.style.borderColor = 'var(--color-accent)';
            fileUpload.style.background = 'var(--color-accent-bg)';
        });

        fileUpload.addEventListener('dragleave', () => {
            fileUpload.style.borderColor = '';
            fileUpload.style.background = '';
        });

        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.style.borderColor = '';
            fileUpload.style.background = '';
            if (e.dataTransfer.files.length > 0) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        });

        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageFile(e.target.files[0]);
            }
        });

        // Duplicate detection on blur
        const title = document.getElementById('title');
        const category = document.getElementById('category');
        const location = document.getElementById('location');

        const checkDuplicates = CivicUtils.debounce(() => {
            const data = {
                title: title.value,
                category: category.value,
                location: location.value,
                description: desc.value
            };
            if (data.category && data.location && data.title) {
                const duplicates = CivicUtils.findPotentialDuplicates(data, DataService.getReports());
                renderDuplicateWarning(duplicates);
            }
        }, 500);

        title.addEventListener('input', checkDuplicates);
        category.addEventListener('change', checkDuplicates);
        location.addEventListener('change', checkDuplicates);

        // Form submission
        form.addEventListener('submit', handleSubmit);
    }

    function handleImageFile(file) {
        if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
            Components.showToast('Please upload a PNG or JPG image.', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            Components.showToast('Image must be under 2MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imageData = e.target.result;
            const preview = document.getElementById('imagePreview');
            preview.classList.remove('hidden');
            preview.innerHTML = `<img src="${imageData}" alt="Upload preview">`;
        };
        reader.readAsDataURL(file);
    }

    function renderDuplicateWarning(duplicates) {
        const container = document.getElementById('duplicateWarning');
        if (!container) return;

        if (duplicates.length === 0) {
            container.innerHTML = '';
            return;
        }

        const dup = duplicates[0];
        const cat = CivicUtils.getCategoryById(dup.report.category);

        container.innerHTML = `
            <div class="alert alert--warning duplicate-warning">
                <div class="alert__icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <div class="alert__content">
                    <div class="alert__title">A similar issue may already exist</div>
                    <div class="duplicate-warning__report">
                        <div>
                            <div class="duplicate-warning__report-title">
                                <i class="fa-solid ${cat.icon}"></i>
                                ${CivicUtils.sanitizeText(dup.report.title)}
                            </div>
                            <div class="duplicate-warning__report-meta">
                                📍 ${CivicUtils.sanitizeText(dup.report.location)} · Confirmed by ${dup.report.confirmations} people
                            </div>
                        </div>
                    </div>
                    <div class="alert__actions">
                        <a href="report-detail.html?id=${dup.report.id}" class="btn btn--sm btn--secondary">
                            <i class="fa-solid fa-eye"></i> View Existing Report
                        </a>
                    </div>
                    <p class="alert__message" style="margin-top: var(--space-2);">You can still submit your report if this is a different issue.</p>
                </div>
            </div>
        `;
    }

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            category: document.getElementById('category').value,
            title: document.getElementById('title').value,
            location: document.getElementById('location').value,
            severity: selectedSeverity || '',
            description: document.getElementById('description').value,
            image: imageData
        };

        // Validate
        const validation = CivicUtils.validateReport(data);
        clearAllErrors();

        if (!validation.isValid) {
            Object.entries(validation.errors).forEach(([field, message]) => {
                showFieldError(field, message);
            });
            // Scroll to first error
            const firstError = document.querySelector('.form-error:not(.hidden)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Show loading
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('btn--loading');
        submitBtn.disabled = true;

        // Simulate brief processing delay
        setTimeout(() => {
            const report = DataService.addReport(data);
            showSuccess(report);

            // 🎉 Launch confetti celebration
            if (typeof ScrollReveal !== 'undefined' && ScrollReveal.launchConfetti) {
                ScrollReveal.launchConfetti(2500);
            }
        }, 600);
    }

    function showSuccess(report) {
        const container = document.getElementById('reportFormContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="report-form">
                <div class="report-success">
                    <div class="report-success__icon">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <h2 class="report-success__title">Report Submitted!</h2>
                    <p class="report-success__message">Thank you for helping your community. Your report has been received and will be reviewed shortly.</p>
                    <div class="report-success__id">${report.id}</div>
                    <p class="report-success__status">
                        <span class="badge badge--pending">
                            <i class="fa-solid fa-clock"></i> Pending Verification
                        </span>
                    </p>
                    <div class="report-success__actions">
                        <a href="report-detail.html?id=${report.id}" class="btn btn--primary">
                            <i class="fa-solid fa-eye"></i> View Report
                        </a>
                        <button class="btn btn--secondary" onclick="ReportFormPage.renderForm()">
                            <i class="fa-solid fa-plus"></i> Report Another Issue
                        </button>
                        <a href="reports.html" class="btn btn--ghost">
                            Browse All Issues
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    function showFieldError(field, message) {
        const errorEl = document.getElementById(`${field}Error`);
        if (errorEl) {
            errorEl.classList.remove('hidden');
            errorEl.querySelector('span').textContent = message;
        }
        const inputEl = document.getElementById(field);
        if (inputEl) {
            inputEl.classList.add('form-input--error', 'form-select--error', 'form-textarea--error');
        }
    }

    function clearFieldError(field) {
        const errorEl = document.getElementById(`${field}Error`);
        if (errorEl) errorEl.classList.add('hidden');
        const inputEl = document.getElementById(field);
        if (inputEl) {
            inputEl.classList.remove('form-input--error', 'form-select--error', 'form-textarea--error');
        }
    }

    function clearAllErrors() {
        document.querySelectorAll('.form-error').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.form-input--error, .form-select--error, .form-textarea--error').forEach(el => {
            el.classList.remove('form-input--error', 'form-select--error', 'form-textarea--error');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 10);
    }

    return { init, renderForm };
})();
