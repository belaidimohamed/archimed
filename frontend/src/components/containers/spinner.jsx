
import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import styled from 'styled-components';

const Wrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:15%;
`
export default function Spinner() {
    return (
        <Wrapper>
            <ProgressSpinner />
        </Wrapper>
    );
}
        