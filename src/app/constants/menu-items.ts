import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/dashboard',
    pathMatch: 'prefix',
    home: true,
  },
  {
    title: 'Users',
    icon: 'people-outline',
    link: '/users',
    pathMatch: 'prefix',
  },
  {
    title: 'Organisations',
    icon: 'pantone-outline',
    link: '/organisations',
    pathMatch: 'prefix',
  },
  {
    title: 'Missions',
    icon: 'map-outline',
    link: '/missions',
    pathMatch: 'prefix',
  },
  {
    title: 'SmartAPs',
    icon: 'cube-outline',
    link: '/smartaps',
    pathMatch: 'prefix',
  },
  {
    title: 'SmartLinks',
    icon: 'cube-outline',
    link: '/smartlinks',
    pathMatch: 'prefix',
  },
  {
    title: 'AirLinks',
    icon: 'cube-outline',
    link: '/airlinks',
    pathMatch: 'prefix',
  },
  {
    title: 'GCS',
    icon: 'monitor-outline',
    link: '/gcs',
    pathMatch: 'prefix',
  },
  {
    title: 'Logs',
    icon: 'trending-up-outline',
    link: '/logs',
    pathMatch: 'prefix',
  },
  {
    title: 'Features',
    icon: 'pie-chart-outline',
    link: '/features',
    pathMatch: 'prefix',
  },
  {
    title: 'Integrations',
    icon: 'layers-outline',
    link: '/integrations',
    pathMatch: 'prefix',
  },
  {
    title: 'Manufacturers',
    icon: 'award-outline',
    link: '/manufacturers',
    pathMatch: 'prefix',
  },
];
