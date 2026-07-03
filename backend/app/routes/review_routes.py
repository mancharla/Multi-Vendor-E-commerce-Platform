from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.models import User, Review
from app.schemas import ReviewCreate, ReviewResponse
from app.services.review_service import ReviewService


router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewResponse)
def add_review(
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return ReviewService.add_review(db, current_user, review_data)


@router.get("/product/{product_id}", response_model=list[ReviewResponse])
def get_product_reviews(
    product_id: int,
    db: Session = Depends(get_db)
):
    return ReviewService.get_product_reviews(db, product_id)
@router.get("/check/{product_id}")
def check_review(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    review = (
        db.query(Review)
        .filter(
            Review.product_id == product_id,
            Review.customer_id == current_user.id
        )
        .first()
    )

    if review:
        return {
            "reviewed": True,
            "rating": review.rating
        }

    return {
        "reviewed": False
    }