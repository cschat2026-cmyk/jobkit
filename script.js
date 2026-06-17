const EZOIC_ENABLED = false;
const ADSENSE_ENABLED = true;
const ADSENSE_CLIENT = "ca-pub-2456404542897668";
const CONTACT_EMAIL = "cschat2026@gmail.com";

const EZOIC_PLACEHOLDER_MAP = {
  leaderboard: "",
  sidebar: "",
  inline: "",
  footer: ""
};

const ADSENSE_SLOT_MAP = {
  leaderboard: "",
  sidebar: "",
  inline: "",
  footer: ""
};

const PROFILE_STORAGE_KEY = "sqhq_profiles_v2";
const QUOTE_STORAGE_KEY = "sqhq_quotes_v2";

const DEFAULT_TOOL_PROFILES = {
  painting: {
    label: "Painting",
    crewSize: 2,
    laborRate: 48,
    travelFee: 35,
    overheadPct: 12,
    profitPct: 22,
    minimumCharge: 450
  },
  cleaning: {
    label: "House Cleaning",
    crewSize: 2,
    laborRate: 34,
    travelFee: 20,
    overheadPct: 10,
    profitPct: 20,
    minimumCharge: 180
  },
  pressure: {
    label: "Pressure Washing",
    crewSize: 2,
    laborRate: 44,
    travelFee: 30,
    overheadPct: 12,
    profitPct: 24,
    minimumCharge: 275
  },
  lawn: {
    label: "Lawn Care",
    crewSize: 2,
    laborRate: 36,
    travelFee: 18,
    overheadPct: 10,
    profitPct: 20,
    minimumCharge: 65
  }
};


function loadAdSenseScript() {
  if (!ADSENSE_ENABLED || !ADSENSE_CLIENT.startsWith("ca-pub-")) {
    return Promise.resolve(false);
  }

  const existingScript = document.querySelector(
    `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"][src*="${ADSENSE_CLIENT}"]`
  );

  if (existingScript) {
    if (window.adsbygoogle) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load AdSense script.")), {
        once: true
      });
    });
  }

  if (document.querySelector('script[data-adsense-loader="true"]')) {
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = "anonymous";
    script.dataset.adsenseLoader = "true";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load AdSense script."));
    document.head.appendChild(script);
  });
}

function getActiveEzoicPlaceholderIds() {
  return Object.values(EZOIC_PLACEHOLDER_MAP)
    .map((placeholderId) => Number.parseInt(placeholderId, 10))
    .filter((placeholderId) => Number.isInteger(placeholderId) && placeholderId > 0);
}

function renderEzoicSlots(slots) {
  const placeholderIds = getActiveEzoicPlaceholderIds();

  if (!EZOIC_ENABLED || !placeholderIds.length || !window.ezstandalone?.cmd) {
    return false;
  }

  document.documentElement.dataset.adProvider = "ezoic";
  document.documentElement.dataset.adsense = "standby";
  document.documentElement.dataset.ezoic = "enabled";

  slots.forEach((slot) => {
    const slotKey = slot.dataset.adSlotKey;
    const placeholderId = Number.parseInt(EZOIC_PLACEHOLDER_MAP[slotKey], 10);

    if (!Number.isInteger(placeholderId) || placeholderId <= 0) {
      return;
    }

    slot.dataset.ezoicPlaceholder = String(placeholderId);
    slot.innerHTML = `<div id="ezoic-pub-ad-placeholder-${placeholderId}"></div>`;
  });

  ezstandalone.cmd.push(() => {
    ezstandalone.showAds(...placeholderIds);
  });

  return true;
}

function hydrateAdSlots() {
  const slots = document.querySelectorAll(".ad-slot[data-ad-slot-key]");

  if (!slots.length) {
    return;
  }

  if (renderEzoicSlots(slots)) {
    return;
  }

  document.documentElement.dataset.ezoic = EZOIC_ENABLED ? "pending" : "disabled";

  if (!ADSENSE_ENABLED) {
    document.documentElement.dataset.adProvider = "none";
    document.documentElement.dataset.adsense = "disabled";
    return;
  }

  const hasManualSlots = Object.values(ADSENSE_SLOT_MAP).some((slotId) => /^\d{8,}$/.test(slotId));

  if (!hasManualSlots) {
    document.documentElement.dataset.adProvider = "none";
    document.documentElement.dataset.adsense = "pending";
    return;
  }

  document.documentElement.dataset.adProvider = "adsense";
  document.documentElement.dataset.adsense = "enabled";

  loadAdSenseScript()
    .then(() => {
      slots.forEach((slot) => {
        const slotKey = slot.dataset.adSlotKey;
        const adSlot = ADSENSE_SLOT_MAP[slotKey];

        if (!adSlot) {
          return;
        }

        slot.innerHTML = `
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="${ADSENSE_CLIENT}"
               data-ad-slot="${adSlot}"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        `;

        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error("AdSense render error:", error);
        }
      });
    })
    .catch((error) => {
      console.error(error);
      document.documentElement.dataset.adsense = "disabled";
    });
}

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("open")) {
      return;
    }

    if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

