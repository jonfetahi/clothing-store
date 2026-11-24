import { useState } from 'react';
import classNames from 'classnames';
import { FaCreditCard } from 'react-icons/fa6';
import { FaCheck, FaMoneyBillWave } from 'react-icons/fa';
import { CreditCardSection } from './CreditCardSection';

const PAYMENT_METHOD = {
  CARD: 1,
  CASH: 2
}

type Props = {
  fields: any;
  values: any
}

export function PaymentForm({ fields, values }: Props) {
  const [paymentOption, setPaymentOption] = useState(PAYMENT_METHOD.CARD);

  return (
    <div className="w-full  space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight text-primary">
          Payment Method
        </h1>
        <p className="text-sm text-neutral-500">
          Please select the payment method from below options
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={classNames(
            'flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all',
            {
              'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900':
                paymentOption === PAYMENT_METHOD.CARD,
              'border-neutral-200 bg-white hover:border-neutral-300':
                paymentOption !== PAYMENT_METHOD.CARD,
            }
          )}
          onClick={() => {
            fields.payment_method.onChange('card')
            setPaymentOption(PAYMENT_METHOD.CARD);
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={classNames(
                'flex items-center justify-center w-10 h-10 rounded-lg border transition-colors shrink-0',
                {
                  'bg-neutral-900 text-white border-neutral-900':
                    paymentOption === PAYMENT_METHOD.CARD,
                  'bg-neutral-100 text-neutral-600 border-neutral-200':
                    paymentOption !== PAYMENT_METHOD.CARD,
                }
              )}
            >
              <FaCreditCard size={18} />
            </div>

            <div className="flex flex-col">
          <span className="text-sm font-semibold text-neutral-900">
            Credit / Debit Card
          </span>
              <span className="text-xs text-neutral-500">
            Online Credit Card or Debit Card payment
          </span>
            </div>
          </div>

          <div
            className={classNames(
              'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3',
              {
                'border-neutral-900': paymentOption === PAYMENT_METHOD.CARD,
                'border-neutral-300': paymentOption !== PAYMENT_METHOD.CARD,
              }
            )}
          >
            {paymentOption === PAYMENT_METHOD.CARD && (
              <div className="w-2 h-2 rounded-full bg-neutral-900" />
            )}
          </div>
        </div>

        <div
          className={classNames(
            'flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all',
            {
              'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900':
                paymentOption === PAYMENT_METHOD.CASH,
              'border-neutral-200 bg-white hover:border-neutral-300':
                paymentOption !== PAYMENT_METHOD.CASH,
            }
          )}
          onClick={() => {
            fields.payment_method.onChange('cash_on_delivery')
            setPaymentOption(PAYMENT_METHOD.CASH);
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={classNames(
                'flex items-center justify-center w-10 h-10 rounded-lg border transition-colors shrink-0',
                {
                  'bg-neutral-900 text-white border-neutral-900':
                    paymentOption === PAYMENT_METHOD.CASH,
                  'bg-neutral-100 text-neutral-600 border-neutral-200':
                    paymentOption !== PAYMENT_METHOD.CASH,
                }
              )}
            >
              <FaMoneyBillWave size={18} />
            </div>

            <div className="flex flex-col">
          <span className="text-sm font-semibold text-neutral-900">
            Cash On Delivery
          </span>
              <span className="text-xs text-neutral-500">
            Pay when your package arrives
          </span>
            </div>
          </div>

          <div
            className={classNames(
              'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3',
              {
                'border-neutral-900': paymentOption === PAYMENT_METHOD.CASH,
                'border-neutral-300': paymentOption !== PAYMENT_METHOD.CASH,
              }
            )}
          >
            {paymentOption === PAYMENT_METHOD.CASH && (
              <div className="w-2 h-2 rounded-full bg-neutral-900" />
            )}
          </div>
        </div>
      </div>

      {paymentOption === PAYMENT_METHOD.CARD ? (
        <div>
          <CreditCardSection fields={fields} values={values}/>
         </div>
      ) : (
        <div className="flex items-start gap-3.5 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
          <div
            className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 shrink-0 mt-0.5">
            <FaCheck size={11} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-neutral-900">
              No payment required now
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              You can proceed directly to the review step. Your order will be marked as awaiting payment on delivery.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const validator = (values: any) => {
  const errors: any = {};
  if (!values.payment_method) {
    errors['payment_method'] = 'Please select a payment method is required';
  }
  return errors;
};

export function paymentForm() {
  return {
    step_number: 2,
    step: 'Payment',
    label: 'Payment',
    definition: {
      card_number: '',
      card_holder: '',
      cvv: '',
      expiry: '',
      payment_method: '',
      payment_reference: null
    },
    Form: PaymentForm,
    Validator: validator,
  };
}