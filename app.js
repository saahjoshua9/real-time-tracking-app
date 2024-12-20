const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set up canvas size to match the screen size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let model;

// Load TensorFlow COCO-SSD model for object detection
async function loadModel() {
    model = await cocoSsd.load();
    trackObjects();
}

// Function to track objects and update bounding boxes
async function trackObjects() {
    // Capture the screen and get image data
    const video = document.createElement('video');
    video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
    video.play();

    // Set up detection loop
    detectAndTrack(video);
}

// Detect objects in the video stream and draw bounding boxes
async function detectAndTrack(video) {
    const predictions = await model.detect(video);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // For each detected object, create a bounding box and number
    predictions.forEach((prediction, index) => {
        const [x, y, width, height] = prediction.bbox;
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = getColor(prediction.class);
        ctx.fillStyle = getColor(prediction.class);
        ctx.stroke();
        ctx.fillText(index + 1, x + 5, y + 15);
    });

    // Continuously call the detection function
    requestAnimationFrame(() => detectAndTrack(video));
}

// Assign a color to the bounding box based on object class
function getColor(className) {
    const colors = {
        'person': 'red',
        'bottle': 'blue',
        'cup': 'green',
        'car': 'yellow',
        'hand': 'purple',
    };
    return colors[className] || 'gray';
}

// Initialize the object detection model and start tracking
loadModel();
