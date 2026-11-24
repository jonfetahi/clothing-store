type Props = {
  generalState: any
}

export function ReviewForm({ generalState }: Props) {
  const shipping = generalState["Shipping Information"];
  const payment = generalState["Payment"];

  const isCard = payment?.payment_method === "card";

  const shippingFields = [
    {
      label: "Full Name",
      value: `${shipping?.first_name} ${shipping?.last_name}`
    },
    {
      label: "Email Address",
      value: shipping?.email_address
    },
    {
      label: "Street Address",
      value: shipping?.address
    },
    {
      label: "City",
      value: shipping?.city
    },
    {
      label: "Country",
      value: shipping?.country
    },
    {
      label: "Postal Code",
      value: shipping?.postal_code
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary">
          Review Your Order
        </h2>
        <p className="text-sm text-secondary mt-1">
          Please review your information before placing your order.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-primary border-b pb-4 mb-5">
          Shipping Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {shippingFields.map(field => (
            <div key={field.label}>
              <p className="text-sm text-secondary">
                {field.label}
              </p>
              <p className="text-sm font-medium text-primary mt-1 break-words">
                {field.value || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-primary border-b pb-4 mb-5">
          Payment Method
        </h3>
        {isCard ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-secondary">
                Payment Method
              </p>
              <p className="text-sm font-medium mt-1">
                Credit / Debit Card
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-gray-500">
                  Cardholder
                </p>
                <p className="text-sm font-medium mt-1">
                  {payment.card_holder}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Card Number
                </p>
                <p className="text-sm font-medium mt-1">
                  •••• •••• •••• {payment.card_number?.slice(-4)}
                </p>
              </div>
            </div>

            <div>
              <span className={`inline-flex px-3 py-1 rounded-full
                text-xs font-medium ${
                payment.payment_reference
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {payment.payment_reference
                  ? "Payment Authorized (Demo)"
                  : "Authorization Required"}
              </span>
            </div>
          </div>
        ) : payment?.payment_method === "cash_on_delivery" ? (
          <div className="bg-gray-50 border border-gray-100 rounded-md p-4">
            <p className="text-sm font-semibold text-primary">
              Cash on Delivery
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Pay for your order when it arrives.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No payment method selected.
          </p>
        )}
      </div>
    </div>
  );
}

const validator = () => {};

export function reviewForm() {
  return {
    step_number: 3,
    step: 'REVIEW',
    label: 'Review',
    endpoint: 'not-available',
    definition: {},
    Form: ReviewForm,
    Validator: validator,
  };
}