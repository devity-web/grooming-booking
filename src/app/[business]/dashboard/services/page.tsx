import {CircleOff} from 'lucide-react';
import {Suspense} from 'react';
import {CreateServiceDialog} from '@/components/dashboard/create-service-dialog';
import {ServiceRow} from '@/components/dashboard/service-row';
import {Card, CardContent} from '@/components/ui/card';
import {Spinner} from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {getTenantPrisma, type TenantPageProps} from '@/lib/tenant';

export default function ServicesPage(props: TenantPageProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Services</h1>
        <CreateServiceDialog />
      </div>
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <Suspense
              fallback={
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex justify-center items-center py-12">
                        <Spinner className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              }
            >
              <ServicesTableBody {...props} />
            </Suspense>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

async function ServicesTableBody(props: TenantPageProps) {
  const prisma = await getTenantPrisma(props.params);
  const services = await prisma.service.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  if (services.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6}>
            <div className="flex flex-col items-center justify-center gap-6 py-20">
              <CircleOff className="h-20 w-20 text-muted" />
              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-bold">No Services</h3>
                <p className="text-muted-foreground">
                  It looks like you haven't created any services yet. Get
                  started by creating your first service.
                </p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {services.map(service => (
        <ServiceRow key={service.id} service={service} />
      ))}
    </TableBody>
  );
}
