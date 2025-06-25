import React from 'react';

const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={20}
    height={28}
    viewBox='0 0 20 28'
    fill='none'
    stroke='currentColor'
    strokeWidth={1.8}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <rect x={3} y={7} width={14} height={16} rx={2} />
    <path d='M1 7h18' />
    <path d='M6 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
    <line x1={8} y1={13} x2={8} y2={21} />
    <line x1={12} y1={13} x2={12} y2={21} />
  </svg>
);

export default DeleteIcon;