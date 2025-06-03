import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import nltk
from nltk.corpus import stopwords

# Descargar stopwords solo si no están descargadas
nltk.download('stopwords', quiet=True)

# Usar stopwords en español
spanish_stopwords = stopwords.words('spanish')

# 📥 Cargar dataset
try:
    df = pd.read_csv("dataset.csv")
except FileNotFoundError:
    print("❌ Error: El archivo 'dataset.csv' no fue encontrado.")
    exit()

# 🧹 Eliminar filas con campos vacíos
df.dropna(subset=["texto", "area"], inplace=True)

# 🚨 Verificar si el dataset tiene suficientes datos
if df.empty or df["area"].nunique() < 2:
    print("⚠️ El dataset es muy pequeño o no tiene suficientes clases. Agrega más datos.")
    exit()

# ⚙️ Crear pipeline de procesamiento y modelo
modelo = Pipeline([
    ("vectorizer", TfidfVectorizer(stop_words=spanish_stopwords)),
    ("clf", MultinomialNB())
])

# 🎓 Entrenar modelo
modelo.fit(df["texto"], df["area"])

# 💾 Guardar modelo entrenado
joblib.dump(modelo, "modelo_entrenado.pkl")

print("✅ Modelo entrenado y guardado correctamente.")


# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.naive_bayes import MultinomialNB
# from sklearn.pipeline import Pipeline
# import joblib
# import nltk
# from nltk.corpus import stopwords

# nltk.download('stopwords')

# spanish_stopwords = stopwords.words('spanish')

# # Cargar dataset
# df = pd.read_csv("dataset.csv")

# df = df.dropna(subset=["texto", "area"])

# modelo = Pipeline([
#     ("vectorizer", TfidfVectorizer(stop_words=spanish_stopwords)),
#     ("clf", MultinomialNB())
# ])

# modelo.fit(df["texto"], df["area"])

# # Guardar modelo entrenado en archivo
# joblib.dump(modelo, "modelo_entrenado.pkl")

# print("✅ Modelo entrenado y guardado correctamente.")
