import fitz  # PyMuPDF
import joblib
import numpy as np

modelo = joblib.load("modelo_entrenado.pkl")

def extraer_texto_pdf(ruta_pdf):
    texto = ""
    doc = fitz.open(ruta_pdf)
    for pagina in doc:
        texto += pagina.get_text()
    return texto

ruta_pdf = "soliF.pdf"

texto_extraido = extraer_texto_pdf(ruta_pdf)

probabilidades = modelo.predict_proba([texto_extraido])[0]
etiquetas = modelo.classes_

indice_max = np.argmax(probabilidades)
confianza = probabilidades[indice_max]
area_predicha = etiquetas[indice_max]

print("Texto extraído del PDF:")
print(texto_extraido.strip())

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
