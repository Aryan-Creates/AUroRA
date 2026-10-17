/**
 * Reusable Button Component strictly matching DESIGN-renault.md specifications
 * Variants:
 * - primary (Sunlight Yellow CTA, rounded-xs 2px, height 48px)
 * - secondary-dark (Black CTA, rounded-xs 2px, height 48px)
 * - outline-dark (Outlined on light canvas, 1px solid black)
 * - outline-light (Outlined on dark canvas, 1px solid white)
 * - pill (Filter chips & sub-nav pills, rounded-pill 46px)
 * - icon-square (40x40px icon square, rounded-xs 2px)
 */

import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md', // 'sm', 'md', 'lg'
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  let baseStyle = 'inline-flex items-center justify-center font-bold transition-all duration-150 select-none cursor-pointer ';

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle =
        'bg-primary text-on-primary hover:bg-[#f5e400] active:bg-primary-deep disabled:bg-stone disabled:text-mute rounded-xs border-none tracking-btn ';
      break;
    case 'secondary-dark':
      variantStyle =
        'bg-surface-dark text-on-dark hover:bg-charcoal active:bg-ink disabled:bg-stone disabled:text-mute rounded-xs border-none tracking-btn ';
      break;
    case 'outline-dark':
      variantStyle =
        'bg-canvas text-ink border border-hairline-strong hover:bg-surface-soft active:bg-hairline rounded-xs tracking-btn ';
      break;
    case 'outline-light':
      variantStyle =
        'bg-surface-dark text-on-dark border border-on-dark hover:bg-white/10 active:bg-white/20 rounded-xs tracking-btn ';
      break;
    case 'pill':
      variantStyle =
        'bg-canvas text-ink border border-hairline-strong hover:bg-surface-dark hover:text-on-dark hover:border-surface-dark rounded-pill tracking-btnSm font-semibold ';
      break;
    case 'pill-active':
      variantStyle =
        'bg-surface-dark text-on-dark border border-surface-dark rounded-pill tracking-btnSm font-semibold ';
      break;
    case 'icon-square':
      variantStyle =
        'bg-canvas text-ink border border-hairline-strong hover:bg-surface-soft rounded-xs w-10 h-10 p-0 ';
      break;
    case 'danger':
      variantStyle =
        'bg-error text-white hover:bg-[#a85050] active:bg-[#924242] rounded-xs border-none tracking-btn ';
      break;
    default:
      variantStyle = 'bg-primary text-on-primary hover:bg-[#f5e400] rounded-xs ';
  }

  let sizeStyle = '';
  if (variant === 'pill' || variant === 'pill-active') {
    sizeStyle = size === 'sm' ? 'h-[32px] px-3 text-[12px]' : 'h-[36px] md:h-[36px] px-4 text-[13px]';
  } else if (variant === 'icon-square') {
    sizeStyle = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base';
  } else {
    switch (size) {
      case 'sm':
        sizeStyle = 'h-[36px] px-3.5 text-[13px]';
        break;
      case 'lg':
        sizeStyle = 'h-[52px] px-7 text-[16px]';
        break;
      case 'md':
      default:
        sizeStyle = 'min-h-[48px] px-6 text-[14.4px] leading-tight1';
        break;
    }
  }

  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none ' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
