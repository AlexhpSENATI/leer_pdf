from flask import Flask, render_template, request
from scripts.clasificar_pdf import extraer_texto_pdf  # Asegúrate que esta función reciba un número

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predecir', methods=['POST'])  
def predecir():
    entrada = request.form['entrada']
    resultado = extraer_texto_pdf(float(entrada))  
    return render_template('index.html', resultado=resultado)

if __name__ == '__main__':
    app.run(debug=True)
