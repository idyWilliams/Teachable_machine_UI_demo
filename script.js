// Variables to hold the model and webcam element
let model;
let webcamElement = document.getElementById("webcam");
const statusElement = document.getElementById("result");

// Create a simple model for demonstration
async function createDemoModel() {
  // Create a sequential model for image recognition (3 classes)
  const model = tf.sequential();

  // Add convolutional layers
  model.add(
    tf.layers.conv2d({
      inputShape: [224, 224, 3],
      filters: 16,
      kernelSize: 3,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  model.add(
    tf.layers.conv2d({
      filters: 32,
      kernelSize: 3,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: 3, activation: "softmax" })); // 3 output classes

  // Compile the model
  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  console.log("Demo model created successfully");
  return model;
}

// Async function to initialize the webcam and create/load the model
async function init() {
  try {
    statusElement.innerText = "Initializing camera and model...";

    // Create our demo model
    model = await createDemoModel();

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
    statusElement.innerText =
      "Ready! (Using a simple demo model - click Predict)";

    // Enable the predict button once everything is loaded
    document.getElementById("predict").disabled = false;
  } catch (error) {
    console.error("Error initializing the application:", error);
    statusElement.innerText = "Error: " + error.message;
  }
}

// Function to perform prediction
async function predict() {
  try {
    // Make sure webcam is properly loaded
    if (!webcamElement.videoWidth || !webcamElement.videoHeight) {
      statusElement.innerText = "Camera not ready yet";
      return;
    }

    // Ensure the model is loaded
    if (!model) {
      statusElement.innerText = "Model not loaded yet";
      return;
    }

    // Display processing status
    statusElement.innerText = "Processing...";

    // Capture the current frame from the webcam
    const tensor = tf.tidy(() => {
      // Create tensor from webcam feed
      const img = tf.browser.fromPixels(webcamElement);

      // Log the shape to debug
      console.log("Original image shape:", img.shape);

      // Resize to the model's expected input size
      const resized = tf.image.resizeBilinear(img, [224, 224]);
      console.log("Resized shape:", resized.shape);

      // Normalize the image (convert pixel values from 0-255 to 0-1)
      const normalized = resized.div(255.0);

      // Add batch dimension
      return normalized.expandDims(0);
    });

    console.log("Final tensor shape (should be [1,224,224,3]):", tensor.shape);

    // Perform prediction
    const predictions = await model.predict(tensor).data();
    tensor.dispose(); // Clean up the tensor to prevent memory leaks

    // Since this is a demo model with random weights, the predictions won't be meaningful
    // But we'll display them anyway for demonstration purposes
    const classNames = ["Class A", "Class B", "Class C"];

    // Create a nicely formatted output of all probabilities
    let resultHTML = `<div class="mt-2">`;
    for (let i = 0; i < predictions.length; i++) {
      const probability = (predictions[i] * 100).toFixed(2);
      resultHTML += `<div class="flex items-center mb-2">
        <div class="w-24">${classNames[i]}:</div>
        <div class="w-16 text-right mr-2">${probability}%</div>
        <div class="flex-grow bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${probability}%"></div>
        </div>
      </div>`;
    }
    resultHTML += `</div>`;

    // Display the prediction result
    statusElement.innerHTML = `Demo Model Prediction: ${resultHTML}`;
  } catch (error) {
    console.error("Error during prediction:", error);
    statusElement.innerText = "Error during prediction: " + error.message;
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
