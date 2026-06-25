import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))

print(f"Root: {root_dir}")

# Imports CORRECTOS según tu estructura
from app.core.database import SessionLocal
from app.models.models import Category, Product   # ← Aquí está el cambio importante

def seed_data():
    db = SessionLocal()
    try:
        electronics = Category(name="Tecnología", slug="tecnologia", description="Productos tecnológicos")
        home = Category(name="Hogar", slug="hogar", description="Productos para el hogar")
        
        db.add_all([electronics, home])
        db.commit()
        db.refresh(electronics)
        db.refresh(home)

        products = [
            Product(name="OracleAI Starter Kit", price=150.00, category_id=electronics.id, description="Kit de inicio para IA local.", stock=10),
            Product(name="Servidor Edge", price=450.00, category_id=electronics.id, description="Hardware para soberanía computacional.", stock=5),
            Product(name="Smart Light", price=25.00, category_id=home.id, description="Iluminación inteligente.", stock=20),
        ]
        
        db.add_all(products)
        db.commit()
        print("✅ Base de datos poblada con éxito.")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()