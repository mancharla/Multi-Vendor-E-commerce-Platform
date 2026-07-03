from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Coupon


class CouponService:

    @staticmethod
    def create_coupon(db: Session, coupon_data):
        existing = db.query(Coupon).filter(
            Coupon.code == coupon_data.code.upper()
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="Coupon already exists")

        if coupon_data.discount_type not in ["percentage", "flat"]:
            raise HTTPException(
                status_code=400,
                detail="discount_type must be percentage or flat"
            )

        if coupon_data.discount_value <= 0:
            raise HTTPException(
                status_code=400,
                detail="Discount value must be greater than 0"
            )

        coupon = Coupon(
            code=coupon_data.code.upper(),
            discount_type=coupon_data.discount_type,
            discount_value=coupon_data.discount_value,
            min_order_amount=coupon_data.min_order_amount,
            is_active=True
        )

        db.add(coupon)
        db.commit()
        db.refresh(coupon)

        return coupon

    @staticmethod
    def get_all_coupons(db: Session):
        return db.query(Coupon).all()

    @staticmethod
    def apply_coupon(db: Session, coupon_data):
        coupon = db.query(Coupon).filter(
            Coupon.code == coupon_data.code.upper(),
            Coupon.is_active == True
        ).first()

        if not coupon:
            raise HTTPException(status_code=404, detail="Invalid or inactive coupon")

        if coupon_data.cart_total < coupon.min_order_amount:
            raise HTTPException(
                status_code=400,
                detail=f"Minimum order amount should be ₹{coupon.min_order_amount}"
            )

        if coupon.discount_type == "percentage":
            discount_amount = coupon_data.cart_total * coupon.discount_value / 100
        else:
            discount_amount = coupon.discount_value

        if discount_amount > coupon_data.cart_total:
            discount_amount = coupon_data.cart_total

        final_amount = coupon_data.cart_total - discount_amount

        return {
            "coupon_code": coupon.code,
            "cart_total": coupon_data.cart_total,
            "discount_amount": discount_amount,
            "final_amount": final_amount
        }

    @staticmethod
    def deactivate_coupon(db: Session, coupon_id: int):
        coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()

        if not coupon:
            raise HTTPException(status_code=404, detail="Coupon not found")

        coupon.is_active = False
        db.commit()
        db.refresh(coupon)

        return {"message": "Coupon deactivated successfully"}
    
    @staticmethod
    def delete_coupon(db: Session, coupon_id: int):
        coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()

        if not coupon:
            raise HTTPException(status_code=404, detail="Coupon not found")

        db.delete(coupon)
        db.commit()

        return {"message": "Coupon deleted successfully"}
    @staticmethod
    def toggle_coupon_status(db: Session, coupon_id: int):
        coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()

        if not coupon:
            raise HTTPException(status_code=404, detail="Coupon not found")

        coupon.is_active = not coupon.is_active

        db.commit()
        db.refresh(coupon)

        return {
            "message": f"Coupon {'activated' if coupon.is_active else 'deactivated'} successfully",
            "is_active": coupon.is_active
        }
    @staticmethod
    def get_available_coupons(db: Session, cart_total: float):
        coupons = db.query(Coupon).filter(Coupon.is_active == True).all()

        return [
            {
                "id": coupon.id,
                "code": coupon.code,
                "discount_type": coupon.discount_type,
                "discount_value": coupon.discount_value,
                "min_order_amount": coupon.min_order_amount,
                "eligible": cart_total >= coupon.min_order_amount,
                "amount_needed": max(0, coupon.min_order_amount - cart_total),
            }
            for coupon in coupons
        ]