import { useToast } from "./ToastContext";

let id = 0

export function ToastButton() {
  const { toast } = useToast()
  return (
    <button onClick={() => {
      toast({
        id: id++,
        text: 'Message ' + id
      })
    }}>Click!</button>
  )
}
