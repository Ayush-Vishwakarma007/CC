import {ADMIN, VENDOR, MEMBER} from '../helpers/roles';

export class MenuModel{
  icon:string;
  allowRole:number[];
  link:string;
  activeOnRoutes:string[];
  title:string;
  badgeValue?:string;
}

export const topMenu:MenuModel[] = [
  {
    icon:'mdi mdi-view-dashboard',
    allowRole:[ADMIN,VENDOR],
    link:'/dashboard',
    activeOnRoutes: ['/dashboard'],
    title:'Dashboard',
  },
  {
    icon:'mdi  mdi-exit-to-app',
    allowRole:[ADMIN,VENDOR],
    link:'/logout',
    activeOnRoutes: ['/logout'],
    title:'Logout',
  },
  ]
