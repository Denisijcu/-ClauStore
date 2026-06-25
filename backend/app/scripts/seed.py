import sys
import os

# Ajustamos el path para que '/app' sea la raíz, 
# permitiendo que 'from app...' funcione correctamente.
sys.path.append('/app')

from app.core.database import SessionLocal
# Importamos desde el archivo 'models' dentro de la carpeta 'models'
from app.models.models import Category, Product 

def seed_data():
    db = SessionLocal()
    try:
        # Categorías
        electronics = Category(name="Tecnología", slug="tecnologia")
        home = Category(name="Hogar", slug="hogar")
        db.add_all([electronics, home])
        db.commit()
        db.refresh(electronics)
        db.refresh(home)

        # Productos
        products = [
            Product(name="OracleAI Starter Kit", price=150.00, category_id=electronics.id, description="Kit de inicio para IA local."),
            Product(name="Servidor Edge", price=450.00, category_id=electronics.id, description="Hardware para soberanía computacional."),
            Product(name="Smart Light", price=25.00, category_id=home.id, description="Iluminación inteligente.")
        ]
        db.add_all(products)
        db.commit()
        print("Base de datos poblada con éxito.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()