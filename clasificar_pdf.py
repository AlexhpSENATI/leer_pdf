import fitz  # PyMuPDF
import joblib

# Cargar modelo entrenado
modelo = joblib.load("modelo_entrenado.pkl")

# Función para extraer texto de un PDF
def extraer_texto_pdf(ruta_pdf):
    texto = ""
    doc = fitz.open(ruta_pdf)
    for pagina in doc:
        texto += pagina.get_text()
    return texto

# Ruta del PDF a clasificar
ruta_pdf = "areah.pdf"  # cambia esto por el nombre de tu archivo

# Extraer texto del PDF
texto_extraido = extraer_texto_pdf(ruta_pdf)

# Clasificar el texto con el modelo
prediccion = modelo.predict([texto_extraido])

# Mostrar resultado
print("Texto extraído del PDF:")
print(texto_extraido.strip())
print("\n➡️ Área predicha:", prediccion[0])
