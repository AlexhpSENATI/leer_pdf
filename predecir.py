import joblib

# Cargar modelo
modelo = joblib.load("modelo_entrenado.pkl")

# Texto a clasificar
texto = ["Se mejoró la iluminación del pasillo"]

# Predecir
prediccion = modelo.predict(texto)

print("Área:", prediccion[0])
