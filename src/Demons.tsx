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
import DbService from "./services/db.service";
import DemonComponent from "./DemonComponent";

export default function Suggestions(props) {
    const [demons, setdemons] = useState<any>([]);

    const [loading, setLoading] = useState(false);

    async function updateDemons(data: firebase.database.DataSnapshot) {
        console.log(data);
        const val = data.val();
        console.log(val);

        updateDemonsState(data);
    }

    function updateDemonsState(snap: firebase.database.DataSnapshot) {
        let data = DbService.getDemonsFromSnap(snap);

        setdemons(data);
    }

    async function fetchDemons() {

        setLoading(true);

        db.child('demons').on('value', updateDemons);

        let snap = await db.child('demons').once('value');

        updateDemonsState(snap);

        setLoading(false);
    }

    async function RemoveDemon(demon) {
        await DbService.removeDemon(demon);
    }

    useEffect(() => {
        fetchDemons();
        return () => {

        }
    }, [])

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
                        demons && demons.length > 0 ? demons.map((s, i) => {
                            console.log(s);
                            return <DemonComponent demon={s} history={props.history} ></DemonComponent>
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