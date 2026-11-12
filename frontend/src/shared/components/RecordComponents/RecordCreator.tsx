import { FaArrowLeft } from 'react-icons/fa';
import useServices from '../../../hooks/use-service';
import { useMemo, useState } from 'react';
import useForm from '../../../hooks/use-form';
import { usePreloadedService } from '../../../hooks/use-preloaded-service';
import { useNotify } from '../../../hooks/use-notify';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLoader } from '../AppLoader';
import Button from '../../ui/Button';
import Stepper from '../Stepper';
import { Container } from '../../ui/Container';

type Props = {
  createRecordService: any;
  createTitle: string;
  formDefinition: any[];
  additionalServices?: any;
};

export function RecordCreator(props: Props) {
  const { showSuccess } = useNotify();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const {
    createRecordService,
    createTitle,
    formDefinition,
    additionalServices,
  } = props;

  const { loading, requestAsync } = useServices(createRecordService, false);
  const { loading: preloading, value } =
    usePreloadedService(additionalServices);

  const { definition, Form, Validator } = formDefinition[activeStep];
  const { fields, values, errors, isValid, setShowErrors } = useForm(
    definition,
    Validator
  );

  const onCreateRecord = () => {
    let payload = {
      ...values,
    };
    if (isValid) {
      requestAsync({ payload }).then((data) => {
        if (data) {
          showSuccess('Successfully Created');
          onGoBack();
        }
      });
    } else {
      setShowErrors(true);
    }
  };

  const hasSteps = formDefinition.length > 1;

  const steps = useMemo(() => {
    return formDefinition.map((f) => f.step);
  }, [formDefinition]);

  const onGoBack = () => {
    navigate(location.pathname.split('/').slice(0, -1).join('/'));
  };

  const onNextStep = () => {
    setActiveStep((s) => s + 1);
  };

  return (
    <div className="max-w-full mx-auto mt-5 px-5">
      {(loading || preloading) && <AppLoader />}
      <div className="flex flex-row justify-between items-center">
        <div className="flex gap-2 items-center">
          <FaArrowLeft
            onClick={onGoBack}
            size={19}
            className="cursor-pointer"
          />
          <div className="text-lg">{createTitle}</div>
        </div>
        <div>
          <Button onClick={onCreateRecord} type="primary">
            {'Create'}
          </Button>
        </div>
      </div>
      {hasSteps && <Stepper steps={steps} activeStep={activeStep} />}
      <Container>
        <Form values={values} fields={fields} errors={errors} value={value} />
        {hasSteps && (
          <div>
            <Button onClick={onNextStep} type="primary">
              {'Next'}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}