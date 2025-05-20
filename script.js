let model; // Variable to hold the loaded model
let webcamElement = document.getElementById("webcam"); // Webcam video element

// Async function to initialize the webcam and load the model
async function init() {
  try {
    // Load the Teachable Machine model
    const modelURL =
      "https://teachablemachine.withgoogle.com/models/7cEccJReh/";
    model = await tf.loadLayersModel(modelURL + "model.json");

    // Access the user's webcam
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 224,
        height: 224,
      },
    });
    webcamElement.srcObject = stream;

    // Wait for the video to be ready
    await new Promise((resolve) => {
      webcamElement.onloadeddata = () => {
        resolve();
      };
    });

    console.log("Application initialized successfully");

    // Enable the predict button once everything is loaded
    document.getElementById("predict").disabled = false;
  } catch (error) {
    console.error("Error initializing the application:", error);
  }
}

// Function to perform prediction
async function predict() {
  try {
    // Make sure webcam is properly loaded
    if (!webcamElement.videoWidth || !webcamElement.videoHeight) {
      console.error("Video dimensions are not available yet");
      return;
    }

    // Ensure the model is loaded
    if (!model) {
      console.error("Model not loaded yet");
      return;
    }

    // Display processing status
    document.getElementById("result").innerText = "Processing...";

    // Capture the current frame from the webcam
    const tensor = tf.tidy(() => {
      // Create tensor from webcam feed
      const img = tf.browser.fromPixels(webcamElement);

      // Resize to the model's expected input size
      const resized = tf.image.resizeBilinear(img, [224, 224]);

      // Normalize the image (convert pixel values from 0-255 to 0-1)
      const normalized = resized.div(255.0);

      // Add batch dimension
      return normalized.expandDims(0);
    });

    // Perform prediction
    const predictions = await model.predict(tensor).data();
    tensor.dispose(); // Clean up the tensor to prevent memory leaks

    // Find the class with the highest probability
    const highestProbability = Math.max(...predictions);
    const predictedIndex = predictions.indexOf(highestProbability);

    // Get class names if available (modify this based on your model's classes)
    const classNames = ["Class 0", "Class 1", "Class 2"]; // Replace with your actual class names
    const className = classNames[predictedIndex] || `Class ${predictedIndex}`;

    // Display the prediction result
    document.getElementById("result").innerText = `Prediction: ${className} (${(
      highestProbability * 100
    ).toFixed(2)}%)`;
  } catch (error) {
    console.error("Error during prediction:", error);
    document.getElementById("result").innerText =
      "Error during prediction. See console for details.";
  }
}

// Add event listener to the predict button
document.getElementById("predict").addEventListener("click", predict);

// Disable the predict button until everything is loaded
document.getElementById("predict").disabled = true;

// Initialize the application
window.addEventListener("DOMContentLoaded", () => {
  init();
});
