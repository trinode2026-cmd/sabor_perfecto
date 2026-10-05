"""Punto de entrada de la API de Sabor Perfecto."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import enrutador_principal
from core.base_datos import probar_conexion
from core.configuracion import configuracion

DESCRIPCION = """
API del recomendador de platillos **Sabor Perfecto**.

Las rutas publicas entregan el menu y las recomendaciones listas para mostrarse.
Cada recomendacion incluye un campo `traza` con el detalle del sistema de inferencia
difusa que la genero (grados de pertenencia, reglas activadas y defuzzificacion),
pensado como evidencia tecnica y no para la interfaz del usuario final.
"""

app = FastAPI(
    title=configuracion.nombre_app,
    description=DESCRIPCION,
    version="1.0.0",
    docs_url="/docs",
)

# Permite que el frontend consuma la API desde los origenes del .env
app.add_middleware(
    CORSMiddleware,
    allow_origins=configuracion.lista_origenes,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Todas las rutas viven bajo el prefijo configurado
app.include_router(enrutador_principal, prefix=configuracion.prefijo_api)


@app.get("/", tags=["Estado"], summary="Mensaje de bienvenida")
def inicio():
    """Confirma que la API esta levantada."""
    return {
        "mensaje": "Bienvenido a la API de Sabor Perfecto",
        "documentacion": "/docs",
        "prefijo": configuracion.prefijo_api,
    }


@app.get("/salud", tags=["Estado"], summary="Revisa la API y la base de datos")
def salud():
    """Informa si la API responde y si la base de datos esta disponible."""
    base_lista = probar_conexion()
    return {
        "api": "ok",
        "base_datos": "ok" if base_lista else "sin conexion",
        "entorno": configuracion.entorno,
        "puerto": configuracion.api_puerto,
        "moneda": configuracion.moneda,
    }


# Permite levantar la API con: python main.py, tomando el puerto del archivo .env
if __name__ == "__main__":
    import uvicorn

    print(f"Levantando {configuracion.nombre_app} en http://{configuracion.api_host}:{configuracion.api_puerto}")
    uvicorn.run(
        "main:app",
        host=configuracion.api_host,
        port=configuracion.api_puerto,
        reload=configuracion.recarga_automatica,
    )
