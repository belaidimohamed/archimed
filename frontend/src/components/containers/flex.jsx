import React from 'react';
import styled from 'styled-components';

// Styled component for the Flex container
const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'nowrap')};
  justify-content: ${(props) => props.justifycontent || 'flex-start'};
  align-items: ${(props) => props.alignitems || 'stretch'};
  gap: ${(props) => props.gap || '0'};
  width:100%;
  
`;

const Flex = ({
  children,
  gap = '20px',
  wrap = true,
  justifyContent = 'center',
  alignItems = 'center',
  direction = 'row',
}) => {
  return (
    <FlexContainer
      gap={gap}
      wrap={wrap}
      justifycontent={justifyContent}
      alignitems={alignItems}
      direction={direction}
    >
      {children}
    </FlexContainer>
  );
};

export default Flex;
