from flask import Flask, request, send_file
from impedance import preprocessing
from flask_cors import CORS
from impedance.models.circuits import CustomCircuit
import matplotlib.pyplot as plt
from impedance.visualization import plot_nyquist
import io

app = Flask(__name__)
CORS(app)

@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    file = request.files['file']
    frequencies, Z = preprocessing.readCSV(file)
    frequencies, Z = preprocessing.ignoreBelowX(frequencies, Z)
    
    circuit = 'R0-p(R1,C1)-p(R2-Wo1,C2)'
    initial_guess = [.01, .01, 100, .01, .05, 100, 1]

    circuit = CustomCircuit(circuit, initial_guess=initial_guess)
    circuit.fit(frequencies, Z)
    
    Z_fit = circuit.predict(frequencies)
    
    fig, ax = plt.subplots()
    plot_nyquist(Z, fmt='o', scale=10, ax=ax)
    plot_nyquist(Z_fit, fmt='-', scale=10, ax=ax)

    plt.legend(['Data', 'Fit'])
    
    plt.savefig('plot.png')
    return send_file('plot.png', mimetype='image/png')

if __name__ == '__main__':
    app.run(port=5000)