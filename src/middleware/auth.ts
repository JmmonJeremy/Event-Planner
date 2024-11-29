export const ensureAuth = (req:any, res:any, next:any) => {
  console.log("Cookie: connect.sid=" + req.cookies['connect.sid']);   
  console.log("Authorization: Bearer " + req.accessToken);   
  // Check if `req.user` exists before accessing `id`
  if (req.user) {
    console.log(`Authenticated user: ${req.user.id} |-> ${req.user.displayName}`);     
    console.log("isAuthenticated: " + req.isAuthenticated());
  } else {
    console.log("User not found in session");
  }  
  if (req.isAuthenticated()) {     
    return next();
  } else {
    console.log("AUTHENTICATION FAILED in ensureAuth function & redirected to 401 Unauthorized Page");
    res.status(401).render('login', { 
      accessDenied: true,
      layout: 'login'  // Specifies the layout to use
      });     
  }
};

export const ensureGuest = (req:any, res:any, next:any) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.status(200).redirect('/dashboard');
  }
};
