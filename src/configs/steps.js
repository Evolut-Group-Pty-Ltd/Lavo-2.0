const steps = {
    intro: {
        textColor: 0xffffff,
        outlineTextColor: 0x212b32,
        bgColor: 0x24093D,
        tintColor: 0xffffff
    },
    step1: {
        name: '',
        textColor: 0xffffff,
        bgColor: 0x24093D,
        tintColor: 0x212b32
    },
    end: {
        textColor: 0xffffff,
        outlineTextColor: 0x000000,
        bgColor: 0x24093D,
        tintColor: 0x000000,
    },
}
export const main = {
    into : {
        title:[
            `.`,
        ],
        textuers:[
        ],
    },
    end : {
        title:[
            `Shanghai's masterplan – covering an area of`,
            `640km² – has proven how forward thinking`,
            ` can manage water effectively at scale.`,
        ],
        textuers:[
            {
                name:"image0.jpg",
                position : {
                    x: -720,
                    y: 230,
                    z: -250,
                },
                scale:{
                    x:700,
                    y:500,
                },
                type:"none"

            },
            {
                name:"image1.jpg",
                position : {
                    x: -300,
                    y: -400,
                    z: -250,
                },
                scale:{
                    x:330,
                    y:270,
                },
                type:"none"

            },
            {
                name:"image2.jpg",
                position : {
                    x: 600,
                    y: 100,
                    z: -250,
                },
                scale:{
                    x:530,
                    y:380,
                },
                type:"none"

            },
        ],
    }
}
export default steps