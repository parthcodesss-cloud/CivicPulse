/* ============================================
   CivicPulse — Scroll Reveal + Counter Engine
   Uses Intersection Observer — no libraries.
   ============================================ */

const ScrollReveal = (() => {
    'use strict';

    let observer = null;

    function init() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show everything immediately
            document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger')
                .forEach(el => el.classList.add('visible'));
            return;
        }

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Trigger counter animations inside this element
                    entry.target.querySelectorAll('[data-counter]').forEach(counter => {
                        animateCounter(counter);
                    });

                    // Also check if the element itself is a counter
                    if (entry.target.hasAttribute('data-counter')) {
                        animateCounter(entry.target);
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        // Observe all reveal elements
        document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger')
            .forEach(el => observer.observe(el));
    }

    // ── Animated Number Counter ──
    function animateCounter(el) {
        if (el.dataset.animated === 'true') return;
        el.dataset.animated = 'true';

        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.counterSuffix || '';
        const prefix = el.dataset.counterPrefix || '';
        const duration = parseInt(el.dataset.counterDuration) || 1500;
        const isFloat = String(target).includes('.');

        let start = 0;
        const startTime = performance.now();

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);

            const current = start + (target - start) * easedProgress;

            if (isFloat) {
                el.textContent = prefix + current.toFixed(1) + suffix;
            } else {
                el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isFloat) {
                    el.textContent = prefix + target.toFixed(1) + suffix;
                } else {
                    el.textContent = prefix + target.toLocaleString() + suffix;
                }
            }
        }

        requestAnimationFrame(update);
    }

    // ── Skeleton Loading Helpers ──
    function showSkeletons(container, count, type = 'card') {
        if (!container) return;

        const skeletons = [];
        for (let i = 0; i < count; i++) {
            skeletons.push(`<div class="skeleton skeleton-${type}"></div>`);
        }
        container.innerHTML = skeletons.join('');
    }

    function showStatSkeletons(container, count = 4) {
        if (!container) return;

        const skeletons = [];
        for (let i = 0; i < count; i++) {
            skeletons.push(`<div class="skeleton skeleton-stat"></div>`);
        }
        container.innerHTML = skeletons.join('');
    }

    // ── Confetti Animation ──
    function launchConfetti(duration = 2500) {
        const canvas = document.createElement('canvas');
        canvas.className = 'confetti-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const particles = [];
        const colors = ['#10b981', '#34d399', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444'];

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                vx: (Math.random() - 0.5) * 8,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 3,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }

        const startTime = performance.now();

        function animate(time) {
            const elapsed = time - startTime;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.vy += 0.08;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                if (elapsed > duration * 0.6) {
                    p.opacity = Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4));
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            });

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        }

        requestAnimationFrame(animate);
    }

    // ── CSV Export ──
    function exportToCSV(data, filename = 'civicpulse_reports.csv') {
        if (!data || data.length === 0) {
            Components.showToast('No data to export.', 'warning');
            return;
        }

        const headers = ['Report ID', 'Title', 'Category', 'Location', 'Severity', 'Status', 'Confirmations', 'Date Reported'];
        const rows = data.map(report => {
            const cat = CivicUtils.getCategoryById(report.category);
            return [
                report.id,
                `"${report.title.replace(/"/g, '""')}"`,
                cat.label,
                `"${report.location}"`,
                report.severity,
                report.status,
                report.confirmations,
                new Date(report.createdAt).toLocaleDateString('en-IN')
            ].join(',');
        });

        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Components.showToast(`Exported ${data.length} reports to CSV`, 'success', 'Export Complete');
    }

    return {
        init,
        animateCounter,
        showSkeletons,
        showStatSkeletons,
        launchConfetti,
        exportToCSV
    };
})();
