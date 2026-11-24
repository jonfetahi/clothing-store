import { useMemo, useState } from 'react';
import { useBreadcrumbs } from '../../../context/navigation-context';
import Stepper from '../../../shared/components/Stepper';
import useForm from '../../../hooks/use-form';
import useServices from '../../../hooks/use-service';
import { Services } from '../../../api/services';
import { AppLoader } from '../../../shared/components/AppLoader';
import { shippingInfoForm } from './shipping-info/ShippingInfoForm';
import { paymentForm } from './payment/PaymentForm';
import { reviewForm } from './review/ReviewForm';
import Button from '../../../shared/ui/Button';
import { useNavigate } from 'react-router-dom';
import { OrderSummaryCard } from './shipping-info/OrderSummaryCard';
import { ShoppingCartTypes } from '../shopping-cart/types';
import { useNotify } from '../../../hooks/use-notify';

const allSteps: any = [
  reviewForm(),
  paymentForm(),
  shippingInfoForm(),
]?.sort((a: any, b: any) => a.step_number - b.step_number);
const steps = allSteps.map((s:any) => s.label);

export function CheckoutWizard() {
  const navigate = useNavigate();
  useBreadcrumbs('Checkout', 2);
  const { showSuccess } = useNotify()
  const [activeStep, setActiveStep] = useState(0);
  const [generalState, setGeneralState] = useState({});

  const { loading: loadingItems, data } = useServices(Services.ShoppingCart.list, true);
  const { loading: loadingOrder, requestAsync } = useServices(Services.Orders.create, false);
  const itemsData: ShoppingCartTypes | null = useMemo(() => {
    return data ?? null;
  }, [data]);

  // const [generalState, setGeneralState] = useState({});

  const forms = allSteps.map((s: any) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useForm(s.definition, s.Validator),
  );

  const currentStep = allSteps[activeStep];
  const { fields, values, errors, isValid, setShowErrors } = forms[activeStep];
  const { Form } = currentStep;



  const isLast = activeStep === allSteps.length - 1;

  const onNext = () => {
    if (!isValid) {
      setShowErrors(true);
    } else {
      if (!isLast) {
        setGeneralState((prev) => ({ ...prev, [currentStep.step]: values }));
        setActiveStep((s) => s + 1);
      } else {
        const payload = Object.assign({}, ...forms.map((f: any) => f.values));
        requestAsync({ payload }).then(() => {
          showSuccess('Order Confirmed')
          navigate('/public');
        })
      }
    }
  };
  console.log(generalState);

  const onPrevious = () => {
    setActiveStep((s) => s - 1);
  };

  const onDiscard = () => {
    navigate('/public');
  };

  const loading = loadingItems || loadingOrder;

  return (
    <div className="bg-white">
      {loading && <AppLoader />}
      <Stepper steps={steps} activeStep={activeStep} />
      <div className="grid grid-cols-5 mx-10 my-12 h-full">
        <div className="col-span-3">
          <Form fields={fields} values={values} errors={errors} generalState={generalState} />
        </div>
        <div className="col-span-2 mx-10">
          <OrderSummaryCard data={itemsData} />
        </div>
      </div>
      <div className="w-full flex flex-row justify-between border-t-2 p-5">
        <div>
          <Button onClick={() => onPrevious()} type="secondary" disabled={activeStep === 0}>
            Previous
          </Button>
        </div>
        <div>
          <Button onClick={() => onDiscard()} type="warning">
            Discard
          </Button>
        </div>
        <div>
          <Button onClick={() => onNext()} type="primary" disabled={!isValid}>
            {isLast ? 'Confirm Payment' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}