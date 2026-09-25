const inputView = document.getElementById("inputView");
const loadingView = document.getElementById("loadingView");
const resultView = document.getElementById("resultView");

const selectionStatus = document.getElementById("selectionStatus");
const selectedTextBox = document.getElementById("selectedTextBox");
const selectedTextElement = document.getElementById("selectedText");

const analyzeButton = document.getElementById("analyzeButton");
const openDishaButton = document.getElementById("openDisha");

const resultCount = document.getElementById("resultCount");
const resultCompleteness = document.getElementById("resultCompleteness");
const recommendationsContainer =
  document.getElementById("recommendations");

const viewFullAnalysisButton =
  document.getElementById("viewFullAnalysis");

const newAnalysisButton =
  document.getElementById("newAnalysis");

let selectedText = "";
let analysisId = "";

function setStatus(message, type = "neutral") {
  selectionStatus.textContent = message;
  selectionStatus.className = "selection-status";

  if (type === "success") {
    selectionStatus.classList.add("success");
  }

  if (type === "warning") {
    selectionStatus.classList.add("warning");
  }
}

async function checkBackend() {
  const connectionDot =
    document.querySelector(".connection-dot");

  const connectionTitle =
    document.querySelector(".connection strong");

  const connectionSubtitle =
    document.querySelector(".connection span");

  try {
    const response =
      await fetch("http://localhost:8000/health");

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    const data = await response.json();

    if (data.status !== "healthy") {
      throw new Error("Backend unhealthy");
    }

    connectionDot.classList.remove("offline");

    connectionTitle.textContent = "DISHA system";
    connectionSubtitle.textContent = "Backend connected";

    return true;

  } catch (error) {

    connectionDot.classList.add("offline");

    connectionTitle.textContent = "DISHA system";
    connectionSubtitle.textContent = "Backend unavailable";

    return false;
  }
}

function checkSelectedText() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    async (tabs) => {
      if (!tabs.length) {
        setStatus(
          "No active webpage found.",
          "warning"
        );
        return;
      }

      const tabId = tabs[0].id;

      // First try the existing content script.
      chrome.tabs.sendMessage(
        tabId,
        {
          type: "GET_SELECTED_TEXT",
        },
        async (response) => {
          if (!chrome.runtime.lastError) {
            handleSelectedText(response?.text || "");
            return;
          }

          // Content script is unavailable.
          // Fall back to injecting a small selection reader.
          try {
            const results =
              await chrome.scripting.executeScript({
                target: {
                  tabId: tabId,
                },
                func: () => {
                  return window.getSelection().toString().trim();
                },
              });

            const text =
              results?.[0]?.result || "";

            handleSelectedText(text);

          } catch (error) {
            console.error(
              "DISHA selection access error:",
              error
            );

            setStatus(
              "This webpage does not allow DISHA selection access.",
              "warning"
            );

            selectedTextBox.classList.add("hidden");
            analyzeButton.disabled = true;
          }
        }
      );
    }
  );
}

function handleSelectedText(text) {
  selectedText = text.trim();

  if (!selectedText) {
    setStatus(
      "No text selected. Highlight a procurement specification first.",
      "warning"
    );

    selectedTextBox.classList.add("hidden");
    analyzeButton.disabled = true;

    return;
  }

  setStatus(
    "Procurement text detected and ready for analysis.",
    "success"
  );

  selectedTextElement.textContent = selectedText;

  selectedTextBox.classList.remove("hidden");

  analyzeButton.disabled = false;
}
async function analyzeSpecification() {

  if (!selectedText) {
    return;
  }

  const backendAvailable =
    await checkBackend();

  if (!backendAvailable) {

    setStatus(
      "DISHA backend is unavailable. Start the FastAPI server and try again.",
      "warning"
    );

    return;
  }

  inputView.classList.add("hidden");
  resultView.classList.add("hidden");
  loadingView.classList.remove("hidden");

  try {

    const response = await fetch(
      "http://localhost:8000/api/v1/analyze",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text: selectedText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Analysis request failed: ${response.status}`
      );
    }

    const data = await response.json();

    analysisId = data.analysis_id;

    renderResults(data);

    loadingView.classList.add("hidden");
    resultView.classList.remove("hidden");

  } catch (error) {

    console.error("DISHA analysis error:", error);

    loadingView.classList.add("hidden");
    inputView.classList.remove("hidden");

    setStatus(
      "Analysis failed. Please make sure the DISHA backend is running.",
      "warning"
    );
  }
}

function renderResults(data) {

  const recommendations =
    data.recommendations || [];

  resultCount.textContent =
    recommendations.length;

  const completeness =
    Math.round(data.confidence ?? 0);

  resultCompleteness.innerHTML = `
    <div class="completeness-value">
      ${completeness}%
    </div>

    <div>
      <strong>Specification completeness</strong>
      <span>
        Based on the procurement information detected in the specification.
      </span>
    </div>
  `;

  recommendationsContainer.innerHTML = "";

  recommendations
    .slice(0, 4)
    .forEach((standard) => {

      const card =
        document.createElement("div");

      card.className =
        "recommendation-card";

      const category =
        standard.category ||
        standard.recommendation_type ||
        "Standard";

      const relevance =
        Math.round(
          standard.relevance_score ?? 0
        );

      card.innerHTML = `
        <div class="recommendation-top">

          <div>
            <div class="standard-id">
              ${escapeHtml(
                standard.standard_id || ""
              )}
            </div>

            <strong class="standard-title">
              ${escapeHtml(
                cleanPrototypeTitle(
                  standard.title || ""
                )
              )}
            </strong>
          </div>

          <span class="relevance">
            ${relevance}%
          </span>

        </div>

        <div class="recommendation-meta">

          <span>
            ${escapeHtml(category)}
          </span>

          <span>
            ${escapeHtml(
              standard.status || "ACTIVE"
            )}
          </span>

        </div>
      `;

      recommendationsContainer.appendChild(card);
    });

  if (!recommendations.length) {

    recommendationsContainer.innerHTML = `
      <div class="no-results">
        <strong>No matching standards identified.</strong>
        <span>
          The specification may require additional information.
        </span>
      </div>
    `;
  }
}

function cleanPrototypeTitle(title) {

  return title
    .replace(
      " — Prototype Standard Record",
      ""
    )
    .replace(
      " - Prototype Standard Record",
      ""
    );
}

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}

analyzeButton.addEventListener(
  "click",
  analyzeSpecification
);

openDishaButton.addEventListener(
  "click",
  () => {

    chrome.tabs.create({
      url: "http://localhost:5173/",
    });

  }
);

viewFullAnalysisButton.addEventListener(
  "click",
  () => {

    if (!analysisId) {
      return;
    }

    chrome.tabs.create({
      url:
        `http://localhost:5173/analysis/${analysisId}`,
    });

  }
);

newAnalysisButton.addEventListener(
  "click",
  () => {

    selectedText = "";
    analysisId = "";

    resultView.classList.add("hidden");
    loadingView.classList.add("hidden");
    inputView.classList.remove("hidden");

    selectedTextBox.classList.add("hidden");

    analyzeButton.disabled = true;

    checkSelectedText();
  }
);

checkBackend();
checkSelectedText();