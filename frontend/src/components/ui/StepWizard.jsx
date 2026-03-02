export default function StepWizard({ steps, currentStep, onStepClick }) {
  return (
    <nav aria-label="Fortschritt">
      <ol className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isPast = currentStep > stepNum;
          return (
            <li key={step.id} className="flex-1 flex items-center">
              {index > 0 && (
                <div className={`flex-1 h-0.5 mx-1 ${isPast ? 'bg-primary' : 'bg-slate-200'}`} aria-hidden />
              )}
              <button
                type="button"
                onClick={() => onStepClick?.(stepNum)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : isPast ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-current font-semibold text-sm">
                  {isPast ? '✓' : stepNum}
                </span>
                <span className="text-xs font-medium text-center hidden sm:block">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${isPast ? 'bg-primary' : 'bg-slate-200'}`} aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
