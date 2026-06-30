import random
import uuid


class PaymentService:

    @staticmethod
    def process_payment(amount: float, payment_method: str):

        success = random.choice([True, True, True, False])

        return {
            "success": success,
            "transaction_id": str(uuid.uuid4()),
            "amount": amount,
            "payment_method": payment_method
        }