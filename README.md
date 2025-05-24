# 🤖 Teachable Machine Demo

A modern, responsive web application for real-time image classification using Google's Teachable Machine. Perfect for facial recognition, object detection, and custom image classification tasks.

![Teachable Machine Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=AI+Vision+Classifier)

## ✨ Features

- 🎯 **Real-time Recognition**: Live camera feed with instant predictions
- 🔒 **High Accuracy**: Configurable confidence threshold to prevent false positives
- 🎨 **Modern UI**: Beautiful glass-morphism design with smooth animations
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices
- ⚡ **Fast**: Optimized for performance with TensorFlow.js
- 🔧 **Customizable**: Easy configuration for different models and settings

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/idyWilliams/Teachable_machine_UI_demo
cd Teachable_machine_UI_demo
```

### 2. Get Your Teachable Machine Model
1. Go to [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Create a new **Image Project**
3. Train your model with your images
4. Click **Export Model**
5. Select **TensorFlow.js**
6. Copy the model URL (looks like: `https://teachablemachine.withgoogle.com/models/abc123/`)

### 3. Configure Your Model
Open `script.js` and replace the model URL:

```javascript
// Replace this with your Teachable Machine model URL
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/";
```

### 4. Serve the Application
Since the app uses camera access, you need to serve it over HTTPS or localhost:

#### Option A: Python Simple Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option B: Node.js Live Server
```bash
npm install -g live-server
live-server
```

#### Option C: VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

### 5. Open in Browser
Navigate to `http://localhost:8000` (or the port shown in your terminal)

## 📁 Project Structure

```
ai-vision-classifier/
├── index.html          # Main HTML file
├── styles.css          # Custom styles and animations
├── script.js           # Main application logic
├── config.js           # Configuration settings (optional)
├── README.md           # This file
└── assets/             # Images and other assets (optional)
```

## ⚙️ Configuration

### Model Settings
In `script.js`, adjust these settings:

```javascript
const CONFIG = {
  confidenceThreshold: 0.85,  // Minimum confidence for recognition (0.0-1.0)
  webcamSize: 300,           // Camera resolution
  flipCamera: true           // Mirror the camera feed
};
```

### Confidence Threshold Guide
- **0.95+**: Very strict (almost no false positives, might miss some correct ones)
- **0.85**: Recommended (good balance)
- **0.70**: Moderate (more lenient, some false positives possible)
- **0.50**: Loose (many false positives likely)

## 🎯 Training Your Model Effectively

### Best Practices for High Accuracy

1. **Diverse Training Data**
   - 100+ images per person/class
   - Different lighting conditions
   - Various angles and expressions
   - Multiple backgrounds
   - Different times of day

2. **Include an "Unknown" Class**
   - Add a class called "Unknown" or "Not Recognized"
   - Include images of other people
   - Add some empty/background images
   - This prevents false positives

3. **Quality Over Quantity**
   - Clear, non-blurry images
   - Consistent image quality
   - Avoid extreme lighting
   - Good face-to-background contrast

### Example Training Structure
```
Your Model Classes:
├── Williams (150 images)
├── Sarah (140 images)
├── Mike (160 images)
└── Unknown (100 images) ← Important!
```

## 🔧 Customization

### Changing the UI Theme
Edit `styles.css` to customize colors:

```css
.gradient-bg {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Adding New Features
The code is modular and well-commented. Key functions:
- `predict()`: Handles model predictions
- `updateStatus()`: Updates UI messages
- `init()`: Initializes camera and model

## 🚨 Troubleshooting

### Camera Not Working
- **Check HTTPS**: Camera requires HTTPS or localhost
- **Browser Permissions**: Allow camera access when prompted
- **Multiple Tabs**: Close other tabs using the camera

### Model Not Loading
- **Verify URL**: Check your Teachable Machine model URL
- **Network Issues**: Ensure stable internet connection
- **CORS Issues**: Model must be publicly accessible

### False Positives
- **Increase Threshold**: Set `confidenceThreshold` to 0.90+
- **Add "Unknown" Class**: Train with negative examples
- **More Training Data**: Add diverse images to your model

### Performance Issues
- **Reduce Webcam Size**: Lower `webcamSize` in config
- **Close Other Tabs**: Free up browser resources
- **Check Hardware**: Ensure adequate CPU/GPU power

## 📱 Browser Compatibility

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅      | ✅     |
| Firefox | ✅      | ✅     |
| Safari  | ✅      | ⚠️*    |
| Edge    | ✅      | ✅     |

*Safari mobile requires iOS 14.3+

## 🔒 Privacy & Security

- **Local Processing**: All recognition happens in your browser
- **No Data Sent**: Images are not transmitted to external servers
- **Camera Privacy**: Camera access is only used for real-time recognition

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: widorenyin0@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/idyWilliams/Teachable_machine_UI_demo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/idyWilliams/Teachable_machine_UI_demo/discussions)

## 🙏 Acknowledgments

- [Google's Teachable Machine](https://teachablemachine.withgoogle.com/) for the amazing ML platform
- [TensorFlow.js](https://www.tensorflow.org/js) for browser-based machine learning
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling system

---

**Made with ❤️ for the AI community by [Williams](https://www.linkedin.com/in/idorenyin-williams/)**