import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { FullCenterContainer } from "./styleds/CenterContainer";
import { Title } from "./styleds/title";
import { Loader } from "./components/loader";
import { CSSTransition } from 'react-transition-group';
import { SlideIn } from "./SlideIn";
import { Author } from "./Auther";
import { ShowNotification, timeDifference } from "./utils";
import firebase from "firebase";
import EmptyData from "./EmptyData";

export default function Suggestions(props) {
    const [suggesstions, setSuggesstions] = useState<any>([]);

    const [loading, setLoading] = useState(false);

    async function updateSuggestions(data: firebase.database.DataSnapshot) {
        console.log(data);
        const val = data.val();
        console.log(val);

        updateSuggestionState(data);
    }

    function updateSuggestionState(snap: firebase.database.DataSnapshot) {
        let data: any[] = [];
        let finished: any[] = [];

        snap.forEach((r) => {
            let val = r.val();
            if (!val.finished)
                data.push({ key: r.key, ...val });
            else {
                finished.push({ key: r.key, ...val });
            }
        });

        data = data.concat(finished);

        console.log(data);

        setSuggesstions(data);
    }

    async function fetchSuggestions() {

        setLoading(true);

        db.child('demons').on('value', updateSuggestions);

        let snap = await db.child('demons').once('value');

        updateSuggestionState(snap);

        setLoading(false);
    }

    async function RemoveDemon(demon) {
        if (!demon.author) {
            ShowNotification('danger', 'Error in removing');

            return;
        }

        let user = firebase.auth().currentUser as firebase.User;

        if (user.uid !== demon.author.id) {
            ShowNotification('danger', 'You can only delete your own activities');
            return;
        }

        let ref = await db.child('demons').child(demon.key).ref;

        if (!ref) {
            ShowNotification('danger', 'Error in removing');

            return;
        }

        await ref.remove();
    }

    useEffect(() => {
        fetchSuggestions();
        return () => {

        }
    }, [])

    const transitionStyles = {
        entering: { opacity: 1, },
        entered: { opacity: 1, transform: 'translateX(0)' },
        exiting: { opacity: 0 },
        exited: { opacity: 0, transform: 'translateX(100%)' },
    };

    return (
        <FullCenterContainer>
            <div>

                <SlideIn>
                    <Title>What to suggest</Title>
                </SlideIn>

                {
                    loading ? <Loader></Loader> : null
                }

                <div style={{ justifyContent: 'center' }} className="uk-flex uk-flex-wrap" uk-grid="true">
                    {
                        suggesstions && suggesstions.length > 0 ? suggesstions.map((s, i) => {
                            console.log(s);
                            return <div key={i}
                                style={{
                                    margin: 10,
                                    position: "relative",
                                    flex: '1 1 0',
                                    minWidth: '225px',
                                    maxWidth: 350,
                                    cursor: 'pointer'
                                }}

                            >
                                <div
                                    style={{
                                        backgroundColor: s.finished ? '#CFD8DC' : 'white',
                                        borderRadius: '24px',
                                        paddingBottom: '45px',
                                    }}
                                    onClick={() => {
                                        if (s.finished) return;

                                        props.history.push('/demons/' + s.key)
                                    }} className={`uk-card uk-card-default uk-card-hover uk-card-body ${s.finished ? 'finished' : ''}`}

                                >
                                    <h3 className="uk-card-title">{s.name}</h3>
                                    <p>{s.description}</p>

                                    {
                                        s.selected ? <div style={{
                                            margin: '20px 0',
                                            display: 'flex', alignItems: 'center', textAlign: 'center',
                                            padding: '10px 25px',
                                            border: '2px solid #1e87f0',
                                            color: '#1e87f0',
                                            justifyContent: 'center',
                                            borderRadius: '25px',
                                        }}>
                                            Winner <span style={{ fontSize: 20, paddingLeft: 8 }}>{s.selected.name}</span>
                                        </div> : null
                                    }

                                    <div style={{
                                        marginTop: 8
                                    }}>
                                        <Author author={s.author}></Author>
                                    </div>


                                    <div onClick={(e) => { e.stopPropagation(); RemoveDemon(s); }} style={{
                                        padding: 10,
                                        borderTopRightRadius: 25,
                                        background: '#e53935',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        cursor: 'pointer'
                                    }}>
                                        <span style={{ color: 'white' }} uk-icon="icon: close"></span>
                                    </div>

                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 6,
                                            right: 14,
                                            fontSize: 14,
                                            color: 'black'
                                        }}>
                                        {
                                            s.finished ? `finished ${timeDifference(s.finishedAt)}` : timeDifference(s.createdAt)
                                        }
                                    </div>
                                </div>
                            </div>
                        })
                            : loading ? null : <EmptyData></EmptyData>
                    }
                </div>

                <button
                    style={{
                        position: 'fixed',
                        right: '10px',
                        bottom: 10,
                        padding: 19,
                        borderRadius: '50px',
                        color: 'white',
                        cursor: 'pointer',
                        lineHeight: 'inherit',
                        backgroundColor: '#1e87f0',
                    }}
                    onClick={() => {
                        props.history.push('/new');
                    }} className="uk-button uk-button-primary shadow">
                    <span uk-icon="icon: plus"
                        style={{ color: 'white', marginRight: 8 }}
                    >
                    </span>
                    Create One
                </button>
            </div>
        </FullCenterContainer >
    )
}