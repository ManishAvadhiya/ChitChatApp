export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessageUser: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress :0,
  fileDownloadProgress:0,
  channels:[],
  setChannels:(channels)=>set({channels}),
  setIsUploading:(isUploading)=> set({isUploading}),
  setIsDownloading:(isDownloading)=> set({isDownloading}),
  setFileUploadProgress:(fileUploadProgress)=> set({fileUploadProgress}),
  setFileDownloadProgress:(fileDownloadProgress)=> set({fileDownloadProgress}),

  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessageUser: (directMessageUser) => set({ directMessageUser }),
  addChannel:(channel)=>{
    const channels = get().channels;
    set({channels:[...channels,channel]})
  },
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          receiver:
            selectedChatType === "Channel"
              ? message.receiver
              : message.receiver._id,
          sender:
            selectedChatType === "Channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannelInChannelList:(message) => {
    const channels = get().channels;
    const data = channels.find(channel => channel._id === message.channelId);
    const index = channels.findIndex((channel) => channel._id === message.channelId);
    if(index !== -1 && index !== undefined){
      channels.splice(index,1)
      channels.unshift(data)
    }
  },
  addUsersInDMList:(message) => {
    const userId = get().userInfo.id
    const formId = message.sender._id === userId ? message.receiver._id : message.sender._id
    const formData = message.sender._id === userId ? message.receiver : message.sender
    const dMessageUser = get().directMessageUser;
    const data = dMessageUser.find((user) => user._id === formId);
    const index = dMessageUser.findIndex((user) => user._id === formId);
    if(index !== -1 && index !== undefined){
      dMessageUser.splice(index,1)
      dMessageUser.unshift(data)

    }else{
      dMessageUser.unshift(formData)
    }
    set({directMessageUser:dMessageUser})
  }
  
});
