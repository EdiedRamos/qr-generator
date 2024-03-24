function timeoutHandler(time) {
  let timeoutId = null;
  return (callback) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback();
    }, time);
  };
}

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
  downloadButton: domShort.byId("download-button"),
  shareButton: domShort.byId("share-button"),
  encoded: domShort.byQuery(".encoded"),
  goHome: domShort.byQuery(".go-home"),

  reactive: {
    qrImage: () => domShort.byQuery("#encoded img"),
    canvas: () => domShort.byQuery("canvas"),
  },
};

function clearPreviousQr() {
  const qrImage = references.reactive.qrImage();
  if (qrImage) {
    references.encoded.removeChild(qrImage);
  }
  const canvas = references.reactive.canvas();
  if (canvas) {
    references.encoded.removeChild(canvas);
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

function handleDownload() {
  references.downloadButton.addEventListener("click", function () {
    const canvas = references.reactive.canvas();
    const link = document.createElement("a");
    link.download = "qr_code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

function handleShare() {
  const eventsTimeoutHandler = timeoutHandler(1000);
  references.shareButton.addEventListener("click", function () {
    const canvas = references.reactive.canvas();
    canvas.toBlob(function (blob) {
      navigator.clipboard
        .write([new ClipboardItem({ [blob.type]: blob })])
        .then(() => {
          references.shareButton.classList.add("success-state");
          eventsTimeoutHandler(() =>
            references.shareButton.classList.remove("success-state")
          );
        })
        .catch((err) => console.warn("copy qrcode: some went wrong", err));
    });
  });
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
  handleDownload();
  handleShare();
}

function main() {
  setupListeners();
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
