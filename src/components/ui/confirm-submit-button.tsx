"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmSubmitButtonProps extends ComponentProps<typeof Button> {
  confirmMessage: string;
}

export function ConfirmSubmitButton({
  confirmMessage,
  onClick,
  ...props
}: ConfirmSubmitButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return <Button {...props} type="submit" onClick={handleClick} />;
}
