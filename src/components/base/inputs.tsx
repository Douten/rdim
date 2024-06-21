import styled from "styled-components";

interface InputProps {
  padding?: string;
}

export const Input = styled.input<InputProps>`
  padding: ${({padding}) => (padding || '10px')};
  background: #2E3440;
  color: #D8DEE9;
  border: 1px solid #4C566A;
  border-radius: 5px;
  cursor: pointer;
  width: 70px;
`;