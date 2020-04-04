import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import DbService from './services/db.service';

import AddComment from './AddComment';
import Comment from './Comment';
import { Loader } from './components/loader';

type Props = {
    demonId: any
}

export default function Comments(props: Props) {
    const [comments, setComments] = useState([])

    const [loading, setLoading] = useState(false);

    async function updateComments(data: firebase.database.DataSnapshot) {
        console.log(data);
        const val = data.val();
        console.log(val);

        updateCommentsState(data);
    }

    function updateCommentsState(snap: firebase.database.DataSnapshot) {
        let data = DbService.getCommentsFromSnap(snap);

        setComments(data);
    }

    async function fetchComments() {
        setLoading(true);

        db.child('demons').child(props.demonId).child('comments').orderByChild('createdAt').on('value', updateComments);

        let snap = await db.child('demons').child(props.demonId)
            .child('comments').once('value');

        updateCommentsState(snap);

        setLoading(false);
    }


    useEffect(() => {
        fetchComments();
    }, [])

    return (
        <div style={{ padding: '0 2%' }}>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(0, 0, 0, 0.5)', padding: '4px 0' }} className="notice">
                Only 10 comments are allowed per user per activity
                <br />
                Comment length limit is 144 characters
            </div>
            <div>
                <AddComment comments={comments} demonId={props.demonId}></AddComment>
            </div>
            <div>
                {
                    loading ? <Loader></Loader> : null
                }
                {
                    comments && comments.length > 0 ?
                        comments.map((c, i) => {
                            return <Comment demonId={props.demonId} comment={c} key={i}></Comment>
                        }) : null
                }
            </div>
        </div>
    );
} 