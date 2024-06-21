import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
`;

// ## StackShow Components

export const ActionWrapper = styled.div`
  padding: 5px 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  flex-wrap: wrap;
  position: absolute;
  bottom: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.30),
    inset 0 -1px 4px #FFFFFF03,
    inset 0 -1px 1px #FFFFFF15,
    inset 0 -1px 0px #FFFFFF20;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
`;

export const ReviewImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80dvh;
  padding: 5px;
  width: 100%;
  padding: 10px;

  @media (max-width: 400px) {
    height: 40dvh;
  }
`;

// ## StackList Components

export const StackListkWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  width: 80%;
`;

export const AddStackWrapper = styled.div`
  margin: 5dvh auto;
`;

// ## StackItem Components

export const StackWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

export const StackActionWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;
