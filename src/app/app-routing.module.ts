import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { CommonLayoutComponent } from './layouts/comman-layout/common-layout.component';
import { AuthGuard } from './auth.guard';
import { SidebarLayoutComponent } from "./layouts/sidebar-layout/sidebar-layout.component";
import { SponsorDonorCheckoutWithoutStepsModule } from './pages/sponsor-donor-checkout-without-steps/sponsor-donot-checkout-without-steps.module';


const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 0],
};

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(x => x.HomeModule),
    component: CommonLayoutComponent
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(x => x.HomeModule),
    component: CommonLayoutComponent
  },
  {
    path: 'contact-us',
    component: CommonLayoutComponent,
    loadChildren: () => import('./pages/auth/contact-us/contact-us.module').then(x => x.ContactUsModule),
  },
  {
    path: 'contact',
    component: CommonLayoutComponent,
    loadChildren: () => import('./pages/auth/contact-us/contact-us.module').then(x => x.ContactUsModule),
  },
  {
    path: 'news',
    component: CommonLayoutComponent,
    loadChildren: () => import('./pages/news/news-announcements/news-announcements.module').then(x => x.NewsAnnouncementsModule),
  },
  {
    path: 'news-Details/news/:string',
    component: CommonLayoutComponent,
    loadChildren: () => import('./pages/news/news-announcements-details/news-announcements-details.module').then(x => x.NewsAnnouncementsDetailsModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login-register/login-register.module').then(x => x.LoginRegisterModule),
  },
  {
    path: 'registration',
    loadChildren: () => import('./pages/auth/registration/registration.module').then(x => x.RegistrationModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/auth/profile/profile.module').then(x => x.ProfileModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'profile/:type',
    loadChildren: () => import('./pages/auth/profile/profile.module').then(x => x.ProfileModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'create-event',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/others/create-event/create-event.module').then(x => x.CreateEventModule),
    component: CommonLayoutComponent
  }, {
    path: 'edit-event/:string',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./pages/others/create-event/create-event.module').then(x => x.CreateEventModule),
    component: SidebarLayoutComponent
  }, {
    path: 'eventlist/:string',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./pages/event/eventlist/eventlist.module').then(x => x.EventlistModule),
    component: CommonLayoutComponent
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/auth/reset-password/reset-password.module').then(x => x.ResetPasswordModule),
  },
  {
    path: 'verify/:email/:string',
    loadChildren: () => import('./pages/auth/send-otp/send-otp.module').then(x => x.SendOtpModule),
  },
  {
    path: 'payment/:status/:type',
    loadChildren: () => import('./pages/payment-done/payment-done.module').then(x => x.PaymentDoneModule),
    component: CommonLayoutComponent
  },
  {
    path: 'verify-otp',
    loadChildren: () => import('./pages/auth/verify-otp/verify-otp.module').then(x => x.VerifyOtpModule),
  },
  {
    path: 'event-detail/:string',
    loadChildren: () => import('./pages/event/event-detail/event-detail.module').then(x => x.EventDetailModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'my-event',
    loadChildren: () => import('./pages/event/admin/my-event/my-event.module').then(x => x.MyEventModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'my-event/:type',
    loadChildren: () => import('./pages/event/admin/my-event/my-event.module').then(x => x.MyEventModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'my-register-event',
    loadChildren: () => import('./pages/event/my-register-event/my-register-event.module').then(x => x.MyRegisterEventModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'my-register-event/:type',
    loadChildren: () => import('./pages/event/my-register-event/my-register-event.module').then(x => x.MyRegisterEventModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(x => x.NotificationsModule),
    component: CommonLayoutComponent
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then(x => x.RegisterModule),
  },
  {
    path: 'event-registration/:type/:event',
    loadChildren: () => import('./pages/others/member-register/member-register.module').then(x => x.MemberRegisterModule),
    component: CommonLayoutComponent
  },
  {
    path: 'member-register',
    loadChildren: () => import('./pages/others/member-register/member-register.module').then(x => x.MemberRegisterModule),
    component: CommonLayoutComponent
  },
  {
    path: 'vendor-register',
    loadChildren: () => import('./pages/others/vendor-register/vendor-register.module').then(x => x.VendorRegisterModule),
    component: CommonLayoutComponent
  },
  {
    path: 'create-event-new',
    loadChildren: () => import('./pages/event/admin/create-event-new/create-event-new.module').then(x => x.CreateEventNewModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'edit-event-new/:string',
    loadChildren: () => import('./pages/event/admin/create-event-new/create-event-new.module').then(x => x.CreateEventNewModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'create-auditorium',
    loadChildren: () => import('./pages/event/admin/create-auditorium/create-auditorium.module').then(x => x.CreateAuditoriumModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/others/payment/payment.module').then(x => x.PaymentModule),
    component: CommonLayoutComponent
  },
  {
    path: 'event-preview',
    loadChildren: () => import('./pages/others/event-preview/event-preview.module').then(x => x.EventPreviewModule),
    component: CommonLayoutComponent
  },
  {
    path: 'event-dashboard/:id',
    loadChildren: () => import('./pages/event/admin/dashboard-event/dashboard-event.module').then(x => x.DashboardEventModule),
    // path: 'event-dashboard/:string',
    // loadChildren: './pages/event/admin/event-dashboard/event-dashboard.module#EventDashboardModule',
    component: SidebarLayoutComponent
  },
  {
    path: 'vendor-dashboard',
    loadChildren: () => import('./pages/event/admin/vendor-dashboard/vendor-dashboard.module').then(x => x.VendorDashboardModule),
    component: CommonLayoutComponent
  },
  {
    path: 'member-list',
    loadChildren: () => import('./pages/member/member-list/member-list.module').then(x => x.MemberListModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'book-ticket/:string',
    loadChildren: () => import('./pages/others/book-ticket/book-ticket.module').then(x => x.BookTicketModule),
    component: CommonLayoutComponent
  },
  {
    path: 'become/:type/:eventId/:id',
    loadChildren: () => import('./pages/others/become-sponsor/become-sponsor.module').then(x => x.BecomeSponsorModule),
    component: CommonLayoutComponent
  },
  {
    path: 'become/:type/:eventId/:id',
    loadChildren: () => import('./pages/others/become-sponsor/become-sponsor.module').then(x => x.BecomeSponsorModule),
    component: CommonLayoutComponent
  },
  {
    path: 'create-membership',
    loadChildren: () => import('./pages/member/create-membership/create-membership.module').then(x => x.CreateMembershipModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'create-membership-new',
    loadChildren: () => import('./pages/member/create-membership-new/create-membership-new.module').then(x => x.CreateMembershipNewModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'become-member',
    loadChildren: () => import('./pages/member/become-member/become-member.module').then(x => x.BecomeMemberModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'become-member-without-step',
    loadChildren: () => import('./pages/member/become-member-without-step/become-member-without-step.module').then(x => x.BecomeMemberWithoutStepModule),

  },
  {
    path: 'purchase-ticket-new-event/:id/:type/:community',
    loadChildren: () => import('./pages/purchase-ticket-new-event/purchase-ticket-new-event.module').then(x => x.PurchaseTicketNewEventModule),

  },
  {
    path: 'purchase-ticket-new-event/:id/:type',
    loadChildren: () => import('./pages/purchase-ticket-new-event/purchase-ticket-new-event.module').then(x => x.PurchaseTicketNewEventModule),

  },
  {
    path: 'purchase-ticket-without-step',
    loadChildren: () => import('./pages/purchase-ticket-without-step/purchase-ticket-without-step.module').then(x => x.PurchaseTicketWithoutStepModule),

  },
  {
    path: 'become-member/:string/:id',
    loadChildren: () => import('./pages/member/become-member/become-member.module').then(x => x.BecomeMemberModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'become-member-steps',
    loadChildren: () => import('./pages/member/become-member-steps/become-member-steps.module').then(x => x.BecomeMemberStepsModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'membership-benefits',
    loadChildren: () => import('./pages/member/membership-benefits/membership-benefits.module').then(x => x.MembershipBenefitsModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'register-done',
    loadChildren: () => import('./pages/event/register-done/register-done.module').then(x => x.RegisterDoneModule),
    component: CommonLayoutComponent
  },

  {
    path: 'event-details/:id',
    loadChildren: () => import('./pages/event/event-detail/event-detail.module').then(x => x.EventDetailModule),
    component: CommonLayoutComponent
  },
  {
    path: 'ticket-checkout/:id',
    loadChildren: () => import('./pages/event/ticket-checkout/ticket-checkout.module').then(x => x.TicketCheckoutModule),

  },
  {
    path: 'online-event-checkout/:id',
    loadChildren: () => import('./pages/event/online-event-checkout/online-event-checkout.module').then(x => x.OnlineEventCheckoutModule),

  },
  {
    path: 'donor-checkout/:id',
    loadChildren: () => import('./pages/event/donor-checkout/donor-checkout.module').then(x => x.DonorCheckoutModule),

  },
  {
    path: 'sponsor-checkout/:id',
    loadChildren: () => import('./pages/event/donor-checkout/donor-checkout.module').then(x => x.DonorCheckoutModule),
  },
  {
    path: 'donor-checkout-without-steps/:type/:id',
    loadChildren: () => import('./pages/sponsor-donor-checkout-without-steps/sponsor-donot-checkout-without-steps.module').then(x => SponsorDonorCheckoutWithoutStepsModule),
  },
  {
    path: 'vendor-checkout/:id',
    loadChildren: () => import('./pages/event/vendor-checkout/vendor-checkout.module').then(x => x.VendorCheckoutModule),
  },
  {
    path: 'event-not-found',
    loadChildren: () => import('./pages/event/event-not-found/event-not-found.module').then(x => x.EventNotFoundModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'committee-members',
    loadChildren: () => import('./pages/member/committee-members/committee-members.module').then(x => x.CommitteeMembersModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'committee-management',
    loadChildren: () => import('./pages/member/committee-management/committee-management.module').then(x => x.CommitteeManagementModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'event-gallery',
    loadChildren: () => import('./pages/event/event-gallery/event-gallery.module').then(x => x.EventGalleryModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'gallery-media-detail/:id',
    loadChildren: () => import('./pages/event/gallery-media-detail/gallery-media-detail.module').then(x => x.GalleryMediaDetailModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'user-edit/:galleryId/:id',
    loadChildren: () => import('./pages/event/user-edit/user-edit.module').then(x => x.UserEditModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'donation-dashboard/:id',
    loadChildren: () => import('./pages/event/donation-dashboard/donation-dashboard.module').then(x => x.DonationDashboardModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'dashboard-event/:id',
    loadChildren: () => import('./pages/event/admin/dashboard-event/dashboard-event.module').then(x => x.DashboardEventModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'popup',
    loadChildren: () => import('./pages/popup/popup.module').then(x => x.PopupModule),
    component: CommonLayoutComponent
  },
  {
    path: 'membership-plan',
    redirectTo: 'membership-checkout-new'
  },
  {
    path: 'membership-checkout/:type/:id',
    loadChildren: () => import('./pages/member/membership-checkout/membership-checkout.module').then(x => x.MembershipCheckoutModule),
  },
  {
    path: 'membership-dashboard',
    loadChildren: () => import('./pages/membership-dashboard-new/membership-dashboard-new.module').then(x => x.MembershipDashboardNewModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'gallery-page',
    loadChildren: () => import('./pages/client-pages/gallery-inner/gallery-inner.module').then(x => x.GalleryInnerModule),
    component: CommonLayoutComponent
  },
  {
    path: 'gallery',
    loadChildren: () => import('./pages/client-pages/gallery/gallery.module').then(x => x.GalleryModule),
    component: CommonLayoutComponent
  },
  {
    path: 'image-gallery',
    loadChildren: () => import('./pages/client-pages/gallery/gallery.module').then(x => x.GalleryModule),
    component: CommonLayoutComponent
  },
  {
    path: 'video-gallery',
    loadChildren: () => import('./pages/client-pages/gallery/gallery.module').then(x => x.GalleryModule),
    component: CommonLayoutComponent
  },
  {
    path: 'youtube-gallery',
    loadChildren: () => import('./pages/client-pages/gallery/gallery.module').then(x => x.GalleryModule),
    component: CommonLayoutComponent
  },
  {
    path: 'chapter/:string',
    loadChildren: () => import('./pages/client-pages/chapter-home/chapter-home.module').then(x => x.ChapterHomeModule),
    component: CommonLayoutComponent
  },
  {
    path: 'about-us',
    loadChildren: () => import('./pages/client-pages/about-us/about-us.module').then(x => x.AboutUsModule),
    component: CommonLayoutComponent,
  }, {
    path: 'members-directory',
    loadChildren: () => import('./pages/member/members-directory/members-directory.module').then(x => x.MembersDirectoryModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'management',
    loadChildren: () => import('./pages/administration/administration.module').then(x => x.AdministrationModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'chapter-sponsorship',
    loadChildren: () => import('./pages/donation-sponsorship/chapter-sponsorship/chapter-sponsorship.module').then(x => x.ChapterSponsorshipModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'chapter-donation',
    loadChildren: () => import('./pages/donation-sponsorship/chapter-donation/chapter-donation.module').then(x => x.ChapterDonationModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'newsletter',
    loadChildren: () => import('./pages/newsletter/newsletter.module').then(x => x.NewsletterModule),
    component: CommonLayoutComponent
  },
  {
    path: 'newsletter-details/:id',
    loadChildren: () => import('./pages/newsletter/newsletter-details/newsletter-details.module').then(x => x.NewsletterDetailsModule),
    component: CommonLayoutComponent
  },
  {
    path: 'dynamic-page/:string',
    loadChildren: () => import('./pages/client-pages/dynamic-page/dynamic-page.module').then(x => x.DynamicPageModule),
    component: CommonLayoutComponent
  },
  {
    path: 'chapter-checkout/:type/:id',
    loadChildren: () => import('./pages/donation-sponsorship/chapter-donation-sponsership/chapter-donation-sponsership.module').then(x => x.ChapterDonationSponsershipModule),
  },
  {
    path: 'gallery-new',
    loadChildren: () => import('./pages/gallery-new/gallery-new.module').then(x => x.GalleryNewModule),
    component: CommonLayoutComponent
  },
  {
    path: 'participate-checkout/:id',
    loadChildren: () => import('./pages/event/participate-checkout/participate-checkout.module').then(x => x.ParticipateCheckoutModule),
  },
  {
    path: 'banner-management-list',
    loadChildren: () => import('./pages/banner-management/banner-management-list/banner-management-list.module').then(x => x.BannerManagementListModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'banner-display',
    loadChildren: () => import('./pages/banner-management/banner-display/banner-display.module').then(x => x.BannerDisplayModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'banner-display/:id',
    loadChildren: () => import('./pages/banner-management/banner-display/banner-display.module').then(x => x.BannerDisplayModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'clover',
    loadChildren: () => import('./pages/clover-demo/clover-demo.module').then(x => x.CloverDemoModule),
  },
  {
    path: 'create-form',
    loadChildren: () => import('./pages/dynamic-form/create-form/create-form.module').then(x => x.CreateFormModule),
    component: SidebarLayoutComponent

  },
  {
    path: 'preview-form',
    loadChildren: () => import('./pages/dynamic-form/preview-form/preview-form.module').then(x => x.PreviewFormModule),
    component: SidebarLayoutComponent

  },
  {
    path: 'manage-form',
    loadChildren: () => import('./pages/dynamic-form/manage-form/manage-form.module').then(x => x.ManageFormModule),
    component: SidebarLayoutComponent

  },
  {
    path: 'assign-form/:id',
    loadChildren: () => import('./pages/dynamic-form/assign-form/assign-form.module').then(x => x.AssignFormModule),
    component: SidebarLayoutComponent

  },
  {
    path: 'editor',
    loadChildren: () => import('./pages/editor/editor.module').then(x => x.EditorModule),
  },
  {
    path: 'donorlist',
    component: CommonLayoutComponent,
    loadChildren: () => import('./pages/donation-sponsorship/donor-list/donor-list.module').then(x => x.DonorListModule),

  },
  {
    path: 'checkout-management',
    // component:CommonLayoutComponent,
    loadChildren: () => import('./pages/checkout-management/checkout-management.module').then(x => x.CheckoutManagementModule),
  },
  {
    path: 'checkout-management/:status/:type/:id',
    // component:CommonLayoutComponent,
    loadChildren: () => import('./pages/checkout-management/checkout-management.module').then(x => x.CheckoutManagementModule),

  },
  {
    path: 'live-streaming/:code',
    component: CommonLayoutComponent, data: { skipChapter: true },
    loadChildren: () => import('./pages/live-streaming/live-streaming.module').then(x => x.LiveStreamingModule),
  },
  {
    path: 'live-streaming-not-allowed/:id',
    loadChildren: () => import('./pages/event/event-not-found/event-not-found.module').then(x => x.EventNotFoundModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'my-sponsorship/edit/:eventId/:id',
    loadChildren: () => import('./pages/event/admin/dashboard-component/statistic/edit-my-sponsorship/edit-my-sponsorship.module').then(x => x.EditMySponsorshipModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'my-contribution',
    loadChildren: () => import('./pages/my-contribution/my-contribution.module').then(x => x.MyContributionModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'my-chapter-sponsorship/edit/:id',
    loadChildren: () => import('./pages/my-contribution/edit-my-chapter-sponsorship/edit-my-chapter-sponsorship.module').then(x => x.EditMyChapterSponsorshipModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'my-event-sponsorship/edit/:id',
    loadChildren: () => import('./pages/my-contribution/edit-my-event-sponsorship/edit-my-event-sponsorship.module').then(x => x.EditMyEventSponsorshipModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'thanks-successful-payment',
    loadChildren: () => import('./pages/thanks-successful-payment/thanks-successful-payment.module').then(x => x.ThanksSuccessfulPaymentModule),
  },
  {
    path: 'sponsor-checkout-new/:type/:id',
    loadChildren: () => import('./pages/sponsor-donor-checkout-new/sponsor-donor-checkout-new.module').then(x => x.SponsorDonorCheckoutNewModule),
  },
  {
    path: 'donor-checkout-new/:type/:id',
    loadChildren: () => import('./pages/sponsor-donor-checkout-new/sponsor-donor-checkout-new.module').then(x => x.SponsorDonorCheckoutNewModule),
  },
  {
    path: 'ticket-booking-new/:id/:type',
    loadChildren: () => import('./pages/ticket-booking-new/ticket-booking-new.module').then(x => x.TicketBookingNewModule)
    // loadChildren: () => import('./pages/purchase-ticket-new-event/purchase-ticket-new-event.module').then(x => x.PurchaseTicketNewEventModule),
  },
  /*  {
      path: 'ticket-list',
      loadChildren: './pages/ticket-booking-new/ticket-list/ticket-list.module#TicketListModule'
    },*/
  /**  jaydeep tank{
     path: 'membership-checkout-new',
     loadChildren: './pages/member/membership-checkout-new/membership-checkout-new.module#MembershipCheckoutNewModule',
   },*/
  {
    path: 'membership-checkout-new',
    loadChildren: () => import('./pages/member/become-member-without-step/become-member-without-step.module').then(x => x.BecomeMemberWithoutStepModule),
  },
  {
    path: 'bulk-ticket-qty-tickets',
    loadChildren: () => import('./pages/bulk-ticket/bulk-ticket-qty-tickets/bulk-ticket-qty-tickets.module').then(x => x.BulkTicketQtyTicketsModule),
  },
  {
    path: 'bulk-ticket-info',
    loadChildren: () => import('./pages/bulk-ticket/bulk-ticket-info/bulk-ticket-info.module').then(x => x.BulkTicketInfoModule),
  },
  {
    path: 'bulk-ticket-payment',
    loadChildren: () => import('./pages/bulk-ticket/bulk-ticket-payment/bulk-ticket-payment.module').then(x => x.BulkTicketPaymentModule),
  },
  {
    path: 'scholarship-management',
    loadChildren: () => import('./pages/scholarship-management/scholarship-management.module').then(x => x.ScholarshipManagementModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'scholarship-user-side',
    loadChildren: () => import('./pages/scholarship-user-side/scholarship-user-side.module').then(x => x.ScholarshipUserSideModule),
    component: CommonLayoutComponent
  },

  {
    path: 'scholarship-list',
    loadChildren: () => import('./pages/scholarship-list/scholarship-list.module').then(x => x.ScholarshipListModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'scholarship-detail',
    loadChildren: () => import('./pages/scholarship-detail/scholarship-detail.module').then(x => x.ScholarshipDetailModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'survey-form',
    loadChildren: () => import('./pages/survey-form/survey-form.module').then(x => x.SurveyFormModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'survey-form-create',
    loadChildren: () => import('./pages/survey-form-create/survey-form-create.module').then(x => x.SurveyFormCreateModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'event-feedback-survey-form',
    loadChildren: () => import('./pages/event-feedback-survey-form/event-feedback-survey-form.module').then(x => x.EventFeedbackSurveyFormModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'event-feedback-user-side',
    loadChildren: () => import('./pages/event-feedback-user-side/event-feedback-user-side.module').then(x => x.EventFeedbackUserSideModule),
    component: SidebarLayoutComponent
  }, {
    path: 'payment-checkout/:id',
    loadChildren: () => import('./pages/payment-checkout/payment-checkout.module').then(x => x.PaymentCheckoutModule),
  },
  {
    path: 'membership-dashboard-new',
    loadChildren: () => import('./pages/membership-dashboard-new/membership-dashboard-new.module').then(x => x.MembershipDashboardNewModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'assets-list',
    loadChildren: () => import('./pages/hall-boocking/admin/assets-list/assets-list.module').then(x => x.AssetsListModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'assets-summery',
    loadChildren: () => import('./pages/hall-boocking/admin/assets-summery/assets-summery.module').then(x => x.AssetsSummeryModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'hall-booking',
    component: CommonLayoutComponent,
    loadChildren: () => import('./pages/hall-boocking/user/hall-booking/hall-booking.module').then(x => x.HallBookingModule),
    // component: SidebarLayoutComponent
  },
  {
    path: 'hall-booking-details',
    component: CommonLayoutComponent,
    loadChildren: () => import('./pages/hall-boocking/user/hall-booking-details/hall-booking-details.module').then(x => x.HallBookingDetailsModule),
    // component: SidebarLayoutComponent
  },
  {
    path: 'hall-booking-checkout',
    // component:CommonLayoutComponent,
    loadChildren: () => import('./pages/hall-boocking/user/hall-booking-checkout/hall-booking-checkout.module').then(x => x.HallBookingCheckoutModule),

  },
  {
    path: 'member-details/:id',
    loadChildren: () => import('./pages/member/member-details/member-details.module').then(x => x.MemberDetailsModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'management/news-management',
    loadChildren: () => import('./pages/news-management/news-management.module').then(x => x.NewsManagementModule),
    component: SidebarLayoutComponent
  },
  // {
  //   path: 'event-fund',
  //   component:CommonLayoutComponent,
  //   loadChildren: './pages/member/event-fund.module#EventFundModule',
  // },
  {
    path: 'membership-dashboard/event-fund',
    loadChildren: () => import('./pages/member/event-fund/event-fund.module').then(x => x.EventFundModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'unsubscribe/:email/:id',
    loadChildren: () => import('./pages/unsubscribe/unsubscribe.module').then(x => x.UnsubscribeModule),
    // component: SidebarLayoutComponent
  },
  {
    path: 'recover/:email/:id',
    loadChildren: () => import('./pages/recover/recover.module').then(x => x.RecoverModule),
    // component: SidebarLayoutComponent
  },
  {
    path: 'subscribe/:email/:id',
    loadChildren: () => import('./pages/subscribe/subscribe.module').then(x => x.SubscribeModule),
    // component: SidebarLayoutComponent
  },
  {
    path: 'member-benefits',
    loadChildren: () => import('./pages/member-benefits/member-benefits.module').then(x => x.MemberBenefitsModule),
    component: CommonLayoutComponent,
  },
  {
    path: 'sponsorship-benefits',
    loadChildren: () => import('./pages/sponsorshipbenefits/sponsorshipbenefits.module').then(x => x.SponsorshipbenefitsModule),
    component: CommonLayoutComponent,
  },
  {
    path: 'profile-member',
    loadChildren: () => import('./pages/auth/profile-member/profile-member.module').then(x => x.ProfileMemberModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'volunteer',
    component: CommonLayoutComponent,
    loadChildren: () => import('./pages/auth/volunteer/volunteer.module').then(x => x.VolunteerModule),
  },
  {
    path: 'anand-bazzar',
    loadChildren: () => import('./pages/anand-bazzar/anand-bazzar.module').then(x => x.AnandBazzarModule),
    component: CommonLayoutComponent
  },
  {
    path: 'volunteer-list',
    loadChildren: () => import('./pages/volunteer-list/volunteer-list.module').then(x => x.VolunteerListModule),
    component: SidebarLayoutComponent
  },
  {
    path: 'event/volunteer',
    loadChildren: () => import('./pages/event/volunteer/volunteer.module').then(x => x.VolunteerModule),

  },
  {
    path: 'all-sponsor/:id',
    loadChildren: () => import('./pages/all-sponsor/all-sponsor.module').then(x => x.AllSponsorModule),
    component: CommonLayoutComponent

  },
  /*{
    path: 'event-fund',
    loadChildren: './pages/member/event-fund/event-fund.module#EventFundModule',
    component: SidebarLayoutComponent
  },*/

  {
    path: 'purchase-items',
    loadChildren: () => import('./pages/purchase-items/purchase-items.module').then(x => x.PurchaseItemsModule),

  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions
  )],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
