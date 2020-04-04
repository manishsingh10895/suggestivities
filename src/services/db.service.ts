import React from 'react'
import { db } from '../firebase'
import { ShowNotification } from '../utils';
import firebase from 'firebase';


export default class DbService {
    getDemons() {
        return db.child('demons')
    }

    static async removeDemon(demon: any) {
        if (!demon.author) {
            ShowNotification('danger', 'Error in removing');

            return;
        }

        let user = firebase.auth().currentUser as firebase.User;

        if (user.uid !== demon.author.id) {
            ShowNotification('danger', 'You can only delete your own activities');
            return;
        }

        let ref = await db.child('demons').child(demon.key).ref;

        if (!ref) {
            ShowNotification('danger', 'Error in removing');

            return;
        }

        await ref.remove();
    }

    static getDemonsFromSnap(snap: firebase.database.DataSnapshot) {
        let data: any[] = [];
        let finished: any[] = [];

        snap.forEach((r) => {
            let val = r.val();
            if (!val.finished)
                data.push({ key: r.key, ...val });
            else {
                finished.push({ key: r.key, ...val });
            }
        });

        data = data.concat(finished);

        console.log(data);

        return data;
    }

    static getSuggestionsFromSnap(snap: firebase.database.DataSnapshot) {

    }

    static getCommentsFromSnap(snap: firebase.database.DataSnapshot) {
        let data: any[] = [];

        snap.forEach((r) => {
            let val = r.val();

            data.push({ key: r.key, ...val });

        });

        console.log(data);

        return data.reverse();
    }
}