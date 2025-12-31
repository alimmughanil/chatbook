import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MultiLineText({ text, className = "" }) {
  return (
    <div className={`whitespace-pre-line lg:!font-medium text-sm md:text-base ${className}`}>
      {text}
    </div>
  );
}

function FlashMessage() {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) {
      toast(<MultiLineText text={flash.success} />, { type: 'success' });
    }

    if (flash?.message) {
      toast(<MultiLineText text={flash.message} />, { type: 'success' });
    }

    if (flash?.error) {
      toast(<MultiLineText text={flash.error} />, {
        type: 'error',
        autoClose: 10000,
      });
    }
  }, [flash]);

  return (
    <>
      <ToastContainer
        toastClassName="!w-fit sm:min-w-[20rem] xl:max-w-[50vw]"
        draggable={true}
        draggablePercent={80}
      />
    </>
  );
}

export default FlashMessage;
