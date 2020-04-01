import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom';
import firebase from 'firebase';
import { Firebase } from './firebase';

type Props = {
    component: Component,
}

export function PrivateRoute({ component: Component, authed, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
        />
    )
}


export function PublicRoute({ component: Component, authed, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => authed === false
                ? <Component {...props} />
                : <Redirect to='/' />}
        />
    )
}

export const AuthLoading = (props) => {
    async function checkLogin() {
        let user = await firebase.auth().currentUser;

        if (user) {
            props.history.push('/');
        } else {
            props.history.push('/login');
        }
    }

    return (
        <div className="uk-container uk-flex uk-flex-center uk-flex-middle">
            <span uk-spinner="ratio: 4.5"></span>
        </div>
    )
}