import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../ui/Container';
import useServices from '../../../hooks/use-service';
import { useEffect, useMemo, useState } from 'react';
import Stepper from '../Stepper';
import useForm from '../../../hooks/use-form';
import { FaArrowLeft } from 'react-icons/fa';
import { usePreloadedService } from '../../../hooks/use-preloaded-service';
import { useNotify } from '../../../hooks/use-notify';
import { AppLoader } from '../AppLoader';
import Button from '../../ui/Button';

type Props = {
  getRecordService: any;
  path?: string;
  formDefinition: any[];
  editTitle: string;
  updateRecordService: any;
  additionalServices?: any;
};

export function RecordEditor(props: Props) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess } = useNotify();
  const isEdit = true;

  const {
    getRecordService,
    formDefinition,
    editTitle,
    updateRecordService,
    additionalServices,
  } = props;

  const [activeStep, setActiveStep] = useState(0);

  const { loading: loadingGetRecordById, data } = useServices(
    getRecordService,
    !!id,
    { id }
  );

  const { loading: loadingUpdate, requestAsync } = useServices(
    updateRecordService,
    false,
    { id }
  );

  const { loading: preloading, value } =
    usePreloadedService(additionalServices);

  const { definition, Form, Validator } = formDefinition[activeStep];
  const { fields, values, errors, fill, isValid, setShowErrors, touched } =
    useForm(definition, Validator);

  const steps = useMemo(() => {
    return formDefinition.map((f) => f.step);
  }, [formDefinition]);

  useEffect(() => {
    if (data) {
      //@ts-ignore
      fill({ ...data });
    }
  }, [data]);

  const onUpdateRecord = () => {
    if (isValid) {
      const payload = {
        ...values,
      };
      requestAsync({ payload }).then((data) => {
        if (data) {
          showSuccess('Successfully updated');
          navigate(location.pathname.split('/').slice(0, -1).join('/'));
        }
      });
    } else {
      setShowErrors(true);
    }
  };

  const onGoBack = () => {
    navigate(location.pathname.split('/').slice(0, -1).join('/'));
  };

  const hasSteps = formDefinition.length > 1;
  const isLastStep = activeStep === formDefinition.length - 1;
  const onNextStep = () => {
    setActiveStep((s) => s + 1);
  };

  const loading = loadingGetRecordById || loadingUpdate || preloading;

  return (
    <div className="max-w-full mx-auto mt-5 px-5">
      {loading && <AppLoader />}
      <div className="flex flex-row justify-between items-center">
        <div className="flex gap-2 items-center">
          <FaArrowLeft
            onClick={onGoBack}
            size={19}
            className="cursor-pointer"
          />
          <div className="text-lg">{editTitle}</div>
        </div>
        <div>
          <Button onClick={onUpdateRecord} type="primary" disabled={!touched}>
            {'Save'}
          </Button>
        </div>
      </div>
      {hasSteps && <Stepper steps={steps} activeStep={activeStep} />}
      <Container>
        <Form
          values={values}
          fields={fields}
          errors={errors}
          value={value}
          fill={fill}
          isEdit={isEdit}
        />
        {hasSteps && (
          <div>
            <Button onClick={onNextStep} type="primary" disabled={isLastStep}>
              {'Next'}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}