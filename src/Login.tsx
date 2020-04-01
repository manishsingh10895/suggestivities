import React from 'react'
import firebase from 'firebase'
import { useLocation, RouteComponentProps } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function Login(props: RouteComponentProps<{ from: string }>) {
    let query = useQuery();

    //@ts-ignore
    console.log(props.location?.state?.from);
    //@ts-ignore
    let redirect = props.location?.state?.from?.pathname;

    async function fireLogin() {
        try {
            var provider = new firebase.auth.GoogleAuthProvider();

            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

            let user = await firebase.auth()
                .signInWithPopup(provider)

            if (redirect) {
                props.history.push(redirect);
                return;
            }

            props.history.push('/');
        } catch (err) {
            throw err;
        }
    }

    return (
        <div className="fh container auth-container uk-flex uk-flex-middle uk-flex-center">
            <button onClick={fireLogin} className="uk-button uk-button-primary">Login</button>
        </div>
    )
}