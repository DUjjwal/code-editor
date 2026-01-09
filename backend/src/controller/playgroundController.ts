import e, { Request, Response, NextFunction } from "express"
import {prisma} from "../lib/prisma.js"
import { parseTemplateFolder } from "../lib/getTemplate.js"
import path from "path"
import { fileURLToPath } from "url";

export const getAllPlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //@ts-ignore
        const userId = req.user

        const playgrounds = await prisma.playground.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        picture: true
                    }
                }
            }
        })

        return res.status(200).json({
            playgrounds: playgrounds
        })
    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "db error"
        })
    }
    


}

// export const createPlayground = async (req: Request, res: Response, next: NextFunction) => {

//     try {
//         const {title,template, description} = req.body
//         //@ts-ignore
//         const userId = req.user

        
//         const playground = await prisma.playground.create({
//             data: {
//                 title: title,
//                 template: template.toUpperCase(),
//                 userId: userId,
//                 description
//             }
//         })

//         return res.status(200).json({
//             message: "create success",
//             playground
//         })

//     }catch(err) {
//         console.log(err)
//         return res.status(400).json({
//             message: "db error"
//         })
//     }
    



// }

export const deletePlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.body
        
        await prisma.playground.delete({
            where: {
                id: id
            }
        })

        return res.status(200).json({
            message: "delete success"
        })

    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "delete error"
        })
    }
}

export const duplicatePlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.body

        const oldPlayground = await prisma.playground.findUnique({
            where: {
                id: id
            }
        })
        
        if(oldPlayground) {
            const newPlayground = await prisma.playground.create({
                data: {
                    title: (oldPlayground.title + "(DUPLICATE)"),
                    template: oldPlayground.template,
                    //@ts-ignore
                    userId: req.user
                }
            })

            return res.status(200).json({
                message: "duplicate success",
                playground: newPlayground
            })

        }else {
            return res.status(400).json({
                message: "playground not found"
            })
        }
    }catch(error) {
        console.log(error)
        return res.status(400).json({
            message: "duplicate error"
        })
    }
}

export const markPlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.body

        await prisma.playground.update({
            where: {
                id: id
            },
            data: {
                isMarked: true
            }
        })

        return res.status(200).json({
            message: "mark success"
        })
    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "mark failed"
        })
    }

    
}

export const unmarkPlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.body

        await prisma.playground.update({
            where: {
                id: id
            },
            data: {
                isMarked: false
            }
        })

        return res.status(200).json({
            message: "unmark success"
        })
    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "unmark failed"
        })
    }

    
}

export const editPlayground = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title,description,id} = req.body
    
        await prisma.playground.update({
            where: {id:id},
            data: {
                title,
                description
            }
        })
    
        return res.status(200).json({
            message: "update success"
        })

    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "update error"
        })
    }
}

// export const getPlaygroundData = async (req: Request, res: Response, next: NextFunction) => {

//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);

//     const TEMPLATES_ROOT = path.resolve(__dirname, "../../starters-main");

//     const dict: Record<string, string> = {
//         REACT: path.join(TEMPLATES_ROOT, "react"),
//         ANGULAR: path.join(TEMPLATES_ROOT, "angular"),
//         NEXTJS: path.join(TEMPLATES_ROOT, "nextjs-shadcn"),
//         HONO: path.join(TEMPLATES_ROOT, "hono-nodejs-starter"),
//         VUE: path.join(TEMPLATES_ROOT, "vue"),
//         EXPRESS: path.join(TEMPLATES_ROOT, "express-simple"),
//     };

//     try {
//         const {id} = req.body

//         const data = await prisma.templateFile.findUnique({
//             where: {
//                 playgroundId: id
//             }
//         })
    
//         if(!data) {
//             const playground = await prisma.playground.findUnique({
//                 where: {
//                     id: id
//                 }
//             })

//             const template: string = playground?.template!
//             console.log(template)
//             //@ts-ignore
//             const data = parseTemplateFolder(dict[template])
            
//             const retData = await prisma.templateFile.create({
//                 data: {
//                     content: JSON.stringify(data),
//                     playgroundId: id
//                 }
//             })

//             return res.status(200).json({
//                 message: "data success",
//                 data: retData.content
//             })
    
//         }else {

//             return res.status(200).json({
//                 message: "success",
//                 data: data.content
//             })

//         }

//     }catch(err) {
//         console.log(err)
//         return res.status(400).json({
//             message: "data fetch error"
//         })
//     }
// }


export const createPlaygroundLatest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title,template, description} = req.body
        //@ts-ignore
        const userId = req.user

        
        const playground = await prisma.playground.create({
            data: {
                title: title,
                template: template.toUpperCase(),
                userId: userId,
                description
            }
        })

        //creating files
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const TEMPLATES_ROOT = path.resolve(__dirname, "../../starters-main");

        const dict: Record<string, string> = {
            REACT: path.join(TEMPLATES_ROOT, "react"),
            ANGULAR: path.join(TEMPLATES_ROOT, "angular"),
            NEXTJS: path.join(TEMPLATES_ROOT, "nextjs-shadcn"),
            HONO: path.join(TEMPLATES_ROOT, "hono-nodejs-starter"),
            VUE: path.join(TEMPLATES_ROOT, "vue"),
            EXPRESS: path.join(TEMPLATES_ROOT, "express-simple"),
        };

        //@ts-ignore
        const data = parseTemplateFolder(dict[playground.template])


        const createFile = async ({name, content, type, parentId, playgroundId}: {name: string, content?: string, type: string, parentId?: number, playgroundId: string}) => {

            const file = await prisma.file.create({
                data: {
                    name,
                    //@ts-ignore
                    type: type.toUpperCase(),
                    content: content ?? "",
                    parentId: parentId ?? null,
                    playgroundId
                }
            })

            return file

        }


        const generateFiles = async ({item, parentId}: {item: any, parentId?: number}) => {
            if(item.filename) {
                //@ts-ignore
                const file = await createFile({name: item.filename+"."+item.fileExtension, type: "FILE", content: item.content, parentId, playgroundId: playground.id})
                
                return
            }
            else {
                //@ts-ignore
                const file = await createFile({name: item.folderName, type: "FOLDER", content: null, parentId, playgroundId: playground.id})

                item.items.forEach((i: any) => generateFiles({item: i, parentId: file.id}))
                
            }
        }

        generateFiles({item: data})

        return res.status(200).json({
            message: "create success",
            playground
        })

    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "db error"
        })
    }
}

export const getPlaygroundFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.body

        const files = await prisma.file.findMany({
            where: {
                playgroundId: id
            }
        })

        let root = null
        const map: any = {}

        files.forEach((item: any) => {
            if(!item.parentId) {
                root = item
                return
            }
            if(!map[item.parentId])
                map[item.parentId] = []

            map[item.parentId].push(item)
        })

        const buildTree = ({item}: {item: any}) => {
            const childrens = map[item.id]

            if(!childrens) {
                return {...item, items: []}
            }

            return {
                ...item,
                items: childrens.map((item: any) => buildTree({item}))
            }
        }

        const obj = buildTree({item: root})

        

        return res.status(200).json({
            message: "file success",
            data: obj
        })



    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message: "file error"
        })
    }
}