import React from 'react';
import { Button } from './button';
import Utils from '@repo/utils';
import { useToast } from '../hooks/use-toast';
import { cn } from '../core/utils';

type Props = {
  value: string;
  labels?: string[];
};

function Clipboard({
  value,
  labels = ['Copy', 'Copied!'],
  className,
  ...props
}: Props & React.ComponentProps<typeof Button>) {
  const [idle, after] = labels;
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  async function handleClick() {
    if (copied) {
      return;
    }

    navigator.clipboard.writeText(value);
    setCopied(true);
    toast({
      description: 'Copied to clipboard',
      duration: 3000,
    });
    await Utils.delay(3000);
    setCopied(false);
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      className={cn(className, {
        'cursor-default': copied,
      })}
      {...props}
    >
      {!copied ? idle : after}
    </Button>
  );
}

export { Clipboard };