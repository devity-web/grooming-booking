import {IconTrash} from '@tabler/icons-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DeleteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDelete: () => void;
  isLoading?: boolean;
  title: string;
  description: string;
  deleteText?: string;
}

export function DeleteDialog({
  open,
  setOpen,
  handleDelete,
  isLoading,
  title,
  description,
  deleteText = 'Delete',
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            isLoading={isLoading}
            onClick={handleDelete}
            variant="destructive"
          >
            {deleteText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
