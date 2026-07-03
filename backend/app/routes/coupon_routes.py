from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.models import User
from app.schemas import CouponCreate, CouponResponse, ApplyCouponRequest
from app.services.coupon_service import CouponService


router = APIRouter(prefix="/coupons", tags=["Coupons"])


@router.post("/", response_model=CouponResponse)
def create_coupon(
    coupon_data: CouponCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return CouponService.create_coupon(db, coupon_data)


@router.get("/", response_model=list[CouponResponse])
def get_all_coupons(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return CouponService.get_all_coupons(db)


@router.post("/apply")
def apply_coupon(
    coupon_data: ApplyCouponRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return CouponService.apply_coupon(db, coupon_data)
@router.get("/available")
def available_coupons(
    cart_total: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return CouponService.get_available_coupons(db, cart_total)

@router.put("/{coupon_id}/toggle")
def toggle_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return CouponService.toggle_coupon_status(db, coupon_id)
@router.delete("/{coupon_id}")
def delete_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return CouponService.delete_coupon(db, coupon_id)
