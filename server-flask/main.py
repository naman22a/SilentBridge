from flask import Flask, jsonify, request
import os
import tensorflow as tf
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)

model = None
MODEL_PATH = os.path.join('model', 'model_isl.h5')

# Load the model asynchronously
def load_model():
    global model
    model = tf.keras.models.load_model(MODEL_PATH)

load_model()

INTERNAL_SERVER_ERROR = {"field": "server", "message": "Internal server error"}
labels = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
]

@app.route('/')
def home():
    return jsonify({ 'ok': True })

@app.route('/predict', methods=['POST'])
def post_prediction():
    try:
        # Check if image does not exist
        if 'image' not in request.files:
            return jsonify({
                "data": None,
                "errors": [{"field": "image", "message": "Please upload an image"}]
            })
        print("Hellooooooooooooooooooooooooooooooooooooo")
        image = request.files['image']
        filename = secure_filename(image.filename)
        image_path = os.path.join('tmp', filename)
        image.save(image_path)

        # Check if model does not exist
        if model is None:
            raise Exception('Model not loaded yet')

        # Convert image into tensor image
        tf_image = tf.image.decode_image(tf.io.read_file(image_path))

        # Resize image to 100x100 dimensions
        resized_image = tf.image.resize(tf_image, [100, 100])

        # Normalize the image (values will be between 0 and 1)
        resized_image = resized_image / 255.0

        # Add batch dimension
        resized_image = tf.expand_dims(resized_image, 0)

        # Predict the value
        output = model.predict(resized_image)

        # Convert tensor to list
        indices = output.tolist()[0]

        # Find the highest probability and index
        max_index = np.argmax(indices)

        # Get the character from labels array by passing the index
        character = labels[max_index]

        return jsonify({
            "data": { "character": character }
        })
    except Exception as error:
        print(error)
        return jsonify({
            "data": None,
            "errors": [INTERNAL_SERVER_ERROR]
        })

if __name__ == '__main__':
    app.run(debug=True, port=8080)
