 
export async function getCookies(cookieName:string) {
  
  const cookie = await fetch(`/api/pos/cookies?cookieName=${cookieName}`, {method:"GET"});
  const rez = await cookie.json(); 
  return rez.data;
 
}
export async function setCookies(cookieName:string, value:string) {
   await fetch(`/api/pos/cookies`,{
    method:"POST",
    body:JSON.stringify({
        cookieName, value
    })
   });

   return true; //
 
}
