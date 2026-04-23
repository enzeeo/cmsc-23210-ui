const TRACKING_ENDPOINT_URL = "https://script.google.com/macros/s/PLACEHOLDER/exec";
const SCROLL_TOLERANCE_IN_PIXELS = 2;

function getElements() {
  return {
    termsContainer: document.getElementById("termsContainer"),
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
  elements.nameInput.disabled = false;
  elements.acceptButton.disabled = false;
  elements.rejectButton.disabled = false;
  elements.statusMessage.textContent = "You can now enter your name and choose Accept or Reject.";
}

function showMessage(elements, messageText) {
  elements.statusMessage.textContent = messageText;
}

function buildTrackingPayload(typedName, selectedAction) {
  return {
    typedName,
    selectedAction,
    pressedAtIsoTimestamp: new Date().toISOString()
  };
}

async function sendTrackingData(payload) {
  await fetch(TRACKING_ENDPOINT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
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

  elements.termsContainer.addEventListener("scroll", () => {
    const reachedBottom = hasScrolledToBottom(elements.termsContainer);

    if (reachedBottom) {
      enableConsentControls(elements);
    }
  });

  elements.acceptButton.addEventListener("click", async () => {
    await handleButtonSelection("Accept", elements);
  });

  elements.rejectButton.addEventListener("click", async () => {
    await handleButtonSelection("Reject", elements);
  });
}

initializeTermsPage();
