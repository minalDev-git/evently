export const universityHeaderLinks = [
  {
    label: "Dashboard",
    route: "/university/dashboard/",
  },
  {
    label: "Create Event",
    route: "/university/create_event/",
  },
  // {
  //   label: "All Events",
  //   route: "/profile",
  // },
];
export const studentHeaderLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Dashboard",
    route: "/student/dashboard/",
  },
  {
    label: "My Profile",
    route: "/student/profile/",
  },
];
export const adminHeaderLinks = [
  {
    label: "View Events",
    route: "/admin/dashboard/events/",
  },
  {
    label: "View Universities",
    route: "/admin/dashboard/universities/",
  },
  {
    label: "View Students",
    route: "/admin/dashboard/students/",
  },
];

export const eventDefaultValues = {
  event_name: "",
  description: "",
  venue: "",
  eventDate: new Date(),
  price: 0,
  slug: "",
  event_type: "R",
  form_url: "",
  image_url: "",
  visibility: "Pub",
  universityId: 0,
};
export const studentDefaultValues = {
  name: "",
  email: "",
  password: "",
  university: 0,
};
export const universityDefaultValues = {
  name: "",
  email: "",
  password: "",
  logo_url: "",
  total_events: 0,
  total_rsvps: 0,
  total_tickets: 0,
};
export const adminDefaultValues = {
  username: "",
  password: "",
};

export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";
