from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Wishlist, Product
from app.services.product_service import ProductService


class WishlistService:

    @staticmethod
    def wishlist_response(wishlist: Wishlist):
        return {
            "id": wishlist.id,
            "customer_id": wishlist.customer_id,
            "product_id": wishlist.product_id,
            "product": ProductService.product_response(wishlist.product)
        }

    @staticmethod
    def add_to_wishlist(db: Session, current_user, wishlist_data):
        product = db.query(Product).filter(
            Product.id == wishlist_data.product_id
        ).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        existing = db.query(Wishlist).filter(
            Wishlist.customer_id == current_user.id,
            Wishlist.product_id == wishlist_data.product_id
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="Product already in wishlist")

        wishlist = Wishlist(
            customer_id=current_user.id,
            product_id=wishlist_data.product_id
        )

        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)

        return WishlistService.wishlist_response(wishlist)

    @staticmethod
    def get_my_wishlist(db: Session, customer_id: int):
        wishlists = db.query(Wishlist).filter(
            Wishlist.customer_id == customer_id
        ).all()

        return [
            WishlistService.wishlist_response(wishlist)
            for wishlist in wishlists
        ]

    @staticmethod
    def remove_from_wishlist(db: Session, current_user, wishlist_id: int):
        wishlist = db.query(Wishlist).filter(
            Wishlist.id == wishlist_id,
            Wishlist.customer_id == current_user.id
        ).first()

        if not wishlist:
            raise HTTPException(status_code=404, detail="Wishlist item not found")

        db.delete(wishlist)
        db.commit()

        return {"message": "Product removed from wishlist"}