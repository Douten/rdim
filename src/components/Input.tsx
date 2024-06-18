import { useState } from 'react';

import editIcon from '../images/pencil.png';
import deleteIcon from '../images/trash.fill.png';
import checkmarkIcon from '../images/checkmark.png';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Input({ value, onChange }: InputProps)
{
  return (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
  );
}
