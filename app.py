from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np

app = Flask(__name__)

# Load the TensorFlow Lite model
model_path = 'flask/model.tflite'
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from the request
        input_data = request.json['input_data']

        # Preprocess the input data as needed (convert to numpy array, scale, etc.)
        input_array = np.array(input_data, dtype=np.float32)

        # Set input tensor to the loaded model
        input_details = interpreter.get_input_details()
        interpreter.set_tensor(input_details[0]['index'], input_array)

        # Run inference
        interpreter.invoke()

        # Get the output tensor
        output_details = interpreter.get_output_details()
        output_data = interpreter.get_tensor(output_details[0]['index'])

        # Process the output as needed
        result = {'prediction': output_data.tolist()}

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
