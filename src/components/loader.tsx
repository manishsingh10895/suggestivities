import React from 'react';
import { CenterContainer } from '../styleds/CenterContainer';
import styled from 'styled-components';

let SLoader = styled(CenterContainer).attrs(props => ({
    'data-uk-spinner': 'ratio: 4.5'
}))`
min-height: 20rem;
`

export const Loader = (props) => (
    <SLoader></SLoader>
)