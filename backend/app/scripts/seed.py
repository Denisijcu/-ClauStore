from app.database import SessionLocal
from app.models.category import Category
from app.models.product import Product
from sqlalchemy.orm import Session

def seed_data():
    db = SessionLocal()
    try:
        # 1. Crear Categorías
        electronics = Category(name="Tecnología")
        home = Category(name="Hogar")
        db.add_all([electronics, home])
        db.commit()
        db.refresh(electronics)
        db.refresh(home)

        # 2. Crear Productos vinculados
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