const TRACKING_ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbyvP52mtJ8PRvbSj2yldQWy6eIUzoSrlTm4DKutetUIeg9rm7I7p6Dz4j2b6EPPIvh6jQ/exec";
const SCROLL_TOLERANCE_IN_PIXELS = 2;
const SMALL_PLANET_LAYER_COUNT = 5;
const DUST_PLANET_LAYER_COUNT = 50;
const STAR_TAIL_COUNT = 201;
const PLACEHOLDER_DOCUMENT_URL = "";
const PLACEHOLDER_DOCUMENT_TITLE = "Placeholder Terms and Conditions";
const PDF_CONTAINER_SCROLL_HEIGHT_OFFSET = 4;
const PDF_WIDTH_FIT_HASH = "#view=FitH&zoom=page-width";

function getElements() {
  return {
    cosmicBackground: document.getElementById("cosmicBackground"),
    termsContainer: document.getElementById("termsContainer"),
    termsDocumentFrame: document.getElementById("termsDocumentFrame"),
    nameInput: document.getElementById("nameInput"),
    acceptButton: document.getElementById("acceptButton"),
    rejectButton: document.getElementById("rejectButton"),
    statusMessage: document.getElementById("statusMessage")
  };
}

function hasScrolledToBottom(scrollableElement) {
  const visibleHeight = scrollableElement.clientHeight;
  const totalScrollHeight = scrollableElement.scrollHeight;
  const currentScrollTop = scrollableElement.scrollTop;
  const maxScrollPosition = totalScrollHeight - visibleHeight;
  const currentPosition = currentScrollTop + SCROLL_TOLERANCE_IN_PIXELS;

  return currentPosition >= maxScrollPosition;
}

function enableConsentControls(elements) {
  if (!elements.nameInput.disabled && !elements.acceptButton.disabled && !elements.rejectButton.disabled) {
    return;
  }

  elements.nameInput.disabled = false;
  elements.acceptButton.disabled = false;
  elements.rejectButton.disabled = false;
  elements.statusMessage.textContent = "You can now enter your name and choose Accept or Reject.";
}

function showMessage(elements, messageText) {
  elements.statusMessage.textContent = messageText;
}

