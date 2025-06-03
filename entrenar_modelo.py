import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

spanish_stopwords = stopwords.words('spanish')

# Cargar dataset
df = pd.read_csv("dataset.csv")

df = df.dropna(subset=["texto", "area"])

modelo = Pipeline([
    ("vectorizer", TfidfVectorizer(stop_words=spanish_stopwords)),
    ("clf", MultinomialNB())
])

modelo.fit(df["texto"], df["area"])

# Guardar modelo entrenado en archivo
joblib.dump(modelo, "modelo_entrenado.pkl")

print("✅ Modelo entrenado y guardado correctamente.")
