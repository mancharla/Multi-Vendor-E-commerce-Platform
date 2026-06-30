from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.models import User
from app.schemas import WishlistCreate, WishlistResponse
from app.services.wishlist_service import WishlistService


router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.post("/", response_model=WishlistResponse)
def add_to_wishlist(
    wishlist_data: WishlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return WishlistService.add_to_wishlist(db, current_user, wishlist_data)


@router.get("/", response_model=list[WishlistResponse])
def get_my_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return WishlistService.get_my_wishlist(db, current_user.id)


@router.delete("/{wishlist_id}")
def remove_from_wishlist(
    wishlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return WishlistService.remove_from_wishlist(db, current_user, wishlist_id)