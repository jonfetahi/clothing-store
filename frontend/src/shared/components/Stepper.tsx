import { FaCheck } from 'react-icons/fa';
import classNames from 'classnames';

type StepperProps = {
  steps: string[];
  activeStep: number;
};

const Stepper = ({ steps, activeStep }: StepperProps) => {
  return (
    <div className="py-2 mx-auto w-4/5">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isUpcoming = index > activeStep;

          const circleBase =
            'flex items-center justify-center w-6 h-6 rounded-full z-10 flex-shrink-0';
          const circle = classNames(circleBase, {
            'bg-green-600 text-white': isCompleted,
            'border-2 border-blue-600 text-blue-600': isActive,
            'bg-blue-100 text-blue-300': isUpcoming,
          });

          const line = classNames('flex-1 h-0.5', {
            'bg-green-600': isCompleted,
            'bg-blue-400': isActive,
            'bg-blue-100': isUpcoming,
          });

          return (
            <div
              key={index}
              className="relative flex flex-col items-center flex-1 min-w-[75px]"
            >
              {index !== 0 && (
                <div className="absolute -left-1/2 top-3 w-full">
                  <div className={line} />
                </div>
              )}

              <div className={circle}>
                {isCompleted ? (
                  <FaCheck size={12} />
                ) : isActive ? (
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                ) : (
                  <div className="w-3 h-3" />
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">STEP {index + 1}</p>
                <p className="text-sm font-medium text-gray-900">{step}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;