// ========================================
// AI VISION CLASSIFIER - TEACHABLE MACHINE
// ========================================

// TODO: Replace with your Teachable Machine model URL
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/rR4VGg7Q9/";

// Configuration
const CONFIG = {
  confidenceThreshold: 0.85,  // Increased threshold to prevent false positives
  webcamSize: 300,
  flipCamera: true
};

// Global variables
let model, webcam, labelContainer, maxPredictions;
let isRunning = false;

// ========================================
// UTILITY FUNCTIONS
// ========================================

function updateStatus(message, isError = false) {
  const statusDiv = document.getElementById("status");
  const className = isError ?
    "bg-red-100 bg-opacity-20 border border-red-400 rounded-xl p-4" :
    "bg-white bg-opacity-20 rounded-xl p-4";

  statusDiv.innerHTML = `
    <div class="${className}">
      <p class="text-white font-medium">${message}</p>
    </div>
  `;

  if (isError) {
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
      errorMessage.textContent = message.replace(/❌|⚠️/g, '').trim();
    }
  }
}

function waitForLibraries() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50;

    const checkLibraries = () => {
      attempts++;
      if (typeof tf !== 'undefined' && typeof tmImage !== 'undefined') {
        resolve();
      } else if (attempts >= maxAttempts) {
        reject(new Error('Libraries failed to load'));
      } else {
        setTimeout(checkLibraries, 100);
      }
    };

    checkLibraries();
  });
}

// ========================================
// CAMERA PERMISSIONS
// ========================================

async function checkCameraPermissions() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    updateStatus("📸 Camera access granted - Ready to start!");
    document.getElementById("error-container").classList.add("hidden");
    return true;
  } catch (error) {
    console.error("Camera permission error:", error);
    if (error.name === 'NotAllowedError') {
      updateStatus("❌ Camera access denied. Please allow camera permissions.", true);
    } else if (error.name === 'NotFoundError') {
      updateStatus("❌ No camera found. Please connect a camera device.", true);
    } else if (error.name === 'NotSupportedError') {
      updateStatus("⚠️ Camera not supported. Please use HTTPS or localhost.", true);
    } else {
      updateStatus("❌ Camera access error. Please check your browser settings.", true);
    }
    document.getElementById("error-container").classList.remove("hidden");
    return false;
  }
}

// ========================================
// MODEL INITIALIZATION
// ========================================

async function init() {
  try {
    updateStatus("📚 Loading AI libraries...");
    await waitForLibraries();

    updateStatus("🔄 Loading AI model...");
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    updateStatus("📷 Initializing camera...");

    const flip = CONFIG.flipCamera;
    webcam = new tmImage.Webcam(CONFIG.webcamSize, CONFIG.webcamSize, flip);
    await webcam.setup();
    await webcam.play();

    const webcamContainer = document.getElementById("webcam-container");
    webcamContainer.innerHTML = "";
    webcam.canvas.style.borderRadius = "15px";
    webcamContainer.appendChild(webcam.canvas);

    setupPredictionLabels();

    document.getElementById("predictions-container").classList.remove("hidden");
    document.getElementById("error-container").classList.add("hidden");

    updateStatus("✅ AI Vision Active - Analyzing in real-time");

    document.getElementById("buttonText").textContent = "⏹️ Stop Camera";
    isRunning = true;

    window.requestAnimationFrame(loop);

  } catch (error) {
    console.error("Initialization error:", error);
    updateStatus("❌ Error loading model or accessing camera", true);
    document.getElementById("error-container").classList.remove("hidden");
    document.getElementById("buttonText").textContent = "🔄 Try Again";
    isRunning = false;
  }
}

function setupPredictionLabels() {
  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = "";

  for (let i = 0; i < maxPredictions; i++) {
    const predictionDiv = document.createElement("div");
    predictionDiv.className = "recognition-card bg-white bg-opacity-20 rounded-xl p-3 mb-2";
    predictionDiv.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="text-white font-medium">Loading...</span>
        <span class="text-white text-sm">0%</span>
      </div>
      <div class="w-full bg-white bg-opacity-20 rounded-full h-1 mt-2">
        <div class="prediction-bar h-1 rounded-full" style="width: 0%"></div>
      </div>
    `;
    labelContainer.appendChild(predictionDiv);
  }
}

// ========================================
// PREDICTION LOOP
// ========================================

async function loop() {
  if (isRunning && webcam) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  }
}

async function predict() {
  try {
    const prediction = await model.predict(webcam.canvas);

    // Find highest confidence prediction
    let highestPrediction = prediction[0];
    let highestIndex = 0;

    for (let i = 1; i < prediction.length; i++) {
      if (prediction[i].probability > highestPrediction.probability) {
        highestPrediction = prediction[i];
        highestIndex = i;
      }
    }

    // Check if prediction is confident enough
    const isConfident = highestPrediction.probability > CONFIG.confidenceThreshold;

    // Update each prediction display
    for (let i = 0; i < maxPredictions; i++) {
      const probability = (prediction[i].probability * 100);
      const className = prediction[i].className;
      const predictionDiv = labelContainer.children[i];

      if (i === highestIndex && isConfident) {
        // Show recognized person prominently
        predictionDiv.innerHTML = `
          <div class="text-center py-4">
            <div class="text-3xl mb-2">👋</div>
            <div class="text-xl font-bold text-white mb-1">Hello!</div>
            <div class="text-2xl font-bold text-yellow-300">${className}</div>
            <div class="text-sm text-white text-opacity-80 mt-2">Confidence: ${probability.toFixed(1)}%</div>
          </div>
        `;
        predictionDiv.className = "recognition-card recognized ring-4 ring-yellow-400 ring-opacity-60 rounded-xl p-3 mb-2";
      } else {
        // Show other predictions with reduced opacity
        predictionDiv.innerHTML = `
          <div class="flex justify-between items-center opacity-50">
            <span class="text-white font-medium">${className}</span>
            <span class="text-white text-sm">${probability.toFixed(1)}%</span>
          </div>
          <div class="w-full bg-white bg-opacity-20 rounded-full h-1 mt-2">
            <div class="prediction-bar h-1 rounded-full transition-all duration-300" style="width: ${probability}%"></div>
          </div>
        `;
        predictionDiv.className = "recognition-card unknown bg-white bg-opacity-20 rounded-xl p-3 mb-2";
      }
    }

    // Update main status
    if (isConfident) {
      updateStatus(`✨ Recognized: ${highestPrediction.className}!`);
    } else {
      updateStatus("🔍 Looking for a match... (No confident recognition)");
    }

  } catch (error) {
    console.error("Prediction error:", error);
  }
}

// ========================================
// CAMERA CONTROLS
// ========================================

function stopCamera() {
  if (webcam) {
    webcam.stop();
  }
  isRunning = false;
  document.getElementById("predictions-container").classList.add("hidden");
  document.getElementById("webcam-container").innerHTML = "";
  document.getElementById("buttonText").textContent = "🚀 Start Camera";
  updateStatus("Ready to start classification");
}

function toggleCamera() {
  if (isRunning) {
    stopCamera();
  } else {
    init();
  }
}

// ========================================
// PAGE LOAD INITIALIZATION
// ========================================

window.addEventListener('load', async () => {
  setTimeout(async () => {
    await checkCameraPermissions();

    if (typeof tmImage === 'undefined') {
      updateStatus("❌ AI libraries failed to load. Please refresh the page.", true);
      document.getElementById("error-container").classList.remove("hidden");
    }
  }, 2000);
});