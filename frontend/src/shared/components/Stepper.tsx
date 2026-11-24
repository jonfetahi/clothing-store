import { Fragment } from 'react';
import { FaCheck } from 'react-icons/fa';
import classNames from 'classnames';

type StepperProps = {
  steps: string[];
  activeStep: number;
};

const Stepper = ({ steps, activeStep }: StepperProps) => {
  return (
    <div className="w-full flex justify-center py-3">
      <div className="flex items-center w-4/5">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isLast = index === steps.length - 1;

          const circleClass = classNames(
            'flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-colors',
            {
              'bg-neutral-900 text-white': isCompleted || isActive,
              'bg-neutral-100 text-neutral-600 border border-neutral-200':
                !isCompleted && !isActive,
            }
          );

          const labelClass = classNames(
            'text-sm text-wrap transition-colors max-w-10',
            {
              'font-semibold text-neutral-900': isActive,
              'font-medium text-neutral-800': isCompleted,
              'font-medium text-neutral-600': !isCompleted && !isActive,
            }
          );

          const connectorClass = classNames(
            'flex-1 h-[2px] mx-6 transition-colors',
            {
              'bg-neutral-800': isCompleted,
              'bg-neutral-200': !isCompleted,
            }
          );

          return (
            <Fragment key={index}>
              <div className="flex items-center gap-2.5 shrink-0">
                <div className={circleClass}>
                  {isCompleted ? (
                    <FaCheck size={11} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className={labelClass}>{step}</span>
              </div>

              {!isLast && <div className={connectorClass} />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;