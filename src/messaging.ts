import firebase from "firebase";

export const Messaging = firebase.messaging();


Messaging.usePublicVapidKey('BEBxwSx4AvHV2B9lOHGK8jRjOF6HtZzs0spco-QOxPn_cWRI1AkzeivhFOJVaqm3I1FzxtKVSE7gElpyVoBEUIk');

export const GetMessagingToken = async () => {
    try {
        let token = await Messaging.getToken();
        console.log(token);
    } catch (err) {
        console.error(err);
    }
}

export const HandleTokenRefresh = () => {
    Messaging.onTokenRefresh(() => {
        GetMessagingToken();
    })
}

export const HandleMessage = () => {
    Messaging.onMessage((payload) => {
        console.log(payload);
    })
}