function buildPlaceholderTermsDocument() {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          :root {
            color-scheme: light;
          }

          html {
            height: 100%;
            overflow-x: hidden;
          }

          body {
            min-height: 100%;
            margin: 0;
            font-family: "Trebuchet MS", "Segoe UI", sans-serif;
            color: #162033;
            background: #ffffff;
            overflow-x: hidden;
          }

          .document-shell {
            width: 100%;
            min-height: 100%;
            max-width: 100%;
            margin: 0;
            box-sizing: border-box;
            padding: 1.5rem;
            line-height: 1.65;
          }

          h2 {
            margin-top: 0;
            margin-bottom: 1rem;
            font-size: 1.4rem;
          }

          p {
            margin-top: 0;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="document-shell">
          <h2>${PLACEHOLDER_DOCUMENT_TITLE}</h2>
          <p>
            This embedded area is where your PDF will be shown. When you replace the frame source
            with a PDF file, it will render in this full-width document area and the viewer can
            scroll up and down inside it.
          </p>
          <p>
            This placeholder keeps the page usable now. It also keeps the bottom form unlocked once
            the document has been read or when the embedded viewer does not expose scroll progress.
          </p>
          <p>
            By continuing, you acknowledge that this example page records exactly what you type in
            the name field, which button you press, and the time of your action.
          </p>
          <p>
            Placeholder section 1: You agree to review updates when available.
            Placeholder section 2: You understand this page is for demonstration.
            Placeholder section 3: You understand tracking information is collected.
            Placeholder section 4: You confirm that you may continue to the next page.
          </p>
          <p>
            End of placeholder terms and conditions.
          </p>
        </div>
      </body>
    </html>
  `;
}

function documentDoesNotNeedScrolling(scrollableElement) {
  const totalScrollHeight = scrollableElement.scrollHeight;
  const visibleHeight = scrollableElement.clientHeight;

  return totalScrollHeight <= visibleHeight + PDF_CONTAINER_SCROLL_HEIGHT_OFFSET;
}

function tryGetFrameDocument(termsDocumentFrame) {
  try {
    return termsDocumentFrame.contentDocument;
  } catch (error) {
    return null;
  }
}

function buildDocumentFrameSource(documentUrl) {
  const lowercaseDocumentUrl = documentUrl.toLowerCase();

  if (!lowercaseDocumentUrl.endsWith(".pdf")) {
    return documentUrl;
  }

  if (documentUrl.includes("#")) {
    return documentUrl;
  }

  return `${documentUrl}${PDF_WIDTH_FIT_HASH}`;
}

function updateConsentAvailabilityForFrame(elements) {
  const frameDocument = tryGetFrameDocument(elements.termsDocumentFrame);

  if (!frameDocument) {
    enableConsentControls(elements);
    return;
  }

  const frameScrollRoot = frameDocument.scrollingElement || frameDocument.documentElement;

  if (!frameScrollRoot) {
    enableConsentControls(elements);
    return;
  }

  if (documentDoesNotNeedScrolling(frameScrollRoot) || hasScrolledToBottom(frameScrollRoot)) {
    enableConsentControls(elements);
  }
}

function connectFrameScrollTracking(elements) {
  const frameDocument = tryGetFrameDocument(elements.termsDocumentFrame);

  if (!frameDocument) {
    enableConsentControls(elements);
    return;
  }

  const frameWindow = elements.termsDocumentFrame.contentWindow;

  if (frameWindow) {
    frameWindow.addEventListener("scroll", () => {
      updateConsentAvailabilityForFrame(elements);
    });
  }

  frameDocument.addEventListener("scroll", () => {
    updateConsentAvailabilityForFrame(elements);
  });

  updateConsentAvailabilityForFrame(elements);
}

function initializeTermsDocumentFrame(elements) {
  if (!elements.termsDocumentFrame) {
    return;
  }

  elements.termsDocumentFrame.addEventListener("load", () => {
    connectFrameScrollTracking(elements);
  });

  if (PLACEHOLDER_DOCUMENT_URL.length > 0) {
    elements.termsDocumentFrame.src = buildDocumentFrameSource(PLACEHOLDER_DOCUMENT_URL);
  } else {
    elements.termsDocumentFrame.srcdoc = buildPlaceholderTermsDocument();
  }
}

function createBackgroundParticle() {
  const particleElement = document.createElement("div");

  particleElement.style.setProperty("--position-x", Math.random().toFixed(4));
  particleElement.style.setProperty("--position-y", Math.random().toFixed(4));
  particleElement.style.setProperty("--direction-x", (Math.random() - 0.5).toFixed(4));
  particleElement.style.setProperty("--direction-y", (Math.random() - 0.5).toFixed(4));
  particleElement.style.setProperty("--delay-factor", Math.random().toFixed(4));

  return particleElement;
}

function fillBackgroundLayer(layerElement, particleCount) {
  if (!layerElement) {
    return;
  }

  for (let i = 0; i < particleCount; i += 1) {
    layerElement.appendChild(createBackgroundParticle());
  }
}

function initializeCosmicBackground() {
  const elements = getElements();

  if (!elements.cosmicBackground) {
    return;
  }

  fillBackgroundLayer(
    elements.cosmicBackground.querySelector(".planets"),
    SMALL_PLANET_LAYER_COUNT
  );
  fillBackgroundLayer(
    elements.cosmicBackground.querySelector(".planets-2"),
    DUST_PLANET_LAYER_COUNT
  );
  fillBackgroundLayer(
    elements.cosmicBackground.querySelector(".startails"),
    STAR_TAIL_COUNT
  );
}

function buildTrackingPayload(typedName, selectedAction) {
  return {
    typedName,
    selectedAction,
    pressedAtIsoTimestamp: new Date().toISOString()
  };
}

async function sendTrackingData(payload) {
  const formData = new URLSearchParams();

  formData.append("typedName", payload.typedName);
  formData.append("selectedAction", payload.selectedAction);
  formData.append("pressedAtIsoTimestamp", payload.pressedAtIsoTimestamp);

  await fetch(TRACKING_ENDPOINT_URL, {
    method: "POST",
    body: formData
  });
}

async function handleButtonSelection(selectedAction, elements) {
  const typedName = elements.nameInput.value;

  if (typedName.length === 0) {
    showMessage(elements, "Please enter your name before continuing.");
    return;
  }

  const trackingPayload = buildTrackingPayload(typedName, selectedAction);

  try {
    await sendTrackingData(trackingPayload);
  } catch (error) {
    showMessage(elements, "Tracking endpoint is a placeholder right now. Continuing to next page.");
  }

  window.location.href = "link.html";
}

function initializeTermsPage() {
  const elements = getElements();

  if (!elements.termsContainer) {
    return;
  }

  initializeTermsDocumentFrame(elements);

  if (documentDoesNotNeedScrolling(elements.termsContainer)) {
    enableConsentControls(elements);
  }

  elements.acceptButton.addEventListener("click", async () => {
    await handleButtonSelection("Accept", elements);
  });

  elements.rejectButton.addEventListener("click", async () => {
    await handleButtonSelection("Reject", elements);
  });
}

initializeCosmicBackground();
initializeTermsPage();
