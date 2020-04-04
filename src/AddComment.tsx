import React, { useState } from 'react';
import { db } from './firebase';
import firebase from 'firebase';
import { getUserData, ShowNotification } from './utils';
import { PrimaryColor } from './services/config';

type Props = {
    demonId: string,
    comments: any[]
}

const MaxLength = 144;

const MAX_COMMENTS = 10;

const InputColorMap = {
    72: '#8BC34A',
    99: '#FDD835',
    128: '#FB8C00',
    138: '#F4511E',
    144: '#BF360C',
}

let inputColors = [];

Object.keys(InputColorMap)
    .forEach((k) => {
        let index = Number(k);
        for (let i = inputColors.length; i < index; i++) {
            inputColors.push(InputColorMap[k]);
        }
    })

console.log(inputColors);

export default function AddComment(props: Props) {

    const [comment, setComment] = useState('');

    const [inputColor, setinputColor] = useState(PrimaryColor);

    async function submit(e) {
        e.preventDefault();

        if (!comment) return;

        let check = checkIfCanComment();

        if (!check) {
            ShowNotification('warning', 'Max comment limit reached');
            return;
        };

        await db.child('demons').child(props.demonId).child('comments')
            .push({
                author: getUserData(),
                comment: comment,
                createdAt: Date.now()
            })

        setComment('');
    }

    function checkIfCanComment() {
        let userId = getUserData().id;

        let userComments = props.comments.filter((c) => {
            return c.author.id == userId;
        })

        console.log(userComments);

        if (!userComments) return true;

        if (userComments.length < 10) return true;

        return false;
    }

    function inputChange(value: string) {

        setComment(value);
        setinputColor(inputColors[value.length]);
        console.log(inputColor);
    }

    return (
        <div className="comment-form">
            <form onSubmit={submit}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 25px'
                }}
            >
                <input
                    maxLength={MaxLength}
                    value={comment}
                    style={{
                        flex: '0.75 1 50%',
                        height: 44,
                        borderRadius: 22,
                        border: `2px solid ${inputColor}`,
                        padding: '0px 25px',
                        outline: 'none',
                        color: '#afafaf',
                        fontSize: 16,
                        marginRight: 14,
                        transition: 'border-color 0.1s ease-in',
                        lineHeight: 44,
                    }}
                    placeholder="Ae! kya bolti tu?" onChange={(e) => inputChange(e.target.value)} />

                <div className="">
                    <span onClick={submit} style={{ color: 'white', cursor: 'pointer', backgroundColor: PrimaryColor, borderRadius: '50%' }} uk-icon="icon: play-circle; ratio:2"></span>
                </div>
            </form>
        </div >
    );
}