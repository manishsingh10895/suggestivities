import React from 'react'
import firebase from 'firebase'

export function Login(props) {
    async function fireLogin() {
        try {
            var provider = new firebase.auth.GoogleAuthProvider();

            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

            let user = await firebase.auth()
                .signInWithPopup(provider)


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