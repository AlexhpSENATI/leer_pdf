import fitz
import joblib

modelo = joblib.load("modelo_entrenado.pkl")

def extraer_texto_pdf(ruta_pdf):
    texto = ""
    doc = fitz.open(ruta_pdf)
    for pagina in doc:
        texto += pagina.get_text()
    return texto.strip()

# Leer PDF
ruta_pdf = "areaF.pdf"
texto = extraer_texto_pdf(ruta_pdf)

# Obtener predicción con probabilidades
probas = modelo.predict_proba([texto])[0]
etiquetas = modelo.classes_

# Elegir la más probable
indice_max = probas.argmax()
area_predicha = etiquetas[indice_max]
confianza = probas[indice_max]

# Mostrar resultado
print("📝 Texto extraído del PDF:")
print(texto)
print("\n🔍 Predicción:")

if area_predicha.lower() == "otros" or confianza < 0.6:
    print("❌ Área no encontrada (confianza baja o clasificada como 'Otros')")
else:
    porcentaje = round(confianza * 100, 2)
    print(f"➡️ Área: {area_predicha} ({porcentaje}%)")
