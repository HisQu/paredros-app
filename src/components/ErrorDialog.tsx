import { Button } from './ui/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from './ui/dialog'
import { useState } from 'react'

export function ErrorDialog({ error, ...props }: { error: {title: string, description: string, details: string } } & React.ComponentPropsWithoutRef<typeof Button>) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} {...props} />
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>ErrorTitle</DialogTitle>
        <DialogDescription>
          ErrorDescr
        </DialogDescription>
        <DialogBody>
            ErrorBody
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}