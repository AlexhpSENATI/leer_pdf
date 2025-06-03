import fitz  # PyMuPDF
import joblib

modelo = joblib.load("modelo_entrenado.pkl")

def extraer_texto_pdf(ruta_pdf):
    texto = ""
    doc = fitz.open(ruta_pdf)
    for pagina in doc:
        texto += pagina.get_text()
    return texto

ruta_pdf = "areaMA.pdf"  

# Extraer texto del PDF
texto_extraido = extraer_texto_pdf(ruta_pdf)

prediccion = modelo.predict([texto_extraido])

# Mostrar resultado
print("Texto extraído del PDF:")
print(texto_extraido.strip())
print("\n➡️ Área predicha:", prediccion[0])