function applyDeviceMode() {
  const width = window.innerWidth;
  let mode = "desktop";

  if (width <= 760) {
    mode = "mobile";
  } else if (width <= 1100) {
    mode = "tablet";
  }

  document.documentElement.dataset.deviceMode = mode;
}

applyDeviceMode();
window.addEventListener("resize", applyDeviceMode);

document.querySelectorAll("[data-print-template]").forEach((button) => {
  button.addEventListener("click", () => {
    window.print();
  });
});

document.querySelectorAll("[data-contact-trigger]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const pageTitle = document.title || "Untitled Page";
    const pageUrl = window.location.href || "";
    const subject = `[JobQuote Kit Feedback] ${pageTitle}`;
    const body = [
      "Hi,",
      "",
      "I have feedback or a question about this page:",
      "",
      "Website: JobQuote Kit",
      `Page title: ${pageTitle}`,
      `Page URL: ${pageUrl}`,
      "",
      "My message:",
      ""
    ].join("\n");

    window.alert(
      "Thanks for your feedback. Your email app will open next with the website name, page title, and page link already filled in."
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});

document.querySelectorAll("[data-load-example-trigger]").forEach((button) => {
  button.addEventListener("click", () => {
    const toolSection = document.getElementById("quote-workbench");
    if (toolSection) {
      toolSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const loadButton = document.getElementById("load-example");
    if (loadButton) {
      window.setTimeout(() => {
        loadButton.click();
      }, 160);
    }
  });
});

function safeNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function formatCompactDate(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function roundQuote(value) {
  return Math.max(0, Math.round(value / 5) * 5);
}

function loadProfileState() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || "{}");
    return { ...DEFAULT_TOOL_PROFILES, ...saved };
  } catch (error) {
    console.error("Failed to load saved profiles:", error);
    return { ...DEFAULT_TOOL_PROFILES };
  }
}

function saveProfileState(profiles) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
}

function loadQuoteState() {
  try {
    return JSON.parse(localStorage.getItem(QUOTE_STORAGE_KEY) || "[]");
  } catch (error) {
    console.error("Failed to load saved quotes:", error);
    return [];
  }
}

function saveQuoteState(quotes) {
  localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(quotes));
}

