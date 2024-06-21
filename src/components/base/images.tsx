import styled from "styled-components";

interface ElementSize {
    width?: string;
    height?: string;
}

const ContainedImg = styled.img`
  object-fit: contain;
`;

export const Img = styled(ContainedImg)<ElementSize>`
  width: ${({width}) => (width || '15px')};
  height: ${({height}) => (height || '15px')};
`;

export const ReviewImage = styled(ContainedImg)`
  border-radius: 10px;
  max-height: 100%;
`;

export const StackImageThumbnail = styled.img`
    padding: 10px;
    background: #2E3440;
    color: #D8DEE9;
    border: 1px solid #4C566A;
    border-radius: 5px;
    cursor: pointer;
    width: 100px;
    height: 100px;
    object-fit: cover;
`;