import { Button } from './ui/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from './ui/dialog'

interface ErrorDialogProps {
  error: {title: string, description: string, details: string } | null;
  onClose: () => void;
}

export function ErrorDialog({ error, onClose }: ErrorDialogProps) {
  if (!error) return null;

  return (
    <Dialog open={!!error} onClose={() => onClose()}>
      <DialogTitle>{error.title}</DialogTitle>
      <DialogDescription>
        {error.description}
      </DialogDescription>
      <DialogBody>
        <pre className="text-xs p-3 rounded border border-gray-200 whitespace-pre-wrap text-white">
          {error.details}
        </pre>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => onClose()}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}