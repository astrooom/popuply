(function () {
  // CSS Styles
  const styles = `
    #popuply-popup-container {
      position: fixed;
      top: 70px;
      right: 20px;
      z-index: 9999;
    }
    .popuply-popup {
      border-radius: 12px;
      padding: 8px 9px;
      width: 370px;
      height: auto;
      display: flex;
      align-items: stretch;
      position: relative;
      margin-bottom: 10px;
      animation: popupEntrance 0.3s ease-out forwards;
      transition: transform 0.3s ease-out, margin-top 0.3s ease-out;
    }
    .popuply-popup.initial {
      opacity: 0.2;
      transform: translateX(10px);
    }
    @keyframes popupEntrance {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    .popuply-popup.light {
      background-color: #ffffff;
      color: #333333;
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
    }
    .popuply-popup.dark {
      background-color: #333333;
      color: #ffffff;
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.5);
    }
    .popuply-popup .image-container {
      flex: 0 0 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }
    .popuply-popup .image-container img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
    }
    .popuply-popup .content-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .popuply-popup.no-icon .content-container {
      margin-left: 10px;
    }
    .popuply-popup h3 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: bold;
    }
    .popuply-popup p {
      font-size: 14px;
    }
    .popuply-popup a {
      color: #007bff;
      text-decoration: none;
    }
    .popuply-popup .timestamp {
      position: absolute;
      top: 6px;
      right: 12px;
      font-size: 13px;
      opacity: 0.6;
    }
    .popuply-popup.clickable {
      cursor: pointer;
      transition: transform 0.1s ease-in-out;
    }
    .popuply-popup.clickable:hover {
      transform: scale(1.02);
    }
    .popuply-popup.hiding {
      animation: popupExit 0.3s ease-in forwards;
    }
    @keyframes popupExit {
      to {
        opacity: 0;
        transform: translateX(200px);
      }
    }
    .popuply-popup.moving-up {
      animation: moveUp 0.3s ease-out forwards;
    }
    @keyframes moveUp {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(-67px);
      }
    }

    @media (max-width: 768px) {
      #popuply-popup-container {
        top: 10px;
        right: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .popuply-popup {
        width: 90%;
        max-width: 370px;
        margin-bottom: 8px;
      }
      .popuply-popup.initial {
        opacity: 0.2;
        transform: translateY(-20px);
      }
      @keyframes popupEntrance {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .popuply-popup.hiding {
        animation: popupExitMobile 0.3s ease-in forwards;
      }
      @keyframes popupExitMobile {
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
    }
  `;

  // Inject styles
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  // Configuration
  const POPUP_CONTAINER_ID = 'popuply-popup-container';

  // Utility functions
  function createPopupContainer() {
    const container = document.createElement('div');
    container.id = POPUP_CONTAINER_ID;
    document.body.appendChild(container);
    return container;
  }

  function createPopupElement(popup, cdnUrl) {
    const element = document.createElement('div');
    element.className = `popuply-popup ${popup.theme} initial`;

    if (!popup.icon_url) {
      element.className += ' no-icon';
    }

    if (popup.link_url) {
      element.className += ' clickable';
      element.addEventListener('click', (event) => {
        event.preventDefault();
        window.open(popup.link_url, '_blank');
      });
    }

    let content = `
      <div class="content-container">
        <h3>${popup.title}</h3>
        <p>${popup.content}</p>
      </div>
      ${popup.timestamp ? `<div class="timestamp">${popup.timestamp}</div>` : ''}
    `;

    if (popup.icon_url) {
      // Check if the icon_url is a full URL
      const iconUrl = popup.icon_url.startsWith('http') ? popup.icon_url : `${cdnUrl}/${popup.icon_url}`;
      content = `
        <div class="image-container">
          <img src="${iconUrl}" alt="Icon">
        </div>
      ` + content;
    }

    element.innerHTML = content;
    return element;
  }

  // Unified popup display function
  function displayPopup(popup, container, cdnUrl, isMobile) {
    const popupElement = createPopupElement(popup, cdnUrl);
    container.appendChild(popupElement);

    // Remove 'initial' class after a short delay to trigger entrance animation
    setTimeout(() => {
      popupElement.classList.remove('initial');
    }, 50);

    setTimeout(() => {
      popupElement.classList.add('hiding');
      popupElement.addEventListener('animationend', () => {
        const remainingPopups = container.querySelectorAll('.popuply-popup:not(.hiding)');
        remainingPopups.forEach(popup => {
          popup.classList.add('moving-up');
        });
        setTimeout(() => {
          container.removeChild(popupElement);
          remainingPopups.forEach(popup => popup.classList.remove('moving-up'));
        }, 300); // Match this with the moveUp animation duration
      }, { once: true });
    }, popup.duration || 5000);
  }

  // Main functionality
  async function initializePopups(siteId, apiUrl, cdnUrl) {
    try {
      const response = await fetch(`${apiUrl}/${siteId}`);
      const data = await response.json();
      const siteData = data.data;

      // Early check if popups should be shown based on page rules.
      const urlPath = new URL(window.location.href).pathname;
      if (!shouldShowPopups(urlPath, siteData.pageRuleType, siteData.pageRulePatterns)) {
        return; // Exit early if popups shouldn't be shown
      }

      let popups = siteData.popups;
      if (siteData.orderMode === 'randomized') {
        popups = popups.sort(() => Math.random() - 0.5);
      }
      await preloadImages(popups, cdnUrl);
      const container = createPopupContainer();
      let currentIndex = 0;
      const isMobile = window.innerWidth <= 768;

      function showNextPopup() {
        if (currentIndex < popups.length) {
          const popup = popups[currentIndex];
          displayPopup(popup, container, cdnUrl, isMobile);
          currentIndex++;
          setTimeout(showNextPopup, siteData.frequency);
        }
      }

      setTimeout(showNextPopup, siteData.startAfter);

      // Initialize SSE for real-time popups (if webhooks are enabled)
      if (siteData.enableWebhook) {
        initializeSSE(siteId, apiUrl, container, cdnUrl, isMobile);
      }
    } catch (error) {
      console.error('Error initializing popups:', error);
    }
  }

  // SSE initialization - attempt reconnection if connection is lost
  function initializeSSE(siteId, apiUrl, container, cdnUrl, isMobile) {
    let eventSource;
    let retryCount = 0;
    const maxRetryCount = 5;
    const initialRetryDelay = 2000; // 2 seconds

    function connect() {
      eventSource = new EventSource(`${apiUrl}/${siteId}/sse`);

      eventSource.onmessage = function (event) {
        console.log('SSE message:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'show_popup') {
            displayPopup(data.popup, container, cdnUrl, isMobile);
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = function (error) {
        console.error('SSE connection error:', error);
        eventSource.close();

        if (retryCount < maxRetryCount) {
          const delay = initialRetryDelay * Math.pow(2, retryCount);
          console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);
          setTimeout(connect, delay);
          retryCount++;
        } else {
          console.error('Max retry attempts reached. Please refresh the page.');
          // Optionally, notify the user to refresh the page
        }
      };

      eventSource.onopen = function () {
        console.log('SSE connection opened');
        retryCount = 0; // Reset retry count on successful connection
      };
    }

    // Initial connection
    connect();
  }

  function shouldShowPopups(path, pageRuleType, pageRulePatterns) {
    const matchesPattern = pageRulePatterns.some(pageRulePatterns => path.includes(pageRulePatterns));
    return pageRuleType === 'blacklist' ? !matchesPattern : matchesPattern;
  }

  // Image preloading function
  async function preloadImages(popups, cdnUrl) {
    const imagePromises = popups
      .filter(popup => popup.icon_url)
      .map(popup => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = `${cdnUrl}/${popup.icon_url}`;
        });
      });
    await Promise.all(imagePromises);
  }

  // Script initialization
  const script = document.currentScript;
  const siteId = script.getAttribute('data-site-id');
  const apiUrl = script.getAttribute('data-api-url') || 'https://popuply.net/api/external/sites';
  const cdnUrl = script.getAttribute('data-cdn-url') || 'https://popuply.b-cdn.net';

  // Print apiUrl
  console.log('Popuply: API URL:', apiUrl);

  if (siteId) {
    initializePopups(siteId, apiUrl, cdnUrl);
  } else {
    console.error('Popuply: No site ID provided');
  }
})();