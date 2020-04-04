import React from 'react';
type Props = {
    author: {
        username: string,
        email: string,
        id: string,
        profilePic: string,
    },
    onlyPhoto?: boolean
}

export const Author = (props: Props) => {
    const { author } = props;

    if (!author) return null;

    if (props.onlyPhoto && props.author.profilePic) return <div>
        <img style={{ borderRadius: '25px', overflow: 'hidden', height: 32, width: 32, maxWidth: 'initial' }} src={author.profilePic}></img>
    </div>;

    if (author.profilePic) {
        return <div >
            <img style={{ borderRadius: '25px', overflow: 'hidden', height: 32, width: 32, maxWidth: 'initial' }} src={author.profilePic}></img>
            <span style={{ paddingLeft: 8 }}>{author.username || author.email}</span>
        </div>
    }


    if (author.username) {
        return <span style={{ color: 'red', fontSize: 14 }}>{author.username}</span>
    }

    return <span style={{ color: 'red', fontSize: 14 }}>{author.email}</span>
}