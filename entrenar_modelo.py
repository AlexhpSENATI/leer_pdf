import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib

# Cargar dataset
df = pd.read_csv("dataset.csv")

# 🧹 Limpiar datos: eliminar filas con texto o área vacíos
df = df.dropna()

# Crear modelo
modelo = Pipeline([
    ("vectorizer", TfidfVectorizer()),
    ("clf", MultinomialNB())
])

# Entrenar
modelo.fit(df["texto"], df["area"])

# Guardar
joblib.dump(modelo, "modelo_entrenado.pkl")

print("✅ Modelo entrenado y guardado.")
