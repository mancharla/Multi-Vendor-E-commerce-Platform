from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Review, Product, Order, OrderItem, OrderStatus,User


class ReviewService:

    @staticmethod
    def add_review(db: Session, current_user, review_data):
        if review_data.rating < 1 or review_data.rating > 5:
            raise HTTPException(
                status_code=400,
                detail="Rating must be between 1 and 5"
            )

        product = db.query(Product).filter(
            Product.id == review_data.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        purchased = db.query(OrderItem).join(Order).filter(
            Order.customer_id == current_user.id,
            OrderItem.product_id == review_data.product_id,
            Order.status.in_([
                OrderStatus.paid,
                OrderStatus.shipped,
                OrderStatus.delivered
            ])
        ).first()

        if not purchased:
            raise HTTPException(
                status_code=403,
                detail="You can review only successfully purchased products"
            )

        existing_review = db.query(Review).filter(
            Review.customer_id == current_user.id,
            Review.product_id == review_data.product_id
        ).first()

        if existing_review:
            raise HTTPException(
                status_code=400,
                detail="You already reviewed this product"
            )

        review = Review(
            customer_id=current_user.id,
            product_id=review_data.product_id,
            rating=review_data.rating,
            comment=review_data.comment
        )

        db.add(review)
        db.commit()
        db.refresh(review)

        return review

    @staticmethod
    def get_product_reviews(db: Session, product_id: int):
        product = db.query(Product).filter(
            Product.id == product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        return db.query(Review).filter(
            Review.product_id == product_id
        ).all()