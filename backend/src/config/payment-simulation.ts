export type PaymentSimulationResult = {
  success: boolean;
  status: "authorized" | "declined";
  message: string;
};

export function simulatePayment(
  cardNumber: string
): PaymentSimulationResult {
  const number = cardNumber.replace(/\s/g, "");

  switch (number) {
    case "4242424242424242":
      return {
        success: true,
        status: "authorized",
        message: "Payment authorized successfully"
      };

    case "4000000000000002":
      return {
        success: false,
        status: "declined",
        message: "Your card was declined"
      };

    case "4000000000009995":
      return {
        success: false,
        status: "declined",
        message: "Insufficient funds"
      };

    default:
      return {
        success: false,
        status: "declined",
        message: "Invalid demo card number"
      };
  }
}