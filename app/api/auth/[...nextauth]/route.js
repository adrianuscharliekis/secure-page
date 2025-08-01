import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
      },
      async authorize(credentials, req) {
        const { ca_code, payload, timestamp, productType ,externalId} = credentials;

        try {
          const response = await fetch(process.env.URL_GATEWAY + "/auth/login", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-TIMESTAMP': timestamp,
              'X-CLIENT-KEY': ca_code,
              'X-SIGNATURE': payload,
              'X-EXTERNAL-ID': externalId,
              'X-PRODUCT-ID':productType
            },
            body: JSON.stringify({ grantType: "client_credentials" })
          });

          if (!response.ok) {
            console.error("Gateway auth error:", await response.text());
            return null;
          }
          
          const apiResponse = await response.json();

          if ((apiResponse.responseCode === "200" || apiResponse.responseCode === "2002700") && apiResponse.additionalInfo?.accessToken) {
            
            const user = {
              accessToken: apiResponse.additionalInfo.accessToken,
              expiresIn: apiResponse.additionalInfo.expiresIn,
              productType: productType,
              ca_code: ca_code,
              id: ca_code,
              externalID:externalId,
            };
            return user;
          } else {
            console.error("Gateway auth response not successful:", apiResponse);
            return null;
          }
        } catch (error) {
          console.error("Fetch to gateway failed:", error);
          return null;
        }
      },
    }),
  ],
  pages:{
    signIn: "/unauthorized",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.partnerKey = user.ca_code;
        token.externalKey = user.productType; // Changed to match middleware
        token.id = user.id;
        token.externalID=user.externalID

        const nowInSeconds = Math.floor(Date.now() / 1000);
        const expiresInSeconds = parseInt(user.expiresIn, 10);
        token.exp = nowInSeconds + expiresInSeconds;
      }
      return token;
    },
    
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.partnerKey = token.partnerKey;
      session.user.externalKey = token.externalKey; // Changed to match middleware
      session.user.externalID=token.externalID;
      
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
