import Lottie from "react-lottie"
import animationData from "../../../../assets/lottie-json.json"
const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:flex flex-col justify-center items-center hidden duration-1000 transition-all ">
        <Lottie isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={{loop:true,autoplay:true,animationData}}
        />
        <div className="text-opacity-80 text-black flex flex-col items-center mt-10 gap-5 lg:text-4xl text-3xl transition-all duration-300">
            <h3>Welcome to <span className="text-blue-950 italic font-bold">ChitChat!!</span></h3>
        </div>
    </div>
  )
}

export default EmptyChatContainer