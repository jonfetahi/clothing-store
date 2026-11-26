import React, { useState } from 'react';
import { FaCreditCard, FaLock, FaCheck, FaPen } from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress } from 'react-icons/si';
import Button from '../../../../shared/ui/Button';
import TextInput from '../../../../shared/ui/TextInput';
import FormField from '../../../../shared/ui/FormField';
import useService from '../../../../hooks/use-service';
import { Services } from '../../../../api/services';
import { AppLoader } from '../../../../shared/components/AppLoader';


// Helper to detect card brand from leading digits
function getCardBrand(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'VISA';
  if (/^(5[1-5]|2(2[2-9]|[3-6]|7[01]|720))/.test(digits)) return 'MASTERCARD';
  if (/^3[47]/.test(digits)) return 'AMEX';
  return 'CARD';
}

// Masks all digits except the last 4: "•••• •••• •••• 3456"
function formatMaskedCardNumber(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '');
  if (!digits) return '•••• •••• •••• ••••';
  const last4 = digits.slice(-4).padStart(4, '•');
  return `•••• •••• •••• ${last4}`;
}
type Props = {
  fields: any
  values: any
}

export function CreditCardSection({ values, fields }: Props) {
  const [isSaved, setIsSaved] = useState(false);
  const brand = getCardBrand(values.card_number);

  const { loading, requestAsync } = useService(Services.Payment.simulate, false)

  const handleCardNumberChange = (rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 16);
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    fields.card_number.onChange(formatted);
  };

  const handleExpiryChange = (rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 4);
    const formatted =
      digitsOnly.length > 2
        ? `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
        : digitsOnly;
    fields.expiry.onChange(formatted)
  };

  const handleCvvChange = (rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 4);
    fields.cvv.onChange(digitsOnly);
  };

  const renderBrandLogo = () => {
    if (brand === 'VISA') return <SiVisa size={36} />;
    if (brand === 'MASTERCARD') return <SiMastercard size={28} />;
    if (brand === 'AMEX') return <SiAmericanexpress size={28} />;
    return <FaCreditCard size={22} className="text-neutral-400" />;
  };


  const onSaveCard = () => {
    const payload = {
      card_number: values.card_number,
    }
    requestAsync({ payload }).then((result) => {
      if (result) {
        setIsSaved(true)
        fields.payment_reference.onChange(result.payment_reference);
      }
    })
  }

  // 1. Saved Virtual Credit Card View
  if (isSaved) {
    return (
      <div className="space-y-3">
        <div className="relative w-full max-w-sm aspect-[1.586/1] rounded-2xl bg-primary text-white p-6 flex flex-col justify-between overflow-hidden border border-neutral-800 shadow-sm">
          {/* Subtle decorative ring */}
          <div className="pointer-events-none absolute -right-12 -top-12 w-44 h-44 rounded-full bg-white/[0.04]" />

          {/* Top Row: EMV Chip + Card Network Logo */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-7 rounded-md bg-neutral-700/80 border border-neutral-600/80 flex items-center justify-center">
              <div className="w-6 h-4 border border-neutral-500/60 rounded-[2px]" />
            </div>
            <div className="text-white">{renderBrandLogo()}</div>
          </div>

          {/* Middle Row: Masked Card Number */}
          <div className="my-auto pt-2">
            <p className="font-mono text-lg sm:text-xl tracking-[0.18em] text-neutral-100">
              {formatMaskedCardNumber(values.card_number)}
            </p>
          </div>

          {/* Bottom Row: Cardholder Name, Expiry & CVV */}
          <div className="flex items-end justify-between gap-4 text-xs">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                Card Holder
              </p>
              <p className="font-medium text-sm text-neutral-100 truncate mt-0.5 uppercase">
                {values.card_holder || 'CARDHOLDER NAME'}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                Expires
              </p>
              <p className="font-mono text-sm text-neutral-100 mt-0.5">
                {values.expiry || 'MM/YY'}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                CVV
              </p>
              <p className="font-mono text-sm text-neutral-100 mt-0.5">
                {'•'.repeat(values.cvv.length || 3)}
              </p>
            </div>
          </div>
        </div>

        <Button
          type="primary"
          onClick={() => setIsSaved(false)}
          className="inline-flex items-center gap-1.5 text-xs"
        >
          <FaPen size={10} />
          Edit card details
        </Button>
      </div>
    );
  }

  // 2. Card Input Form View
  return (
    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4">
      {loading && <AppLoader />}
      <div className="space-y-1.5">
        <FormField label={'Cardholder Name'} error={false}>
          <TextInput
            placeholder={'Name on card'}
            value={values.card_holder}
            onChange={(val: any) =>fields.card_holder.onChange(val)}
          />
        </FormField>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <FormField label={'Card Number'} error={false}>
            {brand !== 'CARD' && (
              <span className="text-[11px] font-semibold tracking-wider text-neutral-500">
              {brand}
            </span>
            )}
          </FormField>
        </div>
        <TextInput
          Icon={FaCreditCard}
          placeholder="0000 0000 0000 0000"
          value={values.card_number}
          onChange={handleCardNumberChange}
          inputClassName="tracking-wider font-mono"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <FormField label={'Expiration Date'} error={false}>
            <TextInput
              placeholder="MM/YY"
              value={values.expiry}
              onChange={handleExpiryChange}
              center
              inputClassName="tracking-wider font-mono"
            />
          </FormField>
        </div>

        <div className="space-y-1.5">
          <FormField label={'CVV'} error={false}>
            <TextInput
              Icon={FaLock}
              placeholder="123"
              value={values.cvv}
              onChange={handleCvvChange}
              isTypePassword
              inputClassName="tracking-widest font-mono"
            />
          </FormField>

        </div>
      </div>

      <div className="pt-1 flex justify-end">
        <Button
          type="primary"
          onClick={() => onSaveCard()}
          disabled={values.card_number.replace(/\D/g, '').length < 13 || !values.expiry || !values.cvv}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg  text-white text-xs font-medium "
        >
          <FaCheck size={11} />
          Save Card
        </Button>
      </div>
    </div>
  );
}