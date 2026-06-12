/* ============================================
   Analytics Dashboard — Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. KPI Number Animation on Load
  // ============================================

  const kpiCards = [
    { id: 'kpi-users', target: 24512, prefix: '', suffix: '', change: '+12%', positive: true },
    { id: 'kpi-revenue', target: 48320, prefix: '$', suffix: '', change: '+8.3%', positive: true, isCurrency: true },
    { id: 'kpi-sessions', target: 1847, prefix: '', suffix: '', change: '-3.2%', positive: false },
    { id: 'kpi-bounce', target: 24.8, prefix: '', suffix: '%', change: '-5.1%', positive: false, isDecimal: true }
  ];

  const DURATION = 2000; // 2 seconds

  function animateKPI(cardInfo) {
    const card = document.getElementById(cardInfo.id);
    if (!card) return;

    const valueEl = card.querySelector('.kpi-value');
    const changeEl = card.querySelector('.kpi-change');

    // Set change text and color class
    if (changeEl) {
      changeEl.textContent = cardInfo.change;
      changeEl.classList.remove('kpi-positive', 'kpi-negative');
      changeEl.classList.add(cardInfo.positive ? 'kpi-positive' : 'kpi-negative');
    }

    const startTime = performance.now();
    const isDecimal = cardInfo.isDecimal || false;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      // Ease-out cubic easing for smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentValue = ease * cardInfo.target;

      if (isDecimal) {
        valueEl.textContent = cardInfo.prefix + currentValue.toFixed(1) + cardInfo.suffix;
      } else if (cardInfo.isCurrency) {
        valueEl.textContent = cardInfo.prefix + Math.floor(currentValue).toLocaleString() + cardInfo.suffix;
      } else {
        valueEl.textContent = cardInfo.prefix + Math.floor(currentValue).toLocaleString() + cardInfo.suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Final exact value
        if (isDecimal) {
          valueEl.textContent = cardInfo.prefix + cardInfo.target.toFixed(1) + cardInfo.suffix;
        } else if (cardInfo.isCurrency) {
          valueEl.textContent = cardInfo.prefix + cardInfo.target.toLocaleString() + cardInfo.suffix;
        } else {
          valueEl.textContent = cardInfo.prefix + cardInfo.target.toLocaleString() + cardInfo.suffix;
        }
      }
    }

    requestAnimationFrame(update);
  }

  // Start KPI animations
  kpiCards.forEach(animateKPI);


  // ============================================
  // 2. Bar Chart — Revenue Overview
  // ============================================

  const barData = [
    { month: 'Jan', value: 5.2 },
    { month: 'Feb', value: 6.1 },
    { month: 'Mar', value: 7.8 },
    { month: 'Apr', value: 6.9 },
    { month: 'May', value: 8.3 },
    { month: 'Jun', value: 9.1 }
  ];

  const barChartContainer = document.getElementById('bar-chart');
  if (barChartContainer) {
    // Clear existing content
    barChartContainer.innerHTML = '';

    const maxValue = Math.max(...barData.map(d => d.value));
    const maxHeight = 250; // px

    barData.forEach((item, index) => {
      const barWrapper = document.createElement('div');
      barWrapper.style.flex = '1';
      barWrapper.style.display = 'flex';
      barWrapper.style.flexDirection = 'column';
      barWrapper.style.alignItems = 'center';
      barWrapper.style.justifyContent = 'flex-end';
      barWrapper.style.minWidth = '30px';

      const bar = document.createElement('div');
      bar.className = 'bar';
      const targetHeight = (item.value / maxValue) * maxHeight;
      bar.style.height = '0px';
      bar.style.width = '100%';
      bar.style.background = 'var(--accent-blue)';
      bar.style.borderRadius = '4px 4px 0 0';
      bar.style.transition = 'height 1s ease-out';
      bar.style.position = 'relative';
      bar.style.cursor = 'pointer';

      // Tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'bar-tooltip';
      tooltip.textContent = item.value + 'k';
      tooltip.style.position = 'absolute';
      tooltip.style.top = '-30px';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.background = 'var(--bg-body)';
      tooltip.style.color = 'var(--text-primary)';
      tooltip.style.padding = '4px 8px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '0.75rem';
      tooltip.style.whiteSpace = 'nowrap';
      tooltip.style.opacity = '0';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.transition = 'opacity 0.2s ease';
      tooltip.style.boxShadow = 'var(--shadow-sm)';

      bar.appendChild(tooltip);

      // Hover events for tooltip
      bar.addEventListener('mouseenter', () => { tooltip.style.opacity = '1'; });
      bar.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });

      barWrapper.appendChild(bar);
      barChartContainer.appendChild(barWrapper);

      // Animate height after a small staggered delay
      setTimeout(() => {
        bar.style.height = targetHeight + 'px';
      }, 100 + index * 100);
    });
  }


  // ============================================
  // 3. Donut Chart — Traffic Sources (SVG)
  // ============================================

  const donutData = [
    { label: 'Organic', value: 42, color: '#4ade80' },
    { label: 'Direct', value: 28, color: '#60a5fa' },
    { label: 'Referral', value: 18, color: '#fbbf24' },
    { label: 'Social', value: 12, color: '#f87171' }
  ];

  const donutContainer = document.getElementById('donut-chart');
  const legendContainer = document.querySelector('.chart-legend');

  if (donutContainer) {
    donutContainer.innerHTML = '';

    const svgSize = 220;
    const cx = 100;
    const cy = 100;
    const radius = 40;
    const strokeWidth = 25;
    const circumference = 2 * Math.PI * radius; // ~251.327

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.style.maxWidth = '100%';
    svg.style.maxHeight = '100%';

    let cumulativePercent = 0;

    donutData.forEach((segment, index) => {
      const segmentLength = (segment.value / 100) * circumference;
      const dashArray = `${segmentLength} ${circumference}`;
      const initialOffset = circumference;
      const finalOffset = circumference - segmentLength;

      // Calculate rotation: start from top (-90deg) plus cumulative angle
      const startAngle = -90 + (cumulativePercent * 3.6);
      cumulativePercent += segment.value;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', radius);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', segment.color);
      circle.setAttribute('stroke-width', strokeWidth);
      circle.setAttribute('stroke-dasharray', dashArray);
      circle.setAttribute('stroke-dashoffset', initialOffset);
      circle.setAttribute('transform', `rotate(${startAngle}, ${cx}, ${cy})`);
      circle.style.transition = 'stroke-dashoffset 1.2s ease-out';
      circle.style.transformBox = 'fill-box';
      circle.style.transformOrigin = 'center';

      svg.appendChild(circle);

      // Animate after a short delay
      setTimeout(() => {
        circle.setAttribute('stroke-dashoffset', finalOffset);
      }, 300 + index * 150);
    });

    // Center hole circle for donut effect
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', cx);
    centerCircle.setAttribute('cy', cy);
    centerCircle.setAttribute('r', radius - strokeWidth / 2 + 2);
    centerCircle.setAttribute('fill', 'var(--bg-card)');
    svg.appendChild(centerCircle);

    donutContainer.appendChild(svg);
  }

  // Build legend
  if (legendContainer) {
    legendContainer.innerHTML = '';
    donutData.forEach(segment => {
      const item = document.createElement('div');
      item.className = 'legend-item';

      const colorBox = document.createElement('span');
      colorBox.className = 'legend-color';
      colorBox.style.background = segment.color;

      const label = document.createElement('span');
      label.textContent = `${segment.label} ${segment.value}%`;

      item.appendChild(colorBox);
      item.appendChild(label);
      legendContainer.appendChild(item);
    });
  }


  // ============================================
  // 4. Users Table — Populate & Live Search
  // ============================================

  const users = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '10:30 AM' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', lastLogin: '9:22 AM' },
    { name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer', status: 'Inactive', lastLogin: 'Yesterday' },
    { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Editor', status: 'Active', lastLogin: '2:15 PM' },
    { name: 'Tom Brown', email: 'tom@example.com', role: 'Admin', status: 'Active', lastLogin: 'Just now' }
  ];

  const tbody = document.querySelector('.users-table tbody');
  if (tbody) {
    tbody.innerHTML = '';

    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.className = 'user-row';

      const statusClass = user.status === 'Active' ? 'badge-active' : 'badge-inactive';

      tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><span class="status-badge ${statusClass}">${user.status}</span></td>
        <td>${user.lastLogin}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Live search
  const searchInput = document.getElementById('user-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('.users-table tbody tr.user-row');

      rows.forEach(row => {
        const name = row.children[0].textContent.toLowerCase();
        const email = row.children[1].textContent.toLowerCase();
        const match = name.includes(query) || email.includes(query);
        row.style.display = match ? '' : 'none';
      });
    });
  }


  // ============================================
  // 5. Activity Feed
  // ============================================

  const feedItems = [
    { text: 'New user registered', time: '2 min ago' },
    { text: 'Sales report generated', time: '15 min ago' },
    { text: 'Server update completed', time: '1 hour ago' },
    { text: 'Payment received', time: '3 hours ago' },
    { text: 'System backup finished', time: '1 day ago' }
  ];

  const feedList = document.querySelector('.feed-list');
  if (feedList) {
    feedList.innerHTML = '';

    feedItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'feed-item';
      div.innerHTML = `
        <span class="feed-time">${item.time}</span>
        <span class="feed-text">${item.text}</span>
      `;
      feedList.appendChild(div);
    });
  }


  // ============================================
  // 6. Notification Bell
  // ============================================

  const bell = document.querySelector('.notification-bell');
  if (bell) {
    bell.addEventListener('click', () => {
      alert('You have 3 new notifications!');
    });
  }


  // ============================================
  // 7. Sidebar Active State
  // ============================================

  const navLinks = document.querySelectorAll('.sidebar-nav a.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Prevent default only for demo; in real app some may navigate
      // e.preventDefault();

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

}); // end DOMContentLoaded
