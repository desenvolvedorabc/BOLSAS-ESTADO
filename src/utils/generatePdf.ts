import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export function useGeneratePdf() {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    removeAfterPrint: false,
  });

  return {
    componentRef,
    handlePrint,
  };
}
