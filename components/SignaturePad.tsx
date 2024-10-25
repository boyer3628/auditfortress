"use client";

import { useRef, useState } from "react";
import SignatureCanvas from 'react-signature-canvas';
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onSave: (signature: string) => void;
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  const sigPadRef = useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = useState(false);

  const clear = () => {
    sigPadRef.current?.clear();
    setIsSigned(false);
  };

  const save = () => {
    if (sigPadRef.current) {
      const signatureData = sigPadRef.current.toDataURL();
      onSave(signatureData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <SignatureCanvas
          ref={sigPadRef}
          canvasProps={{
            className: "w-full h-32",
          }}
          onBegin={() => setIsSigned(true)}
        />
      </div>
      <div className="flex gap-4">
        <Button
          onClick={clear}
          variant="outline"
          className="flex-1"
        >
          Clear
        </Button>
        <Button
          onClick={save}
          disabled={!isSigned}
          className="flex-1"
        >
          Save Signature
        </Button>
      </div>
    </div>
  );
}
