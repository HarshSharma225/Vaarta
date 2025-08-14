import {create} from "zustand"

export const useThemeStore = create((set)=>({
    theme: "night",
    setTheme: (theme) => set({theme}),
}))