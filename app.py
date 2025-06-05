from flask import Flask, render_template, request
import fitz  # PyMuPDF
import joblib
import numpy as np
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Cargar modelo entrenado
modelo = joblib.load("models/modelo_entrenado.pkl")

def extraer_texto_pdf(ruta_pdf):
    texto = ""
    doc = fitz.open(ruta_pdf)
    for pagina in doc:
        texto += pagina.get_text()
    return texto

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'pdf_file' not in request.files:
        return "No se subió ningún archivo", 400

    archivo = request.files['pdf_file']
    if archivo.filename == '':
        return "Nombre de archivo vacío", 400

    


# from flask import Flask, render_template, request
# from scripts.clasificar_pdf import extraer_texto_pdf  # Asegúrate que esta función reciba un número

# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/predecir', methods=['POST'])  
# def predecir():
#     entrada = request.form['entrada']
#     resultado = extraer_texto_pdf(float(entrada))  
#     return render_template('index.html', resultado=resultado)

# if __name__ == '__main__':
#     app.run(debug=True)
