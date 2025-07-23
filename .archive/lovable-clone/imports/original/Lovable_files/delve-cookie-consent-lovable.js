/**
 * Delve Cookie Consent
 * A delve.co-themed cookie consent banner with automatic blocking
 * Version: 3.0.0
 *
 * Built for compliance-minded teams who appreciate good design.
 * Now with automatic script blocking, cookie management, and config-driven services.
 *
 * Regional Support:
 * - GDPR regions: Always show banner (no config needed)
 * - CCPA (California): Set ccpaEnabled: true to show banner
 * - Non-regulated regions: Set showInNonRegulatedRegions: true to show banner
 * - Default: Only GDPR regions see the banner
 */

(function (window, document) {
  "use strict";

  // Script and Cookie Blocking System
  class BlockingManager {
    static originalCreateElement = null;
    static originalCookieDescriptor = null;
    static blockedCookies = new Set();
    static enabledCategories = new Set(["necessary"]);

    static init() {
      this.interceptScripts();
      this.interceptCookies();
    }

    static interceptScripts() {
      if (this.originalCreateElement) return;

      this.originalCreateElement = document.createElement;
      document.createElement = function (tagName) {
        const element = BlockingManager.originalCreateElement.call(
          this,
          tagName
        );

        if (tagName.toLowerCase() === "script") {
          const originalSrcSetter = Object.getOwnPropertyDescriptor(
            HTMLScriptElement.prototype,
            "src"
          )?.set;
          if (originalSrcSetter) {
            Object.defineProperty(element, "src", {
              set: function (value) {
                const category = this.dataset.category;
                if (
                  category &&
                  !BlockingManager.enabledCategories.has(category)
                ) {
                  // console.log(`🚫 Blocked script: ${value} (${category})`);
                  return;
                }
                originalSrcSetter.call(this, value);
              },
              get: function () {
                return this.getAttribute("src");
              },
            });
          }
        }

        return element;
      };
    }

    static interceptCookies() {
      if (this.originalCookieDescriptor) return;

      this.originalCookieDescriptor = Object.getOwnPropertyDescriptor(
        Document.prototype,
        "cookie"
      );

      Object.defineProperty(document, "cookie", {
        get: this.originalCookieDescriptor.get,
        set: function (value) {
          const cookieName = value.split("=")[0].trim();
          const cookieCategory = BlockingManager.getCookieCategory(cookieName);

          if (
            cookieCategory &&
            !BlockingManager.enabledCategories.has(cookieCategory)
          ) {
            // console.log(`🚫 Blocked cookie: ${cookieName} (${cookieCategory})`);
            return;
          }

          BlockingManager.originalCookieDescriptor.set.call(this, value);
        },
      });
    }

    static getCookieCategory(cookieName) {
      // Check each configured category for matching cookies
      for (const [categoryKey, categoryConfig] of Object.entries(
        config.categories
      )) {
        if (categoryConfig.cookies) {
          for (const cookiePattern of categoryConfig.cookies) {
            if (
              cookiePattern instanceof RegExp &&
              cookiePattern.test(cookieName)
            ) {
              return categoryKey;
            }
            if (
              typeof cookiePattern === "string" &&
              cookiePattern === cookieName
            ) {
              return categoryKey;
            }
          }
        }
      }

      // If no category matches, assume it's necessary (don't block)
      return null;
    }

    static updateConsent(categories) {
      this.enabledCategories = new Set(
        Object.keys(categories).filter((key) => categories[key].enabled)
      );

      // Process script tags with data-category
      this.processScriptTags(categories);

      // Clear cookies for disabled categories
      this.clearCookiesForDisabledCategories(categories);
    }

    static processScriptTags(categories) {
      const scripts = document.querySelectorAll("script[data-category]");

      scripts.forEach((script) => {
        const category = script.dataset.category;
        const isNegated = category.startsWith("!");
        const actualCategory = isNegated ? category.slice(1) : category;

        const categoryEnabled = categories[actualCategory]?.enabled;
        const shouldRun = isNegated ? !categoryEnabled : categoryEnabled;

        if (shouldRun && script.type === "text/plain") {
          // Enable script
          const newScript = document.createElement("script");

          // Copy attributes
          Array.from(script.attributes).forEach((attr) => {
            if (attr.name !== "type") {
              newScript.setAttribute(attr.name, attr.value);
            }
          });

          // Set type
          const customType = script.dataset.type;
          newScript.type = customType || "text/javascript";

          // Copy content or src
          if (script.src || script.dataset.src) {
            newScript.src = script.src || script.dataset.src;
          } else {
            newScript.textContent = script.textContent;
          }

          script.parentNode?.replaceChild(newScript, script);

          // console.log(`✅ Enabled script: ${actualCategory}`);
        }
      });
    }

    static clearCookiesForDisabledCategories(categories) {
      Object.keys(categories).forEach((categoryKey) => {
        const categoryConfig = categories[categoryKey];

        // If category is disabled and has cookies defined, clear them
        if (!categoryConfig.enabled && categoryConfig.cookies) {
          categoryConfig.cookies.forEach((cookiePattern) => {
            this.clearCookiesByPattern(cookiePattern);
          });
        }
      });
    }

    static clearCookiesByPattern(pattern) {
      const cookies = document.cookie.split(";");

      cookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        let shouldDelete = false;

        if (pattern instanceof RegExp) {
          shouldDelete = pattern.test(cookieName);
        } else if (typeof pattern === "string") {
          shouldDelete = pattern === cookieName;
        }

        if (shouldDelete) {
          this.deleteCookie(cookieName);
        }
      });
    }

    static deleteCookie(name, domain = "", path = "/") {
      const domainStr = domain ? `; domain=${domain}` : "";
      const pathStr = path ? `; path=${path}` : "";

      // Delete for current domain
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC${pathStr}${domainStr}`;

      // Delete for parent domain if no domain specified
      if (!domain) {
        const hostname = window.location.hostname;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC${pathStr}; domain=${hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC${pathStr}; domain=.${hostname}`;
      }

      // console.log(`🗑️ Deleted cookie: ${name}`);
    }
  }

  // Delve.co brand colors and styling
  const DELVE_STYLES = `
        .delve-cookie-banner * {
            box-sizing: border-box;
        }
        
        .delve-cookie-banner {
            position: fixed;
            bottom: 20px;
            right: 20px;
            transform: translateY(100px);
            background: #FCFBF8;
            border: 1px solid #E5E7EB;
            border-radius: 1.75rem;
            padding: 20px;
            max-width: 300px;
            width: calc(100vw - 40px);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            color: #374151;
            z-index: 999999;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(0, 0, 0, 0.08);
            backdrop-filter: blur(8px);
            overflow: hidden;
            /* Reset properties to prevent inheritance */
            margin: 0;
            line-height: 1.4;
            font-size: 0.875rem;
            text-align: left;
            vertical-align: baseline;
            direction: ltr;
            letter-spacing: normal;
            word-spacing: normal;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-cookie-banner {
                background: hsl(0 0% 11%);
                border: 1px solid hsl(0 0% 20%);
                color: #F9FAFB;
            }
        }
        
        .delve-cookie-banner.show {
            transform: translateY(0);
        }
        
        .delve-cookie-banner.hiding {
            transform: translateY(120px);
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
        }
        
        .delve-banner-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .delve-banner-header {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .delve-banner-icon {
            display: none;
        }
        
        .delve-banner-text {
            flex: 1;
        }
        
        .delve-banner-title {
            font-size: 1.125rem;
            font-weight: 600;
            margin: 0;
            color: #1B1B1B;
            display: block;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-banner-title {
                color: #F9FAFB;
            }
        }
        
        .delve-banner-message {
            font-size: 0.8125rem;
            line-height: 1.4;
            margin: 0;
            color: #6B7280;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-banner-message {
                color: #D1D5DB;
            }
        }
        
        .delve-privacy-link {
            font-size: 0.75rem;
            color: #3B82F6;
            text-decoration: none;
            margin: 0;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-privacy-link {
                color: #FFFFFF;
            }
        }
        
        .delve-privacy-link:hover {
            text-decoration: underline;
        }
        
        .delve-preferences-link {
            font-size: 0.8125rem;
            color: #6B7280;
            text-decoration: underline;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-preferences-link {
                color: #D1D5DB;
            }
        }
        
        .delve-preferences-link:hover {
            color: #374151;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-preferences-link:hover {
                color: #F9FAFB;
            }
        }
        
        .delve-banner-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .delve-banner-footer {
            padding: 16px 0 0 0;
            margin-top: 20px;
            text-align: center;
        }
        
        .delve-banner-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        
        .delve-banner-brand-text {
            font-size: 0.6875rem;
            color: #9CA3AF;
        }
        
        .delve-banner-brand-logo {
            width: 60px;
            height: 18px;
            flex-shrink: 0;
            display: inline-block;
            vertical-align: middle;
            margin-left: 1px;
            margin-top: -3px;
        }
        
        .delve-banner-brand-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            vertical-align: middle;
        }
        
        .delve-banner-brand-logo svg {
            width: 60px;
            height: 18px;
            fill: currentColor;
            vertical-align: middle;
        }
        
        .delve-banner-brand-link {
            color: #3B82F6;
            text-decoration: none;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-banner-brand-link {
                color: #FFFFFF;
            }
        }
        
        .delve-banner-brand-link:hover {
            text-decoration: underline;
        }
        
        /* Auto-accept progress bar - removed */
        
        .delve-btn {
            padding: 0.625rem 0.875rem;
            border: none;
            border-radius: 20px;
            font-size: 0.8125rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            min-height: 2.25rem;
            width: 100%;
            outline: none;
        }
        
        .delve-btn:focus-visible {
            outline: 2px solid #3B82F6;
            outline-offset: 2px;
        }
        
        .delve-btn-primary {
            background: #1B1B1B;
            color: white;
            border: none;
        }
        
        .delve-btn-primary:hover {
            background: #383838;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-btn-primary {
                background: #FFFFFF;
                color: #1B1B1B;
                border: none;
            }
            
            .delve-btn-primary:hover {
                background: #E5E7EB;
                box-shadow: 0 2px 8px rgba(255, 255, 255, 0.15);
            }
        }
        
        .delve-btn-secondary {
            background: #F7F4ED;
            color: #374151;
            border: none;
        }
        
        .delve-btn-secondary:hover {
            background: #EDE8DF;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-btn-secondary {
                background: hsl(0 0% 20%);
                color: #D1D5DB;
                border: none;
            }
            
            .delve-btn-secondary:hover {
                background: hsl(0 0% 25%);
                box-shadow: 0 2px 6px rgba(255, 255, 255, 0.05);
            }
        }
        
        .delve-btn-tertiary {
            background: transparent;
            color: #6B7280;
            border: 1px solid #E5E7EB;
        }
        
        .delve-btn-tertiary:hover {
            background: #F9FAFB;
            color: #374151;
            border-color: #9CA3AF;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-btn-tertiary {
                background: transparent;
                color: #D1D5DB;
                border: 1px solid hsl(0 0% 30%);
            }
            
            .delve-btn-tertiary:hover {
                background: hsl(0 0% 15%);
                color: #F9FAFB;
                border-color: hsl(0 0% 40%);
                box-shadow: 0 2px 6px rgba(255, 255, 255, 0.04);
            }
        }
        

        
        /* Settings Sheet */
        .delve-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0);
            z-index: 1000000;
            display: none;
            backdrop-filter: none;
            overflow: hidden;
            touch-action: none;
            transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
        }
        
        .delve-settings-overlay.show {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-settings-overlay.show {
                background: rgba(0, 0, 0, 0.7);
            }
        }
        
        .delve-settings-modal {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            background: #FCFBF8;
            border-radius: 20px 0 0 20px;
            width: 450px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }
        
        .delve-settings-overlay.show .delve-settings-modal {
            transform: translateX(0);
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-settings-modal {
                background: hsl(0 0% 11%);
                color: #F9FAFB;
            }
        }
        
        .delve-settings-content {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
            touch-action: pan-y;
        }
        
        .delve-settings-close {
            position: absolute;
            top: 20px;
            left: 20px;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 8px;
            color: #6B7280;
            transition: color 0.2s ease;
            z-index: 10;
        }
        
        .delve-settings-close:hover {
            color: #1B1B1B;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-settings-close {
                color: #9CA3AF;
            }
            
            .delve-settings-close:hover {
                color: #F9FAFB;
            }
        }
        
        .delve-settings-header {
            padding: 60px 32px 24px 32px;
        }
        
        .delve-settings-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0 0 16px 0;
            color: #1B1B1B;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-settings-title {
                color: #F9FAFB;
            }
        }
        
        .delve-settings-subtitle {
            font-size: 0.9375rem;
            color: #374151;
            margin: 0 0 16px 0;
            line-height: 1.5;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-settings-subtitle {
                color: #E5E7EB;
            }
        }
        
        .delve-settings-info {
            font-size: 0.875rem;
            color: #6B7280;
            margin: 0;
            line-height: 1.5;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-settings-info {
                color: #9CA3AF;
            }
        }
        
        .delve-settings-info a {
            color: inherit;
            text-decoration: underline;
        }
        
        .delve-settings-info a:hover {
            text-decoration: underline;
        }
        
        .delve-categories-container {
            padding: 0 32px;
        }
        
        .delve-category {
            /* No borders */
        }
        
        .delve-category-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 0;
            cursor: default;
        }
        
        .delve-category-header[data-expandable="true"] {
            cursor: pointer;
        }
        
        .delve-category-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .delve-category-icon {
            position: relative;
            width: 16px;
            height: 16px;
            color: #6B7280;
            user-select: none;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-category-icon {
                color: #9CA3AF;
            }
        }
        
        .delve-category-icon svg {
            position: absolute;
            top: 0;
            left: 0;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        
        .delve-category-icon .icon-plus {
            opacity: 1;
            transform: scale(1);
        }
        
        .delve-category-icon .icon-minus {
            opacity: 0;
            transform: scale(0.8);
        }
        
        .delve-category.expanded .delve-category-icon .icon-plus {
            opacity: 0;
            transform: scale(0.8);
        }
        
        .delve-category.expanded .delve-category-icon .icon-minus {
            opacity: 1;
            transform: scale(1);
        }
        
        .delve-category-name {
            font-size: 1rem;
            font-weight: 500;
            color: #1B1B1B;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-category-name {
                color: #F9FAFB;
            }
        }
        
        .delve-category-status {
            font-size: 0.875rem;
            color: #10B981;
            font-weight: 500;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-category-status {
                color: #34D399;
            }
        }
        
        .delve-toggle {
            position: relative;
            width: 48px;
            height: 26px;
            background: #E5E7EB;
            border-radius: 13px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            flex-shrink: 0;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-toggle {
                background: hsl(0 0% 30%);
            }
            
            .delve-toggle.enabled {
                background: #FFFFFF;
            }
            
            .delve-toggle.disabled-permanent {
                background: hsl(0 0% 20%);
                cursor: not-allowed;
            }
        }
        
        .delve-toggle.enabled {
            background: #10B981;
        }
        
        .delve-toggle.disabled-permanent {
            background: #F3F4F6;
            cursor: not-allowed;
        }
        
        .delve-toggle-thumb {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            will-change: transform;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-toggle.enabled .delve-toggle-thumb {
                background: hsl(0 0% 11%);
            }
        }
        
        .delve-toggle.enabled .delve-toggle-thumb {
            transform: translateX(22px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        
        .delve-category-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .delve-category.expanded .delve-category-content {
            max-height: 200px;
        }
        
        .delve-category-content-inner {
            opacity: 0;
            clip-path: inset(0 0 100% 0);
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .delve-category.expanded .delve-category-content-inner {
            opacity: 1;
            clip-path: inset(0 0 0 0);
        }
        
        .delve-category-description {
            font-size: 0.875rem;
            color: #6B7280;
            line-height: 1.5;
            margin: 0 0 20px 0;
            padding-left: 26px;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-category-description {
                color: #9CA3AF;
            }
        }
        
        .delve-settings-actions {
            padding: 20px 32px 24px 32px;
            display: flex;
            gap: 16px;
            justify-content: center;
            background: #FCFBF8;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-settings-actions {
                background: hsl(0 0% 11%);
            }
        }
        
        .delve-settings-actions .delve-btn {
            flex: 1;
            max-width: 250px;
        }
        
        .delve-settings-footer {
            padding: 12px 24px;
            background: #F9FAFB;
            text-align: center;
            border-radius: 0 0 0 20px;
            flex-shrink: 0;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-settings-footer {
                background: hsl(0 0% 8%);
            }
        }
        
        .delve-settings-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        
        .delve-settings-brand-text {
            font-size: 0.6875rem;
            color: #9CA3AF;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-settings-brand-text {
                color: #6B7280;
            }
        }
        
        .delve-brand-footer {
            padding: 16px 24px;
            background: #F9FAFB;
            text-align: center;
            border-radius: 0 0 0 20px;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-brand-footer {
                background: hsl(0 0% 8%);
            }
        }
        
        .delve-brand-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .delve-brand-logo {
            width: 80px;
            height: 24px;
            flex-shrink: 0;
            display: inline-block;
            vertical-align: middle;
            margin-left: 2px;
            margin-bottom: 1px;
        }
        
        .delve-brand-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            vertical-align: middle;
        }
        
        .delve-brand-logo svg {
            width: 80px;
            height: 24px;
            fill: currentColor;
            vertical-align: middle;
        }
        
        .delve-brand-text {
            font-size: 0.75rem;
            color: #9CA3AF;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-brand-text {
                color: #6B7280;
            }
        }
        
        .delve-brand-link {
            color: #3B82F6;
            text-decoration: none;
        }
        
        @media (prefers-color-scheme: dark) {
            .delve-brand-link {
                color: #FFFFFF;
            }
        }
        
        .delve-brand-link:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .delve-cookie-banner {
                bottom: 12px;
                left: 12px;
                right: 12px;
                transform: translateY(100px);
                max-width: none;
                width: auto;
                border-radius: 1.75rem;
                padding: 16px;
            }
            

            
            .delve-cookie-banner.show {
                transform: translateY(0);
            }
            
            .delve-cookie-banner.hiding {
                transform: translateY(120px);
                opacity: 0;
                pointer-events: none;
                visibility: hidden;
            }
            
            .delve-banner-content {
                gap: 16px;
            }
            
            .delve-banner-title {
                font-size: 1.125rem;
            }
            
            .delve-banner-message {
                font-size: 0.8125rem;
                line-height: 1.4;
            }
            
            .delve-preferences-link {
                font-size: 0.8125rem;
                color: #6B7280;
            }
            
            .delve-banner-actions {
                gap: 10px;
            }
            
            .delve-btn {
                padding: 0.625rem 0.875rem;
                font-size: 0.8125rem;
                min-height: 2.25rem;
                border-radius: 20px;
                width: 100%;
                font-weight: 500;
            }
            
            .delve-settings-modal {
                width: 100vw;
                max-width: 100vw;
                border-radius: 20px 20px 0 0;
                border-left: none;
                bottom: auto;
                height: 90vh;
                max-height: 90vh;
                transform: translateY(100%);
            }
            
            .delve-settings-overlay.show .delve-settings-modal {
                transform: translateY(0);
            }
            

            
            .delve-settings-close {
                top: 16px;
                left: 16px;
            }
            
            .delve-settings-header {
                padding: 56px 20px 20px 20px;
            }
            
            .delve-settings-title {
                font-size: 1.25rem;
                margin-bottom: 12px;
            }
            
            .delve-settings-subtitle {
                font-size: 0.875rem;
                line-height: 1.5;
                margin-bottom: 12px;
            }
            
            .delve-settings-info {
                font-size: 0.8125rem;
                line-height: 1.5;
            }
            
            .delve-categories-container {
                padding: 0 20px;
            }
            
            .delve-category-header {
                padding: 16px 0;
            }
            
            .delve-category-name {
                font-size: 0.9375rem;
            }
            
            .delve-category-description {
                font-size: 0.8125rem;
                padding-left: 26px;
                margin-bottom: 16px;
            }
            
            .delve-toggle {
                width: 44px;
                height: 24px;
                border-radius: 12px;
            }
            
            .delve-toggle-thumb {
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
            }
            
            .delve-toggle.enabled .delve-toggle-thumb {
                transform: translateX(20px);
            }
            
            .delve-settings-actions {
                padding: 16px 20px 20px 20px;
                flex-direction: row;
                gap: 12px;
            }
            
            .delve-settings-actions .delve-btn {
                flex: 1;
                max-width: none;
                padding: 0.625rem 0.875rem;
                font-size: 0.875rem;
                min-height: 2.25rem;
                font-weight: 500;
            }
            
            .delve-brand-footer {
                border-radius: 0 0 1.75rem 1.75rem;
                padding: 8px 20px;
                margin: 8px -20px -16px -20px;
            }
            
            .delve-banner-footer {
                border-radius: 0 0 1.75rem 1.75rem;
                padding: 16px 0 0 0;
                margin-top: 16px;
            }
            
            .delve-banner-brand-text {
                font-size: 0.625rem;
            }
            
            .delve-settings-footer {
                border-radius: 0;
                padding: 12px 20px;
            }
            
            .delve-settings-brand-text {
                font-size: 0.75rem;
            }
        }
    `;

  // Default configuration
  const defaultConfig = {
    message:
      "We use cookies to improve your experience, personalize content and ads, and optimize our site.",
    acceptText: "Accept all",
    rejectText: "Reject non-essential cookies",
    settingsText: "Learn more or manage",
    privacyPolicyText: "View Privacy Policy",
    privacyPolicyUrl: "https://lovable.dev/privacy",
    cookieName: "delve_cookie_consent",
    expiryDays: 365,
    showRejectButton: true,
    showSettingsButton: true,
    autoShow: true,

    // Auto-blocking options
    manageScriptTags: true,

    // CCPA compliance
    ccpaEnabled: true,

    // Non-regulated regions
    showInNonRegulatedRegions: false, // Show banner in regions without GDPR/CCPA

    // Branding
    showBranding: true,
    brandText: "Powered by",
    brandLink:
      "https://www.delve.co/book-demo?utm_source=cookieconsent&utm_medium=web&utm_campaign=lovable",
    brandName: "Delve",

    // Default cookie table headers (can be overridden per category)
    defaultCookieTableHeaders: {
      name: "Cookie Name",
      purpose: "Purpose",
      duration: "Duration",
    },

    // Categories must be defined by user
    categories: {},

    // Callbacks for developers
    onAccept: function (categories) {
      // console.log('✅ Cookies accepted:', categories);
    },
    onReject: function () {
      // console.log('❌ Non-essential cookies rejected');
    },
    onChange: function (categories) {
      // console.log('⚙️ Cookie preferences changed:', categories);
    },
  };

  // Hardcoded category definitions
  const categoryDefinitions = {
    necessary: {
      name: "Essential",
      description:
        "These secure areas of this website and enable its basic functions, like page navigation. The website can't work properly without these cookies, so you won't be able to turn them on or off.",
      required: true,
    },
    analytics: {
      name: "Analytics",
      description:
        "These help us understand how visitors interact with this website (such as the pages they visit and how long for) by collecting and reporting information anonymously.",
      required: false,
    },
    marketing: {
      name: "Advertising",
      description:
        "These let us track visitors across this website and online, so we can display ads that are relevant and more engaging to you.",
      required: false,
    },
    preferences: {
      name: "Preferences",
      description:
        "These allow this website to remember information that changes the way it behaves or looks, like your preferred language or the region you're in.",
      required: false,
    },
  };

  let config = { ...defaultConfig };
  let banner = null;
  let settingsModal = null;
  let isBannerForced = false; // Track if banner is manually shown

  // Geo Detection Module
  const GeoDetection = {
    API_ENDPOINT: "https://cdn.delve.co/api/geo",
    CACHE_DURATION: 3600000, // 1 hour

    async detect() {
      // Check cache first
      const cached = this.getCached();
      if (cached) {
        // console.log('📍 Using cached geo data:', cached.country);
        return cached;
      }

      try {
        const response = await fetch(this.API_ENDPOINT, {
          method: "GET",
          credentials: "omit", // Important for privacy
        });

        if (!response.ok) {
          throw new Error(`Geo API returned ${response.status}`);
        }

        const data = await response.json();
        this.cache(data);
        // console.log('📍 Detected location:', data.country, `(${data.consentType})`);
        return data;
      } catch (error) {
        // console.warn('⚠️ Geo detection failed:', error.message);
        // Default to GDPR behavior on error
        return {
          requiresConsent: true,
          error: true,
          country: "XX",
          consentType: "gdpr",
        };
      }
    },

    getCached() {
      try {
        const item = sessionStorage.getItem("delve_geo_data");
        if (!item) return null;

        const { data, timestamp } = JSON.parse(item);
        if (Date.now() - timestamp > this.CACHE_DURATION) {
          sessionStorage.removeItem("delve_geo_data");
          return null;
        }

        return data;
      } catch (e) {
        return null;
      }
    },

    cache(data) {
      try {
        sessionStorage.setItem(
          "delve_geo_data",
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );
      } catch (e) {
        // Ignore storage errors
      }
    },
  };

  // Cookie utilities
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function hasConsent() {
    return getCookie(config.cookieName) !== null;
  }

  function getConsentData() {
    const consentCookie = getCookie(config.cookieName);
    if (!consentCookie) return null;

    try {
      return JSON.parse(decodeURIComponent(consentCookie));
    } catch (e) {
      return null;
    }
  }

  function saveConsent(categories) {
    const consentData = {
      timestamp: new Date().toISOString(),
      categories: categories,
    };
    setCookie(
      config.cookieName,
      encodeURIComponent(JSON.stringify(consentData)),
      config.expiryDays
    );
  }

  // Helper function to clear all cookies
  function clearAllCookies() {
    const cookies = document.cookie.split(";").filter((c) => c.trim());

    if (cookies.length > 0) {
      console.log(
        `🗑️ DelveCookieConsent: Clearing ${cookies.length} cookies...`
      );
    }

    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      if (name) {
        // Try to clear for different paths and domains
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;

        // console.log(`  ↳ Cleared: ${name}`);
      }
    });
  }

  function injectStyles() {
    if (document.getElementById("delve-cookie-styles")) return;

    const style = document.createElement("style");
    style.id = "delve-cookie-styles";
    style.textContent = DELVE_STYLES;
    document.head.appendChild(style);
  }

  function getDelveLogoSVG(isDark = false) {
    if (isDark) {
      // Dark mode logo (white)
      return `<svg width="116" height="24" viewBox="0 0 116 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M24.2615 2.29137C24.2615 1.03764 23.366 0.174681 22.1122 0.174681C18.9698 0.174681 15.8273 0.174681 12.6848 0.174681C9.54237 0.174681 6.56272 0.23981 3.50166 0.142117C1.61292 0.0932701 0.847656 1.24931 0.847656 2.82868C0.880221 5.90602 0.847656 8.98336 0.847656 12.077C0.847656 15.1706 0.847656 17.9712 0.847656 20.9182C0.847656 22.3674 1.71061 23.3769 2.96435 23.3769C9.36326 23.3769 15.7622 23.3769 22.1448 23.3769C23.3497 23.3769 24.2452 22.4813 24.2452 21.2764C24.2452 14.9589 24.2452 8.62516 24.2452 2.30765L24.2615 2.29137ZM3.69705 8.99965C4.28321 7.90874 4.95078 6.86668 5.65091 5.8409C6.15566 5.09191 7.1326 4.92909 7.88158 5.38499C8.66313 5.8409 8.95621 6.81783 8.5003 7.63194C7.89786 8.69028 7.24657 9.69978 6.59528 10.7256C6.28592 11.214 5.79745 11.442 5.22757 11.442C3.94128 11.442 3.0946 10.1394 3.69705 8.99965ZM7.00234 20.153C5.63463 20.153 4.85308 18.7853 5.55322 17.5641C6.54643 15.8707 7.60478 14.1937 8.63056 12.5166C10.4053 9.61837 12.1801 6.72014 13.9548 3.8219C14.3782 3.13805 14.8829 2.60073 15.7459 2.64958C17.081 2.73099 17.7649 4.11498 17.0159 5.35243C15.4528 7.97387 13.8409 10.5627 12.2452 13.1516C11.0403 15.138 9.81916 17.1082 8.61428 19.0946C8.23979 19.7134 7.7676 20.1367 7.00234 20.153ZM21.2656 10.7256C20.3863 12.2398 19.442 13.7215 18.5302 15.2195C17.5207 16.8477 16.5274 18.4922 15.5179 20.1041C14.8504 21.1788 13.906 21.4718 13.0105 20.902C12.1475 20.3646 11.9847 19.3714 12.6034 18.3456C14.4922 15.2683 16.3809 12.191 18.2696 9.09734C18.6441 8.47862 19.1326 8.05528 19.8979 8.07156C21.2493 8.07156 21.9983 9.47183 21.2819 10.7093L21.2656 10.7256Z" fill="white"/>
            <path d="M78.9557 6.28113H84.0032C85.1918 10.368 86.3804 14.4222 87.569 18.4928C87.6342 18.4928 87.6993 18.4928 87.7644 18.4928C88.953 14.4222 90.1416 10.368 91.3139 6.29741H96.3777C94.3587 12.0613 92.356 17.7438 90.3859 23.41H84.9313C82.9449 17.7275 80.9584 12.0613 78.9395 6.28113H78.9557Z" fill="white"/>
            <path d="M73.3242 0.455078H77.9158V23.3805H73.3242V0.455078Z" fill="white"/>
            <path d="M53.6811 9.19882C53.1927 6.46341 51.9878 4.10248 49.6594 2.40913C47.9335 1.17168 45.9796 0.520395 43.9118 0.455266C40.7856 0.34129 37.6431 0.422701 34.4355 0.422701V23.3806C34.6147 23.4132 34.7449 23.4458 34.8752 23.4458C38.1153 23.3969 41.3718 23.5109 44.6119 23.2504C48.7639 22.9247 51.6296 20.6778 53.1113 16.7701C54.0393 14.3114 54.1533 11.7551 53.6974 9.19882H53.6811ZM48.6988 14.6696C48.0638 17.3074 46.3053 18.8705 43.5862 19.0658C42.1859 19.1635 40.7856 19.0821 39.3039 19.0821V4.47697C41.9091 4.59095 44.6608 3.82569 46.8426 5.79584C47.673 6.54482 48.2917 7.68457 48.6336 8.7592C49.2524 10.6805 49.171 12.6832 48.6988 14.6696Z" fill="white"/>
            <path d="M106.667 15.9896H112.577C112.708 13.6449 112.48 11.5283 111.356 9.59068C110.021 7.31116 107.904 6.22025 105.348 5.9923C102.303 5.73179 99.6167 6.57846 97.7768 9.13477C96.002 11.5934 95.7089 14.4102 96.2788 17.3247C96.6045 19.0018 97.3046 20.5649 98.6072 21.6884C101.782 24.4238 106.699 24.5866 110.135 22.1768C111.242 21.4279 112.17 20.0927 112.447 18.4971C110.949 18.4156 109.549 18.3342 108.165 18.2528C106.862 20.3532 104.811 20.4835 103.199 19.9625C101.587 19.4414 100.708 17.9597 100.854 16.0059H106.651L106.667 15.9896ZM104.778 9.49298C106.667 9.57439 108.181 11.2189 107.986 13.0262H100.887C100.887 10.9584 102.613 9.39529 104.778 9.49298Z" fill="white"/>
            <path d="M71.6232 13.8412C71.4278 10.5522 70.1089 8.01217 66.9664 6.59562C63.3843 4.98368 58.7602 6.25369 56.5947 9.51014C55.113 11.7408 54.999 14.232 55.2758 16.7557C55.4549 18.4165 56.0736 19.9308 57.2297 21.2008C59.3626 23.5454 62.1306 24.0013 65.094 23.7408C67.1455 23.5617 68.9529 22.7313 70.3043 21.1194C70.923 20.3704 71.3789 19.3772 71.4278 18.4979C69.9624 18.4165 68.5621 18.3351 67.2107 18.2537C65.9732 20.4681 63.482 20.5983 61.7887 19.7679C60.3559 19.0678 59.7371 17.2768 60.0791 15.9905H71.5092C71.558 15.7788 71.5906 15.7137 71.5906 15.6323C71.5906 15.0298 71.6232 14.4437 71.5906 13.8575L71.6232 13.8412ZM67.0967 13.0108H60.0139C59.6883 11.5943 61.3165 9.70553 63.2378 9.49386C65.2242 9.28219 67.2758 10.9267 67.0967 13.0108Z" fill="white"/>
          </svg>`;
    } else {
      // Light mode logo (dark blue)
      return `<svg width="116" height="24" viewBox="0 0 116 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.2615 2.29137C24.2615 1.03764 23.366 0.174681 22.1122 0.174681C18.9698 0.174681 15.8273 0.174681 12.6848 0.174681C9.54237 0.174681 6.56272 0.23981 3.50166 0.142117C1.61292 0.0932701 0.847656 1.24931 0.847656 2.82868C0.880221 5.90602 0.847656 8.98336 0.847656 12.077C0.847656 15.1706 0.847656 17.9712 0.847656 20.9182C0.847656 22.3674 1.71061 23.3769 2.96435 23.3769C9.36326 23.3769 15.7622 23.3769 22.1448 23.3769C23.3497 23.3769 24.2452 22.4813 24.2452 21.2764C24.2452 14.9589 24.2452 8.62516 24.2452 2.30765L24.2615 2.29137ZM3.69705 8.99965C4.28321 7.90874 4.95078 6.86668 5.65091 5.8409C6.15566 5.09191 7.1326 4.92909 7.88158 5.38499C8.66313 5.8409 8.95621 6.81783 8.5003 7.63194C7.89786 8.69028 7.24657 9.69978 6.59528 10.7256C6.28592 11.214 5.79745 11.442 5.22757 11.442C3.94128 11.442 3.0946 10.1394 3.69705 8.99965ZM7.00234 20.153C5.63463 20.153 4.85308 18.7853 5.55322 17.5641C6.54643 15.8707 7.60478 14.1937 8.63056 12.5166C10.4053 9.61837 12.1801 6.72014 13.9548 3.8219C14.3782 3.13805 14.8829 2.60073 15.7459 2.64958C17.081 2.73099 17.7649 4.11498 17.0159 5.35243C15.4528 7.97387 13.8409 10.5627 12.2452 13.1516C11.0403 15.138 9.81916 17.1082 8.61428 19.0946C8.23979 19.7134 7.7676 20.1367 7.00234 20.153ZM21.2656 10.7256C20.3863 12.2398 19.442 13.7215 18.5302 15.2195C17.5207 16.8477 16.5274 18.4922 15.5179 20.1041C14.8504 21.1788 13.906 21.4718 13.0105 20.902C12.1475 20.3646 11.9847 19.3714 12.6034 18.3456C14.4922 15.2683 16.3809 12.191 18.2696 9.09734C18.6441 8.47862 19.1326 8.05528 19.8979 8.07156C21.2493 8.07156 21.9983 9.47183 21.2819 10.7093L21.2656 10.7256Z" fill="#00060C"/>
<path d="M78.9557 6.28113H84.0032C85.1918 10.368 86.3804 14.4222 87.569 18.4928C87.6342 18.4928 87.6993 18.4928 87.7644 18.4928C88.953 14.4222 90.1416 10.368 91.3139 6.29741H96.3777C94.3587 12.0613 92.356 17.7438 90.3859 23.41H84.9313C82.9449 17.7275 80.9584 12.0613 78.9395 6.28113H78.9557Z" fill="#00060C"/>
<path d="M73.3242 0.455078H77.9158V23.3805H73.3242V0.455078Z" fill="#00060C"/>
<path d="M53.6811 9.19882C53.1927 6.46341 51.9878 4.10248 49.6594 2.40913C47.9335 1.17168 45.9796 0.520395 43.9118 0.455266C40.7856 0.34129 37.6431 0.422701 34.4355 0.422701V23.3806C34.6147 23.4132 34.7449 23.4458 34.8752 23.4458C38.1153 23.3969 41.3718 23.5109 44.6119 23.2504C48.7639 22.9247 51.6296 20.6778 53.1113 16.7701C54.0393 14.3114 54.1533 11.7551 53.6974 9.19882H53.6811ZM48.6988 14.6696C48.0638 17.3074 46.3053 18.8705 43.5862 19.0658C42.1859 19.1635 40.7856 19.0821 39.3039 19.0821V4.47697C41.9091 4.59095 44.6608 3.82569 46.8426 5.79584C47.673 6.54482 48.2917 7.68457 48.6336 8.7592C49.2524 10.6805 49.171 12.6832 48.6988 14.6696Z" fill="#00060C"/>
<path d="M106.667 15.9896H112.577C112.708 13.6449 112.48 11.5283 111.356 9.59068C110.021 7.31116 107.904 6.22025 105.348 5.9923C102.303 5.73179 99.6167 6.57846 97.7768 9.13477C96.002 11.5934 95.7089 14.4102 96.2788 17.3247C96.6045 19.0018 97.3046 20.5649 98.6072 21.6884C101.782 24.4238 106.699 24.5866 110.135 22.1768C111.242 21.4279 112.17 20.0927 112.447 18.4971C110.949 18.4156 109.549 18.3342 108.165 18.2528C106.862 20.3532 104.811 20.4835 103.199 19.9625C101.587 19.4414 100.708 17.9597 100.854 16.0059H106.651L106.667 15.9896ZM104.778 9.49298C106.667 9.57439 108.181 11.2189 107.986 13.0262H100.887C100.887 10.9584 102.613 9.39529 104.778 9.49298Z" fill="#00060C"/>
<path d="M71.6232 13.8412C71.4278 10.5522 70.1089 8.01217 66.9664 6.59562C63.3843 4.98368 58.7602 6.25369 56.5947 9.51014C55.113 11.7408 54.999 14.232 55.2758 16.7557C55.4549 18.4165 56.0736 19.9308 57.2297 21.2008C59.3626 23.5454 62.1306 24.0013 65.094 23.7408C67.1455 23.5617 68.9529 22.7313 70.3043 21.1194C70.923 20.3704 71.3789 19.3772 71.4278 18.4979C69.9624 18.4165 68.5621 18.3351 67.2107 18.2537C65.9732 20.4681 63.482 20.5983 61.7887 19.7679C60.3559 19.0678 59.7371 17.2768 60.0791 15.9905H71.5092C71.558 15.7788 71.5906 15.7137 71.5906 15.6323C71.5906 15.0298 71.6232 14.4437 71.5906 13.8575L71.6232 13.8412ZM67.0967 13.0108H60.0139C59.6883 11.5943 61.3165 9.70553 63.2378 9.49386C65.2242 9.28219 67.2758 10.9267 67.0967 13.0108Z" fill="#00060C"/>
</svg>`;
    }
  }

  function isDarkMode() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function createBanner(geoData) {
    const banner = document.createElement("div");
    banner.className = "delve-cookie-banner";

    // Determine if reject button should be shown
    const showRejectButton =
      config.showRejectButton &&
      geoData &&
      (geoData.consentType === "gdpr" ||
        (geoData.consentType === "ccpa" && config.ccpaEnabled));

    banner.innerHTML = `
            <div class="delve-banner-content">
                <div class="delve-banner-header">
                    <h2 class="delve-banner-title">Choose your cookies</h2>
                    <div class="delve-banner-text">
                        <p class="delve-banner-message">${config.message}${
      config.showSettingsButton
        ? ` <a href="#" class="delve-preferences-link" data-action="settings">${config.settingsText}</a>`
        : ""
    }</p>
                    </div>
                </div>
                <div class="delve-banner-actions">
                    <button class="delve-btn delve-btn-primary" data-action="accept">${
                      config.acceptText
                    }</button>
                    ${
                      showRejectButton
                        ? `<button class="delve-btn delve-btn-secondary" data-action="reject">${config.rejectText}</button>`
                        : ""
                    }
                </div>
            </div>
        `;
    return banner;
  }

  function createSettingsModal() {
    const modal = document.createElement("div");
    modal.className = "delve-settings-overlay";

    let categoriesHTML = "";
    Object.keys(config.categories).forEach((key) => {
      const category = config.categories[key];
      const categoryDef = categoryDefinitions[key];

      if (!categoryDef) {
        // console.warn(`Unknown category: ${key}`);
        return;
      }

      const isRequired = categoryDef.required;
      const isEnabled = category.enabled;

      categoriesHTML += `
                <div class="delve-category expandable" data-category-key="${key}">
                    <div class="delve-category-header" data-expandable="true">
                        <div class="delve-category-left">
                            <span class="delve-category-icon">
                                <svg class="icon-plus" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <svg class="icon-minus" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5 8H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                            <span class="delve-category-name">${
                              categoryDef.name
                            } cookies</span>
                        </div>
                        ${
                          isRequired
                            ? '<span class="delve-category-status">Always active</span>'
                            : `<div class="delve-toggle ${
                                isEnabled ? "enabled" : ""
                              }" 
                                 data-category="${key}">
                                <div class="delve-toggle-thumb"></div>
                            </div>`
                        }
                    </div>
                    <div class="delve-category-content">
                        <div class="delve-category-content-inner">
                            <p class="delve-category-description">${
                              categoryDef.description
                            }</p>
                        </div>
                    </div>
                </div>
            `;
    });

    modal.innerHTML = `
            <div class="delve-settings-modal">
                <button class="delve-settings-close" data-action="close">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="delve-settings-content">
                    <div class="delve-settings-header">
                        <h2 class="delve-settings-title">Cookie settings</h2>
                        <p class="delve-settings-subtitle">Cookies help us to enhance your experience, tailor ads to your interests, and improve our website.</p>
                        <p class="delve-settings-info">Find out more on different cookie categories by expanding each cookie category below. Read our <a href="https://lovable.dev/privacy" target="_blank" rel="noopener">Cookie Policy</a> to learn more about how we use cookies and how to adjust your cookie preferences if you change your mind.</p>
                    </div>
                    <div class="delve-categories-container">
                        ${categoriesHTML}
                    </div>
                </div>
                <div class="delve-settings-actions">
                    <button class="delve-btn delve-btn-primary" data-action="save">Confirm my choices</button>
                    <button class="delve-btn delve-btn-secondary" data-action="accept-all">Accept all</button>
                </div>
                ${
                  config.showBranding
                    ? `<div class="delve-settings-footer">
                    <div class="delve-settings-brand">
                        <span class="delve-settings-brand-text">
                            ${config.brandText} 
                            <a href="${
                              config.brandLink
                            }" class="delve-banner-brand-link" target="_blank">
                                <span class="delve-banner-brand-logo">${getDelveLogoSVG(
                                  isDarkMode()
                                )}</span>
                            </a>
                        </span>
                    </div>
                </div>`
                    : ""
                }
            </div>
        `;

    return modal;
  }

  function showBanner(force = false) {
    if (!banner) return;

    // Track if banner is being forced to show (e.g., user wants to change settings)
    if (force) {
      isBannerForced = true;
    }

    // If banner is already in DOM, ensure it's visible
    if (banner.parentNode) {
      // Remove any hiding state
      banner.classList.remove("hiding");
      // Force reflow to ensure animation works
      void banner.offsetWidth;
      // Add show class
      banner.classList.add("show");
    } else {
      // First time showing, add to DOM
      document.body.appendChild(banner);
      // Use setTimeout to ensure the element is rendered before adding animation
      setTimeout(() => banner.classList.add("show"), 10);
    }
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove("show");

    // Add hiding class for smoother animation
    banner.classList.add("hiding");

    // Reset forced flag
    isBannerForced = false;

    // Don't remove from DOM, just hide it so it can be shown again
    // This allows DelveCookieConsent.show() to work immediately
  }

  function showSettings() {
    if (!settingsModal) return;

    // Prevent body scrolling
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.dataset.scrollY = scrollY;

    document.body.appendChild(settingsModal);
    settingsModal.style.display = "block";

    // Trigger animation after a frame
    requestAnimationFrame(() => {
      settingsModal.classList.add("show");
    });

    // Ensure modal content is scrollable
    const modalContent = settingsModal.querySelector(".delve-settings-content");
    if (modalContent) {
      modalContent.scrollTop = 0;
    }

    // Update toggles based on current state
    Object.keys(config.categories).forEach((key) => {
      const toggle = settingsModal.querySelector(`[data-category="${key}"]`);
      if (toggle && !toggle.dataset.required) {
        if (config.categories[key].enabled) {
          toggle.classList.add("enabled");
        } else {
          toggle.classList.remove("enabled");
        }
      }
    });
  }

  function hideSettings() {
    if (!settingsModal) return;

    // Remove show class to trigger animation
    settingsModal.classList.remove("show");

    // Wait for animation to complete
    setTimeout(() => {
      // Restore body scrolling
      const scrollY = document.body.dataset.scrollY || 0;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY));
      delete document.body.dataset.scrollY;

      settingsModal.style.display = "none";
      if (settingsModal.parentNode) {
        settingsModal.parentNode.removeChild(settingsModal);
      }

      // Mark settings as closed and resume auto-accept if it was paused
      if (banner && banner.autoAcceptState) {
        banner.autoAcceptState.settingsOpen = false;
        if (banner.resumeAutoAccept) {
          banner.resumeAutoAccept();
        }
      }
    }, 300); // Match the transition duration
  }

  function cancelAutoAccept() {
    if (banner && banner.autoAcceptState && banner.autoAcceptState.timer) {
      clearTimeout(banner.autoAcceptState.timer);
      banner.autoAcceptState.timer = null;
      banner.autoAcceptState.remainingTime = 0;

      // Progress bar removed
    }
  }

  function handleAcceptAll() {
    cancelAutoAccept();

    // Enable all categories
    Object.keys(config.categories).forEach((key) => {
      config.categories[key].enabled = true;
    });

    saveConsent(config.categories);

    // Update blocking system
    if (config.manageScriptTags) {
      BlockingManager.updateConsent(config.categories);
    }

    hideBanner();
    config.onAccept(config.categories);
  }

  function handleRejectNonEssential() {
    cancelAutoAccept();

    // Only enable necessary cookies
    Object.keys(config.categories).forEach((key) => {
      const categoryDef = categoryDefinitions[key];
      config.categories[key].enabled = categoryDef?.required || false;
    });

    saveConsent(config.categories);

    // Update blocking system
    if (config.manageScriptTags) {
      BlockingManager.updateConsent(config.categories);
    }

    hideBanner();
    config.onReject();
  }

  function handleSavePreferences() {
    // Get current toggle states
    Object.keys(config.categories).forEach((key) => {
      const toggle = settingsModal.querySelector(`[data-category="${key}"]`);
      if (toggle && !toggle.dataset.required) {
        config.categories[key].enabled = toggle.classList.contains("enabled");
      }
    });

    saveConsent(config.categories);

    // Update blocking system
    if (config.manageScriptTags) {
      BlockingManager.updateConsent(config.categories);
    }

    hideSettings();
    hideBanner();
    config.onChange(config.categories);
  }

  function attachEventListeners() {
    // Banner events
    if (banner) {
      banner.addEventListener("click", function (e) {
        const action = e.target.dataset.action;

        // Prevent default for links
        if (e.target.tagName === "A" && action) {
          e.preventDefault();
        }

        switch (action) {
          case "accept":
            handleAcceptAll();
            break;
          case "reject":
            handleRejectNonEssential();
            break;
          case "settings":
            if (banner.pauseAutoAccept) {
              banner.pauseAutoAccept();
            }
            if (banner.autoAcceptState) {
              banner.autoAcceptState.settingsOpen = true;
            }
            showSettings();
            break;
        }
      });

      // Add hover listeners for preferences link
      const preferencesLink = banner.querySelector(".delve-preferences-link");
      if (preferencesLink) {
        preferencesLink.addEventListener("mouseenter", function () {
          if (banner.pauseAutoAccept) {
            banner.pauseAutoAccept();
          }
        });

        preferencesLink.addEventListener("mouseleave", function () {
          if (
            banner.resumeAutoAccept &&
            banner.autoAcceptState &&
            !banner.autoAcceptState.settingsOpen
          ) {
            banner.resumeAutoAccept();
          }
        });
      }
    }

    // Settings modal events
    if (settingsModal) {
      settingsModal.addEventListener("click", function (e) {
        // Close on overlay click
        if (e.target === settingsModal) {
          hideSettings();
          return;
        }

        // Check for action on the clicked element or its parent button
        const actionElement = e.target.closest("[data-action]");
        const action = actionElement
          ? actionElement.dataset.action
          : e.target.dataset.action;

        switch (action) {
          case "save":
            handleSavePreferences();
            break;
          case "cancel":
          case "close":
            hideSettings();
            break;
          case "accept-all":
            // Enable all categories
            Object.keys(config.categories).forEach((key) => {
              config.categories[key].enabled = true;
              const toggle = settingsModal.querySelector(
                `[data-category="${key}"]`
              );
              if (toggle && !toggle.dataset.required) {
                toggle.classList.add("enabled");
              }
            });
            handleSavePreferences();
            break;
        }

        // Handle category toggle clicks
        const toggle = e.target.closest(".delve-toggle");
        if (toggle && !toggle.dataset.required) {
          toggle.classList.toggle("enabled");
          e.stopPropagation(); // Prevent triggering expand/collapse
        }

        // Handle expandable category header clicks
        const expandableHeader = e.target.closest(
          '.delve-category-header[data-expandable="true"]'
        );
        if (expandableHeader && !e.target.closest(".delve-toggle")) {
          const category = expandableHeader.closest(".delve-category");
          category.classList.toggle("expanded");
        }
      });

      // Prevent wheel events from bubbling to body when modal is open
      settingsModal.addEventListener(
        "wheel",
        function (e) {
          const modalContent = settingsModal.querySelector(
            ".delve-settings-content"
          );
          if (modalContent && modalContent.contains(e.target)) {
            e.stopPropagation();
          }
        },
        { passive: false }
      );
    }
  }

  async function initializeConsent() {
    // Categories must be defined by user
    if (!config.categories || Object.keys(config.categories).length === 0) {
      console.error("DelveCookieConsent: Categories must be defined in config");
      return;
    }

    // Auto-generate cookies array from cookieTable if not provided
    Object.keys(config.categories).forEach((categoryKey) => {
      const category = config.categories[categoryKey];

      // Skip if cookies array is already defined
      if (category.cookies && category.cookies.length > 0) {
        return;
      }

      // Generate cookies array from cookieTable
      if (category.cookieTable && category.cookieTable.cookies) {
        category.cookies = [];

        category.cookieTable.cookies.forEach((row) => {
          const cookieName = row.name;
          if (cookieName) {
            // Check if it's a pattern (contains wildcards or regex patterns)
            if (
              cookieName.includes("*") ||
              cookieName.includes("_*") ||
              cookieName.startsWith("^") ||
              cookieName.includes("/")
            ) {
              // Convert wildcard patterns to regex
              if (cookieName.includes("*")) {
                const regexPattern = cookieName
                  .replace(/\*/g, ".*")
                  .replace(/_\.\*/, "_.*");
                category.cookies.push(new RegExp(`^${regexPattern}`));
              } else if (
                cookieName.startsWith("/") &&
                cookieName.endsWith("/")
              ) {
                // Handle regex patterns like /^_ga/
                const regexStr = cookieName.slice(1, -1);
                category.cookies.push(new RegExp(regexStr));
              } else {
                // Treat as string literal
                category.cookies.push(cookieName);
              }
            } else {
              // Exact string match
              category.cookies.push(cookieName);
            }
          }
        });

        // console.log(`✅ Auto-generated cookies array for ${categoryKey}:`, category.cookies);
      }
    });

    // Initialize blocking system
    if (config.manageScriptTags) {
      BlockingManager.init();
    }

    // Check if consent already exists
    const existingConsent = getConsentData();
    const hasExistingConsent = existingConsent !== null;

    if (existingConsent) {
      // Update categories with saved preferences
      Object.keys(existingConsent.categories).forEach((key) => {
        if (config.categories[key]) {
          config.categories[key].enabled =
            existingConsent.categories[key].enabled;
        }
      });

      // Update blocking system with existing consent
      if (config.manageScriptTags) {
        BlockingManager.updateConsent(config.categories);
      }
    }

    // Always detect geo location
    const geoData = await GeoDetection.detect();
    config.geoData = geoData;

    // Check if we should show the banner based on geo and config
    let shouldShowBanner = true;

    // Determine if region requires consent
    if (geoData.consentType === "gdpr") {
      // GDPR regions always show banner
      shouldShowBanner = true;
    } else if (geoData.consentType === "ccpa") {
      // CCPA regions (California) - show banner only if CCPA is enabled
      shouldShowBanner = config.ccpaEnabled;
      if (!shouldShowBanner) {
        // console.log('🚫 Banner hidden: CCPA disabled for California user');
      }
    } else {
      // Non-regulated regions - show banner only if enabled
      shouldShowBanner = config.showInNonRegulatedRegions;
      if (!shouldShowBanner) {
        // console.log('🚫 Banner hidden: showInNonRegulatedRegions disabled');
      }
    }

    // Always inject styles and create UI elements
    injectStyles();

    // Always create banner and modal (even if not shown initially)
    banner = createBanner(geoData);
    settingsModal = createSettingsModal();

    // Always attach event listeners
    attachEventListeners();

    // Handle regions that don't need consent
    if (!shouldShowBanner) {
      // Still update blocking system with default consent (all enabled for non-regulated regions)
      if (config.manageScriptTags) {
        Object.keys(config.categories).forEach((key) => {
          config.categories[key].enabled = true;
        });
        BlockingManager.updateConsent(config.categories);
      }
      return;
    }

    // Show banner if autoShow is enabled AND no existing consent
    if (config.autoShow && !hasExistingConsent) {
      showBanner();

      // Auto-dismiss based on consent type
      if (geoData.consentType === "ccpa" || geoData.consentType !== "gdpr") {
        const duration = geoData.consentType === "ccpa" ? 10000 : 5000;
        const message =
          geoData.consentType === "ccpa"
            ? "🌴 CCPA region detected - auto-dismissing in 10 seconds"
            : "🌍 Non-regulated region - auto-dismissing in 5 seconds";

        // console.log(message);

        // Track auto-accept state
        const autoAcceptState = {
          duration: duration,
          startTime: Date.now(),
          remainingTime: duration,
          isPaused: false,
          timer: null,
          settingsOpen: false,
        };

        // Function to start/resume auto-accept
        function startAutoAccept() {
          if (autoAcceptState.isPaused) return;

          autoAcceptState.startTime = Date.now();

          autoAcceptState.timer = setTimeout(() => {
            if (banner && banner.classList.contains("show")) {
              // console.log('⏰ Auto-accepting cookies');
              handleAcceptAll();
            }
          }, autoAcceptState.remainingTime);
        }

        // Function to pause auto-accept
        function pauseAutoAccept() {
          if (!autoAcceptState.timer || autoAcceptState.isPaused) return;

          autoAcceptState.isPaused = true;
          clearTimeout(autoAcceptState.timer);

          // Calculate remaining time
          const elapsed = Date.now() - autoAcceptState.startTime;
          autoAcceptState.remainingTime = Math.max(
            0,
            autoAcceptState.remainingTime - elapsed
          );
        }

        // Function to resume auto-accept
        function resumeAutoAccept() {
          if (
            !autoAcceptState.isPaused ||
            autoAcceptState.remainingTime <= 0 ||
            autoAcceptState.settingsOpen
          )
            return;

          autoAcceptState.isPaused = false;
          startAutoAccept();
        }

        // Store functions for external access
        banner.autoAcceptState = autoAcceptState;
        banner.pauseAutoAccept = pauseAutoAccept;
        banner.resumeAutoAccept = resumeAutoAccept;

        // Initial start
        setTimeout(() => {
          startAutoAccept();
        }, 100);

        // Add hover listeners to buttons
        const buttons = banner.querySelectorAll(".delve-btn");
        buttons.forEach((button) => {
          button.addEventListener("mouseenter", pauseAutoAccept);
          button.addEventListener("mouseleave", resumeAutoAccept);
        });
      }
      // GDPR regions - no auto-dismiss, user must interact
    }
  }

  function init(userConfig = {}) {
    // Merge user config with defaults
    config = { ...defaultConfig, ...userConfig };

    // Handle async initialization
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => initializeConsent());
    } else {
      initializeConsent();
    }
  }

  // Public API
  window.DelveCookieConsent = {
    init: init,
    show: function () {
      // Always clear all cookies when showing the banner for a clean slate
      clearAllCookies();
      // Force show the banner even if consent exists
      showBanner(true);
    },
    hide: hideBanner,
    showSettings: showSettings,
    hasConsent: hasConsent,
    getConsent: getConsentData,
    updatePreferences: function (categories) {
      Object.keys(categories).forEach((key) => {
        if (config.categories[key]) {
          config.categories[key].enabled = categories[key];
        }
      });
      saveConsent(config.categories);

      if (config.manageScriptTags) {
        BlockingManager.updateConsent(config.categories);
      }

      config.onChange(config.categories);
    },
    acceptedCategory: function (category) {
      return config.categories[category]?.enabled || false;
    },
    acceptedService: function (service, category) {
      return config.categories[category]?.services?.[service]?.enabled || false;
    },
    getGeoData: function () {
      return config.geoData || null;
    },
    detectGeo: async function () {
      const geoData = await GeoDetection.detect();
      config.geoData = geoData;
      return geoData;
    },
  };
})(window, document);
