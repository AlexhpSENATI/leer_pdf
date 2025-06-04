def procesar_pdf(ruta_pdf):
    texto = extraer_texto_pdf(ruta_pdf)
    area, confianza = predecir_area(texto, modelo)
    
    if confianza < UMBRAL_CONFIANZA:
        enviar_a_revision(texto, ruta_pdf)
        return "Requiere revisión manual"
    else:
        guardar_resultado(area, texto, ruta_pdf)
        return f"Área: {area} (confianza {confianza:.2f}%)"

def reentrenar_modelo():
    datos = cargar_datos_entrenamiento()
    modelo = entrenar(datos)
    guardar_modelo(modelo)
