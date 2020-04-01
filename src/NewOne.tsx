import React, { useState } from 'react';
import { db } from './firebase';
import { Title } from './styleds/title';
import { RouteComponentProps } from 'react-router-dom';
import { ShowNotification, getUserData } from './utils';
import { SlideIn } from './SlideIn';

type Props = {

}

export default function NewOne(props: RouteComponentProps<Props>) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name) return;

        try {
            await db.child('demons').push({
                name, description, finished: false, author: getUserData(),
                createdAt: Date.now()
            })

            props.history.push('/');

            ShowNotification('success', "Created");
        } catch (err) {
            ShowNotification('danger', err.message);
        }
    }

    return (
        <div className="uk-container uk-flex uk-flex-center uk-flex-middle fh">
            <div className="form-container" style={{ maxWidth: '100%' }}>
                <SlideIn>
                    <Title>
                        Create a new Activity
                    </Title>
                </SlideIn>
                <form className="form" onSubmit={handleSubmit} >
                    <div className="uk-margin">
                        <input name="name" className="uk-input uk-form-width-large" type="text" placeholder="Name for it" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="uk-margin">
                        <input name="description" className="uk-input uk-form-width-large" type="text" placeholder="Give it some description"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="uk-button uk-button-primary">
                        Create
                    </button>
                </form>
            </div>
        </div>
    )
}