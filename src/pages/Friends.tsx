import { useState, useEffect } from 'react'
import { GetFriends } from '../api/friends/getFriends'
import { GetFriendRequests } from '../api/friends/getFriendsRequests'
import { SendFriendRequest } from '../api/friends/sendFriendRequest'
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
        try {
            await SendFriendRequest(username)
            setFriendRequestMessage("Vänförfrågan skickad!")
        } catch (error) {
            setFriendRequestMessage("Misslyckades med att skicka vänförfrågan.")
        }
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
        <div className="container bg-white rounded shadow p-4 d-flex gap-4 flex-sm-column flex-md-row">
            <div className="border p-4 shadow-sm rounded order-sm-2 order-md-1" style={{ flex: 1, height: "fit-content" }}>
                <h1 className="text-center mb-2">Vänlista</h1>
                {loadingFriends ? (
                    <p>Laddar vänner...</p>
                ) : friends.length > 0 ? (
                    friends.map((friend) => (
                        <div key={friend.userName}>
                            <h5>{friend.name}, {friend.age}</h5>
                            <p>{friend.userName}</p>
                        </div>
                    ))
                ) : (
                    <div>
                        <p className="mb-2"><strong>Inga vänner att visa.</strong></p>
                        <p>Lägg till vänner genom att skicka vänförfrågningar eller via deltagande i evenemang.</p>
                    </div>
                )}
            </div>
            <div className="border p-4 shadow-sm rounded order-sm-1 order-md-2" style={{ flex: 1, height: "fit-content" }}>
                <div className="border rounded p-2 mb-4 justify-content-around d-flex row">
                    <div className="d-flex gap-2 align-items-center">
                        <p className="mb-0" style={{ whiteSpace: "nowrap" }}><strong>Skicka vänförfrågning:</strong></p>
                        <div className="d-flex gap-2">
                            <input className="form-control" type="text" placeholder="Användarnamn..." required value={username} onChange={(e) => setUsername(e.target.value)} />
                            <button className="btn-orange" onClick={() => sendFriendRequest(username)}>Skicka</button>
                        </div>
                    </div>    
                    {friendRequestMessage && <p className="mb-0">{friendRequestMessage}</p>}
                </div>
                <div>
                    <h2 className="text-center mb-2">Vänförfrågningar</h2>
                    {loadingRequests ? (
                        <p>Laddar vänförfrågningar...</p>
                    ) : (friendRequests.incomingUsernames?.length || friendRequests.outgoingUsernames?.length) ? (
                        <>
                            {friendRequests.incomingUsernames?.length > 0 && (
                                <div>
                                    <p><strong>Vänförfrågningar till dig:</strong></p>
                                    {friendRequests.incomingUsernames.map((username) => (
                                        <div key={username} className="d-flex gap-2 align-items-center">
                                            <span>{username}</span>
                                            <button>Acceptera</button>
                                            <button>Avböj</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {friendRequests.outgoingUsernames?.length > 0 && (
                                <div className="mt-2">
                                    <p><strong>Vänförfrågningar du skickat:</strong></p>
                                    {friendRequests.outgoingUsernames.map((username) => (
                                        <div key={username} className="d-flex gap-2 align-items-center">
                                            <span>{username}</span>
                                            <button>Avbryt</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <p><strong>Inga vänförfrågningar att visa.</strong></p>
                    )}
                </div>
            </div>
        </div>
    )
}