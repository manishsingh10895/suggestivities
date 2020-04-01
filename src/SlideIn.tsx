import React from "react";
import { CSSTransition } from "react-transition-group";
import { Title } from "./styleds/title";

type Props = {
    children: any,
}

export function SlideIn(props: Props) {
    return <CSSTransition
        classNames={{
            enter: 'slide-in',
            enterActive: 'slide-in-active',
            appear: 'slide-in',
            appearActive: 'slide-in-active',
        }}
        timeout={1000}
        in
        appear
    >
        {props.children}
    </CSSTransition>
}