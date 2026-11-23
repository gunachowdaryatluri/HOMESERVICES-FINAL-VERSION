export const CATS = ["Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting", "Appliance Repair"];
export const STATUSES = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];
export const home = role => (role === "admin" ? "/admin" : role === "provider" ? "/provider" : "/customer");
