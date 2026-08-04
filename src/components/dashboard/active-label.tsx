import {Badge} from '../ui/badge';

export function ActiveLabel({isActive}: {isActive: boolean}) {
  if (isActive) {
    return <Badge variant="success">Ativo</Badge>;
  }

  return <Badge variant="destructive">Desativado</Badge>;
}
