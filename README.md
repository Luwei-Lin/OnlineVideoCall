# OnlineVideoCall Full-Stack 
It is based on WebRTC frame to make online text chat and video chat possible.
Online Video Call Website
1. Register domain name 
2. Set SSL and authorize the domain
3. Install node.js and npm in the Linux
4. Open the port in the ECS accordly
5. Test the web is reachable
Day2
1. set folder
2. build index.html user and password
3. deploy database(design app.db) 
    a. md5 encrypt password
    b. name id should be unique (primary key)
4. socket.io (npm install socket.io@2.0.3)
Day4
1. text-based chat room design and deployement 
Day5
1. 1 to 1 Video Room Design
Day6
1. ICE Structure
2. RTC Peer Connection
    pc=new RTCPeerConnection([config])
    a. media coordination(negotiation)
                                        addIceCandidate
        setLocalDescription             setRemoteDescription
        offer  --->                     ---> offer
    Amy             Signaling Channel               Bob
        answer <---                     <--- Answer
        setRemoteDescription            setLocalDescription
        addIceCandidate
    b. stream and track addition and prohibition
    c. transition relative functions
    d. statistics
3. candiate, stream, iceServers, state(4types)

