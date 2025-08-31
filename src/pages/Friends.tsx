import { useState, useEffect } from 'react'
import { GetFriends } from '../api/friends/getFriends'
import { GetFriendRequests } from '../api/friends/getFriendsRequests'
import { SendFriendRequest } from '../api/friends/sendFriendRequest'
import { AcceptFriendRequest } from '../api/friends/acceptFriendRequest'
import type { FriendDto, FriendRequestDto } from '../types'

export default function Friends() {
    const [friends, setFriends] = useState<FriendDto[]>([])
    const [friendRequests, setFriendRequests] = useState<FriendRequestDto>({
        incomingUsernames: [],
        outgoingUsernames: [],
    });

    const [loadingFriends, setLoadingFriends] = useState(true)
    const [loadingRequests, setLoadingRequests] = useState(true)
    const [friendRequestMessage, setFriendRequestMessage] = useState<string | null>(null)
    const [username, setUsername] = useState<string>("")

    const sendFriendRequest = async (username: string) => {
        const success = await SendFriendRequest(username)

        if (success) {
            setFriendRequestMessage("Vänförfrågning skickad!")
        } else {
            setFriendRequestMessage("Misslyckades med att skicka vänförfrågning.")
        }
    }

    const clearMessage = () => {
        setFriendRequestMessage(null)
    }

    useEffect(() => {
        const fetchFriends = async () => {
            const friendsData = await GetFriends()
            setFriends(friendsData)
            setLoadingFriends(false)
        }

        const fetchFriendRequests = async () => {
            const requestsData = await GetFriendRequests()
            setFriendRequests(requestsData)
            setLoadingRequests(false)
        }

        fetchFriends()
        fetchFriendRequests()
    }, [])

    return (
        <div className="container bg-dark">
            <div className="bg-light d-flex rounded shadow p-4 justify-content-around mb-4">
                <button className="btn-orange" style={{ width: "200px" }}>Vänner</button>
                <button className="btn-orange" style={{ width: "200px" }}>Hitta Vänner</button>
            </div>
            <div className="d-flex" style={{ height: "" }}>
                <div className="bg-light rounded shadow p-4" style={{ width: "45%" }}>
                    {loadingFriends ? (
                        <p>Laddar vänner...</p>
                    ) : friends.length > 0 ? (
                        friends.map((friend) => (
                            <div key={friend.username} className="bg-light p-2 d-flex justify-content-between rounded shadow">
                                <div className="d-flex gap-4">
                                    <p>img</p>
                                    <div>
                                        <p style={{ borderBottom: "2px solid black" }}><strong>{friend.username}</strong></p>
                                        <p className="mb-0">{friend.name}</p>
                                        <p className="mb-0">{friend.age}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-end gap-2">
                                    <button className="btn-orange ">Profile</button>
                                    <button className="btn-orange ">Chat</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p className="mb-2"><strong>Inga vänner att visa.</strong></p>
                            <p>Lägg till vänner genom att skicka vänförfrågningar eller via deltagande i evenemang.</p>
                        </div>
                    )}
                </div>
                <div className="bg-dark" style={{ width: "10%", height: "500px" }}>
                    <p>scroll</p>
                </div>
                <div style={{ width: "45%" }}>
                    <p>vänprofil</p>
                </div>
            </div>            
        </div>
        // <div className="container p-4 d-flex gap-4 flex-column flex-lg-row" style={{ opacity: 0.95 }}>
        //     <div className="border p-4 shadow-sm rounded order-sm-2 order-md-2 order-lg-1" style={{ flex: 1, height: "fit-content" }}>
        //         <h1 className="text-center mb-2">Vänlista</h1>
        //         {loadingFriends ? (
        //             <p>Laddar vänner...</p>
        //         ) : friends.length > 0 ? (
        //             friends.map((friend) => (
        //                 <div key={friend.userName}>
        //                     <h5>{friend.name}, {friend.age}</h5>
        //                     <p>{friend.userName}</p>
        //                 </div>
        //             ))
        //         ) : (
        //             <div>
        //                 <p className="mb-2"><strong>Inga vänner att visa.</strong></p>
        //                 <p>Lägg till vänner genom att skicka vänförfrågningar eller via deltagande i evenemang.</p>
        //             </div>
        //         )}
        //     </div>
        //     <div className="border p-4 shadow-sm rounded order-sm-1 order-md-1 order-lg-2" style={{ flex: 1, height: "fit-content" }}>
        //         <div className="d-flex border rounded p-2 gap-2 align-items-center justify-content-between mb-4">
        //             <p className="mb-0" style={{ whiteSpace: "nowrap" }}><strong>Skicka vänförfrågning:</strong></p>
        //             <div className="d-flex gap-2">
        //                 <input className="form-control" type="text" placeholder="Användarnamn..." required value={username} onChange={(e) => setUsername(e.target.value)} />
        //                 <button className="btn-orange" onClick={() => sendFriendRequest(username)}>Skicka</button>
        //             </div>
        //         </div>
        //         {friendRequestMessage && <p className="mb-4 border p-2 d-flex align-items-center justify-content-between">{friendRequestMessage}<button className="btn-orange" style={{ padding: "0 10px" }} onClick={clearMessage}>🗙</button></p>}
        //         <h2 className="text-center mb-4">Vänförfrågningar</h2>
        //         {loadingRequests ? (
        //             <p>Laddar vänförfrågningar...</p>
        //         ) : (friendRequests.incomingUsernames?.length || friendRequests.outgoingUsernames?.length) ? (
        //             <>
        //                 {friendRequests.incomingUsernames?.length > 0 && (
        //                     <div className="d-flex row gap-2 mb-4">
        //                         <p className="mb-2"><strong>Vänförfrågningar till dig:</strong></p>
        //                         {friendRequests.incomingUsernames.map((username) => (
        //                             <div key={username} className="border rounded d-flex p-2 align-items-center justify-content-between">
        //                                 <span>{username}</span>
        //                                 <div className="d-flex gap-2">
        //                                     <button className="btn-orange" onClick={() => AcceptFriendRequest(username)}>Acceptera</button>
        //                                     <button className="btn-orange">Avböja</button>
        //                                 </div>
        //                             </div>
        //                         ))}
        //                     </div>
        //                 )}

        //                 {friendRequests.outgoingUsernames?.length > 0 && (
        //                     <div className="d-flex row gap-2">
        //                         <p className="mb-2"><strong>Vänförfrågningar du skickat:</strong></p>
        //                         {friendRequests.outgoingUsernames.map((username) => (
        //                             <div key={username} className="border rounded p-2 d-flex align-items-center justify-content-between">
        //                                 <span>{username}</span>
        //                                 <button className="btn-orange">Avbryt</button>
        //                             </div>
        //                         ))}
        //                     </div>
        //                 )}
        //             </>
        //         ) : (
        //             <p><strong>Inga vänförfrågningar att visa.</strong></p>
        //         )}
        //     </div>
        // </div>
    )
}