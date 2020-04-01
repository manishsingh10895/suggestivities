import React from 'react';

export default function EmptyData() {
    return <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <img style={{ width: 400, height: 300 }} src="/empty-data.png"></img>
    </div>
}