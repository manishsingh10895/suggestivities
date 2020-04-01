import React, { useState, useEffect } from 'react';
import { Transition, CSSTransition } from 'react-transition-group';
import { db } from './firebase';
import { ShowNotification, checkIfValidUser } from './utils';
import { Author } from './Auther';


type Props = {
    suggestion: any,
    index: number,
    demonId: string,
}

const colors = [
    '#26C6DA',
    '#3F51B5',
    '#FBC02D',
    '#C2185B',
    '#00BFA5',
    "#F50057",
    '#FF6D00',
    "#039BE5",
    "#43A047",
    "#FF6E40",
    "#8BC34A",
    "#FF8A65"
]

const transitionStyles = {
    entering: { opacity: 1, },
    entered: { opacity: 1, transform: 'translateX(0)' },
    exiting: { opacity: 0 },
    exited: { opacity: 0, transform: 'translateX(100%)' },
};

export function Suggestion(props: Props) {
    const s = props.suggestion;
    const i = props.index;

    const anim = {
        delay: 0,
        in: true,
        classNames: "Circle",
        timeout: { exit: 100 },
    }

    const animClass = 'Circle';

    const [hovered, setHovered] = useState(false);

    async function deleteSuggestion() {
        try {

            let validUser = checkIfValidUser(props.suggestion.author.id);

            if (!validUser) {
                ShowNotification('danger', 'You can only remove your suggestions');
                return;
            }

            let ref = await db.child('demons').child(props.demonId).child('suggestions')
                .child(props.suggestion.key).ref;

            await ref.remove();

            ShowNotification('warning', 'Suggestion Removed');
        } catch (err) {
            console.log(err);
            ShowNotification('danger', err.message);
        }
    }

    useEffect(() => {
        setInterval(() => {
            // setHovered(!hovered);
        }, 6000)
    })

    return (
        <div
            onMouseLeave={() => {
                console.log('exitted');
                setHovered(false);
            }}
            onMouseEnter={() => {
                console.log('entered');
                setHovered(true);
            }} key={i} className="uk-tile uk-padding-small wow-shadow" style={{
                backgroundColor: colors[i % colors.length] || '#FF3D00',
                margin: 4,
                flex: '1 1 0',
                maxWidth: '350px',
                position: 'relative',
                borderRadius: 50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '15px 45px',
                color: 'white',
            }}>
            <div style={{
                color: 'white',
                fontSize: 24
            }}>
                {s.name}
            </div>


            <CSSTransition
                classNames={animClass}
                timeout={{
                    enter: 300,
                    exit: 100,
                }}
                in={hovered}
                unmountOnExit={true}
            >
                <Author author={s.author}></Author>
            </CSSTransition>

            <CSSTransition
                classNames={animClass}
                timeout={{
                    enter: 300,
                    exit: 0
                }}
                in={hovered}
                unmountOnExit={true}
            >
                <div
                    onClick={deleteSuggestion}
                    data-uk-icon="icon: close"
                    style={{
                        position: 'absolute',
                        color: '#ECEFF1',
                        right: -3,
                        padding: 5,
                        borderRadius: '25px',
                        cursor: 'pointer',
                        top: -5,
                        backgroundColor: colors[i % colors.length] || '#FF3D00',
                    }}></div>
            </CSSTransition>
        </div>
    )
}   