import { useState, useEffect, useRef } from 'react'
import { GetFriends } from '../api/friends/getFriends'
import { GetFriendRequests } from '../api/friends/getFriendsRequests'
import { SendFriendRequest } from '../api/friends/sendFriendRequest'
import { AcceptFriendRequest } from '../api/friends/acceptFriendRequest'
import { DeclineFriendRequest } from '../api/friends/declineFriendRequest'
import { RegretFriendRequest } from '../api/friends/regretFriendRequest'
import { GetConversations } from '../api/conversations/getConversations'
import { StartPrivateConversation } from '../api/conversations/startPrivateConversation'
import type { FriendDto, FriendRequestDto, ConversationDto } from '../types'
import { calculateAge } from '../utils/calculateAge'
import PrivateChat from '../components/PrivateChat'

export default function Friends() {
  const [friends, setFriends] = useState<FriendDto[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequestDto>({
    incomingUsernames: [],
    outgoingUsernames: [],
  })
  const [loadingFriends, setLoadingFriends] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [friendRequestMessage, setFriendRequestMessage] = useState<string | null>(null)
  const [friendRequestUsername, setFriendRequestUsername] = useState<string>("")
  const [width, setWidth] = useState<number>(document.body.clientWidth)
  const [activeView, setActiveView] = useState<boolean>(true)
  const [friendSearch, setFriendSearch] = useState<string>("")
  const [filteredFriends, setFilteredFriends] = useState<FriendDto[]>([])
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null)
  const [chatStarted, setChatStarted] = useState<boolean>(false)
  const [conversations, setConversations] = useState<ConversationDto[]>([])
  const timeoutRef = useRef<number | null>(null)
  const userId = localStorage.getItem("userId") || ""

  const sendFriendRequest = async (username: string) => {
    if (friendRequests.incomingUsernames.includes(username) || friendRequests.outgoingUsernames.includes(username)) {
      alert("Du eller mottagaren har redan skickat en vänförfrågan")
      return
    }

    const success = await SendFriendRequest(username)
    if (success) {
      setFriendRequestMessage("Vänförfrågning skickad!")
      setLoadingRequests(true)
      const requestsData = await GetFriendRequests()
      setFriendRequests(requestsData)
      setLoadingRequests(false)
    } else {
      setFriendRequestMessage("Misslyckades, fel användarnamn.")
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setFriendRequestMessage(null), 4000)
  }

  const acceptFriendRequest = async (username: string) => {
    const success = await AcceptFriendRequest(username)
    if (success) {
      friendRequests.incomingUsernames = friendRequests.incomingUsernames.filter(u => u !== username)
      setFriendRequests({ ...friendRequests })
      setLoadingFriends(true)
      const friendsData = await GetFriends()
      setFriends(friendsData)
      setFilteredFriends(friendsData)
      setLoadingFriends(false)
    } else alert("Misslyckades med att acceptera vänförfrågning.")
  }

  const declineFriendRequest = async (username: string) => {
    const success = await DeclineFriendRequest(username)
    if (success) {
      friendRequests.incomingUsernames = friendRequests.incomingUsernames.filter(u => u !== username)
      setFriendRequests({ ...friendRequests })
    } else alert("Misslyckades med att avslå vänförfrågan.")
  }

  const regretFriendRequest = async (username: string) => {
    const success = await RegretFriendRequest(username)
    if (success) {
      friendRequests.outgoingUsernames = friendRequests.outgoingUsernames.filter(u => u !== username)
      setFriendRequests({ ...friendRequests })
    } else alert("Misslyckades med att avbryta vänförfrågan.")
  }

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsData = await GetFriends()
      setFriends(friendsData)
      setFilteredFriends(friendsData)
      setLoadingFriends(false)
    }

    const fetchFriendRequests = async () => {
      const requestsData = await GetFriendRequests()
      setFriendRequests(requestsData)
      setLoadingRequests(false)
    }

    const fetchConversations = async () => {
      const conversationsData = await GetConversations()
      setConversations(conversationsData)
    }

    fetchFriends()
    fetchFriendRequests()
    fetchConversations()
  }, [])

  useEffect(() => {
    const handleResize = () => setWidth(document.body.clientWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (friendSearch.trim() === "") setFilteredFriends(friends)
      else setFilteredFriends(friends.filter(f => f.username.toLowerCase().includes(friendSearch.toLowerCase())))
    }, 200)
    return () => clearTimeout(timeout)
  }, [friendSearch, friends])

  const getConversationWithUser = (username: string) => {
    const friendObj = friends.find(f => f.username === username)
    if (!friendObj) return undefined
    return conversations.find(c => c.conversationParticipants.some(p => p.userId === friendObj.userId))
  }

  return (
    <div className="container d-flex flex-column">
      <div className="d-flex gap-4 flex-grow-1" style={{ overflowY: "hidden" }}>
        {(width > 968 || (activeView && width < 968)) && (
          <div className="bg-light rounded shadow p-3 d-flex flex-column container-header" style={{ width: width > 968 ? "50%" : "100%" }}>
            
            {selectedChatUser && width < 968 ? (
              <div className="flex-grow-1 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="header mb-0">{selectedChatUser}</h3>
                  <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2" onClick={() => setSelectedChatUser(null)}>← Tillbaka</button>
                </div>

                {chatStarted && (
                  <div className="bg-white border rounded p-3 shadow-sm flex-grow-1 d-flex flex-column" style={{ height: "200px" }}>
                    <PrivateChat
                      conversationId={getConversationWithUser(selectedChatUser)?.conversationId}
                      senderId={userId}
                    />
                  </div>
                )}
              </div>
            ) : (
                <> 
                    {width < 968 ? (
                        <div className="d-flex justify-content-around align-items-center">
                            <h3 className="mb-3 header text-center mt-1 mb-3">Mina Vänner</h3>
                            <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2 mb-3" onClick={() => setActiveView(false)}>Hitta Vänner</button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="mb-3 header text-center mt-1 mb-3">Mina Vänner</h2>
                        </div>
                    )}
                    
                    {loadingFriends ? (
                    <p>Laddar vänner...</p>
                    ) : friends.length > 0 ? (
                    <>
                    <div>
                        <div className="border rounded p-3 mb-4 bg-white shadow-sm" style={{ flexShrink: 0 }}>
                            <label className="form-label fw-bold">Sök efter vän:</label>
                            <div className="input-group gap-2">
                                <input
                                className="form-control"
                                type="text"
                                placeholder="Användarnamn..."
                                value={friendSearch}
                                onChange={(e) => setFriendSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow-1 overflow-auto border rounded p-3 shadow-sm">
                        {filteredFriends.map(friend => (
                        <div key={friend.username} className="border rounded p-3 mb-3 bg-white shadow-sm d-flex justify-content-between align-items-md-center flex-column flex-md-row">
                            <div className="d-flex gap-3 align-items-center">
                            <div className="bg-secondary rounded-circle d-flex justify-content-center align-items-center" style={{ width: "50px", height: "50px" }}>👤</div>
                            <div>
                                <h5 className={`mb-1 ${width < 768 ? "fs-6" : ""}`}>{friend.username}</h5>
                                <p className={`mb-0 text-muted ${width < 768 ? "fs-6" : ""}`}>{friend.name}, {calculateAge(friend.age)} år</p>
                            </div>
                            </div>
                            <div className="d-flex gap-2 mt-2 mt-md-0 justify-content-end justify-content-md-start">
                                <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2">Profil</button>
                                <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2"
                                    onClick={async () => {
                                    setChatStarted(false);
                                    setSelectedChatUser(friend.username)
                                    const conversation = await StartPrivateConversation(friend.username)
                                    if (conversation) {
                                        if (!conversations.some(c => c.conversationId === conversation.conversationId)) {
                                        setConversations(prev => [...prev, conversation])
                                        }
                                        setChatStarted(true)
                                    } else {
                                        alert("Kunde inte starta chatt med den här användaren.")
                                        setChatStarted(false)
                                    }
                                    }}
                                >
                                    Chat
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    </>
                    ) : (
                    <div className="p-3 border rounded">
                        <p className="mb-2 text-center"><strong>Inga vänner att visa</strong></p>
                        <p className="text-muted">Lägg till vänner genom att skicka vänförfrågningar eller delta i evenemang.</p>
                    </div>
                    )}
                 </>
                )}
          </div>
        )}

        {(width > 968 || (!activeView && width < 968)) && (
          <div className="bg-light rounded shadow p-3 d-flex flex-column container-header" style={{ width: width > 968 ? "50%" : "100%" }}>
            {selectedChatUser && width > 968 ? (
              <div className="flex-grow-1 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="header mb-0">{selectedChatUser}</h3>
                  <button className="btn-orange" onClick={() => setSelectedChatUser(null)}>← Tillbaka</button>
                </div>

                {chatStarted && (
                  <div className="bg-white border rounded p-3 shadow-sm flex-grow-1 d-flex flex-column" style={{ height: "200px" }}>
                    <PrivateChat
                      conversationId={getConversationWithUser(selectedChatUser)?.conversationId}
                      senderId={userId}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                {width < 968 ? (
                        <div className="d-flex justify-content-around align-items-center">
                            <h3 className="mb-3 header text-center mt-1 mb-3">Vänförfrågningar</h3>
                            <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2 mb-3" onClick={() => setActiveView(true)}>Vänner</button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="mb-3 header text-center mt-1 mb-3">Vänförfrågningar</h2>
                        </div>
                )}

                <div className="border rounded p-3 mb-4 bg-white shadow-sm" style={{ flexShrink: 0 }}>
                  <label className="form-label fw-bold">Skicka vänförfrågan:</label>
                  <div className="input-group gap-2">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Användarnamn..."
                      value={friendRequestUsername}
                      onChange={(e) => setFriendRequestUsername(e.target.value)}
                    />
                    <button className="btn-orange px-2 py-1" onClick={() => sendFriendRequest(friendRequestUsername)}>Skicka</button>
                  </div>
                  {friendRequestMessage && (
                    <div className="alert alert-info mt-2 d-flex justify-content-between align-items-center">
                      {friendRequestMessage}
                    </div>
                  )}
                </div>

                <div className="flex-grow-1 overflow-auto border rounded p-3 shadow-sm">
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
                                <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2 fs-6" onClick={() => acceptFriendRequest(username)} style={{ width: "fit-content"}}>Acceptera</button>
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => declineFriendRequest(username)}>Avböj</button>
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
                              <button className="btn btn-outline-danger btn-sm" onClick={() => regretFriendRequest(username)}>Avbryt</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-4 border rounded">
                      <p className="text-muted"><strong>Inga vänförfrågningar att visa</strong></p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
