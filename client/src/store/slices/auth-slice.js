export const createAuthSlice = (set) =>({
    userInfo:undefined,
    setuserInfo:(userInfo)=>set({userInfo}),
})