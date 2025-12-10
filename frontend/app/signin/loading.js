import { FiLoader } from "react-icons/fi"

export default function loading(){
    return (
        <div className="flex items-center justify-center min-h-full bg-background">
            <FiLoader className="text-xl text-foreground animate-spin" />
        </div>
    )
}