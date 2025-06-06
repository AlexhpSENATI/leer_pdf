from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import fitz  
import joblib
import numpy as np
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.secret_key = 'tu_clave_secreta_aqui'  
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

modelo = joblib.load("models/modelo_entrenado.pkl")

def extraer_texto_pdf(ruta_pdf):
    texto = ""
    doc = fitz.open(ruta_pdf)
    for pagina in doc:
        texto += pagina.get_text()
    return texto

@app.route('/', methods=['GET'])
def index():
    # Obtener valores si vienen por parámetros (GET)
    mensaje = request.args.get('mensaje')
    percentage = request.args.get('percentage')
    place = request.args.get('place')

    prediction = None
    if mensaje and percentage and place:
        prediction = {
            "mensaje": mensaje,
            "percentage": percentage,
            "place": place
        }

    return render_template('index.html', prediction=prediction)

@app.route('/predict', methods=['POST'])
def predict():
    if 'pdf_file' not in request.files:
        return "No se subió ningún archivo", 400

    archivo = request.files['pdf_file']
    if archivo.filename == '':
        return "Nombre de archivo vacío", 400

    if archivo and allowed_file(archivo.filename):
        # Guardar el archivo con nombre único
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        nombre_seguro = f"{timestamp}_{secure_filename(archivo.filename)}"
        ruta_pdf = os.path.join(app.config['UPLOAD_FOLDER'], nombre_seguro)
        archivo.save(ruta_pdf)

        texto = extraer_texto_pdf(ruta_pdf)

        try:
            probabilidades = modelo.predict_proba([texto])[0]
            etiquetas = modelo.classes_

            indice_max = np.argmax(probabilidades)
            confianza = probabilidades[indice_max]
            area_predicha = etiquetas[indice_max]
            porcentaje = round(confianza * 100, 2)
        except Exception as e:
            os.remove(ruta_pdf)
            return f"Error en la predicción: {e}", 500

        if confianza < 0.6:
            return redirect(url_for('index',
                mensaje="❌ Área no encontrada (confianza insuficiente)",
                percentage=porcentaje,
                place="Desconocido"
            ))

        return redirect(url_for('index',
            mensaje="✅ Área encontrada",
            percentage=porcentaje,
            place=area_predicha
        ))

    else:
        return "Archivo inválido. Solo se permiten PDFs.", 400

@app.route('/get-pdfs', methods=['GET'])
def get_pdfs():
    pdfs = []
    upload_folder = app.config['UPLOAD_FOLDER']
    
    if os.path.exists(upload_folder):
        for filename in sorted(os.listdir(upload_folder), reverse=True):
            if filename.endswith('.pdf'):
                filepath = os.path.join(upload_folder, filename)
                file_info = {
                    'name': filename.split('_', 1)[1] if '_' in filename else filename,
                    'url': url_for('static', filename=f'uploads/{filename}'),
                    'date': datetime.fromtimestamp(os.path.getctime(filepath)).strftime('%d/%m/%Y %H:%M'),
                    'size': f"{os.path.getsize(filepath) / 1024:.1f} KB"
                }
                pdfs.append(file_info)
    
    return jsonify(pdfs)