function initializeQuoteWorkbench() {
  const form = document.querySelector("[data-quote-workbench]");

  if (!form) {
    return;
  }

  let profiles = loadProfileState();
  let savedQuotes = loadQuoteState();

  const elements = {
    serviceType: document.getElementById("service-type"),
    jobName: document.getElementById("job-name"),
    area: document.getElementById("job-area"),
    hours: document.getElementById("estimated-hours"),
    crewSize: document.getElementById("crew-size"),
    laborRate: document.getElementById("labor-rate"),
    materials: document.getElementById("materials-cost"),
    travelFee: document.getElementById("travel-fee"),
    addOns: document.getElementById("addons-cost"),
    overheadPct: document.getElementById("overhead-pct"),
    profitPct: document.getElementById("profit-pct"),
    minimumCharge: document.getElementById("minimum-charge"),
    customerScope: document.getElementById("customer-scope"),
    notes: document.getElementById("quote-notes"),
    suggestedScopePreview: document.getElementById("suggested-scope-preview"),
    useSuggestedScopeButton: document.getElementById("use-suggested-scope"),
    status: document.getElementById("tool-status"),
    profileSummary: document.getElementById("profile-summary"),
    directCost: document.getElementById("direct-cost"),
    overheadAmount: document.getElementById("overhead-amount"),
    quotePrice: document.getElementById("quote-price"),
    recoveryRate: document.getElementById("recovery-rate"),
    minimumFlag: document.getElementById("minimum-flag"),
    historyList: document.getElementById("saved-quote-list"),
    historyEmpty: document.getElementById("saved-quote-empty"),
    loadExampleButton: document.getElementById("load-example"),
    loadExampleMobileButton: document.getElementById("load-example-mobile"),
    copyClientSheetMobileButton: document.getElementById("copy-client-sheet-mobile"),
    saveProfileButton: document.getElementById("save-profile"),
    saveQuoteButton: document.getElementById("save-quote"),
    saveQuoteMobileButton: document.getElementById("save-quote-mobile"),
    resetButton: document.getElementById("reset-workbench"),
    clearHistoryButton: document.getElementById("clear-history"),
    serviceShortcuts: Array.from(document.querySelectorAll("[data-service-shortcut]")),
    progressChips: {
      service: document.querySelector('[data-progress-step="service"]'),
      costs: document.querySelector('[data-progress-step="costs"]'),
      client: document.querySelector('[data-progress-step="client"]')
    },
    quoteSummary: document.getElementById("quote-summary"),
    copySummaryButton: document.getElementById("copy-summary"),
    emailSummaryButton: document.getElementById("email-summary"),
    clientSheetPreview: document.getElementById("client-sheet-preview"),
    copyClientSheetButton: document.getElementById("copy-client-sheet"),
    emailClientSheetButton: document.getElementById("email-client-sheet"),
    printClientSheetButton: document.getElementById("print-client-sheet"),
    resultGuidance: document.getElementById("result-guidance"),
    copyClientSheetPrimaryButton: document.getElementById("copy-client-sheet-primary"),
    saveQuoteResultButton: document.getElementById("save-quote-result"),
    quoteContextBar: document.getElementById("quote-context-bar"),
    quoteHealth: document.getElementById("quote-health"),
    quoteSendReadiness: document.getElementById("quote-send-readiness"),
    quoteSendHelper: document.getElementById("quote-send-helper"),
    quoteSendBadge: document.getElementById("quote-send-badge"),
    quoteFixList: document.getElementById("quote-fix-list"),
    quoteBreakdownGrid: document.getElementById("quote-breakdown-grid"),
    quoteBreakdownNote: document.getElementById("quote-breakdown-note"),
    quoteNextAction: document.getElementById("quote-next-action"),
    quoteNextActionTitle: document.getElementById("quote-next-action-title"),
    quoteNextActionCopy: document.getElementById("quote-next-action-copy")
  };

  function setStatus(message) {
    if (elements.status) {
      elements.status.textContent = message;
    }
  }

  function updateServiceShortcuts(activeService) {
    elements.serviceShortcuts.forEach((button) => {
      const isActive = button.dataset.serviceShortcut === activeService;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateProgressChips(state) {
    const serviceReady = Boolean(state.serviceType);
    const costsReady = state.hours > 0 || state.materials > 0 || state.travelFee > 0 || state.addOns > 0;
    const clientReady = Boolean(state.customerScope);

    Object.entries(elements.progressChips).forEach(([key, chip]) => {
      if (!chip) {
        return;
      }

      const isActive =
        (key === "service" && serviceReady) ||
        (key === "costs" && costsReady) ||
        (key === "client" && clientReady);

      chip.classList.toggle("active", isActive);
      chip.setAttribute("aria-pressed", String(isActive));
    });
  }

  function applyProfile(serviceKey, preserveQuoteFields = true) {
    const selectedProfile = profiles[serviceKey] || DEFAULT_TOOL_PROFILES.painting;

    elements.serviceType.value = serviceKey;
    elements.crewSize.value = selectedProfile.crewSize;
    elements.laborRate.value = selectedProfile.laborRate;
    elements.travelFee.value = selectedProfile.travelFee;
    elements.overheadPct.value = selectedProfile.overheadPct;
    elements.profitPct.value = selectedProfile.profitPct;
    elements.minimumCharge.value = selectedProfile.minimumCharge;

    if (!preserveQuoteFields) {
      elements.jobName.value = "";
      elements.area.value = "";
      elements.hours.value = "";
      elements.materials.value = "";
      elements.addOns.value = "";
      elements.customerScope.value = "";
      elements.notes.value = "";
    }

    renderProfileSummary(serviceKey);
    updateServiceShortcuts(serviceKey);
    calculateQuote();
  }

  function renderProfileSummary(serviceKey) {
    const selectedProfile = profiles[serviceKey] || DEFAULT_TOOL_PROFILES.painting;

    if (!elements.profileSummary) {
      return;
    }

    elements.profileSummary.innerHTML = `
      <strong>${selectedProfile.label} profile</strong>
      <span>${formatCurrency(selectedProfile.laborRate)}/hr labor</span>
      <span>${selectedProfile.crewSize} person crew</span>
      <span>${selectedProfile.overheadPct}% overhead</span>
      <span>${selectedProfile.profitPct}% target profit</span>
      <span>${formatCurrency(selectedProfile.minimumCharge)} minimum charge</span>
    `;
  }

  function renderQuoteContext(state) {
    if (!elements.quoteContextBar) {
      return;
    }

    const serviceLabel = DEFAULT_TOOL_PROFILES[state.serviceType]?.label || "Service";
    const jobLabel = state.jobName || "Untitled job";
    const scopeLabel = state.customerScope
      ? "Client-ready scope added"
      : "Client-ready scope not added yet";

    elements.quoteContextBar.textContent = `${serviceLabel} | ${jobLabel} | ${scopeLabel}`;
  }

  function renderQuoteHealth(result) {
    if (!elements.quoteHealth) {
      return;
    }

    const materialShare = result.recommendedQuote > 0 ? (result.materials / result.recommendedQuote) * 100 : 0;
    const addOnShare = result.recommendedQuote > 0 ? (result.addOns / result.recommendedQuote) * 100 : 0;
    const issues = [];

    if (!result.hours || result.laborHours <= 0) {
      issues.push("add labor hours before sending this quote");
    }

    if (!result.customerScope) {
      issues.push("add a customer-facing scope so the client knows what is included");
    }

    if (result.materials <= 0 && result.serviceType !== "lawn") {
      issues.push("check whether materials or consumables should be included");
    }

    if (materialShare > 35) {
      issues.push("materials are a large share of the quote, so verify supplier pricing");
    }

    if (addOnShare > 25) {
      issues.push("extras are a large share of the quote, so name them clearly in the scope");
    }

    if (result.minimumApplied && result.laborHours > 0) {
      issues.push("minimum charge is controlling the price, which is normal for small jobs but worth reviewing");
    }

    let health = "good";
    let message = "This quote has the basics covered. Review the client version, then copy or save it when the scope is correct.";

    if (!result.hours && !result.materials && !result.addOns) {
      health = "neutral";
      message = "Add hours and core costs to see whether this quote is ready to send.";
    } else if (issues.length >= 3) {
      health = "risk";
      message = `Before sending: ${issues.slice(0, 3).join("; ")}.`;
    } else if (issues.length) {
      health = "warning";
      message = `Quick check: ${issues.join("; ")}.`;
    }

    elements.quoteHealth.dataset.health = health;
    elements.quoteHealth.innerHTML = `
      <strong>Quote health check</strong>
      <p>${message}</p>
    `;

    if (elements.quoteSendReadiness && elements.quoteSendHelper && elements.quoteSendBadge && elements.quoteFixList) {
      let readiness = "ready";
      let readinessTitle = "Ready to send";
      let readinessHelper = "This quote has enough detail for a clean client copy. Do one final read, then copy or send it.";
      let fixItems = [];

      if (!result.hours && !result.materials && !result.addOns) {
        readiness = "draft";
        readinessTitle = "Still building";
        readinessHelper = "You do not have enough job detail yet. Start with labor hours and the main cost inputs.";
        fixItems = ["Add labor hours.", "Add core costs such as materials, travel, or extras.", "Review the recommended quote again after the numbers update."];
      } else if (issues.length) {
        readiness = "review";
        readinessTitle = "Needs review";
        readinessHelper = "This quote is close, but a few details should be tightened before it goes to a customer.";
        fixItems = issues.map((issue) => issue.charAt(0).toUpperCase() + issue.slice(1) + ".");
      } else {
        fixItems = ["Read the client-ready version once.", "Confirm the scope language matches the actual job.", "Copy, email, or save the quote."];
      }

      elements.quoteSendReadiness.textContent = readinessTitle;
      elements.quoteSendHelper.textContent = readinessHelper;
      elements.quoteSendBadge.dataset.readiness = readiness;
      elements.quoteSendBadge.textContent = readiness === "ready" ? "Ready" : readiness === "review" ? "Review" : "Draft";
      elements.quoteFixList.innerHTML = fixItems.map((item) => `<li>${item}</li>`).join("");
    }
  }

  function renderQuoteBreakdown(result) {
    if (!elements.quoteBreakdownGrid || !elements.quoteBreakdownNote) {
      return;
    }

    const lines = [
      {
        label: "Labor cost",
        value: result.laborCost,
        detail:
          result.laborHours > 0
            ? `${result.crewSize || 0} people x ${result.hours || 0} hours at ${formatCurrency(result.laborRate)}/person hr`
            : "Add labor hours to see the labor share."
      },
      {
        label: "Materials",
        value: result.materials,
        detail: result.materials > 0 ? "Supplies and consumables entered for this job." : "No materials cost entered yet."
      },
      {
        label: "Travel and setup",
        value: result.travelFee,
        detail: result.travelFee > 0 ? "Fuel, drive, parking, or setup cost included." : "No travel or setup fee entered."
      },
      {
        label: "Extras",
        value: result.addOns,
        detail: result.addOns > 0 ? "Upsells or extra scope included in the quote." : "No add-ons or extras entered."
      },
      {
        label: "Overhead",
        value: result.overheadAmount,
        detail: `${result.overheadPct}% overhead applied to direct cost.`
      }
    ];

    const biggestLine = lines.reduce((current, line) => (line.value > current.value ? line : current), lines[0]);
    const totalVisible = lines.reduce((sum, line) => sum + line.value, 0);
    const divisor = totalVisible > 0 ? totalVisible : 1;

    elements.quoteBreakdownGrid.innerHTML = lines
      .filter((line) => totalVisible > 0 || line.label === "Labor cost")
      .map((line) => {
        const share = totalVisible > 0 ? Math.max(4, Math.round((line.value / divisor) * 100)) : 0;
        return `
          <article class="quote-breakdown-item">
            <div class="quote-breakdown-head">
              <strong>${line.label}</strong>
              <span>${formatCurrency(line.value)}</span>
            </div>
            <div class="quote-breakdown-bar"><span style="width: ${share}%"></span></div>
            <p>${line.detail}</p>
          </article>
        `;
      })
      .join("");

    elements.quoteBreakdownNote.textContent =
      totalVisible > 0
        ? `${biggestLine.label} is currently the biggest driver of this quote. Review it first if the final price feels too high or too low.`
        : "Add hours and costs to see which parts of the job are pushing the price most.";
  }

  function renderNextAction(result) {
    if (!elements.quoteNextAction || !elements.quoteNextActionTitle || !elements.quoteNextActionCopy) {
      return;
    }

    let tone = "good";
    let title = "Best next move";
    let copy = "Review the client version once, then copy, email, or save the quote.";

    if (!result.hours && !result.materials && !result.travelFee && !result.addOns) {
      tone = "risk";
      copy = "Add labor hours and at least one core cost input first. That will turn this from a draft into a usable quote.";
    } else if (!result.customerScope) {
      tone = "warning";
      copy = "Add or insert a customer-facing scope next. It makes the client-ready version much easier to send.";
    } else if (result.materials <= 0 && result.serviceType !== "lawn") {
      tone = "warning";
      copy = "Review materials next. A missing materials line is a common reason service quotes feel profitable on paper but not in real work.";
    } else if (result.minimumApplied) {
      tone = "warning";
      copy = "Check whether the minimum charge still feels right for this job. It is currently setting the final price.";
    }

    elements.quoteNextAction.dataset.tone = tone;
    elements.quoteNextActionTitle.textContent = title;
    elements.quoteNextActionCopy.textContent = copy;
  }

  function buildSuggestedScope(result) {
    const serviceLabel = DEFAULT_TOOL_PROFILES[result.serviceType]?.label || "Service";
    const lines = [];

    lines.push(`${serviceLabel} service for ${result.jobName || "the listed project"}.`);

    if (result.area) {
      lines.push(`Approximate service area: ${result.area}.`);
    }

    if (result.serviceType === "painting") {
      lines.push("Includes standard prep, surface protection, application, and cleanup.");
    } else if (result.serviceType === "cleaning") {
      lines.push("Includes the agreed cleaning tasks, standard supplies, and final tidy-up.");
    } else if (result.serviceType === "pressure") {
      lines.push("Includes setup, washing, standard treatment, and site cleanup.");
    } else if (result.serviceType === "lawn") {
      lines.push("Includes the scheduled lawn service, detail work, and cleanup of the work area.");
    }

    if (result.addOns > 0) {
      lines.push("Also includes approved add-on or extra-scope work listed in this quote.");
    }

    lines.push("Final scope can be adjusted if site conditions or requested work change before the job starts.");
    return lines.join(" ");
  }

  function renderSuggestedScope(result) {
    if (!elements.suggestedScopePreview) {
      return;
    }

    elements.suggestedScopePreview.textContent = buildSuggestedScope(result);
  }

  function collectFormState() {
    return {
      serviceType: elements.serviceType.value,
      jobName: elements.jobName.value.trim(),
      area: safeNumber(elements.area.value),
      hours: safeNumber(elements.hours.value),
      crewSize: safeNumber(elements.crewSize.value),
      laborRate: safeNumber(elements.laborRate.value),
      materials: safeNumber(elements.materials.value),
      travelFee: safeNumber(elements.travelFee.value),
      addOns: safeNumber(elements.addOns.value),
      overheadPct: safeNumber(elements.overheadPct.value),
      profitPct: safeNumber(elements.profitPct.value),
      minimumCharge: safeNumber(elements.minimumCharge.value),
      customerScope: elements.customerScope.value.trim(),
      notes: elements.notes.value.trim()
    };
  }

  function calculateQuote() {
    const state = collectFormState();
    const laborHours = state.hours * Math.max(state.crewSize, 1);
    const laborCost = laborHours * state.laborRate;
    const directCost = laborCost + state.materials + state.travelFee + state.addOns;
    const overheadAmount = directCost * (state.overheadPct / 100);
    const totalCostBasis = directCost + overheadAmount;
    const marginMultiplier = Math.max(0.01, 1 - state.profitPct / 100);
    const rawQuote = totalCostBasis / marginMultiplier;
    const recommendedQuote = Math.max(state.minimumCharge, roundQuote(rawQuote));
    const recoveryRate = laborHours > 0 ? recommendedQuote / laborHours : 0;
    const minimumApplied = recommendedQuote === state.minimumCharge && state.minimumCharge > rawQuote;

    elements.directCost.textContent = formatCurrency(totalCostBasis);
    elements.overheadAmount.textContent = formatCurrency(overheadAmount);
    elements.quotePrice.textContent = formatCurrency(recommendedQuote);
    elements.recoveryRate.textContent = laborHours > 0 ? `${formatCurrency(recoveryRate)}/crew hr` : "Add hours";
    elements.minimumFlag.textContent = minimumApplied
      ? `Minimum charge applied at ${formatCurrency(state.minimumCharge)}`
      : "Quote based on your cost, overhead, and profit inputs";

    updateProgressChips(state);
    renderQuoteContext(state);

    if (elements.resultGuidance) {
      if (!state.hours && !state.materials && !state.travelFee && !state.addOns) {
        elements.resultGuidance.textContent =
          "Start with hours, labor rate, and the main job costs. The quote updates instantly as you fill in the form.";
      } else if (!state.customerScope) {
        elements.resultGuidance.textContent =
          "The price is updating. Add a customer-facing scope if you want a cleaner client-ready version.";
      } else {
        elements.resultGuidance.textContent =
          "The quote is ready to use. Copy the internal summary, send the client version, or save the job for later.";
      }
    }

    renderQuoteSummary({
      ...state,
      laborHours,
      laborCost,
      overheadAmount,
      totalCostBasis,
      recommendedQuote,
      recoveryRate,
      minimumApplied
    });
    renderClientSheet({
      ...state,
      laborHours,
      laborCost,
      overheadAmount,
      totalCostBasis,
      recommendedQuote,
      recoveryRate,
      minimumApplied
    });
    renderSuggestedScope({
      ...state,
      laborHours,
      laborCost,
      overheadAmount,
      totalCostBasis,
      recommendedQuote,
      recoveryRate,
      minimumApplied
    });
    renderQuoteHealth({
      ...state,
      laborHours,
      laborCost,
      overheadAmount,
      totalCostBasis,
      recommendedQuote,
      recoveryRate,
      minimumApplied
    });
    renderQuoteBreakdown({
      ...state,
      laborHours,
      laborCost,
      overheadAmount,
      totalCostBasis,
      recommendedQuote,
      recoveryRate,
      minimumApplied
    });
    renderNextAction({
      ...state,
      laborHours,
      laborCost,
      overheadAmount,
      totalCostBasis,
      recommendedQuote,
      recoveryRate,
      minimumApplied
    });

    return {
      ...state,
      laborHours,
      laborCost,
      overheadAmount,
      totalCostBasis,
      recommendedQuote,
      recoveryRate,
      minimumApplied
    };
  }

  function buildQuoteSummary(result) {
    const serviceLabel = DEFAULT_TOOL_PROFILES[result.serviceType]?.label || "Service";
    const headline = `${serviceLabel} quote for ${result.jobName || "untitled job"}`;
    const lines = [
      headline,
      `Recommended price: ${formatCurrency(result.recommendedQuote)}`,
      `Total cost basis: ${formatCurrency(result.totalCostBasis)} | Overhead included: ${formatCurrency(result.overheadAmount)}`,
      `Crew plan: ${result.crewSize || 0} people x ${result.hours || 0} hours | Recovery rate: ${
        result.laborHours > 0 ? `${formatCurrency(result.recoveryRate)}/crew hr` : "add labor hours"
      }`,
      `Inputs: labor ${formatCurrency(result.laborRate)}/person hr, materials ${formatCurrency(result.materials)}, travel ${formatCurrency(
        result.travelFee
      )}, extras ${formatCurrency(result.addOns)}`,
      result.area ? `Job size / area: ${result.area}` : "Job size / area: not entered",
      result.minimumApplied
        ? `Pricing rule: minimum charge of ${formatCurrency(result.minimumCharge)} was applied.`
        : `Pricing rule: based on ${result.overheadPct}% overhead and ${result.profitPct}% target profit.`
    ];

    if (result.notes) {
      lines.push(`Notes: ${result.notes}`);
    }
    return lines.join("\n");
  }

  function renderQuoteSummary(result) {
    if (!elements.quoteSummary) {
      return;
    }

    elements.quoteSummary.textContent = buildQuoteSummary(result);
  }

  function buildClientSheet(result) {
    const serviceLabel = DEFAULT_TOOL_PROFILES[result.serviceType]?.label || "Service";
    const lines = [
      `JobQuote Kit client quote sheet`,
      `Service: ${serviceLabel}`,
      `Project: ${result.jobName || "Untitled job"}`,
      result.area ? `Project size / area: ${result.area}` : null,
      "",
      "Scope of work:",
      result.customerScope || "Add a customer-facing scope description to generate a cleaner client version.",
      "",
      `Quoted price: ${formatCurrency(result.recommendedQuote)}`,
      result.minimumApplied
        ? `Pricing note: this quote includes the minimum service charge for the job.`
        : `Pricing note: this quote reflects the current scope, labor plan, and materials entered.`,
      "",
      "If you have any questions or requested adjustments, please reply with the project name above."
    ].filter(Boolean);

    return lines.join("\n");
  }

  function renderClientSheet(result) {
    if (!elements.clientSheetPreview) {
      return;
    }

    elements.clientSheetPreview.textContent = buildClientSheet(result);
  }

  async function copyClientSheet() {
    const result = calculateQuote();
    const summary = buildClientSheet(result);

    if (!navigator.clipboard?.writeText) {
      window.alert("Copy is not supported in this browser. Please use the email or print option instead.");
      return;
    }

    try {
      await navigator.clipboard.writeText(summary);
      setStatus("Copied the client quote sheet. You can paste it into email, chat, or your customer CRM.");
    } catch (error) {
      console.error("Failed to copy client sheet:", error);
      window.alert("Copy failed in this browser. Please use the email or print option instead.");
    }
  }

  function emailClientSheet() {
    const result = calculateQuote();
    const serviceLabel = DEFAULT_TOOL_PROFILES[result.serviceType]?.label || "Service";
    const subject = `[JobQuote Kit Client Quote] ${serviceLabel}${result.jobName ? ` - ${result.jobName}` : ""}`;
    const body = buildClientSheet(result);

    window.alert("Your email app will open with the client-facing quote sheet drafted and ready to edit before sending.");
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function printClientSheet() {
    const result = calculateQuote();
    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");

    if (!printWindow) {
      window.alert("The print preview could not open. Please allow pop-ups for this page and try again.");
      return;
    }

    const content = buildClientSheet(result)
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Client Quote Sheet</title>
          <style>
            body { font-family: Arial, sans-serif; color: #172233; margin: 40px; line-height: 1.6; }
            h1 { font-size: 24px; margin-bottom: 24px; }
            p { margin: 0 0 12px; }
          </style>
        </head>
        <body>
          <h1>Client Quote Sheet</h1>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  async function copyQuoteSummary() {
    const result = calculateQuote();
    const summary = buildQuoteSummary(result);

    if (!navigator.clipboard?.writeText) {
      window.alert("Copy is not supported in this browser. You can still use the email draft option.");
      return;
    }

    try {
      await navigator.clipboard.writeText(summary);
      setStatus("Copied the quote summary. You can paste it into your email, notes app, or customer message.");
    } catch (error) {
      console.error("Failed to copy quote summary:", error);
      window.alert("Copy failed in this browser. Please try the email draft option instead.");
    }
  }

  function emailQuoteSummary() {
    const result = calculateQuote();
    const serviceLabel = DEFAULT_TOOL_PROFILES[result.serviceType]?.label || "Service";
    const subject = `[JobQuote Kit Quote Draft] ${serviceLabel}${result.jobName ? ` - ${result.jobName}` : ""}`;
    const body = [
      buildQuoteSummary(result),
      "",
      `Website: JobQuote Kit`,
      `Page title: ${document.title || "JobQuote Kit"}`,
      `Page URL: ${window.location.href || ""}`
    ].join("\n");

    window.alert(
      "Your email app will open with the quote summary, website name, page title, and page link already filled in."
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function saveCurrentQuote() {
    const result = calculateQuote();
    const entry = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      ...result
    };

    savedQuotes = [entry, ...savedQuotes].slice(0, 12);
    saveQuoteState(savedQuotes);
    renderHistory();
    setStatus(
      `Saved job for ${result.jobName || DEFAULT_TOOL_PROFILES[result.serviceType]?.label || "this job"}. You can reload it from Recent jobs anytime.`
    );
  }

  function renderHistory() {
    if (!elements.historyList || !elements.historyEmpty) {
      return;
    }

    elements.historyList.innerHTML = "";

    if (!savedQuotes.length) {
      elements.historyEmpty.hidden = false;
      return;
    }

    elements.historyEmpty.hidden = true;

    savedQuotes.forEach((quote) => {
      const item = document.createElement("article");
      item.className = "saved-quote-item";
      item.innerHTML = `
        <div>
          <strong>${quote.jobName || DEFAULT_TOOL_PROFILES[quote.serviceType]?.label || "Saved quote"}</strong>
          <p>${formatCurrency(quote.recommendedQuote)} · ${formatCompactDate(quote.savedAt)}</p>
        </div>
        <div class="saved-quote-actions">
          <button type="button" class="tool-link-button" data-load-quote="${quote.id}">Load</button>
          <button type="button" class="tool-link-button danger" data-delete-quote="${quote.id}">Delete</button>
        </div>
      `;
      elements.historyList.appendChild(item);
    });
  }

  function fillFormFromQuote(quote) {
    elements.serviceType.value = quote.serviceType;
    elements.jobName.value = quote.jobName || "";
    elements.area.value = quote.area || "";
    elements.hours.value = quote.hours || "";
    elements.crewSize.value = quote.crewSize || "";
    elements.laborRate.value = quote.laborRate || "";
    elements.materials.value = quote.materials || "";
    elements.travelFee.value = quote.travelFee || "";
    elements.addOns.value = quote.addOns || "";
    elements.overheadPct.value = quote.overheadPct || "";
    elements.profitPct.value = quote.profitPct || "";
    elements.minimumCharge.value = quote.minimumCharge || "";
    elements.notes.value = quote.notes || "";
    elements.customerScope.value = quote.customerScope || "";

    renderProfileSummary(quote.serviceType);
    updateServiceShortcuts(quote.serviceType);
    calculateQuote();
  }

  function loadExampleQuote(serviceKey) {
    const examples = {
      painting: {
        jobName: "Maple Street Interior Repaint",
        area: 1450,
        hours: 18,
        materials: 420,
        addOns: 160,
        customerScope:
          "Repaint the main living areas and hallway, protect floors and furniture, complete light wall patching, and leave the work area clean at the end of the job.",
        notes: "Two accent walls, minor patching, protect furniture and floors."
      },
      cleaning: {
        jobName: "Biweekly 3 Bed / 2 Bath Cleaning",
        area: 1800,
        hours: 6,
        materials: 28,
        addOns: 45,
        customerScope:
          "Clean the kitchen, bathrooms, bedrooms, and main living areas, complete standard touch-point cleaning, and finish with a final tidy-up before leaving.",
        notes: "Includes fridge wipe-down and one pet-hair surcharge."
      },
      pressure: {
        jobName: "Driveway + Back Patio Wash",
        area: 1200,
        hours: 5,
        materials: 35,
        addOns: 70,
        customerScope:
          "Pressure wash the driveway and back patio, apply standard treatment where needed, move light furniture as required, and leave the area clear after service.",
        notes: "Oil spot treatment and furniture move included."
      },
      lawn: {
        jobName: "Weekly Lawn Visit",
        area: 6500,
        hours: 2,
        materials: 0,
        addOns: 25,
        customerScope:
          "Mow, edge, trim, and blow the lawn areas, complete light bed cleanup as listed, and leave the property neat after the visit.",
        notes: "Mow, edge, trim, blow, and front bed weed cleanup."
      }
    };

    const example = examples[serviceKey] || examples.painting;
    applyProfile(serviceKey, false);
    elements.jobName.value = example.jobName;
    elements.area.value = example.area;
    elements.hours.value = example.hours;
    elements.materials.value = example.materials;
    elements.addOns.value = example.addOns;
    elements.customerScope.value = example.customerScope;
    elements.notes.value = example.notes;
    calculateQuote();
  }

  form.addEventListener("input", () => {
    calculateQuote();
  });

  elements.serviceType.addEventListener("change", () => {
    applyProfile(elements.serviceType.value);
    setStatus(`Loaded ${DEFAULT_TOOL_PROFILES[elements.serviceType.value]?.label || "service"} pricing. Next step: enter hours and job costs.`);
  });

  function handleLoadExample() {
    loadExampleQuote(elements.serviceType.value);
    setStatus("Example loaded. Change the numbers to match your real job, then copy or save the result when it looks right.");
  }

  elements.loadExampleButton.addEventListener("click", handleLoadExample);

  if (elements.loadExampleMobileButton) {
    elements.loadExampleMobileButton.addEventListener("click", handleLoadExample);
  }

  elements.saveProfileButton.addEventListener("click", () => {
    const state = collectFormState();
    profiles[state.serviceType] = {
      ...profiles[state.serviceType],
      crewSize: state.crewSize,
      laborRate: state.laborRate,
      travelFee: state.travelFee,
      overheadPct: state.overheadPct,
      profitPct: state.profitPct,
      minimumCharge: state.minimumCharge
    };
    saveProfileState(profiles);
    renderProfileSummary(state.serviceType);
    setStatus(`Saved ${DEFAULT_TOOL_PROFILES[state.serviceType]?.label || "service"} service rates in this browser.`);
  });

  elements.saveQuoteButton.addEventListener("click", saveCurrentQuote);

  if (elements.saveQuoteMobileButton) {
    elements.saveQuoteMobileButton.addEventListener("click", saveCurrentQuote);
  }

  elements.resetButton.addEventListener("click", () => {
    applyProfile(elements.serviceType.value, false);
    setStatus("Cleared the current quote. Your saved service rates are still kept. Use Try example if you want a quick starting point.");
  });

  elements.clearHistoryButton.addEventListener("click", () => {
    savedQuotes = [];
    saveQuoteState(savedQuotes);
    renderHistory();
    setStatus("Cleared saved quotes from this browser.");
  });

  elements.historyList.addEventListener("click", (event) => {
    const loadButton = event.target.closest("[data-load-quote]");
    const deleteButton = event.target.closest("[data-delete-quote]");

    if (loadButton) {
      const targetId = Number.parseInt(loadButton.dataset.loadQuote, 10);
      const quote = savedQuotes.find((entry) => entry.id === targetId);
      if (quote) {
        fillFormFromQuote(quote);
        setStatus(`Loaded saved quote for ${quote.jobName || DEFAULT_TOOL_PROFILES[quote.serviceType]?.label || "this job"}. Review the numbers and adjust anything that changed.`);
      }
    }

    if (deleteButton) {
      const targetId = Number.parseInt(deleteButton.dataset.deleteQuote, 10);
      savedQuotes = savedQuotes.filter((entry) => entry.id !== targetId);
      saveQuoteState(savedQuotes);
      renderHistory();
      setStatus("Removed one saved quote.");
    }
  });

  if (elements.copySummaryButton) {
    elements.copySummaryButton.addEventListener("click", copyQuoteSummary);
  }

  if (elements.emailSummaryButton) {
    elements.emailSummaryButton.addEventListener("click", emailQuoteSummary);
  }

  if (elements.copyClientSheetButton) {
    elements.copyClientSheetButton.addEventListener("click", copyClientSheet);
  }

  if (elements.copyClientSheetPrimaryButton) {
    elements.copyClientSheetPrimaryButton.addEventListener("click", copyClientSheet);
  }

  if (elements.copyClientSheetMobileButton) {
    elements.copyClientSheetMobileButton.addEventListener("click", copyClientSheet);
  }

  if (elements.emailClientSheetButton) {
    elements.emailClientSheetButton.addEventListener("click", emailClientSheet);
  }

  if (elements.printClientSheetButton) {
    elements.printClientSheetButton.addEventListener("click", printClientSheet);
  }

  if (elements.useSuggestedScopeButton) {
    elements.useSuggestedScopeButton.addEventListener("click", () => {
      const result = calculateQuote();
      elements.customerScope.value = buildSuggestedScope(result);
      calculateQuote();
      setStatus("Inserted the suggested client scope. Edit it if you want to match the job more closely.");
    });
  }

  if (elements.saveQuoteResultButton) {
    elements.saveQuoteResultButton.addEventListener("click", saveCurrentQuote);
  }

  elements.serviceShortcuts.forEach((button) => {
    button.addEventListener("click", () => {
      const serviceKey = button.dataset.serviceShortcut;
      if (!serviceKey) {
        return;
      }

      applyProfile(serviceKey, false);
      setStatus(
        `Loaded the ${DEFAULT_TOOL_PROFILES[serviceKey]?.label || "service"} preset. Next step: adjust hours, materials, and extras for the real job.`
      );
    });
  });

  renderHistory();
  applyProfile(elements.serviceType.value || "painting");
  setStatus("Ready to price. Choose a service or tap Try example.");
}

hydrateAdSlots();
initializeQuoteWorkbench();
