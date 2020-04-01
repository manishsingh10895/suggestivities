import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { useParams, RouteComponentProps } from 'react-router-dom';
import { Loader } from './components/loader';
import { Title } from './styleds/title';
import MakeSuggestion from './MakeSuggestion';
import { Transition } from 'react-transition-group';
import { Suggestion } from './Suggestion';
import { checkIfValidUser, ShowNotification } from './utils';
import { Author } from './Auther';
import EmptyData from './EmptyData';

type Props = {
    id: string
}

declare var Navigator: {
    share: () => void
}

function Share({ demon }) {

    if (!demon) return null;

    let text = 'Suggest me some ' + demon.name;

    //@ts-ignore
    if (navigator.share) {
        return (
            <div onClick={() => {
                //@ts-ignore
                navigator.share({
                    title: 'Suggestivities',
                    text,
                    url: window.location.href
                })
            }}>
                <span uk-icon="icon: social"></span>
            </div>
        )
    }
    else {
        return <div>
            <a target="_blank" href={`https://web.whatsapp.com/send?text=${window.location.href}`} data-action="share/whatsapp/share"><span uk-icon="icon: social"></span></a>
        </div>
    }
}

export function Demon(props: RouteComponentProps<Props>) {

    const [demon, setDemon] = useState<any>(null)

    const [suggestions, setSuggestions] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const params = useParams<{ id: string }>();
    const id: string = params.id;

    async function handleNewSuggestions(val: firebase.database.DataSnapshot) {
        console.log(val.val());
        let snap = await db.child('demons').child(id || '')
            .child('suggestions')
            .once('value');

        let data: any[] = [];

        snap.forEach(
            (s: firebase.database.DataSnapshot) => {
                data.push({
                    key: s.key,
                    ...s.val()
                })
            })

        console.log(data);
        setSuggestions(data);
    }

    async function handleSuggestionRemoved(val) {
        console.log(val);
    }

    async function fetchDemon() {
        setLoading(true);
        let snap = await db.child('demons').child(id).once('value');

        let val = snap.val();

        setDemon(val);

        console.log(val);

        if (!val) {
            props.history.push('/');
            return;
        }

        await fetchSuggestions();

        setLoading(false);
    }

    async function fetchSuggestions() {
        db.child('demons').child(id).child('suggestions').on('value', handleNewSuggestions)
        db.child('demons').child(id).child('suggestions').on('child_removed', handleSuggestionRemoved);
    }

    useEffect(() => {
        fetchDemon();
        return () => {

        }
    }, [])

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    async function endSuggestions() {

        let validUser = checkIfValidUser(demon.author.id);

        if (!validUser) {
            ShowNotification('danger', 'You can only mark your activities as ended');
            return;
        }

        let res = window.confirm('Are you sure to end this?');

        if (!res || !suggestions || suggestions.length == 0) return;



        let refs: any = {};

        suggestions.forEach((s) => {
            let did = 'something';
            if (s.author && s.author.id) did = s.author.id;

            if (!refs[did]) refs[did] = [];

            refs[did].push(s);
        });

        let rand = getRandomArbitrary(0, Object.keys(refs).length);

        let refKey = Object.keys(refs)[rand];

        let ref = refs[refKey];

        rand = getRandomArbitrary(0, ref.length);

        console.log(rand)

        console.log(ref);
        try {
            await db.child('demons').child(id).update({
                finished: true,
                selected: ref[rand] || suggestions[0],
                finishedAt: Date.now()
            })

            props.history.push('/');

        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="fh uk-flex uk-flex-center uk-flex-middle">
            {
                loading ?
                    <Loader></Loader> : null
            }

            {
                !loading ?
                    <div>
                        {
                            !demon ?
                                null :
                                <div className="demon">
                                    <Title>
                                        {demon.name}
                                    </Title>
                                    <h5 style={{ textAlign: 'center' }}>
                                        {demon.description}
                                    </h5>

                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Author author={demon.author} ></Author>

                                        <div className="share" style={{ marginLeft: 12 }}>
                                            <Share demon={demon}></Share>
                                        </div>
                                    </div>
                                </div>
                        }

                        <hr className="uk-divider-icon" />

                        <Title>
                            Suggestions
                        </Title>

                        <div
                            style={{
                                justifyContent: 'center'
                            }}
                            className="uk-flex uk-flex-wrap">
                            {
                                suggestions && suggestions.length > 0 ? suggestions.map((s, i) => {
                                    return (
                                        <Suggestion demonId={id} key={i} suggestion={s} index={i}></Suggestion>
                                    )
                                }) : <EmptyData></EmptyData>
                            }
                        </div>

                        <hr className="uk-divider-icon" />

                        <MakeSuggestion id={id}></MakeSuggestion>

                        <div
                            onClick={endSuggestions}
                            className="shadow"
                            style={{
                                position: 'fixed',
                                right: '10px',
                                bottom: 10,
                                padding: 12,
                                borderRadius: '50px',
                                color: 'white',
                                cursor: 'pointer',
                                backgroundColor: '#1e87f0',
                            }}>
                            <span style={{ color: 'white' }} uk-icon="icon: check"></span>
                            <span style={{ color: 'white', marginLeft: 8 }}>
                                End Suggestions
                            </span>
                        </div>
                    </div>
                    : null
            }

        </div>
    )
}

