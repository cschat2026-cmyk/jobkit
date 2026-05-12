const ADSENSE_ENABLED = false;
const ADSENSE_CLIENT = "ca-pub-0000000000000000";
const CONTACT_EMAIL = "cschat2026@gmail.com";

const ADSENSE_SLOT_MAP = {
  leaderboard: "1000000001",
  sidebar: "1000000002",
  inline: "1000000003",
  footer: "1000000004"
};

const PROFILE_STORAGE_KEY = "sqhq_profiles_v2";
const QUOTE_STORAGE_KEY = "sqhq_quotes_v2";
const SUPPLY_SEARCH_STORAGE_KEY = "sqhq_supply_searches_v1";
const PROCUREMENT_STORAGE_KEY = "sqhq_procurement_bundles_v1";

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

const SUPPLY_PLATFORM_LINKS = [
  {
    label: "Amazon",
    buildUrl: (query) => `https://www.amazon.com/s?k=${encodeURIComponent(query)}`
  },
  {
    label: "Home Depot",
    buildUrl: (query) => `https://www.homedepot.com/s/${encodeURIComponent(query)}`
  },
  {
    label: "Lowe's",
    buildUrl: (query) => `https://www.lowes.com/search?searchTerm=${encodeURIComponent(query)}`
  },
  {
    label: "Walmart",
    buildUrl: (query) => `https://www.walmart.com/search?q=${encodeURIComponent(query)}`
  },
  {
    label: "eBay",
    buildUrl: (query) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`
  }
];

const SUPPLY_TEMPLATES = {
  painting: [
    {
      name: "Interior wall paint",
      budgetShare: [0.45, 0.7],
      rationale: "This search phrase keeps the result set focused on contractor-sized paint volume instead of small DIY cans.",
      makeQuery: (state) => `${state.area || 1} sq ft interior wall paint 5 gallon`,
      getGuide: (state) => `Start with about ${Math.max(1, Math.ceil((state.area || 400) / 350))} gallons for one moderate-coat pass.`
    },
    {
      name: "Primer and prep supplies",
      budgetShare: [0.15, 0.3],
      rationale: "Bundling primer, tape, and floor protection reduces the chance that prep costs get undercounted in the final job margin.",
      makeQuery: () => "interior paint primer painter tape drop cloth bundle",
      getGuide: () => "Useful when prep quality and floor protection matter more than lowest unit price."
    },
    {
      name: "Patch and repair materials",
      budgetShare: [0.08, 0.18],
      rationale: "This search is built for common touch-up and patch work so the user can price wall repair separately from coating materials.",
      makeQuery: () => "drywall patch spackle sanding sponge kit",
      getGuide: () => "Best for repaint jobs with nail pops, dents, and light wall repair."
    }
  ],
  cleaning: [
    {
      name: "General cleaning chemical set",
      budgetShare: [0.35, 0.55],
      rationale: "The phrase favors professional supply bundles, which are closer to recurring-service buying patterns than single-bottle retail searches.",
      makeQuery: () => "professional house cleaning supplies all purpose disinfectant microfiber bundle",
      getGuide: () => "Useful for recurring jobs where consistency matters more than one-time deep clean purchases."
    },
    {
      name: "Deep clean add-on supplies",
      budgetShare: [0.2, 0.38],
      rationale: "It targets heavier bathroom and kitchen reset supplies so users can separate deep-clean costs from standard recurring jobs.",
      makeQuery: () => "oven degreaser bathroom scale remover grout brush cleaning kit",
      getGuide: () => "Good when your quote includes a move-out, first-time clean, or heavy kitchen/bath reset."
    },
    {
      name: "Vacuum and tool accessories",
      budgetShare: [0.12, 0.24],
      rationale: "Accessory replacement quietly eats margin, so this search helps users account for consumables that are easy to forget in small jobs.",
      makeQuery: () => "commercial vacuum bags filter mop pad bulk",
      getGuide: () => "Helps protect margins on frequent recurring cleans where accessory replacement adds up."
    }
  ],
  pressure: [
    {
      name: "Surface cleaner or wand upgrade",
      budgetShare: [0.35, 0.6],
      rationale: "This phrase surfaces higher-output attachments that matter most when driveway and patio work is a repeated revenue line.",
      makeQuery: () => "pressure washer surface cleaner attachment commercial",
      getGuide: () => "Often worth checking if driveways and patios are a frequent quote type."
    },
    {
      name: "Degreaser and treatment chemicals",
      budgetShare: [0.18, 0.34],
      rationale: "It keeps the search focused on restoration chemistry instead of generic soap, which is more useful when charging for stain treatment.",
      makeQuery: () => "pressure washing degreaser oil stain treatment",
      getGuide: () => "Useful when your add-ons include stain treatment or heavier restoration work."
    },
    {
      name: "Hose, nozzles, and quick-connect parts",
      budgetShare: [0.1, 0.22],
      rationale: "These are common operational replacements, so the search is designed to support uptime rather than one-off shopping.",
      makeQuery: () => "pressure washer hose nozzle quick connect kit",
      getGuide: () => "A common maintenance purchase that can quietly affect job readiness and margin."
    }
  ],
  lawn: [
    {
      name: "String trimmer line and blades",
      budgetShare: [0.18, 0.34],
      rationale: "This phrase prioritizes recurring-use consumables that route-based operators buy again and again during the season.",
      makeQuery: () => "commercial trimmer line edger blades bulk",
      getGuide: () => "Recurring route work benefits from keeping these consumables easy to reorder."
    },
    {
      name: "Weed control and bed cleanup supplies",
      budgetShare: [0.22, 0.4],
      rationale: "It narrows results to detail-work materials so the user can justify add-on pricing beyond basic mowing.",
      makeQuery: () => "landscape weed control gloves yard waste bags",
      getGuide: () => "Best when your quote includes detail work beyond simple mowing and blowing."
    },
    {
      name: "Fuel, oil, and maintenance bundle",
      budgetShare: [0.18, 0.32],
      rationale: "Maintenance inputs are easy to ignore in small-job quoting, so this search keeps route reliability costs visible.",
      makeQuery: () => "small engine oil fuel can air filter mower maintenance kit",
      getGuide: () => "Helpful for protecting route reliability over the full season."
    }
  ]
};

function loadAdSenseScript() {
  if (!ADSENSE_ENABLED || !ADSENSE_CLIENT.startsWith("ca-pub-")) {
    return Promise.resolve(false);
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

function hydrateAdSlots() {
  const slots = document.querySelectorAll(".ad-slot[data-ad-slot-key]");

  if (!slots.length) {
    return;
  }

  if (!ADSENSE_ENABLED) {
    document.documentElement.dataset.adsense = "disabled";
    return;
  }

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

function formatBudgetRange(minValue, maxValue) {
  return `${formatCurrency(minValue)} to ${formatCurrency(maxValue)}`;
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

function loadSupplySearchState() {
  try {
    return JSON.parse(localStorage.getItem(SUPPLY_SEARCH_STORAGE_KEY) || "[]");
  } catch (error) {
    console.error("Failed to load saved supply searches:", error);
    return [];
  }
}

function saveSupplySearchState(searches) {
  localStorage.setItem(SUPPLY_SEARCH_STORAGE_KEY, JSON.stringify(searches));
}

function loadProcurementState() {
  try {
    return JSON.parse(localStorage.getItem(PROCUREMENT_STORAGE_KEY) || "[]");
  } catch (error) {
    console.error("Failed to load saved procurement bundles:", error);
    return [];
  }
}

function saveProcurementState(entries) {
  localStorage.setItem(PROCUREMENT_STORAGE_KEY, JSON.stringify(entries));
}

function initializeQuoteWorkbench() {
  const form = document.querySelector("[data-quote-workbench]");

  if (!form) {
    return;
  }

  let profiles = loadProfileState();
  let savedQuotes = loadQuoteState();
  let savedSupplySearches = loadSupplySearchState();
  let savedProcurements = loadProcurementState();

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
    saveProfileButton: document.getElementById("save-profile"),
    saveQuoteButton: document.getElementById("save-quote"),
    saveQuoteMobileButton: document.getElementById("save-quote-mobile"),
    resetButton: document.getElementById("reset-workbench"),
    clearHistoryButton: document.getElementById("clear-history"),
    serviceShortcuts: Array.from(document.querySelectorAll("[data-service-shortcut]")),
    quoteSummary: document.getElementById("quote-summary"),
    copySummaryButton: document.getElementById("copy-summary"),
    emailSummaryButton: document.getElementById("email-summary"),
    supplyList: document.getElementById("supply-list"),
    supplyCostShare: document.getElementById("supply-cost-share"),
    supplySearchInput: document.getElementById("supply-search-input"),
    saveSupplySearchButton: document.getElementById("save-supply-search"),
    supplySearchStatus: document.getElementById("supply-search-status"),
    recentSupplyEmpty: document.getElementById("recent-supply-empty"),
    recentSupplySearches: document.getElementById("recent-supply-searches"),
    procurementSummary: document.getElementById("procurement-summary"),
    saveProcurementButton: document.getElementById("save-procurement"),
    copyProcurementButton: document.getElementById("copy-procurement"),
    downloadProcurementButton: document.getElementById("download-procurement"),
    savedProcurementEmpty: document.getElementById("saved-procurement-empty"),
    savedProcurementList: document.getElementById("saved-procurement-list"),
    clientSheetPreview: document.getElementById("client-sheet-preview"),
    copyClientSheetButton: document.getElementById("copy-client-sheet"),
    emailClientSheetButton: document.getElementById("email-client-sheet"),
    printClientSheetButton: document.getElementById("print-client-sheet")
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
    renderProcurementSummary({
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
    renderSupplyCompare({
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

    lines.push("Built with JobQuote Kit quote workbench.");
    return lines.join("\n");
  }

  function renderQuoteSummary(result) {
    if (!elements.quoteSummary) {
      return;
    }

    elements.quoteSummary.textContent = buildQuoteSummary(result);
  }

  function buildPlatformLinks(query) {
    return SUPPLY_PLATFORM_LINKS.map(
      (platform) => `
        <a class="supply-link-pill" href="${platform.buildUrl(query)}" target="_blank" rel="noopener noreferrer">
          ${platform.label}
        </a>
      `
    ).join("");
  }

  function renderSupplyCompare(result) {
    if (!elements.supplyList) {
      return;
    }

    const template = SUPPLY_TEMPLATES[result.serviceType] || SUPPLY_TEMPLATES.painting;
    const materialsShare = result.recommendedQuote > 0 ? Math.round((result.materials / result.recommendedQuote) * 100) : 0;

    if (elements.supplyCostShare) {
      elements.supplyCostShare.textContent =
        result.materials > 0
          ? `Materials currently account for about ${materialsShare}% of this quote. Use the compare links to sense-check your purchasing budget.`
          : "No materials cost is entered yet. Add one if you want a clearer purchasing benchmark.";
    }

    elements.supplyList.innerHTML = template
      .map((item) => {
        const query = item.makeQuery(result);
        const lowBudget = Math.round((result.materials || result.recommendedQuote || 0) * item.budgetShare[0]);
        const highBudget = Math.round((result.materials || result.recommendedQuote || 0) * item.budgetShare[1]);
        return `
          <article class="supply-item">
            <div class="supply-item-header">
              <strong>${item.name}</strong>
              <button type="button" class="tool-link-button" data-supply-query="${encodeURIComponent(query)}">Use this search</button>
            </div>
            <p>${item.getGuide(result)}</p>
            <div class="supply-meta-grid">
              <article class="supply-meta-card">
                <span>Budget reference</span>
                <strong>${formatBudgetRange(lowBudget, highBudget)}</strong>
              </article>
              <article class="supply-meta-card">
                <span>Why this search works</span>
                <strong>${item.rationale}</strong>
              </article>
            </div>
            <div class="supply-link-row">
              ${buildPlatformLinks(query)}
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderRecentSupplySearches() {
    if (!elements.recentSupplySearches || !elements.recentSupplyEmpty) {
      return;
    }

    elements.recentSupplySearches.innerHTML = "";

    if (!savedSupplySearches.length) {
      elements.recentSupplyEmpty.hidden = false;
      return;
    }

    elements.recentSupplyEmpty.hidden = true;

    savedSupplySearches.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "recent-search-item";
      item.innerHTML = `
        <div>
          <strong>${entry.query}</strong>
          <p>${DEFAULT_TOOL_PROFILES[entry.serviceType]?.label || "Service"} · ${formatCompactDate(entry.savedAt)}</p>
        </div>
        <div class="saved-quote-actions">
          <button type="button" class="tool-link-button" data-run-supply-search="${entry.id}">Load</button>
          <button type="button" class="tool-link-button danger" data-delete-supply-search="${entry.id}">Delete</button>
        </div>
      `;
      elements.recentSupplySearches.appendChild(item);
    });
  }

  function saveSupplySearch() {
    const query = elements.supplySearchInput?.value.trim();

    if (!query) {
      setStatus("Enter a product or supply phrase first so the compare search can be saved.");
      return;
    }

    const entry = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      serviceType: elements.serviceType.value,
      query
    };

    savedSupplySearches = [entry, ...savedSupplySearches].slice(0, 10);
    saveSupplySearchState(savedSupplySearches);
    renderRecentSupplySearches();

    if (elements.supplySearchStatus) {
      elements.supplySearchStatus.textContent =
        "Saved compare search. You can reload it later and jump back out to supplier result pages.";
    }

    setStatus(`Saved a supply compare search for ${query}.`);
  }

  function buildProcurementSummary(result) {
    const serviceLabel = DEFAULT_TOOL_PROFILES[result.serviceType]?.label || "Service";
    const template = SUPPLY_TEMPLATES[result.serviceType] || SUPPLY_TEMPLATES.painting;
    const lines = [
      `JobQuote Kit procurement summary`,
      `${serviceLabel} job: ${result.jobName || "untitled job"}`,
      `Recommended quote: ${formatCurrency(result.recommendedQuote)}`,
      `Materials budget entered: ${formatCurrency(result.materials)}`,
      result.area ? `Job size / area: ${result.area}` : "Job size / area: not entered",
      "",
      "Suggested buying checklist:"
    ];

    template.forEach((item) => {
      const query = item.makeQuery(result);
      const lowBudget = Math.round((result.materials || result.recommendedQuote || 0) * item.budgetShare[0]);
      const highBudget = Math.round((result.materials || result.recommendedQuote || 0) * item.budgetShare[1]);
      lines.push(`- ${item.name}`);
      lines.push(`  Budget reference: ${formatBudgetRange(lowBudget, highBudget)}`);
      lines.push(`  Why this search works: ${item.rationale}`);
      lines.push(`  Search phrase: ${query}`);
    });

    lines.push("");
    lines.push(`Built on page: ${window.location.href || ""}`);
    return lines.join("\n");
  }

  function renderProcurementSummary(result) {
    if (!elements.procurementSummary) {
      return;
    }

    elements.procurementSummary.textContent = buildProcurementSummary(result);
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

  async function copyProcurementSummary() {
    const result = calculateQuote();
    const summary = buildProcurementSummary(result);

    if (!navigator.clipboard?.writeText) {
      window.alert("Copy is not supported in this browser. Please use the export option instead.");
      return;
    }

    try {
      await navigator.clipboard.writeText(summary);
      setStatus("Copied the procurement summary. You can paste it into email, notes, or your purchasing workflow.");
    } catch (error) {
      console.error("Failed to copy procurement summary:", error);
      window.alert("Copy failed in this browser. Please use the export option instead.");
    }
  }

  function downloadProcurementSummary() {
    const result = calculateQuote();
    const summary = buildProcurementSummary(result);
    const safeName = (result.jobName || `${result.serviceType}-procurement`).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const fileName = `${safeName || "procurement-summary"}.txt`;
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(`Exported procurement summary as ${fileName}.`);
  }

  function renderSavedProcurements() {
    if (!elements.savedProcurementList || !elements.savedProcurementEmpty) {
      return;
    }

    elements.savedProcurementList.innerHTML = "";

    if (!savedProcurements.length) {
      elements.savedProcurementEmpty.hidden = false;
      return;
    }

    elements.savedProcurementEmpty.hidden = true;

    savedProcurements.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "recent-search-item";
      item.innerHTML = `
        <div>
          <strong>${entry.jobName || DEFAULT_TOOL_PROFILES[entry.serviceType]?.label || "Procurement bundle"}</strong>
          <p>${DEFAULT_TOOL_PROFILES[entry.serviceType]?.label || "Service"} · ${formatCurrency(entry.recommendedQuote)} · ${formatCompactDate(entry.savedAt)}</p>
        </div>
        <div class="saved-quote-actions">
          <button type="button" class="tool-link-button" data-load-procurement="${entry.id}">Load</button>
          <button type="button" class="tool-link-button danger" data-delete-procurement="${entry.id}">Delete</button>
        </div>
      `;
      elements.savedProcurementList.appendChild(item);
    });
  }

  function saveCurrentProcurement() {
    const result = calculateQuote();
    const entry = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      serviceType: result.serviceType,
      jobName: result.jobName,
      area: result.area,
      hours: result.hours,
      crewSize: result.crewSize,
      laborRate: result.laborRate,
      materials: result.materials,
      travelFee: result.travelFee,
      addOns: result.addOns,
      overheadPct: result.overheadPct,
      profitPct: result.profitPct,
      minimumCharge: result.minimumCharge,
      customerScope: result.customerScope,
      notes: result.notes,
      recommendedQuote: result.recommendedQuote,
      procurementSummary: buildProcurementSummary(result)
    };

    savedProcurements = [entry, ...savedProcurements].slice(0, 12);
    saveProcurementState(savedProcurements);
    renderSavedProcurements();
    setStatus(
      `Saved procurement bundle for ${entry.jobName || DEFAULT_TOOL_PROFILES[entry.serviceType]?.label || "this job"}. You can reload the whole bundle later.`
    );
  }

  function loadProcurementIntoForm(entry) {
    elements.serviceType.value = entry.serviceType;
    elements.jobName.value = entry.jobName || "";
    elements.area.value = entry.area || "";
    elements.hours.value = entry.hours || "";
    elements.crewSize.value = entry.crewSize || "";
    elements.laborRate.value = entry.laborRate || "";
    elements.materials.value = entry.materials || "";
    elements.travelFee.value = entry.travelFee || "";
    elements.addOns.value = entry.addOns || "";
    elements.overheadPct.value = entry.overheadPct || "";
    elements.profitPct.value = entry.profitPct || "";
    elements.minimumCharge.value = entry.minimumCharge || "";
    elements.customerScope.value = entry.customerScope || "";
    elements.notes.value = entry.notes || "";

    renderProfileSummary(entry.serviceType);
    updateServiceShortcuts(entry.serviceType);
    calculateQuote();
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
      `Saved quote for ${result.jobName || DEFAULT_TOOL_PROFILES[result.serviceType]?.label || "this job"} locally. You can reload it from the history panel anytime.`
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

    renderProfileSummary(quote.serviceType);
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
        notes: "Two accent walls, minor patching, protect furniture and floors."
      },
      cleaning: {
        jobName: "Biweekly 3 Bed / 2 Bath Cleaning",
        area: 1800,
        hours: 6,
        materials: 28,
        addOns: 45,
        notes: "Includes fridge wipe-down and one pet-hair surcharge."
      },
      pressure: {
        jobName: "Driveway + Back Patio Wash",
        area: 1200,
        hours: 5,
        materials: 35,
        addOns: 70,
        notes: "Oil spot treatment and furniture move included."
      },
      lawn: {
        jobName: "Weekly Lawn Visit",
        area: 6500,
        hours: 2,
        materials: 0,
        addOns: 25,
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
    elements.notes.value = example.notes;
    calculateQuote();
  }

  form.addEventListener("input", () => {
    calculateQuote();
  });

  elements.serviceType.addEventListener("change", () => {
    applyProfile(elements.serviceType.value);
    setStatus(`Loaded your ${DEFAULT_TOOL_PROFILES[elements.serviceType.value]?.label || "service"} defaults. Next step: enter hours and job costs.`);
  });

  function handleLoadExample() {
    loadExampleQuote(elements.serviceType.value);
    setStatus("Example loaded. Review the numbers, change anything that does not match your job, then save the quote if you want to reuse it later.");
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
    setStatus(`Saved ${DEFAULT_TOOL_PROFILES[state.serviceType]?.label || "service"} pricing defaults in this browser. Next time you come back, this service will load faster.`);
  });

  elements.saveQuoteButton.addEventListener("click", saveCurrentQuote);

  if (elements.saveQuoteMobileButton) {
    elements.saveQuoteMobileButton.addEventListener("click", saveCurrentQuote);
  }

  elements.resetButton.addEventListener("click", () => {
    applyProfile(elements.serviceType.value, false);
    setStatus("Cleared the current quote. Your saved service defaults are still kept. Tip: use Load example if you want a quick starting point.");
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

  if (elements.supplyList) {
    elements.supplyList.addEventListener("click", (event) => {
      const searchButton = event.target.closest("[data-supply-query]");

      if (!searchButton || !elements.supplySearchInput) {
        return;
      }

      const query = decodeURIComponent(searchButton.dataset.supplyQuery || "");
      elements.supplySearchInput.value = query;

      if (elements.supplySearchStatus) {
        elements.supplySearchStatus.textContent =
          "Search phrase loaded. You can save it now or open supplier result pages from the cards above.";
      }

      setStatus(`Loaded supply compare phrase for ${query}.`);
    });
  }

  if (elements.saveSupplySearchButton) {
    elements.saveSupplySearchButton.addEventListener("click", saveSupplySearch);
  }

  if (elements.recentSupplySearches) {
    elements.recentSupplySearches.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-run-supply-search]");
      const deleteButton = event.target.closest("[data-delete-supply-search]");

      if (loadButton && elements.supplySearchInput) {
        const targetId = Number.parseInt(loadButton.dataset.runSupplySearch, 10);
        const savedSearch = savedSupplySearches.find((entry) => entry.id === targetId);

        if (savedSearch) {
          elements.supplySearchInput.value = savedSearch.query;

          if (elements.supplySearchStatus) {
            elements.supplySearchStatus.textContent =
              "Saved compare search loaded. Edit it if needed, or open supplier result pages from the recommendation cards.";
          }

          setStatus(`Loaded saved supply compare search for ${savedSearch.query}.`);
        }
      }

      if (deleteButton) {
        const targetId = Number.parseInt(deleteButton.dataset.deleteSupplySearch, 10);
        savedSupplySearches = savedSupplySearches.filter((entry) => entry.id !== targetId);
        saveSupplySearchState(savedSupplySearches);
        renderRecentSupplySearches();
        setStatus("Removed one saved supply compare search.");
      }
    });
  }

  if (elements.copySummaryButton) {
    elements.copySummaryButton.addEventListener("click", copyQuoteSummary);
  }

  if (elements.emailSummaryButton) {
    elements.emailSummaryButton.addEventListener("click", emailQuoteSummary);
  }

  if (elements.copyProcurementButton) {
    elements.copyProcurementButton.addEventListener("click", copyProcurementSummary);
  }

  if (elements.downloadProcurementButton) {
    elements.downloadProcurementButton.addEventListener("click", downloadProcurementSummary);
  }

  if (elements.copyClientSheetButton) {
    elements.copyClientSheetButton.addEventListener("click", copyClientSheet);
  }

  if (elements.emailClientSheetButton) {
    elements.emailClientSheetButton.addEventListener("click", emailClientSheet);
  }

  if (elements.printClientSheetButton) {
    elements.printClientSheetButton.addEventListener("click", printClientSheet);
  }

  if (elements.saveProcurementButton) {
    elements.saveProcurementButton.addEventListener("click", saveCurrentProcurement);
  }

  if (elements.savedProcurementList) {
    elements.savedProcurementList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-procurement]");
      const deleteButton = event.target.closest("[data-delete-procurement]");

      if (loadButton) {
        const targetId = Number.parseInt(loadButton.dataset.loadProcurement, 10);
        const savedBundle = savedProcurements.find((entry) => entry.id === targetId);

        if (savedBundle) {
          loadProcurementIntoForm(savedBundle);
          setStatus(
            `Loaded procurement bundle for ${savedBundle.jobName || DEFAULT_TOOL_PROFILES[savedBundle.serviceType]?.label || "this job"}.`
          );
        }
      }

      if (deleteButton) {
        const targetId = Number.parseInt(deleteButton.dataset.deleteProcurement, 10);
        savedProcurements = savedProcurements.filter((entry) => entry.id !== targetId);
        saveProcurementState(savedProcurements);
        renderSavedProcurements();
        setStatus("Removed one saved procurement bundle.");
      }
    });
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
  renderRecentSupplySearches();
  renderSavedProcurements();
  applyProfile(elements.serviceType.value || "painting");
  setStatus("Quote workspace ready. Best first step: choose a service or tap Load example.");
}

hydrateAdSlots();
initializeQuoteWorkbench();
