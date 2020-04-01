import React from 'react';
import styled from 'styled-components';

interface AdditionalProps {
    template: string,
}

export const CenterContainer = styled.div.attrs<AdditionalProps>(props => ({
    className: "uk-flex uk-flex-center uk-flex-middle",
    ...props
}))`

`;

export const FullCenterContainer = styled(CenterContainer)`
    min-height: 100vh;
`