import UIkit from "uikit"
import firebase from "firebase";

export const ShowNotification = (type: any, message: string) => {
    UIkit.notification({
        message,
        status: type || 'primary',
        pos: 'bottom-center'
    });
}

export const getUserData = () => {
    let user = firebase.auth().currentUser;
    if (!user) return null;
    return {
        username: user.displayName,
        email: user.email,
        id: user.uid,
        profilePic: user.photoURL
    }
}

export function timeDifference(previous) {
    if (!previous) return null;

    var current = Date.now();

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return '' + Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return '' + Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return '' + Math.round(elapsed / msPerYear) + ' years ago';
    }
}

export function checkIfValidUser(userId) {
    return firebase.auth().currentUser?.uid == userId;
}