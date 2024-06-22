import styled from 'styled-components';

interface ButtonProps {
  width?: string;
  height?: string;
  background?: string;
}

export const ActionButton = styled.button<ButtonProps>`
  background: ${({ background }) => background || '#2E3440'};
  color: #D8DEE9;
  border: 1px solid #4C566A;
  border-radius: 50%;
  cursor: pointer;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  width: ${({ width }) => width || '35px'};
  height: ${({ height }) => height || '35px'};
`;

export const ConfirmButton = styled(ActionButton)`
  width: 50px;
  height: 50px;
  color: #D8DEE9;
  background: #2e7950BB;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 0;
`;

export const Button = styled.label`
  padding: .5em 1em;
  background: #2E3440;
  color: #D8DEE9;
  border: 1px solid #4C566A;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;
