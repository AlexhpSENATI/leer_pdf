import fitz  # PyMuPDF
import joblib
import numpy as np

# Cargar el modelo previamente entrenado
modelo = joblib.load("modelo_entrenado.pkl")

# Función para extraer texto de un PDF
def extraer_texto_pdf(ruta_pdf):
    texto = ""
    doc = fitz.open(ruta_pdf)
    for pagina in doc:
        texto += pagina.get_text()
    return texto

# Ruta del PDF a analizar
ruta_pdf = "areaD.pdf"

# Extraer texto del PDF
texto_extraido = extraer_texto_pdf(ruta_pdf)

# Predecir área
probabilidades = modelo.predict_proba([texto_extraido])[0]
etiquetas = modelo.classes_

# Obtener índice con mayor probabilidad
indice_max = np.argmax(probabilidades)
confianza = probabilidades[indice_max]
area_predicha = etiquetas[indice_max]

# Mostrar resultados
print("Texto extraído del PDF:")
print(texto_extraido.strip())

# Mostrar predicción con umbral
print("\n➡️ Predicción:")
if confianza < 0.6:
    print("❌ Área no encontrada (confianza insuficiente)")
else:
    print(f"✅ Área predicha: {area_predicha} ({confianza*100:.2f}%)")

# if confianza >= 0.5:
#     porcentaje = round(confianza * 100, 2)
#     print(f"Área predicha: {area_predicha} ({porcentaje}%)")
# else:
#     print("❌ Área no encontrada (confianza insuficiente)")
