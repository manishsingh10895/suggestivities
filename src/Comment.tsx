import React, { CSSProperties, useState, useEffect } from 'react';
import { StyledProps } from 'styled-components';
import { Author } from './Auther';
import { timeDifference, checkIfValidUser, ShowNotification } from './utils';
import { Transition } from 'react-transition-group';
import { db } from './firebase';

type Props = {
    comment: any;
    demonId: string,
}

const Styles: { [name: string]: CSSProperties } = {
    comment: {
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        borderBottom: '1px solid #0000000d',
        justifyContent: 'space-between'
    }
}

const transitionStyles = {
    entering: {
        opacity: 0.75,
        transform: `translateX(0%) scale(1.1)`,
        boxShadow: "0px -6px 20px 0px #989898",
    },
    entered: {
        opacity: 1,
        transform: `translateX(0%) scale(1)`,
        boxShadow: "0px -6px 20px 0px #989898",
    },
    exiting: {
        opacity: 0.5,
        transform: `translateX(50%)`,
        boxShadow: null,
    },
    exited: {
        opacity: 0,
        transform: `translateX(100%)`,
        boxShadow: null,
    }
};


export default function Comment(props: Props) {

    const [isAuthor, setisAuthor] = useState(false);

    const [hovered, sethovered] = useState(false);

    console.log(isAuthor);

    useEffect(() => {
        let isAuthor = checkIfValidUser(props.comment.author.id);

        setisAuthor(isAuthor);

        console.log(isAuthor);

        console.log(props.comment);
    }, [])

    async function removeComment() {
        try {
            let ref = await db.child('demons').child(props.demonId).child('comments').child(props.comment.key).ref;

            await ref.remove()

            ShowNotification('success', 'Comment removed');
        } catch (error) {
            console.error(error);
            ShowNotification('danger', 'Error in comment removal');
        }
    }

    return (
        <div
            onMouseEnter={() => sethovered(true)} onMouseLeave={() => sethovered(false)}
            style={Styles.comment}
        >
            <div style={{ display: 'flex', alignItems: 'center', flexBasis: '75%' }}>
                <Author onlyPhoto={true} author={props.comment.author}></Author> <div
                    style={{
                        marginLeft: 14,
                        textAlign: 'left',
                    }}
                    className="text">
                    {props.comment.comment}
                </div>
            </div>

            <div style={{ color: "#c1c1c1", fontSize: 12 }}>
                {timeDifference(props.comment.createdAt)}
            </div>

            {
                isAuthor ?
                    <Transition in={hovered} timeout={{ enter: 300, exit: 0 }}>
                        {
                            state => {
                                return <div
                                    onClick={removeComment}
                                    style={{
                                        transform: 'scale(0.8)',
                                        ...transitionStyles[state],
                                        transition: 'all 200ms ease-in',
                                        borderRadius: 19,
                                        height: 38,
                                        width: 38,

                                        position: 'absolute',
                                        right: 10,
                                        top: 'calc(50% - 19px)',
                                        color: 'white',
                                        display: 'flex',
                                        justifyContent: "center",
                                        alignItems: 'center',
                                        backgroundColor: '#E64A19'
                                    }}>
                                    <span uk-icon="icon: close"></span>
                                </div>
                            }
                        }
                    </Transition>
                    : null
            }
        </div>
    )
}