@app.route('/delete-pdf/<filename>', methods=['DELETE'])
def delete_pdf(filename):
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            return jsonify({'success': True})
        return jsonify({'success': False, 'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


    
# from flask import Flask, render_template, request, redirect, url_for
# import fitz  
# import joblib
# import numpy as np
# import os
# from werkzeug.utils import secure_filename

# app = Flask(__name__)
# app.config['UPLOAD_FOLDER'] = 'uploads'
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ALLOWED_EXTENSIONS = {'pdf'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# modelo = joblib.load("models/modelo_entrenado.pkl")

# def extraer_texto_pdf(ruta_pdf):
#     texto = ""
#     doc = fitz.open(ruta_pdf)
#     for pagina in doc:
#         texto += pagina.get_text()
#     return texto

# @app.route('/', methods=['GET'])
# def index():
#     mensaje = request.args.get('mensaje')
#     percentage = request.args.get('percentage')
#     place = request.args.get('place')

#     prediction = None
#     if mensaje and percentage and place:
#         prediction = {
#             "mensaje": mensaje,
#             "percentage": percentage,
#             "place": place
#         }

#     return render_template('index.html', prediction=prediction)

# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'pdf_file' not in request.files:
#         return "No se subió ningún archivo", 400

#     archivo = request.files['pdf_file']
#     if archivo.filename == '':
#         return "Nombre de archivo vacío", 400

#     if archivo and allowed_file(archivo.filename):
#         nombre_seguro = secure_filename(archivo.filename)
#         ruta_pdf = os.path.join(app.config['UPLOAD_FOLDER'], nombre_seguro)
#         archivo.save(ruta_pdf)

#         texto = extraer_texto_pdf(ruta_pdf)

#         try:
#             probabilidades = modelo.predict_proba([texto])[0]
#             etiquetas = modelo.classes_

#             indice_max = np.argmax(probabilidades)
#             confianza = probabilidades[indice_max]
#             area_predicha = etiquetas[indice_max]
#             porcentaje = round(confianza * 100, 2)
#         except Exception as e:
#             return f"Error en la predicción: {e}", 500
#         finally:
#             os.remove(ruta_pdf)

#         if confianza < 0.6:
#             return redirect(url_for('index',
#                 mensaje="❌ Área no encontrada (confianza insuficiente)",
#                 percentage=porcentaje,
#                 place="Desconocido"
#             ))

#         return redirect(url_for('index',
#             mensaje="✅ Área encontrada",
#             percentage=porcentaje,
#             place=area_predicha
#         ))

#     else:
#         return "Archivo inválido. Solo se permiten PDFs.", 400

# if __name__ == '__main__':
#     app.run(debug=True)









# from flask import Flask, render_template, request
# import fitz  # PyMuPDF
# import joblib
# import numpy as np
# import os
# from werkzeug.utils import secure_filename


# app = Flask(__name__)
# app.config['UPLOAD_FOLDER'] = 'uploads'
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# # Cargar modelo entrenado
# modelo = joblib.load("models/modelo_entrenado.pkl")

# def extraer_texto_pdf(ruta_pdf):
#     texto = ""
#     doc = fitz.open(ruta_pdf)
#     for pagina in doc:
#         texto += pagina.get_text()
#     return texto

# @app.route('/', methods=['GET'])
# def index():
#     return render_template('index.html')

# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'pdf_file' not in request.files:
#         return "No se subió ningún archivo", 400

#     archivo = request.files['pdf_file']
#     if archivo.filename == '':
#         return "Nombre de archivo vacío", 400

#     if archivo and archivo.filename.endswith('.pdf'):
#         nombre_seguro = secure_filename(archivo.filename)
#         ruta_pdf = os.path.join(app.config['UPLOAD_FOLDER'], nombre_seguro)
#         archivo.save(ruta_pdf)

#         texto = extraer_texto_pdf(ruta_pdf)
#         probabilidades = modelo.predict_proba([texto])[0]
#         etiquetas = modelo.classes_

#         indice_max = np.argmax(probabilidades)
#         confianza = probabilidades[indice_max]
#         area_predicha = etiquetas[indice_max]
#         porcentaje = round(confianza * 100, 2)

#         if confianza < 0.6:
#             return render_template("index.html", prediction={
#                 "mensaje": "❌ Área no encontrada (confianza insuficiente)",
#                 "percentage": porcentaje,
#                 "place": "Desconocido"
#             })

#         return render_template("index.html", prediction={
#             "mensaje": "✅ Área encontrada",
#             "percentage": porcentaje,
#             "place": area_predicha
#         })

#     else:
#         return "Archivo inválido. Solo se permiten PDFs.", 400

# if __name__ == '__main__':
#     app.run(debug=True)

