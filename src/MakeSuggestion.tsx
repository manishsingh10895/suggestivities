import React, { useState } from 'react';
import { db } from './firebase';
import { ShowNotification, getUserData } from './utils';
import firebase from 'firebase';

type Props = {
    id: string
}

export default function MakeSuggestion(props: Props) {

    const [suggestion, setSuggestion] = useState('');

    async function makeIt(e) {
        e.preventDefault();
        if (!suggestion) {
            ShowNotification('warning', 'empty suggesstion');
            return;
        }
        try {
            let user = firebase.auth().currentUser;
            await db.child('demons').child(props.id)
                .child('suggestions')
                .push({
                    name: suggestion,
                    author: getUserData(),
                    createdAt: Date.now()
                })
        } catch (err) {
            ShowNotification('danger', err.message);
        } finally {
            setSuggestion('');
        }
    }

    return (
        <div style={{
            marginTop: '4rem',
        }} className="uk-container uk-flex-center uk-flex-middle">
            <div className="form-container">
                <form className="form" onSubmit={makeIt}>
                    <div className="uk-margin">
                        <input value={suggestion} name="name" onChange={(e) => setSuggestion(e.target.value)} className="uk-input uk-form-width-medium" type="text" placeholder="Your Suggestion" />
                    </div>

                    <button type="submit" className="uk-button uk-button-primary">
                        Make Suggestion
                    </button>
                </form>
            </div>
        </div>
    )
}