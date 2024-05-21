const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function detectObjects() {
    const model = await cocoSsd.load();
    video.play();
    requestAnimationFrame(() => detectFrame(video, model));
}

function detectFrame(video, model) {
    model.detect(video).then(predictions => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let personDetected = false;

        predictions.forEach(prediction => {
            if (prediction.class === 'person' && prediction.score > 0.5) {
                personDetected = true;
                ctx.strokeStyle = '#00FF00';
                ctx.lineWidth = 2;
                ctx.strokeRect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
            }
        });

        if (personDetected) {
            message.style.display = 'block';
        } else {
            message.style.display = 'none';
        }

        requestAnimationFrame(() => detectFrame(video, model));
    });
}

setupCamera().then(detectObjects);
