// ========================================
// CONFIGURATION FILE
// ========================================

// 🔧 MODEL CONFIGURATION
// Replace this URL with your Teachable Machine model URL
const MODEL_CONFIG = {
  // Your Teachable Machine model URL (without model.json)
  url: "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/",

  // Confidence threshold (0.0 to 1.0)
  // Higher = more strict, Lower = more lenient
  confidenceThreshold: 0.85,
};

// 📷 CAMERA CONFIGURATION
const CAMERA_CONFIG = {
  // Webcam dimensions
  width: 300,
  height: 300,

  // Flip camera horizontally (mirror effect)
  flip: true,
};

// 🎨 UI CONFIGURATION
const UI_CONFIG = {
  // Auto-start camera permission check delay (milliseconds)
  permissionCheckDelay: 2000,

  // Animation duration for recognition effects
  animationDuration: 400,

  // Show detailed predictions (true/false)
  showDetailedPredictions: true,
};

// 🚀 EXPORT CONFIGURATION
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MODEL_CONFIG,
    CAMERA_CONFIG,
    UI_CONFIG,
  };
}
