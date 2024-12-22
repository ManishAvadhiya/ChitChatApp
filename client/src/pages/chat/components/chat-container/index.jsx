import ChatHeader from "./components/chatHeader"
import MessageBar from "./components/messageBar"
import MessageContainer from "./components/messageContainer"


const Chatcontainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] flex flex-col md:static md:flex-1 bg-white">
            <ChatHeader/>
            <MessageContainer/>
            <MessageBar/>

    </div>
  )
}

export default Chatcontainer