import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import firebase from "../../../services/firevaseConnction"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callback:{
    async session(session, profile){
      try{

        const lastDonate = firebase.firestore().collection('users')
        .doc(profile.sub)
        .get()
        .then((snapshot)=>{
          if(snapshot.exists){
            return snapshot.data().lastDonate.toDate();
          }else{
            return null;
          }
        })
        
        return {
          ...session,
          id: profile.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate
        }
      }catch{
        return {
          ...session,
          id: null,
          vip: false,
          lastDotane: null
        }
      }
    },
    async signIn(user, account, profile){
      const { email } = user;
      try{
        return true;
      }catch(erro){
        console.log('Deu Erro:', erro)
        return false;
      }
    }
  }
}
export default NextAuth(authOptions)