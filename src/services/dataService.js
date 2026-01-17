import { collection, getDocs, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { players as mockPlayers, teams as mockTeams, matches as mockMatches } from "../data/mockData";

// One-time fetch (Keep for backward compatibility if needed, or remove)
export const getPlayers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "cards"));
        if (querySnapshot.empty) {
            return mockPlayers;
        }
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching players:", error);
        return mockPlayers;
    }
};

export const getTeams = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "teams"));
        if (querySnapshot.empty) {
            return mockTeams;
        }
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching teams:", error);
        return mockTeams;
    }
};

// Real-time Listeners
export const subscribeToPlayers = (callback) => {
    try {
        const unsubscribe = onSnapshot(collection(db, "cards"), (snapshot) => {
            if (snapshot.empty) {
                callback(mockPlayers);
            } else {
                const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(playersData);
            }
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error subscribing to players:", error);
        callback(mockPlayers);
        return () => { };
    }
};

export const subscribeToTeams = (callback) => {
    try {
        const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
            if (snapshot.empty) {
                callback(mockTeams);
            } else {
                const teamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(teamsData);
            }
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error subscribing to teams:", error);
        callback(mockTeams);
        return () => { };
    }
};

export const subscribeToMatches = (callback) => {
    try {
        const unsubscribe = onSnapshot(collection(db, "matches"), (snapshot) => {
            if (snapshot.empty) {
                callback(mockMatches);
            } else {
                const matchesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(matchesData);
            }
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error subscribing to matches:", error);
        callback(mockMatches);
        return () => { };
    }
};

export const subscribeToSettings = (callback) => {
    try {
        const unsubscribe = onSnapshot(doc(db, "settings", "global"), (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data());
            } else {
                callback({ mvpVoting: false });
            }
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error subscribing to settings:", error);
        callback({ mvpVoting: false });
        return () => { };
    }
};

export const subscribeToVotes = (callback) => {
    try {
        const unsubscribe = onSnapshot(collection(db, "votes"), (snapshot) => {
            const votesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(votesData);
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error subscribing to votes:", error);
        callback([]);
        return () => { };
    }
};

export const castVote = async (voterId, targetPlayerId) => {
    try {
        const voteRef = doc(db, "votes", voterId);
        await setDoc(voteRef, {
            voterId,
            targetPlayerId,
            timestamp: new Date()
        });
        return true;
    } catch (error) {
        console.error("Error casting vote:", error);
        throw error;
    }
};

export const checkIfVoted = async (voterId) => {
    try {
        const voteRef = doc(db, "votes", voterId);
        const docSnap = await getDoc(voteRef);
        return docSnap.exists();
    } catch (error) {
        console.error("Error checking vote status:", error);
        return false;
    }
};

export const getVoteResults = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "votes"));
        const voteCounts = {};

        querySnapshot.docs.forEach(doc => {
            const voteData = doc.data();
            const targetId = String(voteData.targetPlayerId);
            voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
        });

        // Convert to array and sort by vote count
        const results = Object.entries(voteCounts).map(([playerId, count]) => ({
            playerId,
            voteCount: count
        })).sort((a, b) => b.voteCount - a.voteCount);

        return results;
    } catch (error) {
        console.error("Error fetching vote results:", error);
        return [];
    }
};
