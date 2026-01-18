import Editor from '@monaco-editor/react';
import type { editor } from "monaco-editor"
import { useEditor } from '@/store/codeEditor';

import axios from "axios"

export function Monaco() {

    const options: editor.IStandaloneEditorConstructionOptions = {
        fontSize: 14,
        fontFamily: "'Droid Sans Mono', monospace",

        minimap: { enabled: false },

        lineNumbers: "on",        // ✅ now this is "on" | "off" | "relative"
        wordWrap: "on",         // ✅ union type
        renderWhitespace: "selection",
        renderLineHighlight: "line",

        scrollBeyondLastLine: true,
        automaticLayout: true,

        bracketPairColorization: {
            enabled: true,
        },

        inlineSuggest: {
            enabled: false,
        },

        quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
        },

        parameterHints: {
            enabled: true,
        },
    }

    const setContent = useEditor((state) => state.setContent)

    const openFiles = useEditor((state) => state.openFiles)
    const activeId = useEditor((state) => state.activeId)

    let data = openFiles[activeId].newContent
    const name = openFiles[activeId].name
    
    return (
        <Editor
            height="90vh"
            path={name}
            value={data}
            theme="github-light"
            options={options}
            onChange={(value) => setContent(value!)}
            onMount={(editor, monaco) => {




                function getContext(model: any, position: any) {
                    

                    if(!position || !model) return 

                    const before = model.getValueInRange({
                        startLineNumber: Math.max(1, position.lineNumber - 200),
                        endLineNumber: position.lineNumber,
                        startColumn: 1,
                        endColumn: position.column
                    })

                    const after = model.getValueInRange({
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber + 50,
                        startColumn: 1,
                        endColumn: position?.column
                    })

                    return {before, after}
                    
                }

                const handleAiSuggestion = async (model: any, position: any) => {
                    //@ts-ignore
                    const {before, after} = getContext(model, position)

                    const prompt = `
                        You are an AI code completion engine like VS Code Copilot.

                        Rules:
                        - Continue code naturally
                        - Do NOT explain anything
                        - Do NOT repeat existing code
                        - Output ONLY the missing code
                        - Follow existing style and indentation

                        Code before cursor:
                        ${before}

                        Code after cursor:
                        ${after}

                        Only return the completion:
                    `

                    const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        model: "llama-3.1-8b-instant",
                        temperature: 0.2,
                        max_tokens: 120
                    }, {
                        headers: {
                            "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API}`,
                            "Content-Type": "application/json",
                        }
                    })

                    return res.data.choices[0].message.content
                }

                monaco.languages.registerInlineCompletionsProvider("javascript", {
                    provideInlineCompletions: async (model: any, position: any) => {
                        const suggestion = await handleAiSuggestion(model, position)

                        return {
                            items: [
                                {
                                    insertText: suggestion,
                                    range: new monaco.Range(
                                        position.lineNumber,
                                        position.column,
                                        position.lineNumber,
                                        position.column
                                    )
                                }
                            ]
                        }
                    },
                    freeInlineCompletions: () => {}
                })

                editor.addAction({
                    id: "ctrl-p-handler",
                    label: "Run Ctrl+P Function",
                    keybindings: [
                        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP
                    ],
                    run: async () => {
                        editor.trigger("keyboard", "editor.action.inlineSuggest.trigger", {})
                    }
                })


            }}
        />
    )
}