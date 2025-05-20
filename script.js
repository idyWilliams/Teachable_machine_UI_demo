let model; // Variable to hold the loaded model
let webcamElement = document.getElementById("webcam"); // Webcam video element

// Async function to initialize the webcam and load the model
async function init() {
  try {
    // Load the Teachable Machine model
    const modelURL =
      "https://teachablemachine.withgoogle.com/models/7cEccJReh/model.json"; // Replace with your model's URL
    model = await tf.loadGraphModel(modelURL);

    // Access the user's webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcamElement.srcObject = stream;

    // Wait for the video to load metadata
    await new Promise((resolve) => {
      webcamElement.onloadedmetadata = () => {
        resolve();
      };
    });
  } catch (error) {
    console.error("Error initializing the application:", error);
  }
}

// Function to perform prediction
async function predict() {
  try {
    // Capture the current frame from the webcam
    const tensor = tf.browser
      .fromPixels(webcamElement)
      .resizeNearestNeighbor([224, 224]) // Resize to the model's input size
      .toFloat()
      .expandDims(); // Add batch dimension

    // Perform prediction
    const prediction = await model.predict(tensor).data();

    // Find the class with the highest probability
    const highestProbability = Math.max(...prediction);
    const predictedIndex = prediction.indexOf(highestProbability);

    // Display the prediction result
    document.getElementById(
      "result"
    ).innerText = `Prediction: Class ${predictedIndex} (${(
      highestProbability * 100
    ).toFixed(2)}%)`;
  } catch (error) {
    console.error("Error during prediction:", error);
  }
}

// Add event listener to the predict button
document.getElementById("predict").addEventListener("click", predict);

// Initialize the application
init();
