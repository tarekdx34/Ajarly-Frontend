// FILE 3: src/components/dashboard/renter/payments/PaymentMethods.tsx (~50 lines)
import { CreditCard } from "lucide-react";
import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";

export function PaymentMethods() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">
        Payment Methods
      </h2>

      <Card className="p-6 max-w-2xl">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Manage your saved payment methods for faster checkout
          </p>

          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">No saved payment methods</p>
                <p className="text-sm text-gray-600">
                  Add a payment method to save time on your next booking
                </p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="mt-4">
            + Add Payment Method
          </Button>
        </div>
      </Card>
    </div>
  );
}