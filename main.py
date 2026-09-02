from fastapi import FastAPI
from pymongo import MongoClient

app = FastAPI()

# Conexión a MongoDB local (puedes cambiar a Atlas si usas nube)
client = MongoClient("mongodb://localhost:27017")
db = client["mi_base"]
coleccion = db["usuarios"]

@app.get("/")
def read_root():
    return {"message": "Backend activo"}

@app.get("/usuarios")
def get_usuarios():
    usuarios = list(coleccion.find({}, {"_id": 0}))
    return usuarios

