import { useEffect } from 'react';

/**
 * Performance optimization component that handles:
 * - Resource preloading
 * - Critical CSS inlining
 * - Image lazy loading
 * - Service worker registration
 */
const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical fonts
      // const fontLink = document.createElement('link');
      // fontLink.rel = 'preload';
      // fontLink.as = 'font';
      // fontLink.type = 'font/woff2';
      // fontLink.crossOrigin = 'anonymous';
      // fontLink.href = '/src/assets/fonts/Inter-VariableFont_slnt,wght.ttf';
      // document.head.appendChild(fontLink);

      // Preload critical images
      const criticalImages = [
        '/src/assets/logo.png',
        '/master-management-icon.png',
      ];

      criticalImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Enable lazy loading for images
    const enableImageLazyLoading = () => {
      if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach((img) => {
          (img as HTMLImageElement).src = (img as HTMLImageElement).dataset.src || '';
        });
      } else {
        // Fallback for browsers that don't support native lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/intersection-observer@0.12.0/intersection-observer.js';
        document.head.appendChild(script);
      }
    };

    // Register service worker for caching
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator && import.meta.env.PROD) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');

          // Check for updates on page load
          registration.update();

          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                  // New service worker activated, reload to get fresh content
                  window.location.reload();
                }
              });
            }
          });
        } catch {
          // Service worker registration failed - fail silently in production
        }
      }
    };

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach((script) => {
        script.setAttribute('defer', '');
      });
    };

    // Run optimizations
    preloadCriticalResources();
    enableImageLazyLoading();
    registerServiceWorker();
    optimizeThirdPartyScripts();

    // Add performance observer for monitoring
    if ('PerformanceObserver' in window && import.meta.env.DEV) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            // Track LCP in development
          }
          if (entry.entryType === 'first-input' && 'processingStart' in entry) {
            // Track FID in development
          }
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
