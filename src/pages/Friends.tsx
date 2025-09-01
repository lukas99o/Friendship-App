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
    const [width, setWidth] = useState<number>(document.body.clientWidth)
    const [activeView, setActiveView] = useState<boolean>(true)

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

    useEffect(() => {
        const handleResize = () => {
            setWidth(document.body.clientWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return (
        <div className="container d-flex flex-column h-100">
  {/* Toggle-knappar small screen */}
  {width < 968 && (
    <div className="d-flex bg-light rounded shadow mb-3 p-3 justify-content-around gap-3 flex-wrap" style={{ flex: "0 1 auto"}}>
      <button className="btn-orange flex-grow-1" onClick={() => setActiveView(true)}>Vänner</button>
      <button className="btn-orange flex-grow-1" onClick={() => setActiveView(false)}>Hitta Vänner</button>
    </div>
  )}

  <div className="d-flex gap-3 flex-grow-1" style={{ overflowY: "hidden" }}>
    {/* Vänlista */}
    {(width > 968 || (activeView && width < 968)) && (
      <div className="bg-light rounded shadow p-3 d-flex flex-column" style={{ width: width > 968 ? "50%" : "100%" }}>
        <h3 className="mb-3" style={{ color: "orange" }}>Mina Vänner</h3>

        {loadingFriends ? (
          <p>Laddar vänner...</p>
        ) : friends.length > 0 ? (
          <div className="flex-grow-1 overflow-auto" style={{ maxHeight: "500px" }}>
            {friends.map(friend => (
              <div key={friend.username} className="border rounded p-3 mb-3 bg-white shadow-sm d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3 align-items-center">
                  <div className="bg-secondary rounded-circle d-flex justify-content-center align-items-center" style={{ width: "50px", height: "50px" }}>
                    👤
                  </div>
                  <div>
                    <h5 className="mb-1">{friend.username}</h5>
                    <p className="mb-0 text-muted">{friend.name}, {friend.age}</p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn-orange btn-sm">Profil</button>
                  <button className="btn-orange btn-sm">Chat</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="mb-2"><strong>Inga vänner att visa</strong></p>
            <p className="text-muted">Lägg till vänner genom att skicka vänförfrågningar eller delta i evenemang.</p>
          </div>
        )}
      </div>
    )}

    {/* Vänförfrågningar */}
    {(width > 968 || (!activeView && width < 968)) && (
      <div className="bg-light rounded shadow p-3 d-flex flex-column" style={{ width: width > 968 ? "50%" : "100%" }}>
        <h3 className="mb-3" style={{ color: "orange" }}>Vänförfrågningar</h3>

        {/* Skicka vänförfrågan */}
        <div className="border rounded p-3 mb-4 bg-white shadow-sm" style={{ flexShrink: 0 }}>
          <label className="form-label fw-bold">Skicka vänförfrågan:</label>
          <div className="input-group gap-2">
            <input
              className="form-control"
              type="text"
              placeholder="Användarnamn..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button className="btn-orange" onClick={() => sendFriendRequest(username)}>Skicka</button>
          </div>
          {friendRequestMessage && (
            <div className="alert alert-info mt-2 d-flex justify-content-between align-items-center">
              {friendRequestMessage}
              <button className="btn-close" onClick={clearMessage}></button>
            </div>
          )}
        </div>

        {/* Lista av förfrågningar */}
        <div className="flex-grow-1 overflow-auto">
          {loadingRequests ? (
            <p>Laddar vänförfrågningar...</p>
          ) : (friendRequests.incomingUsernames?.length || friendRequests.outgoingUsernames?.length) ? (
            <>
              {friendRequests.incomingUsernames?.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-success">Inkommande förfrågningar:</h6>
                  {friendRequests.incomingUsernames.map(username => (
                    <div key={username} className="border rounded p-2 mb-2 bg-white d-flex justify-content-between align-items-center shadow-sm">
                      <span>{username}</span>
                      <div className="d-flex gap-1">
                        <button className="btn-orange" onClick={() => AcceptFriendRequest(username)} style={{ width: "fit-content"}}>Acceptera</button>
                        <button className="btn btn-outline-secondary btn-sm">Avböj</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {friendRequests.outgoingUsernames?.length > 0 && (
                <div>
                  <h6 className="text-warning">Skickade förfrågningar:</h6>
                  {friendRequests.outgoingUsernames.map(username => (
                    <div key={username} className="border rounded p-2 mb-2 bg-white d-flex justify-content-between align-items-center shadow-sm">
                      <span>{username}</span>
                      <button className="btn btn-outline-danger btn-sm">Avbryt</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted"><strong>Inga vänförfrågningar att visa</strong></p>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>

    )
}