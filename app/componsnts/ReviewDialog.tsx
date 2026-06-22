export type ReviewDialogType =
  | "checkout-confirm"
  | "checkout-success"
  | "save-success"
  | "clear-confirm"
  | null;

type ReviewDialogProps = {
  dialog: ReviewDialogType;
  subtotalLabel: string;
  onClose: () => void;
  onConfirmCheckout: () => void;
  onClearSavedSystem: () => void;
};

export default function ReviewDialog({
  dialog,
  subtotalLabel,
  onClose,
  onConfirmCheckout,
  onClearSavedSystem,
}: ReviewDialogProps) {
  if (!dialog) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] rounded-[10px] bg-white p-6 text-center shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        {dialog === "checkout-confirm" ? (
          <>
            <h2
              id="review-dialog-title"
              className="text-[#1F1F1F] text-[22px] font-bold leading-[1.15]"
            >
              Confirm checkout
            </h2>
            <p className="mt-3 text-sm leading-[130%] text-[#1F1F1FBF]">
              Ready to place your security bundle order for {subtotalLabel}?
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="x-btn-outline !h-[44px] !w-full !px-3 !text-base"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="x-btn-primary !h-[44px]"
                onClick={onConfirmCheckout}
              >
                Confirm
              </button>
            </div>
          </>
        ) : null}

        {dialog === "checkout-success" ? (
          <SuccessDialog
            title="Order confirmed!"
            message="Your security bundle checkout was successful."
            onClose={onClose}
          />
        ) : null}

        {dialog === "save-success" ? (
          <SuccessDialog
            title="System saved!"
            message="Your security system has been saved and will be restored when you come back."
            onClose={onClose}
          />
        ) : null}

        {dialog === "clear-confirm" ? (
          <>
            <h2
              id="review-dialog-title"
              className="text-[#1F1F1F] text-[22px] font-bold leading-[1.15]"
            >
              Clear saved system?
            </h2>
            <p className="mt-3 text-sm leading-[130%] text-[#1F1F1FBF]">
              This removes the saved system from this browser. Your current
              selections will stay on the page.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="x-btn-outline !h-[44px] !w-full !px-3 !text-base"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="x-btn-primary !h-[44px] !bg-[#D8392B] hover:!bg-[#9b241b]"
                onClick={onClearSavedSystem}
              >
                Clear
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function SuccessDialog({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <>
      <h2
        id="review-dialog-title"
        className="text-[#0AA288] text-[22px] font-bold leading-[1.15]"
      >
        {title}
      </h2>
      <p className="mt-3 text-sm leading-[130%] text-[#1F1F1FBF]">{message}</p>
      <button type="button" className="x-btn-primary mt-5" onClick={onClose}>
        Done
      </button>
    </>
  );
}
