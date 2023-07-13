// routes
import { PATH_APP, PATH_PAGE } from '../../../routes/paths';
// components
// import Label from '../../../components/Label';
// import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'dashboard', path: PATH_APP.general.dashboard, icon: ICONS.dashboard },
      { title: 'events', path: PATH_APP.general.events, icon: ICONS.calendar },
      { title: 'analytics', path: PATH_APP.general.analytics, icon: ICONS.analytics },
      { title: 'account', path: PATH_APP.general.account, icon: ICONS.user },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'support',
    items: [
      { title: 'faq', path: PATH_PAGE.faqs, icon: ICONS.invoice },
      { title: 'contact us', path: PATH_PAGE.contact, icon: ICONS.chat },
      // EXPANDABLE EXAMPLE
      // {
      //   title: 'blog',
      //   path: PATH_DASHBOARD.blog.root,
      //   icon: ICONS.blog,
      //   children: [
      //     { title: 'posts', path: PATH_DASHBOARD.blog.posts },
      //     { title: 'post', path: PATH_DASHBOARD.blog.demoView },
      //     { title: 'create', path: PATH_DASHBOARD.blog.new },
      //   ],
      // },

      // ICON EXAMPLE
      // {
      //   title: 'mail',
      //   path: PATH_DASHBOARD.mail.root,
      //   icon: ICONS.mail,
      //   info: <Label color="error">+32</Label>,
      // },
    ],
  },

  // DEMO MENU STATES
  // {
  //   subheader: 'Other cases',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'item_by_roles',
  //       path: PATH_DASHBOARD.permissionDenied,
  //       icon: ICONS.menuItem,
  //       roles: ['admin'],
  //       caption: 'only_admin_can_see_this_item',
  //     },
  //     {
  //       title: 'menu_level_1',
  //       path: '#1',
  //       icon: ICONS.menuItem,
  //       children: [
  //         { title: 'menu_level_2', path: '#2', disabled: true },
  //         {
  //           title: 'menu_level_2',
  //           path: '#3',
  //           children: [
  //             { title: 'menu_level_3', path: '#4' },
  //             { title: 'menu_level_3', path: '#5' },
  //           ],
  //         },
  //       ],
  //     },
  //     { title: 'item_disabled', path: '#disabled', icon: ICONS.menuItem, disabled: true },
  //     {
  //       title: 'item_label',
  //       path: '#label',
  //       icon: ICONS.menuItem,
  //       info: (
  //         <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     { title: 'item_caption', path: '#caption', icon: ICONS.menuItem, caption: 'description' },
  //   ],
  // },
];

export default navConfig;
