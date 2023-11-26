
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Chatbot } from "@prisma/client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

async function deleteChatbot(chatbotId: string) {
    const response = await fetch(`/api/chatbots/${chatbotId}`, {
        method: "DELETE",
    })

    if (!response?.ok) {
        toast({
            title: "Something went wrong.",
            description: "Your chatbot was not deleted. Please try again.",
            variant: "destructive",
        })
    } else {
        toast({
            title: "Chatbot deleted.",
            description: "Your chatbot was successfully deleted.",
            variant: "default",
        })
    }

    return true
}

async function publishChatbot(chatbotId: string) {
    const response = await fetch(`/api/chatbots/${chatbotId}/publish`, {
        method: "POST",
    })

    if (!response?.ok) {
        toast({
            title: "Something went wrong.",
            description: "Your chatbot was not published. Please try again.",
            variant: "destructive",
        })
    } else {
        toast({
            title: "Chatbot published.",
            description: "Your chatbot was successfully published.",
            variant: "default",
        })
    }

    return true
}

interface ChatbotOperationsProps {
    chatbot: Pick<Chatbot, "id" | "name" | "modelId">
}

export function ChatbotOperations({ chatbot }: ChatbotOperationsProps) {
    const router = useRouter()
    const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
    const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
                    <Icons.ellipsis className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link href={`/dashboard/chatbots/${chatbot.id}/chat`} className="flex w-full">
                            Chat
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={`/dashboard/chatbots/${chatbot.id}`} className="flex w-full">
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => publishChatbot(chatbot.id)}
                    >
                        Publish
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                        onSelect={() => setShowDeleteAlert(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this chatbot?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async (event: { preventDefault: () => void }) => {
                                event.preventDefault()
                                setIsDeleteLoading(true)

                                const deleted = await deleteChatbot(chatbot.id)

                                if (deleted) {
                                    setIsDeleteLoading(false)
                                    setShowDeleteAlert(false)
                                    router.refresh()
                                }
                            }}
                            className="bg-red-600 focus:ring-red-600"
                        >
                            {isDeleteLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4" />
                            )}
                            <span>Delete</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}