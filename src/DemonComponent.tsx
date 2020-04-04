import React from 'react';
import { Author } from './Auther';
import DbService from './services/db.service';
import { timeDifference } from './utils';

type Props = {
    demon: any;
    history: any
}

const DemonComponent = (props: Props) => {

    async function RemoveDemon(demon) {
        await DbService.removeDemon(demon);
    }

    const s = props.demon;

    return (
        <div
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
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                        flexDirection: 'column',
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
    );
}

export default DemonComponent;