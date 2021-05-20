const steps = {
    intro: {
        textColor: 0xffffff,
        outlineTextColor: 0x212b32,
        bgColor: 0x000000,
        tintColor: 0xffffff
    },
    step1: {
        name: '',
        textColor: 0xffffff,
        bgColor: 0x000000,
        tintColor: 0x212b32
    },
    end: {
        textColor: 0xffffff,
        outlineTextColor: 0x000000,
        bgColor: 0x000000,
        tintColor: 0x000000,
    },
}
export const main = {
    into : {
        title: ["Hydrogen is the most","abundant element in the","universe."],
        textuers:[
        ],
    },
    end : {
        title:[
            `End of`,
            `Text !`,
        ],
        textuers:[
            {
                name:"globe1.png",
                position : {
                    x: -0,
                    y: 0,
                    z: -250,
                },
                scale:{
                    x:700,
                    y:700,
                },
                type:"none"

            },
        ],
    }
}
export default steps