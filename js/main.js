// ! CODE COPY AND DOWNLOAD BUTTONS

// DOM shorthands
const domShort = {
  byId: (id) => document.getElementById(id),
  byQuery: (cls) => document.querySelector(cls),
};

// DOM variables
const references = {
  qrForm: domShort.byId("qr-form"),
  qrInput: domShort.byId("qr-input"),
  urlInput: domShort.byId("url-input"),
  formSection: domShort.byId("form-section"),
  resultSection: domShort.byId("result-section"),
  encoded: domShort.byQuery(".encoded"),
  goHome: domShort.byQuery(".go-home"),

  reactive: {
    qrImage: () => domShort.byQuery("#encoded img"),
  },
};

function clearPreviousQr() {
  const qrImage = references.reactive.qrImage();
  if (qrImage) {
    references.encoded.removeChild(qrImage);
  }
}

function getQr() {
  new QRCode(references.encoded, {
    text: references.qrInput.value,
    width: 200,
    height: 200,
    colorDark: "#000",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

function renderResult() {
  clearPreviousQr();
  getQr();

  references.formSection.classList.add("hidden");
  references.resultSection.classList.remove("hidden");
}

function handleSubmit() {
  references.qrForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const { qrInput, urlInput } = references;

    // validation
    if (qrInput.value.trim().length > 0) {
      urlInput.classList.remove("invalid-input");
      renderResult();
    } else {
      urlInput.classList.add("invalid-input");
    }
  });
}

function handleGoHome() {
  references.goHome.addEventListener("click", () => {
    references.qrInput.value = "";
    if (references.qrCode) {
      console.log({ qrCode: references.qrCode });
    }
    references.formSection.classList.remove("hidden");
    references.resultSection.classList.add("hidden");
  });
}

function setupListeners() {
  handleSubmit();
  handleGoHome();
}

function main() {
  setupListeners();
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
