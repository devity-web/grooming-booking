import {notFound} from 'next/navigation';
import {cache} from 'react';
import prisma from './prisma';
import {createClient} from './supabase/server';

export type TenantParams = Promise<{business: string}>;

export type TenantPageProps = {
  params: TenantParams;
};

export const getTenantContext = cache(
  async (paramsOrSlug: TenantParams | string) => {
    const businessUrl =
      typeof paramsOrSlug === 'string'
        ? paramsOrSlug
        : (await paramsOrSlug).business;

    const supabase = await createClient();

    const {
      data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Missing user data');
    }

    const business = await prisma.business.findFirst({
      where: {
        url: businessUrl,
        profile: {
          userId: user.id,
        },
      },
    });

    if (!business) {
      notFound();
    }

    return {user, business};
  },
);

export const getTenantPrisma = cache(
  async (paramsOrSlug: TenantParams | string) => {
    const businessUrl =
      typeof paramsOrSlug === 'string'
        ? paramsOrSlug
        : (await paramsOrSlug).business;

    const {business} = await getTenantContext(businessUrl);

    return prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({model, args, query}) {
            // If the model has a businessId field, automatically inject it into queries
            if (['Service', 'Appointment', 'Customer'].includes(model)) {
              args.where = {...args.where, businessId: business.id};
            }
            return query(args);
          },
        },
      },
    });
  },
);
