import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { useParams, RouteComponentProps } from 'react-router-dom';
import { Loader } from './components/loader';
import { Title } from './styleds/title';
import MakeSuggestion from './MakeSuggestion';
import { Transition, CSSTransition, TransitionGroup } from 'react-transition-group';
import { Suggestion } from './Suggestion';
import { checkIfValidUser, ShowNotification } from './utils';
import { Author } from './Auther';
import EmptyData from './EmptyData';
import Comments from './Comments';
import { useIntersectionObserver } from './hooks/intersection-observer.hook';

type Props = {
    id: string
}

declare var Navigator: {
    share: () => void
}


const transitionStyles = {
    entering: {
        opacity: 0.75,
        transform: `translateY(0%) scaleY(1.1)`,
        boxShadow: "0px -6px 20px 0px #989898",
    },
    entered: {
        opacity: 1,
        transform: `translateY(0%)`,
        boxShadow: "0px -6px 20px 0px #989898",
    },
    exiting: {
        opacity: 0.5,
        transform: `translateY(50%)`,
        boxShadow: null,
    },
    exited: {
        opacity: 0,
        transform: `translateY(100%)`,
        boxShadow: null,
    }
};



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

    const [showComments, setShowComments] = useState(false);

    const [showCommentsComponent, setshowCommentsComponent] = useState(false)

    const [intersecting, setIntersecting] = useState(false)

    const ref = useRef();

    const params = useParams<{ id: string }>();
    const id: string = params.id;

    function handleIntersection(intersecting: boolean) {
        if (showCommentsComponent) return;

        if (intersecting) {
            setShowComments(true);
        } else {
            setShowComments(false);
        }

        console.log(showComments);
    }

    let observer = new IntersectionObserver((changes, observer) => {
        console.log(changes);
        if (showCommentsComponent) return;
        if (changes && changes.length > 0) {
            let c = changes[0];

            handleIntersection(c.isIntersecting);
        }
    }, {
        rootMargin: '4px',
        threshold: 0.5
    })


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


        setTimeout(() => {
            observer.observe(document.querySelector('.demon-container .form-container'));
        }, 2500)

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
            observer.unobserve(document.querySelector('.demon-container .form-container'));
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

    console.log("Show comments", showCommentsComponent);

    return (
        <div className="fh demon-container uk-flex uk-flex-center uk-flex-middle">
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
                                suggestions && suggestions.length > 0 ?
                                    <TransitionGroup appear={true} style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {
                                            suggestions.map((s, i) => {
                                                return (
                                                    <CSSTransition
                                                        key={i} in={true} timeout={{ enter: i * 1000, exit: i * 1000, }} classNames={{
                                                            enter: 'slide-in-right',
                                                            enterActive: 'slide-in-right-active',
                                                            appear: 'slide-in-right',
                                                            appearActive: 'slide-in-right-active',
                                                        }}>
                                                        <Suggestion demonId={id} key={i} suggestion={s} index={i}></Suggestion>
                                                    </CSSTransition>
                                                )
                                            })
                                        }
                                    </TransitionGroup>
                                    : <EmptyData></EmptyData>
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
                                zIndex: 2,
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

            <Transition
                timeout={{ enter: 200, exit: 200 }}
                in={showComments}
            >
                {
                    state => <div
                        className="comments-container"
                        style={{
                            position: "fixed", bottom: 0,
                            background: '#1e87f0',
                            overflowY: 'auto',
                            cursor: 'pointer',
                            zIndex: showCommentsComponent ? '3' : '1',
                            maxHeight: showCommentsComponent ? 'calc(100vh - 80px)' : '70px', width: '100%',
                            transition: `all 200ms ease-in`,
                            ...transitionStyles[state]
                        }}
                    >
                        <div
                            onClick={() => {
                                console.log(showCommentsComponent);
                                setshowCommentsComponent(!showCommentsComponent)
                                console.log(showCommentsComponent);
                            }
                            }
                            style={{ color: 'white', padding: '10px 10px', textAlign: 'left' }}>
                            {showCommentsComponent ? 'Hide' : "Show"} <span uk-icon="icon: comments"></span>
                        </div>
                        {
                            showCommentsComponent ?
                                <div style={{ background: 'white' }}>
                                    <Comments demonId={id}></Comments>
                                </div>
                                : null
                        }
                    </div>
                }
            </Transition>

        </div >
    )
}

