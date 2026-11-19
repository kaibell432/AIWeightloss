import { Select as S } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';
import { cx } from '@/lib/cx';
import { inputClass } from '@/components/ui/field';

// Radix Select with plain { value, label } options.
export function Select({ id, value, onValueChange, options, placeholder = 'Choose…', required, className }) {
  return (
    <S.Root value={value || undefined} onValueChange={onValueChange} required={required} name={id}>
      <S.Trigger
        id={id}
        className={cx(inputClass, 'flex items-center justify-between gap-2 text-left data-[placeholder]:text-muted/80', className)}
      >
        <S.Value placeholder={placeholder} />
        <S.Icon>
          <ChevronDown className="size-4 text-muted" />
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-hidden rounded-2xl bg-panel p-1.5 shadow-pop ring-1 ring-rule data-[state=open]:animate-rise"
        >
          <S.Viewport>
            {options.map((o) => (
              <S.Item
                key={o.value}
                value={o.value}
                className="relative flex cursor-pointer items-center rounded-xl py-2.5 pr-3 pl-9 text-[0.95rem] outline-none select-none data-[highlighted]:bg-well data-[state=checked]:font-semibold"
              >
                <S.ItemIndicator className="absolute left-3 inline-flex">
                  <Check className="size-4 text-route" />
                </S.ItemIndicator>
                <S.ItemText>{o.label}</S.ItemText>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}
